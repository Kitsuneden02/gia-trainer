/**
 * GIA Reasoning Battery Generator
 * Construct: Working memory & relational logical deduction in 2 phases.
 */

import { REASONING_NAMES, COMPARATIVE_DIMENSIONS } from '../data/reasoning-data.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTwoDistinct(arr) {
  const first = pickRandom(arr);
  let second = pickRandom(arr);
  while (second === first) {
    second = pickRandom(arr);
  }
  return [first, second];
}

/**
 * Generates a Reasoning question.
 * @param {Object} [options]
 * @param {'en'|'es'} [options.lang='en'] - Language for premise and question
 * @returns {import('./types.js').Question}
 */
export function generateReasoningQuestion({ lang = 'en' } = {}) {
  const [personA, personB] = pickTwoDistinct(REASONING_NAMES);
  const dim = pickRandom(COMPARATIVE_DIMENSIONS);

  // 4 premise variations:
  // 0: A is [pos] than B           => A > B
  // 1: A is [neg] than B           => B > A
  // 2: A is not as [pos] as B      => B > A
  // 3: A is not as [neg] as B      => A > B
  const premiseType = Math.floor(Math.random() * 4);

  // Question asks for positive ("Who is taller?") or negative ("Who is shorter?")
  const askPositive = Math.random() < 0.5;

  let aIsGreaterThanB;
  let premiseText;

  if (lang === 'es') {
    const es = dim.es || {
      posBase: dim.posBase || 'alto',
      posComp: dim.posComp || 'más alto',
      negBase: dim.negBase || 'bajo',
      negComp: dim.negComp || 'más bajo'
    };

    if (premiseType === 0) {
      aIsGreaterThanB = true;
      premiseText = `${personA} es ${es.posComp} que ${personB}.`;
    } else if (premiseType === 1) {
      aIsGreaterThanB = false;
      premiseText = `${personA} es ${es.negComp} que ${personB}.`;
    } else if (premiseType === 2) {
      aIsGreaterThanB = false;
      premiseText = `${personA} no es tan ${es.posBase} como ${personB}.`;
    } else {
      aIsGreaterThanB = true;
      premiseText = `${personA} no es tan ${es.negBase} como ${personB}.`;
    }
  } else {
    // English (Official GIA standard)
    const posComp = dim.posComp || dim.positive;
    const negComp = dim.negComp || dim.negative;
    const posBase = dim.posBase || dim.positive;
    const negBase = dim.negBase || dim.negative;

    if (premiseType === 0) {
      aIsGreaterThanB = true;
      premiseText = `${personA} is ${posComp} than ${personB}.`;
    } else if (premiseType === 1) {
      aIsGreaterThanB = false;
      premiseText = `${personA} is ${negComp} than ${personB}.`;
    } else if (premiseType === 2) {
      aIsGreaterThanB = false;
      premiseText = `${personA} is not as ${posBase} as ${personB}.`;
    } else {
      aIsGreaterThanB = true;
      premiseText = `${personA} is not as ${negBase} as ${personB}.`;
    }
  }

  // Answer determination:
  // If asking positive: correct is who is greater
  // If asking negative: correct is who is lesser
  let winner;
  if (askPositive) {
    winner = aIsGreaterThanB ? personA : personB;
  } else {
    winner = aIsGreaterThanB ? personB : personA;
  }

  let questionText;
  if (lang === 'es') {
    const es = dim.es || {
      posComp: dim.posComp || 'más alto',
      negComp: dim.negComp || 'más bajo'
    };
    questionText = `¿Quién es ${askPositive ? es.posComp : es.negComp}?`;
  } else {
    const posComp = dim.posComp || dim.positive;
    const negComp = dim.negComp || dim.negative;
    questionText = `Who is ${askPositive ? posComp : negComp}?`;
  }

  // Options: personA and personB (randomize order on screen)
  const isLeftA = Math.random() < 0.5;
  const leftPerson = isLeftA ? personA : personB;
  const rightPerson = isLeftA ? personB : personA;

  const options = [
    {
      id: leftPerson,
      label: leftPerson,
      key: '1',
      aliasKey: 'ArrowLeft'
    },
    {
      id: rightPerson,
      label: rightPerson,
      key: '2',
      aliasKey: 'ArrowRight'
    }
  ];

  return {
    id: `rsn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'reasoning',
    hasTwoPhases: true,
    premise: premiseText,
    prompt: questionText,
    options,
    correctId: winner,
    data: {
      personA,
      personB,
      dimension: dim.dimension,
      premiseType,
      askPositive,
      aIsGreaterThanB
    },
    metadata: {
      explanation: `${premiseText} -> ${questionText} => ${winner}`
    }
  };
}
