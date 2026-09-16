/**
 * GIA Number Speed and Accuracy Battery Generator
 * Construct: Quantitative processing speed & distance computation (|mid - min| vs |max - mid|).
 */

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

/**
 * Generates 3 numbers with strictly unequal distances to the median.
 * @returns {{ min: number, mid: number, max: number, dMin: number, dMax: number, furthest: number }}
 */
function generateTrio() {
  // We vary the scale of numbers (single digits to double digits)
  // Scale 1: 2 - 25 (simple mental math)
  // Scale 2: 10 - 60 (standard GIA)
  // Scale 3: 20 - 99 (harder mental math)
  const mode = Math.random();
  let minVal, maxRange;
  if (mode < 0.3) {
    minVal = 2;
    maxRange = 25;
  } else if (mode < 0.8) {
    minVal = 5;
    maxRange = 60;
  } else {
    minVal = 10;
    maxRange = 95;
  }

  while (true) {
    const mid = randInt(minVal + 3, maxRange - 3);
    const dMin = randInt(1, Math.min(mid - minVal, 18));
    let dMax = randInt(1, Math.min(maxRange - mid, 18));

    // Distances must not be equal
    if (dMin === dMax) continue;

    const min = mid - dMin;
    const max = mid + dMax;

    const furthest = dMin > dMax ? min : max;

    return {
      min,
      mid,
      max,
      dMin,
      dMax,
      furthest
    };
  }
}

/**
 * Generates a Number Speed & Accuracy question.
 * @returns {import('./types.js').Question}
 */
export function generateNumberSpeedQuestion() {
  const { min, mid, max, dMin, dMax, furthest } = generateTrio();

  // Scramble the visual presentation order of the 3 numbers
  const displayNumbers = shuffle([min, mid, max]);

  const options = displayNumbers.map((num, index) => {
    const key = String(index + 1);
    const aliasKey = index === 0 ? 'ArrowLeft' : index === 1 ? 'ArrowDown' : 'ArrowRight';
    return {
      id: String(num),
      label: String(num),
      key,
      aliasKey
    };
  });

  return {
    id: `num-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'number-speed',
    hasTwoPhases: false,
    prompt: 'Which number is furthest from the remaining (middle-value) number?',
    options,
    correctId: String(furthest),
    data: {
      numbers: displayNumbers,
      min,
      mid,
      max,
      dMin,
      dMax,
      furthest
    },
    metadata: {
      calculation: `Values: [${min}, ${mid}, ${max}]. dMin=|${mid}-${min}|=${dMin}, dMax=|${max}-${mid}|=${dMax}. Furthest: ${furthest} (distance ${Math.max(dMin, dMax)})`
    }
  };
}
