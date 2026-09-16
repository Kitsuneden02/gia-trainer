/**
 * Unit Test Suite for GIA Trainer Core Procedural Generators
 */

import assert from 'node:assert';
import {
  generateQuestion,
  generateReasoningQuestion,
  generatePerceptualQuestion,
  generateNumberSpeedQuestion,
  generateWordMeaningQuestion,
  generateSpatialQuestion,
  BATTERIES
} from '../src/core/index.js';

console.log('Starting GIA Core procedural validation test...');

const ITERATIONS = 1000;

// 1. Number Speed & Accuracy Test
console.log(`Testing Number Speed & Accuracy (${ITERATIONS} iterations)...`);
for (let i = 0; i < ITERATIONS; i++) {
  const q = generateNumberSpeedQuestion();
  assert.strictEqual(q.type, 'number-speed');
  assert.strictEqual(q.options.length, 3);
  const nums = q.data.numbers;
  assert.strictEqual(nums.length, 3);

  const { min, mid, max, dMin, dMax, furthest } = q.data;
  assert(min < mid && mid < max, `Ordering failed: min=${min}, mid=${mid}, max=${max}`);
  assert.notStrictEqual(dMin, dMax, `Equal distances detected: dMin=${dMin}, dMax=${dMax}`);
  assert.strictEqual(dMin, mid - min);
  assert.strictEqual(dMax, max - mid);

  const expectedFurthest = dMin > dMax ? min : max;
  assert.strictEqual(furthest, expectedFurthest);
  assert.strictEqual(q.correctId, String(expectedFurthest));
}
console.log('Number Speed & Accuracy passed!');

// 2. Perceptual Speed Test
console.log(`Testing Perceptual Speed (${ITERATIONS} iterations)...`);
for (let i = 0; i < ITERATIONS; i++) {
  const q = generatePerceptualQuestion();
  assert.strictEqual(q.type, 'perceptual');
  assert.strictEqual(q.options.length, 5);
  const pairs = q.data.pairs;
  assert.strictEqual(pairs.length, 4);

  let manualMatchCount = 0;
  for (const pair of pairs) {
    const isSameChar = pair.top.toLowerCase() === pair.bottom.toLowerCase();
    assert.strictEqual(pair.isMatch, isSameChar);
    if (pair.isMatch) manualMatchCount++;
  }
  assert.strictEqual(q.data.matchCount, manualMatchCount);
  assert.strictEqual(q.correctId, String(manualMatchCount));
}
console.log('Perceptual Speed passed!');

// 3. Reasoning Test (EN and ES Grammar & Logic validation)
console.log(`Testing Reasoning EN & ES (${ITERATIONS} iterations each)...`);
for (let i = 0; i < ITERATIONS; i++) {
  // Test English
  const qEn = generateReasoningQuestion({ lang: 'en' });
  assert.strictEqual(qEn.type, 'reasoning');
  assert.strictEqual(qEn.hasTwoPhases, true);
  assert(qEn.premise.length > 5);
  assert(qEn.prompt.length > 5);
  assert.strictEqual(qEn.options.length, 2);

  // English grammar checks: should not have "as [comparative] as" (e.g., "as heavier as", "as taller as")
  assert(!qEn.premise.includes('as heavier as'), `Ungrammatical EN premise: ${qEn.premise}`);
  assert(!qEn.premise.includes('as lighter as'), `Ungrammatical EN premise: ${qEn.premise}`);
  assert(!qEn.premise.includes('as taller as'), `Ungrammatical EN premise: ${qEn.premise}`);
  assert(!qEn.premise.includes('as shorter as'), `Ungrammatical EN premise: ${qEn.premise}`);

  const { personA: pAEn, personB: pBEn, aIsGreaterThanB: aGtBEn, askPositive: askPosEn } = qEn.data;
  const expectedWinnerEn = askPosEn
    ? (aGtBEn ? pAEn : pBEn)
    : (aGtBEn ? pBEn : pAEn);
  assert.strictEqual(qEn.correctId, expectedWinnerEn);

  // Test Spanish
  const qEs = generateReasoningQuestion({ lang: 'es' });
  assert.strictEqual(qEs.type, 'reasoning');
  assert.strictEqual(qEs.hasTwoPhases, true);
  assert(qEs.premise.length > 5);
  assert(qEs.prompt.length > 5);
  assert.strictEqual(qEs.options.length, 2);

  // Spanish grammar checks: NEVER allow "tan más", "tan menos", "más más"
  assert(!qEs.premise.includes('tan más'), `Ungrammatical Spanish premise with "tan más": ${qEs.premise}`);
  assert(!qEs.premise.includes('tan menos'), `Ungrammatical Spanish premise with "tan menos": ${qEs.premise}`);
  assert(!qEs.premise.includes('más más'), `Ungrammatical Spanish premise with "más más": ${qEs.premise}`);

  const { personA: pAEs, personB: pBEs, aIsGreaterThanB: aGtBEs, askPositive: askPosEs } = qEs.data;
  const expectedWinnerEs = askPosEs
    ? (aGtBEs ? pAEs : pBEs)
    : (aGtBEs ? pBEs : pAEs);
  assert.strictEqual(qEs.correctId, expectedWinnerEs);
}
console.log('Reasoning EN & ES passed!');

// 4. Word Meaning Test
console.log(`Testing Word Meaning (${ITERATIONS} iterations)...`);
for (let i = 0; i < ITERATIONS; i++) {
  const q = generateWordMeaningQuestion();
  assert.strictEqual(q.type, 'word-meaning');
  assert.strictEqual(q.options.length, 3);
  assert.strictEqual(q.data.words.length, 3);
  assert(q.data.words.includes(q.correctId));
  assert.strictEqual(q.correctId, q.data.distractor);
  assert(!q.data.pair.includes(q.data.distractor));
}
console.log('Word Meaning passed!');

