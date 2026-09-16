/**
 * GIA Spatial Visualisation Battery Generator
 * Construct: Mental 2D rotation vs reflection discrimination across 2 symbol boxes.
 * In official Thomas GIA, capital letters (e.g. 'R', 'F', 'P', 'J', 'L', 'G', 'Q')
 * are rotated in strict 90° increments (0°, 90°, 180°, 270°).
 */

import { GIA_LETTERS, CHALLENGE_SHAPES, SPATIAL_SHAPES } from '../data/spatial-shapes.js';

const GIA_ANGLES = [0, 90, 180, 270];
const CHALLENGE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/**
 * Creates one box containing a top and a bottom symbol.
 * @param {boolean} isMatch - True if bottom has the same chirality (pure rotation); False if reflection.
 * @param {Object} shape - Symbol/letter definition
 * @param {number[]} angles - Allowed angles of rotation
 * @returns {Object} Box definition
 */
function createBox(isMatch, shape, angles) {
  const topAngle = pickRandom(angles);
  const bottomAngle = pickRandom(angles);

  // In Thomas GIA, top symbol can occasionally be mirrored (25% probability),
  // and the pair matches iff both top and bottom have identical chirality.
  const topMirrored = Math.random() < 0.25;
  const bottomMirrored = isMatch ? topMirrored : !topMirrored;

  return {
    shapeId: shape.id,
    char: shape.char || null,
    path: shape.path,
    name: shape.name,
    isMatch,
    top: {
      rotation: topAngle,
      mirrored: topMirrored
    },
    bottom: {
      rotation: bottomAngle,
      mirrored: bottomMirrored
    }
  };
}

/**
 * Generates a Spatial Visualisation question (2 boxes, count matching pairs: 0, 1, or 2).
 * @param {Object} [options]
 * @param {'standard'|'challenge'} [options.spatialMode='standard']
 * @returns {import('./types.js').Question}
 */
export function generateSpatialQuestion(options = {}) {
  const isChallenge = options.spatialMode === 'challenge';
  const angles = isChallenge ? CHALLENGE_ANGLES : GIA_ANGLES;
  const shapesPool = isChallenge ? CHALLENGE_SHAPES : GIA_LETTERS;

  // Pick the letter / shape tested in this question
  const shape = pickRandom(shapesPool);

  // Balanced selection of correct count (0, 1, or 2)
  const targetMatches = randInt(0, 2);

  let box1Match = false;
  let box2Match = false;

  if (targetMatches === 2) {
    box1Match = true;
    box2Match = true;
  } else if (targetMatches === 1) {
    if (Math.random() < 0.5) {
      box1Match = true;
      box2Match = false;
    } else {
      box1Match = false;
      box2Match = true;
    }
  } else {
    box1Match = false;
    box2Match = false;
  }

  const box1 = createBox(box1Match, shape, angles);
  const box2 = createBox(box2Match, shape, angles);

  const optItems = [0, 1, 2].map((n) => ({
    id: String(n),
    label: String(n),
    key: String(n)
  }));

  return {
    id: `spt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'spatial',
    hasTwoPhases: false,
    prompt: 'How many boxes contain a matching pair (rotated, not mirrored)?',
    options: optItems,
    correctId: String(targetMatches),
    data: {
      boxes: [box1, box2],
      matchCount: targetMatches,
      spatialMode: isChallenge ? 'challenge' : 'standard',
      shapeName: shape.name
    },
    metadata: {
      summary: `[${shape.char || shape.name}] Box 1: ${box1Match ? 'MATCH' : 'MIRROR'} | Box 2: ${box2Match ? 'MATCH' : 'MIRROR'} => Answer: ${targetMatches}`
    }
  };
}
