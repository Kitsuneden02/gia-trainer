/**
 * GIA Trainer Internationalization (i18n) Dictionary
 * Comprehensive bilingual translations for English (Default) and Spanish.
 */

export const I18N = {
  en: {
    header: {
      methodologyBtn: 'Methodology'
    },
    setup: {
      heroTitle: 'Cognitive Speed Simulator',
      heroSub: 'Train with psychometric precision across the 5 official Thomas International GIA batteries.',
      durationLabel: 'Block Duration',
      durations: [
        { value: '150', label: '2.5 minutes (Official GIA Standard)' },
        { value: '120', label: '2.0 minutes (Numerical Standard)' },
        { value: '60', label: '1.0 minute (Express Sprint)' },
        { value: '180', label: '3.0 minutes' },
        { value: '300', label: '5.0 minutes (Endurance)' },
        { value: '0', label: 'No limit (Free practice)' }
      ],
      startBtn: 'Start: ',
      startMixedBtn: 'Start Full GIA Battery',
      mixedHintTitle: 'Full Battery:',
      mixedHintDesc: 'Alternating questions across all 5 sections. Recommended 2.5 to 5 min block.',
      keysLabel: 'Keys'
    },
    batteries: {
      'number-speed': {
        name: 'Number Speed & Accuracy',
        shortName: 'Number Speed',
        tag: '|mid - min| vs |max - mid|',
        desc: 'Compare numerical distances to identify the furthest extreme.',
        hintDesc: 'Calculate distances to the median (|mid - min| vs |max - mid|).',
        keys: 'Keys 1, 2, 3 or ←, ↓, →'
      },
      'perceptual': {
        name: 'Perceptual Speed',
        shortName: 'Perceptual Speed',
        tag: '0 - 4',
        desc: 'Count how many of 4 letter pairs match (case-insensitive).',
        hintDesc: 'Rapid visual scanning of 4 letter pairs (case-insensitive: E/e).',
        keys: 'Keys 0, 1, 2, 3, 4'
      },
      'reasoning': {
        name: 'Reasoning',
        shortName: 'Reasoning',
        tag: '2 Phases',
        desc: 'Memorize relational premise and deduce the correct entity.',
        hintDesc: 'Relational logic and working memory in two phases.',
        keys: 'Space (continue) | 1 / 2 or ← / →'
      },
      'word-meaning': {
        name: 'Word Meaning',
        shortName: 'Word Meaning',
        tag: 'Odd-One-Out',
        desc: 'Detect the odd word out from a synonym/antonym pair in English.',
        hintDesc: 'Detect the intruder word among vocabulary triads linked by synonymy or antonymy.',
        keys: 'Keys 1, 2, 3 or ←, ↓, →'
      },
      'spatial': {
        name: 'Spatial Visualisation',
        shortName: 'Spatial Visualisation',
        tag: '0, 1, 2',
        desc: 'Evaluate 2 boxes for valid planar rotations vs. reflections.',
        hintDesc: 'Discriminate 2D planar rotation vs. mirror reflection across 2 boxes.',
        keys: 'Keys 0, 1, 2'
      },
      'mixed': {
        name: 'Full GIA Battery',
        shortName: 'Full GIA Battery',
        tag: '5 in 1',
        desc: 'Endurance drill randomly rotating across all 5 batteries.',
        hintDesc: 'Alternating questions across all 5 sections.',
        keys: 'Contextual per battery'
      }
    },
    session: {
      endBtn: 'End',
      hudScore: 'Net Score',
      hudAccuracy: 'Accuracy',
      hudTotal: 'Score',
      hudQpm: 'Items / min',
      hudStreak: 'Streak',
      hudAvgRt: 'Latency',
      premiseTag: 'Phase 1: Memorize the statement',
      premiseSub: 'The statement will disappear when you click continue.',
      premiseBtn: 'Continue <kbd>Space</kbd>',
      premiseMasked: '[HIDDEN] Statement memorized & hidden',
      boxHeader: 'Box'
    },
    summary: {
      title: 'Cognitive Performance Report',
      meta: (batteryName, elapsedSec) => `Battery: ${batteryName} | Effective Time: ${elapsedSec}s`,
      scoreLabel: 'Net GIA Score (Correct - 0.5 × Incorrect)',
      heroSub: (acc, qpm) => `Accuracy: ${acc}% | Throughput: ${qpm} items/min`,
      statAttempts: 'Score / Total Attempts',
      statQpm: 'Throughput (items/min)',
      statRt: 'Average Latency (RT)',
      statStreak: 'Best Correct Streak',
      tableBattery: 'Battery',
      tableCorrect: 'Score',
      tableAccuracy: 'Accuracy',
      tableAvgRt: 'Avg Latency',
      tableNetScore: 'Net Score',
      restartBtn: 'Start Another Training Session',
      adviceExcellent: (acc) => `<strong>Outstanding accuracy (${acc}%)!</strong> Your error management is formidable. In the official GIA you can push 10-15% more speed without fearing the penalty.`,
      adviceBalanced: (acc, qpm, rt) => `<strong>Solid balance (${acc}% accuracy).</strong> You maintain a competitive throughput (${qpm} items/min). Focus on instant pattern recognition to reduce latency (${rt} ms).`,
      adviceCaution: (acc) => `<strong>Caution with the guessing penalty (-0.5 pts per error).</strong> Your accuracy was ${acc}%. Remember that in the GIA, blind guessing heavily penalizes your net standing. Slow down slightly to verify each item.`
    },
    modal: {
      title: 'Thomas GIA Official Specification & Methodology',
      p1: 'The <strong>Thomas International General Intelligence Assessment (GIA)</strong> is a speeded cognitive ability test derived from the <em>British Army Recruit Battery (BARB)</em>. It measures fluid mental processing speed, short-term working memory, and rapid instruction execution.',
      scoringTitle: 'Scoring Formula & Official Penalty',
      scoringFormula: 'Net Score = Correct - (0.5 × Incorrect)',
      scoringExplain: 'Blind guessing severely degrades your net score. The winning strategy is an optimal balance: maximum processing speed combined with mental verification to avoid incorrect penalties.',
      batteriesTitle: 'The 5 Official Batteries',
      batteriesList: [
        '<strong>Number Speed & Accuracy:</strong> Three integers are displayed. Determine the median value and compute distances to the two extremes (|mid - min| vs |max - mid|). Choose the extreme that is <em>furthest</em> from the center.',
        '<strong>Perceptual Speed:</strong> A matrix of 4 letter pairs is shown. Count how many pairs contain the exact same character (case-insensitive: E/e counts, Q/y does not). Options: 0 to 4.',
        '<strong>Reasoning:</strong> In Phase 1, study a relational comparative premise (e.g. <em>"Tom is heavier than Fred"</em>). After memorizing and pressing Space, the statement vanishes and a direct question appears (e.g. <em>"Who is heavier?"</em>). Measures verbal working memory and transitive deduction.',
        '<strong>Word Meaning:</strong> Three English words appear. Two share a definitive semantic link (synonyms or antonyms) and the third is the intruder (Odd-One-Out). Select the intruder.',
        '<strong>Spatial Visualisation:</strong> Evaluate 2 boxes containing asymmetric 2D glyphs. Count how many boxes (0, 1, or 2) contain legitimate planar rotations rather than mirror reflections.'
      ],
      ergonomicsTitle: 'Ergonomic Keyboard Mapping',
      ergonomicsDesc: 'To eliminate physical mouse latency, all questions respond directly to numeric keys (top row or numpad) and arrow keys.'
    }
  },

  es: {
    header: {
      methodologyBtn: 'Metodología'
    },
    setup: {
      heroTitle: 'Simulador de Velocidad Cognitiva',
      heroSub: 'Entrena con precisión psicométrica las 5 baterías oficiales del Thomas International GIA.',
      durationLabel: 'Duración del bloque',
      durations: [
        { value: '150', label: '2.5 minutos (Estándar Oficial GIA)' },
        { value: '120', label: '2.0 minutos (Estándar Numérico)' },
        { value: '60', label: '1.0 minuto (Sprint Express)' },
        { value: '180', label: '3.0 minutos' },
        { value: '300', label: '5.0 minutos (Resistencia)' },
        { value: '0', label: 'Sin límite (Práctica libre)' }
      ],
      startBtn: 'Comenzar: ',
      startMixedBtn: 'Comenzar Entrenamiento Mixto',
      mixedHintTitle: 'Batería Combinada:',
      mixedHintDesc: 'Se alternarán preguntas de las 5 secciones. Recomendado bloque de 2.5 a 5 minutos.',
      keysLabel: 'Atajos'
    },
    batteries: {
      'number-speed': {
        name: 'Velocidad y Precisión Numérica',
        shortName: 'Velocidad Numérica',
        tag: '|mid - min| vs |max - mid|',
        desc: 'Compara distancias respecto al valor central de 3 números.',
        hintDesc: 'Cálculo de distancias al número central (|mid - min| vs |max - mid|).',
        keys: 'Teclas 1, 2, 3 o ←, ↓, →'
      },
      'perceptual': {
        name: 'Velocidad Perceptiva',
        shortName: 'Velocidad Perceptiva',
        tag: '0 - 4',
        desc: 'Cuenta cuántos pares de 4 letras coinciden (A/a, B/b).',
        hintDesc: 'Escaneo visual rápido de 4 pares de letras (insensible a mayúsculas: E/e).',
        keys: 'Teclas 0, 1, 2, 3, 4'
      },
      'reasoning': {
        name: 'Razonamiento',
        shortName: 'Razonamiento',
        tag: '2 Fases',
        desc: 'Memoriza premisa relacional y deduce quién cumple la propiedad.',
        hintDesc: 'Lógica relacional y memoria de trabajo en dos fases.',
        keys: 'Espacio (continuar) | 1 / 2 o ← / →'
      },
      'word-meaning': {
        name: 'Significado de Palabras',
        shortName: 'Significado de Palabras',
        tag: 'Odd-One-Out',
        desc: 'Detecta la palabra intrusa entre un par de sinónimos/antónimos en inglés.',
        hintDesc: 'Detección del término intruso entre tríos de vocabulario en inglés vinculados por sinonimia o antonimia.',
        keys: 'Teclas 1, 2, 3 o ←, ↓, →'
      },
      'spatial': {
        name: 'Visualización Espacial',
        shortName: 'Visualización Espacial',
        tag: '0, 1, 2',
        desc: 'Compara 2 cajas e identifica rotaciones 2D válidas vs. espejos.',
        hintDesc: 'Discriminación de rotación plana 2D vs. reflexión especular en 2 cajas.',
        keys: 'Teclas 0, 1, 2'
      },
      'mixed': {
        name: 'Batería Completa',
        shortName: 'Batería Completa',
        tag: '5 en 1',
        desc: 'Entrena alternando proceduralmente las 5 secciones.',
        hintDesc: 'Preguntas alternadas proceduralmente de las 5 secciones.',
        keys: 'Contextual por batería'
      }
    },
    session: {
      endBtn: 'Terminar',
      hudScore: 'Score Neto',
      hudAccuracy: 'Precisión',
      hudTotal: 'Aciertos',
      hudQpm: 'Preg / min',
      hudStreak: 'Racha',
      hudAvgRt: 'Latencia',
      premiseTag: 'Fase 1: Memoriza la afirmación',
      premiseSub: 'La afirmación desaparecerá cuando pulses continuar.',
      premiseBtn: 'Continuar <kbd>Espacio</kbd>',
      premiseMasked: '[HIDDEN] Afirmación memorizada y oculta',
      boxHeader: 'Caja'
    },
    summary: {
      title: 'Reporte de Desempeño Cognitivo',
      meta: (batteryName, elapsedSec) => `Batería: ${batteryName} | Tiempo efectivo: ${elapsedSec}s`,
      scoreLabel: 'Puntaje Neto GIA (Aciertos − 0.5 × Fallos)',
      heroSub: (acc, qpm) => `Precisión: ${acc}% | Throughput: ${qpm} ítems/min`,
      statAttempts: 'Aciertos / Total de Intentos',
      statQpm: 'Velocidad (preg/min)',
      statRt: 'Latencia Promedio (RT)',
      statStreak: 'Mejor Racha de Aciertos',
      tableBattery: 'Batería',
      tableCorrect: 'Aciertos',
      tableAccuracy: 'Precisión',
      tableAvgRt: 'Tiempo Promedio',
      tableNetScore: 'Score Neto',
      restartBtn: 'Iniciar Otra Sesión de Entrenamiento',
      adviceExcellent: (acc) => `<strong>¡Excelente precisión (${acc}%)!</strong> Tu control de errores es formidable. En el GIA oficial puedes empujar un 10-15% más de velocidad sin temer a la penalización.`,
      adviceBalanced: (acc, qpm, rt) => `<strong>Buen balance (${acc}% de precisión).</strong> Mantienes un throughput competitivo (${qpm} preg/min). Trabaja en reconocer patrones de forma automática para reducir la latencia (${rt} ms).`,
      adviceCaution: (acc) => `<strong>Precaución con la penalización (-0.5 pts por fallo).</strong> Tu precisión fue del ${acc}%. Recuerda que en el GIA las conjeturas al azar destruyen tu puntaje neto. Disminuye ligeramente la prisa mecánica y asegura la confirmación mental de cada ítem.`
    },
    modal: {
      title: 'Metodología y Especificación Oficial Thomas GIA',
      p1: 'El <strong>Thomas International General Intelligence Assessment (GIA)</strong> es una evaluación psicométrica de velocidad cognitiva derivada del <em>British Army Recruit Battery (BARB)</em>. Mide la velocidad de procesamiento mental, la memoria operativa fluida y la capacidad de absorber y ejecutar instrucciones simples con precisión.',
      scoringTitle: 'Fórmula de Puntuación y Penalización Oficial',
      scoringFormula: 'Puntaje Neto = Aciertos - (0.5 × Fallos)',
      scoringExplain: 'Adivinar al azar reduce severamente el percentil final. La estrategia óptima es un balance implacable: máxima velocidad con confirmación mental para no incurrir en errores.',
      batteriesTitle: 'Las 5 Baterías Oficiales',
      batteriesList: [
        '<strong>Number Speed & Accuracy:</strong> Se muestran 3 números enteros. Se halla el valor mediano y se calculan las distancias absolutas a los otros dos extremos (|mid - min| vs |max - mid|). Se selecciona el extremo que esté <em>más distante</em> del centro.',
        '<strong>Perceptual Speed:</strong> Se muestra una matriz de 4 columnas de pares de letras. Se cuenta cuántos pares contienen exactamente la misma letra (insensible a mayúsculas: E/e sí, Q/y no). Opciones: 0 a 4.',
        '<strong>Reasoning:</strong> En Fase 1 se muestra una premisa de ordenación (ej. <em>"Tom is heavier than Fred"</em>). Tras memorizarla y pulsar Espacio, la afirmación se oculta y surge la pregunta directa (ej. <em>"Who is heavier?"</em>). Mide memoria de trabajo verbal y deducción relacional.',
        '<strong>Word Meaning:</strong> Se muestran 3 palabras en inglés. Dos guardan una relación semántica estricta (sinónimos o antónimos) y una tercera es el término intruso (Odd-One-Out). Se debe pulsar el intruso.',
        '<strong>Spatial Visualisation:</strong> Se evalúan 2 cajas conteniendo pares de símbolos asimétricos 2D. Se determina cuántas cajas (0, 1 o 2) contienen una rotación plana legítima en lugar de una reflexión especular (espejo).'
      ],
      ergonomicsTitle: 'Ergonomía de Teclado',
      ergonomicsDesc: 'Para eliminar la latencia mecánica del ratón, todos los ítems responden directamente a las teclas numéricas del teclado principal o del teclado numérico (Numpad), así como a las flechas de dirección.'
    }
  }
};
