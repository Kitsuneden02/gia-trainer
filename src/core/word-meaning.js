/**
 * GIA Word Meaning Battery Generator
 * Construct: Vocabulary comprehension & Odd-One-Out categorization (synonyms/antonyms vs distractor).
 */

import { WORD_TRIADS } from '../data/words.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fisher-Yates non-repeating shuffle deck:
// Guarantees zero repeats within any training session of up to 462 questions!
let deck = [];
let deckCursor = 0;

function replenishDeck() {
  const indices = Array.from({ length: WORD_TRIADS.length }, (_, i) => i);
  deck = shuffle(indices);
  deckCursor = 0;
}

function getNextTriad() {
  if (deck.length === 0 || deckCursor >= deck.length) {
    replenishDeck();
  }
  const idx = deck[deckCursor++];
  return WORD_TRIADS[idx];
}

/**
 * Resets the deck cursor if needed between runs.
 */
export function resetWordMeaningDeck() {
  replenishDeck();
}

/**
 * Generates a Word Meaning question.
 * @returns {import('./types.js').Question}
 */
export function generateWordMeaningQuestion() {
  const triad = getNextTriad();

  const wordA = triad.pair[0];
  const wordB = triad.pair[1];
  const distractor = triad.distractor;

  const shuffledWords = shuffle([wordA, wordB, distractor]);

  const options = shuffledWords.map((word, index) => {
    const key = String(index + 1);
    const aliasKey = index === 0 ? 'ArrowLeft' : index === 1 ? 'ArrowDown' : 'ArrowRight';
    return {
      id: word,
      label: word,
      key,
      aliasKey
    };
  });

  return {
    id: `wrd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'word-meaning',
    hasTwoPhases: false,
    prompt: 'Which word is the odd one out?',
    options,
    correctId: distractor,
    data: {
      words: shuffledWords,
      pair: [wordA, wordB],
      distractor,
      relationshipType: triad.type
    },
    metadata: {
      explanation: `"${wordA}" and "${wordB}" are ${triad.type}s. "${distractor}" is the odd one out.`
    }
  };
}
