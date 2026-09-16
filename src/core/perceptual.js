/**
 * GIA Perceptual Speed Battery Generator
 * Construct: Rapid visual scanning and pattern matching across 4 letter pairs.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickLetter() {
  return ALPHABET[randInt(0, ALPHABET.length - 1)];
}

function pickDifferentLetter(exclude) {
  let l = pickLetter();
  // Ensure the different letter is not the same, and avoid confusing pairs (e.g. I vs L)
  while (l === exclude || (exclude === 'I' && l === 'L') || (exclude === 'L' && l === 'I')) {
    l = pickLetter();
  }
  return l;
}

/**
 * Generates a Perceptual Speed question (4 letter pairs, count matching pairs).
 * Official Thomas GIA standard: lowercase ALWAYS on top, uppercase ALWAYS on bottom.
 * @returns {import('./types.js').Question}
 */
export function generatePerceptualQuestion() {
  // Target number of matching pairs (0 to 4)
  const matchCount = randInt(0, 4);

  // Determine which indices among 0..3 will be matches
  const indices = [0, 1, 2, 3];
  // Shuffle indices (Fisher-Yates)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const matchSet = new Set(indices.slice(0, matchCount));

  const pairs = [];
  for (let i = 0; i < 4; i++) {
    const baseChar = pickLetter();
    const isMatch = matchSet.has(i);
    const otherChar = isMatch ? baseChar : pickDifferentLetter(baseChar);

    // Official Thomas GIA standard: lowercase ALWAYS on top, uppercase ALWAYS on bottom
    const topChar = baseChar.toLowerCase();
    const bottomChar = otherChar.toUpperCase();

    pairs.push({
      top: topChar,
      bottom: bottomChar,
      isMatch
    });
  }

  // Options are always 0, 1, 2, 3, 4
  const options = [0, 1, 2, 3, 4].map((n) => ({
    id: String(n),
    label: String(n),
    key: String(n)
  }));

  return {
    id: `prc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'perceptual',
    hasTwoPhases: false,
    prompt: 'How many pairs contain the same letter?',
    options,
    correctId: String(matchCount),
    data: {
      pairs,
      matchCount
    },
    metadata: {
      pairsSummary: pairs.map((p) => `${p.top}/${p.bottom}:${p.isMatch ? '1' : '0'}`).join(' ')
    }
  };
}
