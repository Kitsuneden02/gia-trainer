/**
 * GIA Spatial Visualisation Battery Generator
 * Construct: Mental 2D rotation vs reflection discrimination across 2 symbol boxes.
 */

import { SPATIAL_SHAPES } from '../data/spatial-shapes.js';

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/**
 * Creates one box containing a top and a bottom symbol.
 * @param {boolean} isMatch - True if bottom is only rotated; False if mirrored.
 * @returns {Object} Box definition
 */
function createBox(isMatch) {
  const shape = pickRandom(SPATIAL_SHAPES);
  const topAngle = pickRandom(ANGLES);
  const bottomAngle = pickRandom(ANGLES);

  return {
    shapeId: shape.id,
    path: shape.path,
    name: shape.name,
    isMatch,
    top: {
      rotation: topAngle,
      mirrored: false
    },
    bottom: {
      rotation: bottomAngle,
      mirrored: !isMatch
    }
  };
}

/**
 * Generates a Spatial Visualisation question (2 boxes, count matching pairs: 0, 1, or 2).
 * @returns {import('./types.js').Question}
 */
export function generateSpatialQuestion() {
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

  const box1 = createBox(box1Match);
  const box2 = createBox(box2Match);

  const options = [0, 1, 2].map((n) => ({
    id: String(n),
    label: String(n),
    key: String(n)
  }));

  return {
    id: `spt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'spatial',
    hasTwoPhases: false,
    prompt: 'How many boxes contain a matching pair (rotated, not mirrored)?',
    options,
    correctId: String(targetMatches),
    data: {
      boxes: [box1, box2],
      matchCount: targetMatches
    },
    metadata: {
      summary: `Box 1: ${box1Match ? 'MATCH' : 'MIRROR'} | Box 2: ${box2Match ? 'MATCH' : 'MIRROR'} => Answer: ${targetMatches}`
    }
  };
}
