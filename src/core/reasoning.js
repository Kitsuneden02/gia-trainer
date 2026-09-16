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
    const esDims = {
      weight: { pos: 'más pesado', neg: 'más liviano' },
      height: { pos: 'más alto', neg: 'más bajo' },
      speed: { pos: 'más rápido', neg: 'más lento' },
      age: { pos: 'más viejo', neg: 'más joven' },
      intelligence: { pos: 'más brillante', neg: 'más torpe' },
      strength: { pos: 'más fuerte', neg: 'más débil' },
      wealth: { pos: 'más rico', neg: 'más pobre' },
      elevation: { pos: 'más alto', neg: 'más bajo' },
      arrival: { pos: 'más temprano', neg: 'más tarde' },
      temperature: { pos: 'más cálido', neg: 'más frío' },
      hardness: { pos: 'más duro', neg: 'más blando' },
      bravery: { pos: 'más valiente', neg: 'más tímido' }
    }[dim.dimension] || { pos: dim.positive, neg: dim.negative };

    if (premiseType === 0) {
      aIsGreaterThanB = true;
      premiseText = `${personA} es ${esDims.pos} que ${personB}.`;
    } else if (premiseType === 1) {
      aIsGreaterThanB = false;
      premiseText = `${personA} es ${esDims.neg} que ${personB}.`;
    } else if (premiseType === 2) {
      aIsGreaterThanB = false;
      premiseText = `${personA} no es tan ${esDims.pos} como ${personB}.`;
    } else {
      aIsGreaterThanB = true;
      premiseText = `${personA} no es tan ${esDims.neg} como ${personB}.`;
    }
  } else {
    // English (Official GIA standard)
    if (premiseType === 0) {
      aIsGreaterThanB = true;
      premiseText = `${personA} is ${dim.positive} than ${personB}.`;
    } else if (premiseType === 1) {
      aIsGreaterThanB = false;
      premiseText = `${personA} is ${dim.negative} than ${personB}.`;
    } else if (premiseType === 2) {
      aIsGreaterThanB = false;
      premiseText = `${personA} is not as ${dim.positive} as ${personB}.`;
    } else {
      aIsGreaterThanB = true;
      premiseText = `${personA} is not as ${dim.negative} as ${personB}.`;
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
    const esDims = {
      weight: { pos: 'más pesado', neg: 'más liviano' },
      height: { pos: 'más alto', neg: 'más bajo' },
      speed: { pos: 'más rápido', neg: 'más lento' },
      age: { pos: 'más viejo', neg: 'más joven' },
      intelligence: { pos: 'más brillante', neg: 'más torpe' },
      strength: { pos: 'más fuerte', neg: 'más débil' },
      wealth: { pos: 'más rico', neg: 'más pobre' },
      elevation: { pos: 'más alto', neg: 'más bajo' },
      arrival: { pos: 'más temprano', neg: 'más tarde' },
      temperature: { pos: 'más cálido', neg: 'más frío' },
      hardness: { pos: 'más duro', neg: 'más blando' },
      bravery: { pos: 'más valiente', neg: 'más tímido' }
    }[dim.dimension] || { pos: dim.positive, neg: dim.negative };
    questionText = `¿Quién es ${askPositive ? esDims.pos : esDims.neg}?`;
  } else {
    questionText = `Who is ${askPositive ? dim.positive : dim.negative}?`;
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
