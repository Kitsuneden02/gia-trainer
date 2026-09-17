/**
 * GIA Trainer Core Contracts and Types
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} id - Unique identifier for the option
 * @property {string} label - Display label
 * @property {string} key - Keyboard shortcut (e.g. '1', '2', '0', 'ArrowLeft')
 * @property {string} [subLabel] - Optional sub-label or detail
 */

/**
 * @typedef {'reasoning' | 'perceptual' | 'number-speed' | 'word-meaning' | 'spatial'} TestBattery
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Unique question identifier
 * @property {TestBattery} type - Battery type
 * @property {string} prompt - Primary prompt or question string
 * @property {string} [premise] - Initial premise for two-phase tests (Reasoning)
 * @property {boolean} hasTwoPhases - True if the test requires memorizing a premise first
 * @property {Object} data - Underlying raw payload (numbers, words, pairs, etc.)
 * @property {QuestionOption[]} options - Array of available answers
 * @property {string} correctId - ID of the correct option
 * @property {Object} [metadata] - Explanatory metadata for post-mortem analysis
 */

export const BATTERIES = {
  REASONING: 'reasoning',
  PERCEPTUAL: 'perceptual',
  NUMBER_SPEED: 'number-speed',
  WORD_MEANING: 'word-meaning',
  SPATIAL: 'spatial'
};

export const BATTERY_INFO = {
  [BATTERIES.REASONING]: {
    id: BATTERIES.REASONING,
    name: 'Reasoning',
    esName: 'Razonamiento',
    desc: 'Lógica relacional y memoria de trabajo en dos fases.',
    officialDurationSec: 150, // 2.5 min
    keyHints: 'Espacio (continuar) | 1 / 2 o ← / →'
  },
  [BATTERIES.PERCEPTUAL]: {
    id: BATTERIES.PERCEPTUAL,
    name: 'Perceptual Speed',
    esName: 'Velocidad Perceptiva',
    desc: 'Identificación instantánea de pares coincidentes (0 a 4).',
    officialDurationSec: 150,
    keyHints: 'Teclas 0, 1, 2, 3, 4'
  },
  [BATTERIES.NUMBER_SPEED]: {
    id: BATTERIES.NUMBER_SPEED,
    name: 'Number Speed & Accuracy',
    esName: 'Velocidad Numérica',
    desc: 'Cálculo de distancias al número central (|mid - min| vs |max - mid|).',
    officialDurationSec: 120, // 2 min
    keyHints: 'Teclas 1, 2, 3 o ←, ↓, →'
  },
  [BATTERIES.WORD_MEANING]: {
    id: BATTERIES.WORD_MEANING,
    name: 'Word Meaning',
    esName: 'Significado de Palabras',
    desc: 'Detección del término intruso entre tríos de vocabulario en inglés.',
    officialDurationSec: 150,
    keyHints: 'Teclas 1, 2, 3 o ←, ↓, →'
  },
  [BATTERIES.SPATIAL]: {
    id: BATTERIES.SPATIAL,
    name: 'Spatial Visualisation',
    esName: 'Visualización Espacial',
    desc: 'Discriminación de rotación 2D vs. imagen especular en 2 pares (0, 1 o 2).',
    officialDurationSec: 150,
    keyHints: 'Teclas 0, 1, 2'
  }
};

/**
 * Calibrated psychometric normative benchmarks for each battery and mixed mode.
 * Based on Thomas International GIA normative distributions (Percentile 50, 75-80, 90+).
 */
export const BATTERY_BENCHMARKS = {
  [BATTERIES.REASONING]: {
    standard: { targetQpm: 12, targetAcc: 85 },
    'top-tier': { targetQpm: 16, targetAcc: 90 },
    elite: { targetQpm: 20, targetAcc: 95 }
  },
  [BATTERIES.NUMBER_SPEED]: {
    standard: { targetQpm: 18, targetAcc: 85 },
    'top-tier': { targetQpm: 25, targetAcc: 90 },
    elite: { targetQpm: 32, targetAcc: 95 }
  },
  [BATTERIES.PERCEPTUAL]: {
    standard: { targetQpm: 22, targetAcc: 85 },
    'top-tier': { targetQpm: 28, targetAcc: 90 },
    elite: { targetQpm: 35, targetAcc: 95 }
  },
  [BATTERIES.WORD_MEANING]: {
    standard: { targetQpm: 22, targetAcc: 85 },
    'top-tier': { targetQpm: 30, targetAcc: 90 },
    elite: { targetQpm: 38, targetAcc: 95 }
  },
  [BATTERIES.SPATIAL]: {
    standard: { targetQpm: 16, targetAcc: 85 },
    'top-tier': { targetQpm: 24, targetAcc: 90 },
    elite: { targetQpm: 30, targetAcc: 95 }
  },
  mixed: {
    standard: { targetQpm: 18, targetAcc: 85 },
    'top-tier': { targetQpm: 25, targetAcc: 90 },
    elite: { targetQpm: 31, targetAcc: 95 }
  }
};

