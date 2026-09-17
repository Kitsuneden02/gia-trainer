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
    assert.strictEqual(pair.top, pair.top.toLowerCase(), 'Top letter must always be lowercase');
    assert.strictEqual(pair.bottom, pair.bottom.toUpperCase(), 'Bottom letter must always be uppercase');
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

  // English purity check: should never contain Spanish words
  assert(!qEn.premise.includes('más'), `Spanish word 'más' in EN premise: ${qEn.premise}`);
  assert(!qEn.premise.includes('tímido'), `Spanish word 'tímido' in EN premise: ${qEn.premise}`);
  assert(!qEn.prompt.includes('más'), `Spanish word 'más' in EN prompt: ${qEn.prompt}`);
  assert(!qEn.prompt.includes('Quién'), `Spanish word 'Quién' in EN prompt: ${qEn.prompt}`);

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

  // Check that purged awkward dimensions never appear
  assert(!qEs.premise.includes('tarde'), `Inappropriate arrival dimension: ${qEs.premise}`);
  assert(!qEs.prompt.includes('temprano'), `Inappropriate arrival dimension: ${qEs.prompt}`);
  assert(!qEs.premise.includes('blando'), `Inappropriate hardness dimension: ${qEs.premise}`);
  assert(!qEs.premise.includes('cálido'), `Inappropriate temperature dimension: ${qEs.premise}`);

  // Gender agreement validation
  const { personA: pAEs, personB: pBEs, gender: gEs, aIsGreaterThanB: aGtBEs, askPositive: askPosEs } = qEs.data;
  if (gEs === 'f') {
    // Should never contain masculine-only endings for gender-inflected dimensions
    assert(!qEs.premise.includes(' más alto ') && !qEs.premise.includes(' tan alto '), `Feminine subject with masculine 'alto': ${qEs.premise}`);
    assert(!qEs.premise.includes(' más pesado ') && !qEs.premise.includes(' tan pesado '), `Feminine subject with masculine 'pesado': ${qEs.premise}`);
    assert(!qEs.premise.includes(' más rápido ') && !qEs.premise.includes(' tan rápido '), `Feminine subject with masculine 'rápido': ${qEs.premise}`);
  } else {
    // Should never contain feminine-only endings for masculine subjects
    assert(!qEs.premise.includes(' más alta ') && !qEs.premise.includes(' tan alta '), `Masculine subject with feminine 'alta': ${qEs.premise}`);
    assert(!qEs.premise.includes(' más pesada ') && !qEs.premise.includes(' tan pesada '), `Masculine subject with feminine 'pesada': ${qEs.premise}`);
    assert(!qEs.premise.includes(' más rápida ') && !qEs.premise.includes(' tan rápida '), `Masculine subject with feminine 'rápida': ${qEs.premise}`);
  }

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

// Verify anti-repetition deck: 100 consecutive questions in a session must have 100 unique triads
console.log('Testing Word Meaning anti-repetition deck (100 consecutive items)...');
const sessionTriadKeys = new Set();
for (let i = 0; i < 100; i++) {
  const q = generateWordMeaningQuestion();
  const key = q.data.pair.slice().sort().join('-') + '|' + q.data.distractor;
  assert(!sessionTriadKeys.has(key), `Duplicate triad detected in 100 items: ${key}`);
  sessionTriadKeys.add(key);
}
assert.strictEqual(sessionTriadKeys.size, 100);
console.log('Word Meaning passed (zero repeats in 100 items)!');

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

// 8. I18N Summary Reporting Test (Ensure no undefined functions or variables in en/es summary)
console.log('Testing I18N Summary report generation across languages...');
const { I18N } = await import('../src/data/i18n.js');
for (const lang of ['en', 'es']) {
  const sumT = I18N[lang].summary;
  assert(sumT.title.length > 0);
  assert(typeof sumT.meta === 'function');
  assert(typeof sumT.heroSub === 'function');
  assert(typeof sumT.adviceExcellent === 'function');
  assert(typeof sumT.adviceBalanced === 'function');
  assert(typeof sumT.adviceCaution === 'function');
  assert(typeof sumT.targetSpec === 'function');
  assert(typeof sumT.targetGap === 'function');
  assert(typeof sumT.targetActual === 'function');
  assert(typeof sumT.targetAccuracyWarning === 'function');
  assert(sumT.targetAchieved.length > 0);
  assert(sumT.targetMissed.length > 0);

  // Test targetGap branches
  assert(sumT.targetGap(-3.6).includes('3.6'));
  assert(sumT.targetGap(2.4).includes('2.4'));
  assert(sumT.targetGap(0).length > 0);

  // Test targetSpec and actual
  const spec = sumT.targetSpec(28, 90);
  assert(spec.includes('28'));
  const actual = sumT.targetActual(24.4, 80);
  assert(actual.includes('24.4'));
  const warn = sumT.targetAccuracyWarning(80, 90);
  assert(warn.includes('80') && warn.includes('90'));
  // Test abortModal and history keys
  assert(I18N[lang].abortModal.title.length > 0);
  assert(I18N[lang].abortModal.desc.length > 0);
  assert(I18N[lang].abortModal.resumeBtn.length > 0);
  assert(I18N[lang].abortModal.confirmBtn.length > 0);
  assert(I18N[lang].history.chartNetScore.length > 0);
  assert(I18N[lang].history.chartQpm.length > 0);
  assert(I18N[lang].history.chartAccuracy.length > 0);
}
console.log('I18N Summary report generation passed!');

// 9. SessionEngine Lifecycle & Pause / Resume / Abort Test
console.log('Testing SessionEngine lifecycle (pause, resume, abort)...');
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
const { SessionEngine } = await import('../src/engine/session.js');
let pausedEmitted = false;
let resumedEmitted = false;
let abortedEmitted = false;

const engine = new SessionEngine({
  battery: 'number-speed',
  durationSec: 150,
  callbacks: {
    onPause: () => { pausedEmitted = true; },
    onResume: () => { resumedEmitted = true; },
    onAbort: () => { abortedEmitted = true; }
  }
});

engine.start();
assert.strictEqual(engine.status, 'running');
assert.strictEqual(engine.items.length, 0);

const initialStartTime = engine.sessionStartTime;

// Test Pause
engine.pause();
assert.strictEqual(engine.status, 'paused');
assert.strictEqual(pausedEmitted, true);
assert(engine.pausedAt > 0);

// Wait 50ms then test Resume
await new Promise((r) => setTimeout(r, 50));
engine.resume();
assert.strictEqual(engine.status, 'running');
assert.strictEqual(resumedEmitted, true);
assert.strictEqual(engine.pausedAt, 0);
assert(engine.totalPausedDurationMs >= 40);
assert(engine.sessionStartTime > initialStartTime);

// Test Abort
engine.abort();
assert.strictEqual(engine.status, 'aborted');
assert.strictEqual(abortedEmitted, true);
console.log('SessionEngine lifecycle passed!');

console.log('ALL 5 BATTERIES + STORAGE ENGINE + SESSION ENGINE + I18N PASSED RIGOROUSLY WITH 0 FAILURES!');