// 5. Spatial Visualisation Test
console.log(`Testing Spatial Visualisation Standard GIA (${ITERATIONS} iterations)...`);
const GIA_VALID_ANGLES = [0, 90, 180, 270];
const GIA_VALID_LETTERS = ['R', 'F', 'P', 'J', 'L', 'G', 'Q'];

for (let i = 0; i < ITERATIONS; i++) {
  const q = generateSpatialQuestion();
  assert.strictEqual(q.type, 'spatial');
  assert.strictEqual(q.options.length, 3);
  assert.strictEqual(q.data.boxes.length, 2);
  assert.strictEqual(q.data.spatialMode, 'standard');

  let manualMatchCount = 0;
  for (const box of q.data.boxes) {
    // Both top and bottom rotations must be orthogonal multiples of 90 degrees
    assert(GIA_VALID_ANGLES.includes(box.top.rotation), `Invalid top angle: ${box.top.rotation}`);
    assert(GIA_VALID_ANGLES.includes(box.bottom.rotation), `Invalid bottom angle: ${box.bottom.rotation}`);

    // Must be a valid GIA asymmetric capital letter
    assert(GIA_VALID_LETTERS.includes(box.char), `Invalid letter: ${box.char}`);

    // A box is a match iff top and bottom share the same chirality
    const isMatch = box.top.mirrored === box.bottom.mirrored;
    assert.strictEqual(box.isMatch, isMatch);
    if (isMatch) manualMatchCount++;
  }
  assert.strictEqual(q.data.matchCount, manualMatchCount);
  assert.strictEqual(q.correctId, String(manualMatchCount));
}
console.log('Spatial Visualisation Standard GIA passed!');

console.log(`Testing Spatial Visualisation Challenge Mode (${ITERATIONS} iterations)...`);
const CHALLENGE_VALID_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

for (let i = 0; i < ITERATIONS; i++) {
  const q = generateSpatialQuestion({ spatialMode: 'challenge' });
  assert.strictEqual(q.type, 'spatial');
  assert.strictEqual(q.options.length, 3);
  assert.strictEqual(q.data.boxes.length, 2);
  assert.strictEqual(q.data.spatialMode, 'challenge');

  let manualMatchCount = 0;
  for (const box of q.data.boxes) {
    assert(CHALLENGE_VALID_ANGLES.includes(box.top.rotation), `Invalid challenge top angle: ${box.top.rotation}`);
    assert(CHALLENGE_VALID_ANGLES.includes(box.bottom.rotation), `Invalid challenge bottom angle: ${box.bottom.rotation}`);

    const isMatch = box.top.mirrored === box.bottom.mirrored;
    assert.strictEqual(box.isMatch, isMatch);
    if (isMatch) manualMatchCount++;
  }
  assert.strictEqual(q.data.matchCount, manualMatchCount);
  assert.strictEqual(q.correctId, String(manualMatchCount));
}
console.log('Spatial Visualisation Challenge Mode passed!');

// 6. Mixed battery test
console.log('Testing Mixed Battery generator...');
for (let i = 0; i < 100; i++) {
  const q = generateQuestion('mixed');
  assert(Object.values(BATTERIES).includes(q.type));
}
console.log('Mixed Battery generator passed!');

// 7. Storage Engine & Metrics Persistence Test
console.log('Testing Storage Engine (localStorage persistence & personal bests)...');
const memoryStorage = {};
globalThis.window = {
  localStorage: {
    getItem: (k) => (k in memoryStorage ? memoryStorage[k] : null),
    setItem: (k, v) => { memoryStorage[k] = String(v); },
    removeItem: (k) => { delete memoryStorage[k]; }
  }
};

const { saveSessionResult, getPersonalBests, getSessionHistory, clearAllStorage } = await import('../src/engine/storage.js');

// Test first session
const res1 = saveSessionResult({
  battery: 'number-speed',
  durationSec: 150,
  elapsedSec: 150,
  netScore: 35.5,
  correct: 38,
  total: 43,
  accuracy: 88,
  throughputQpm: 15.2,
  avgRtMs: 2500,
  bestStreak: 12,
  targetTier: 'standard',
  targetMet: false
});

assert.strictEqual(res1.isNewPb, true);
let pbs = getPersonalBests();
assert.strictEqual(pbs['number-speed'].netScore, 35.5);

// Test lower session (should not be new PB)
const res2 = saveSessionResult({
  battery: 'number-speed',
  netScore: 28.0,
  accuracy: 80,
  throughputQpm: 12.0
});
assert.strictEqual(res2.isNewPb, false);
pbs = getPersonalBests();
assert.strictEqual(pbs['number-speed'].netScore, 35.5);

// Test higher session (should be new PB)
const res3 = saveSessionResult({
  battery: 'number-speed',
  netScore: 42.0,
  accuracy: 94,
  throughputQpm: 18.5
});
assert.strictEqual(res3.isNewPb, true);
pbs = getPersonalBests();
assert.strictEqual(pbs['number-speed'].netScore, 42.0);

// Test history
const history = getSessionHistory();
assert.strictEqual(history.length, 3);
assert.strictEqual(history[0].netScore, 42.0);

// Test clear
clearAllStorage();
assert.strictEqual(getSessionHistory().length, 0);
assert.deepStrictEqual(getPersonalBests(), {});
console.log('Storage Engine passed!');

console.log('ALL 5 BATTERIES + STORAGE ENGINE PASSED RIGOROUSLY WITH 0 FAILURES!');
