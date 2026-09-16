/**
 * GIA Spatial Visualisation Data: Strictly asymmetric 2D geometric shapes and symbols.
 * Asymmetry is required so that rotation cannot be confused with reflection (mirroring).
 */

export const SPATIAL_SHAPES = [
  {
    id: 'letter-r',
    name: 'Symbol R',
    // Normalized 100x100 viewBox SVG path
    path: 'M 25,15 L 65,15 C 78,15 85,22 85,35 C 85,48 78,55 65,55 L 45,55 L 75,85 L 55,85 L 30,55 L 30,85 L 20,85 L 20,15 Z M 30,25 L 30,45 L 60,45 C 68,45 74,42 74,35 C 74,28 68,25 60,25 Z'
  },
  {
    id: 'letter-f',
    name: 'Symbol F',
    path: 'M 25,15 L 80,15 L 80,28 L 40,28 L 40,45 L 72,45 L 72,58 L 40,58 L 40,85 L 25,85 Z'
  },
  {
    id: 'letter-p',
    name: 'Symbol P',
    path: 'M 25,15 L 65,15 C 78,15 85,24 85,38 C 85,52 78,60 65,60 L 40,60 L 40,85 L 25,85 Z M 40,27 L 40,48 L 62,48 C 68,48 72,44 72,38 C 72,31 68,27 62,27 Z'
  },
  {
    id: 'letter-j',
    name: 'Symbol J',
    path: 'M 50,15 L 75,15 L 75,65 C 75,78 68,85 52,85 C 38,85 28,78 28,68 L 42,68 C 42,73 45,76 52,76 C 58,76 62,72 62,65 L 62,27 L 50,27 Z'
  },
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
