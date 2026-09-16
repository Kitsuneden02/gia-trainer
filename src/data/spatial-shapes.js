/**
 * GIA Spatial Visualisation Data: Strictly asymmetric capital letters and challenge polyforms.
 * Asymmetry (chirality) is required so that rotation cannot be confused with reflection (mirroring).
 */

/**
 * Standard GIA Capital Letters (strictly asymmetric, no reflectional or 180° rotational symmetry).
 * Official Thomas GIA primarily uses uppercase letters (such as 'R', 'F', 'P', 'J', 'L', 'G', 'Q').
 */
export const GIA_LETTERS = [
  {
    id: 'letter-r',
    name: 'Letter R',
    char: 'R',
    // High-precision 100x100 normalized SVG path
    path: 'M 25,15 L 65,15 C 78,15 85,22 85,35 C 85,48 78,55 65,55 L 45,55 L 75,85 L 55,85 L 30,55 L 30,85 L 20,85 L 20,15 Z M 30,25 L 30,45 L 60,45 C 68,45 74,42 74,35 C 74,28 68,25 60,25 Z'
  },
  {
    id: 'letter-f',
    name: 'Letter F',
    char: 'F',
    path: 'M 25,15 L 80,15 L 80,28 L 40,28 L 40,45 L 72,45 L 72,58 L 40,58 L 40,85 L 25,85 Z'
  },
  {
    id: 'letter-p',
    name: 'Letter P',
    char: 'P',
    path: 'M 25,15 L 65,15 C 78,15 85,24 85,38 C 85,52 78,60 65,60 L 40,60 L 40,85 L 25,85 Z M 40,27 L 40,48 L 62,48 C 68,48 72,44 72,38 C 72,31 68,27 62,27 Z'
  },
  {
    id: 'letter-j',
    name: 'Letter J',
    char: 'J',
    path: 'M 50,15 L 75,15 L 75,65 C 75,78 68,85 52,85 C 38,85 28,78 28,68 L 42,68 C 42,73 45,76 52,76 C 58,76 62,72 62,65 L 62,27 L 50,27 Z'
  },
  {
    id: 'letter-l',
    name: 'Letter L',
    char: 'L',
    path: 'M 25,15 L 45,15 L 45,68 L 78,68 L 78,85 L 25,85 Z'
  },
  {
    id: 'letter-g',
    name: 'Letter G',
    char: 'G',
    path: 'M 75,28 C 68,18 58,15 48,15 C 30,15 18,28 18,50 C 18,72 30,85 50,85 C 68,85 78,74 78,55 L 50,55 L 50,42 L 88,42 C 88,68 76,95 48,95 C 22,95 8,76 8,50 C 8,24 24,5 50,5 C 64,5 78,11 86,22 Z'
  },
  {
    id: 'letter-q',
    name: 'Letter Q',
    char: 'Q',
    path: 'M 50,10 C 28,10 16,26 16,50 C 16,74 28,90 50,90 C 58,90 66,86 72,80 L 80,88 L 88,80 L 80,72 C 83,66 84,58 84,50 C 84,26 72,10 50,10 Z M 50,22 C 64,22 72,34 72,50 C 72,66 64,78 50,78 C 36,78 28,66 28,50 C 28,34 36,22 50,22 Z'
  }
];

/**
 * Challenge / Advanced Polyforms (Abstract asymmetric geometric shapes for extra difficulty).
 */
export const CHALLENGE_SHAPES = [
  {
    id: 'letter-l-notched',
    name: 'Notched L',
    path: 'M 25,15 L 45,15 L 45,65 L 80,65 L 80,85 L 25,85 Z M 60,65 L 60,50 L 70,50 L 70,65 Z'
  },
  {
    id: 'flag-asymmetric',
    name: 'Pennant Flag',
    path: 'M 25,15 L 80,35 L 25,55 L 25,85 L 18,85 L 18,15 Z M 35,65 L 45,65 L 45,75 L 35,75 Z'
  },
  {
    id: 'pentomino-f',
    name: 'F-Pentomino',
    path: 'M 35,15 L 55,15 L 55,35 L 75,35 L 75,55 L 55,55 L 55,85 L 35,85 L 35,55 L 20,55 L 20,35 L 35,35 Z'
  },
  {
    id: 'poly-hook',
    name: 'Asymmetric Hook',
    path: 'M 20,20 L 75,20 L 75,40 L 45,40 L 45,60 L 80,60 L 80,80 L 20,80 Z'
  }
];

// Backwards-compatible alias default
export const SPATIAL_SHAPES = GIA_LETTERS;
