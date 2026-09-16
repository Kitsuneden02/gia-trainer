/**
 * GIA Trainer Core Engine Index
 */

export * from './types.js';
export { generateReasoningQuestion } from './reasoning.js';
export { generatePerceptualQuestion } from './perceptual.js';
export { generateNumberSpeedQuestion } from './number-speed.js';
export { generateWordMeaningQuestion } from './word-meaning.js';
export { generateSpatialQuestion } from './spatial.js';

import { BATTERIES } from './types.js';
import { generateReasoningQuestion } from './reasoning.js';
import { generatePerceptualQuestion } from './perceptual.js';
import { generateNumberSpeedQuestion } from './number-speed.js';
import { generateWordMeaningQuestion } from './word-meaning.js';
import { generateSpatialQuestion } from './spatial.js';

/**
 * Procedurally generates a question for the requested battery or random mixed.
 * @param {string} battery
 * @param {Object} [options]
 * @returns {import('./types.js').Question}
 */
export function generateQuestion(battery, options = {}) {
  let targetBattery = battery;
  if (battery === 'mixed') {
    const all = [
      BATTERIES.REASONING,
      BATTERIES.PERCEPTUAL,
      BATTERIES.NUMBER_SPEED,
      BATTERIES.WORD_MEANING,
      BATTERIES.SPATIAL
    ];
    targetBattery = all[Math.floor(Math.random() * all.length)];
  }

  switch (targetBattery) {
    case BATTERIES.REASONING:
      return generateReasoningQuestion(options);
    case BATTERIES.PERCEPTUAL:
      return generatePerceptualQuestion();
    case BATTERIES.NUMBER_SPEED:
      return generateNumberSpeedQuestion();
    case BATTERIES.WORD_MEANING:
      return generateWordMeaningQuestion();
    case BATTERIES.SPATIAL:
      return generateSpatialQuestion();
    default:
      throw new Error(`Unknown battery: ${battery}`);
  }
}
