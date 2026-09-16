/**
 * GIA Reasoning Data: Comparative dimensions, bipolar adjectives, and entity pools.
 * Includes both base adjectives (for equative "not as [base] as" / "no es tan [base] como")
 * and comparative adjectives (for "is [comp] than" / "es [comp] que").
 * Strictly uses human-appropriate attributes matching official Thomas GIA psychometrics.
 */

export const REASONING_NAMES_MALE = [
  'Tom', 'Fred', 'Ben', 'John', 'Pete', 'David', 'Mark', 'Paul', 'Sam', 'Luke', 'Carlos', 'James'
];

export const REASONING_NAMES_FEMALE = [
  'Mary', 'Ana', 'Rachel', 'Wendy', 'Lisa', 'Emma', 'Jane', 'Sarah', 'Elena', 'Lucy'
];

export const REASONING_NAMES = [
  ...REASONING_NAMES_MALE,
  ...REASONING_NAMES_FEMALE
];

export const COMPARATIVE_DIMENSIONS = [
  {
    dimension: 'weight',
    positive: 'heavier',
    negative: 'lighter',
    posBase: 'heavy',
    posComp: 'heavier',
    negBase: 'light',
    negComp: 'lighter',
    noun: 'weight',
    es: {
      m: {
        posBase: 'pesado',
        posComp: 'más pesado',
        negBase: 'liviano',
        negComp: 'más liviano'
      },
      f: {
        posBase: 'pesada',
        posComp: 'más pesada',
        negBase: 'liviana',
        negComp: 'más liviana'
      }
    }
  },
  {
    dimension: 'height',
    positive: 'taller',
    negative: 'shorter',
    posBase: 'tall',
    posComp: 'taller',
    negBase: 'short',
    negComp: 'shorter',
    noun: 'height',
    es: {
      m: {
        posBase: 'alto',
        posComp: 'más alto',
        negBase: 'bajo',
        negComp: 'más bajo'
      },
      f: {
        posBase: 'alta',
        posComp: 'más alta',
        negBase: 'baja',
        negComp: 'más baja'
      }
    }
  },
  {
    dimension: 'speed',
    positive: 'faster',
    negative: 'slower',
    posBase: 'fast',
    posComp: 'faster',
    negBase: 'slow',
    negComp: 'slower',
    noun: 'speed',
    es: {
      m: {
        posBase: 'rápido',
        posComp: 'más rápido',
        negBase: 'lento',
        negComp: 'más lento'
      },
      f: {
        posBase: 'rápida',
        posComp: 'más rápida',
        negBase: 'lenta',
        negComp: 'más lenta'
      }
    }
  },
  {
    dimension: 'strength',
    positive: 'stronger',
    negative: 'weaker',
    posBase: 'strong',
    posComp: 'stronger',
    negBase: 'weak',
    negComp: 'weaker',
    noun: 'strength',
    es: {
      m: {
        posBase: 'fuerte',
        posComp: 'más fuerte',
        negBase: 'débil',
        negComp: 'más débil'
      },
      f: {
        posBase: 'fuerte',
        posComp: 'más fuerte',
        negBase: 'débil',
        negComp: 'más débil'
      }
    }
  },
  {
    dimension: 'happiness',
    positive: 'happier',
    negative: 'sadder',
    posBase: 'happy',
    posComp: 'happier',
    negBase: 'sad',
    negComp: 'sadder',
    noun: 'mood',
    es: {
      m: {
        posBase: 'feliz',
        posComp: 'más feliz',
        negBase: 'triste',
        negComp: 'más triste'
      },
      f: {
        posBase: 'feliz',
        posComp: 'más feliz',
        negBase: 'triste',
        negComp: 'más triste'
      }
    }
  },
  {
    dimension: 'age',
    positive: 'older',
    negative: 'younger',
    posBase: 'old',
    posComp: 'older',
    negBase: 'young',
    negComp: 'younger',
    noun: 'age',
    es: {
      m: {
        posBase: 'viejo',
        posComp: 'más viejo',
        negBase: 'joven',
        negComp: 'más joven'
      },
      f: {
        posBase: 'vieja',
        posComp: 'más vieja',
        negBase: 'joven',
        negComp: 'más joven'
      }
    }
  },
  {
    dimension: 'wealth',
    positive: 'richer',
    negative: 'poorer',
    posBase: 'rich',
    posComp: 'richer',
    negBase: 'poor',
    negComp: 'poorer',
    noun: 'wealth',
    es: {
      m: {
        posBase: 'rico',
        posComp: 'más rico',
        negBase: 'pobre',
        negComp: 'más pobre'
      },
      f: {
        posBase: 'rica',
        posComp: 'más rica',
        negBase: 'pobre',
        negComp: 'más pobre'
      }
    }
  },
  {
    dimension: 'bravery',
    positive: 'braver',
    negative: 'more timid',
    posBase: 'brave',
    posComp: 'braver',
    negBase: 'timid',
    negComp: 'más tímido',
    noun: 'courage',
    es: {
      m: {
        posBase: 'valiente',
        posComp: 'más valiente',
        negBase: 'tímido',
        negComp: 'más tímido'
      },
      f: {
        posBase: 'valiente',
        posComp: 'más valiente',
        negBase: 'tímida',
        negComp: 'más tímida'
      }
    }
  },
  {
    dimension: 'intelligence',
    positive: 'brighter',
    negative: 'duller',
    posBase: 'bright',
    posComp: 'brighter',
    negBase: 'dull',
    negComp: 'duller',
    noun: 'acuity',
    es: {
      m: {
        posBase: 'inteligente',
        posComp: 'más inteligente',
        negBase: 'torpe',
        negComp: 'más torpe'
      },
      f: {
        posBase: 'inteligente',
        posComp: 'más inteligente',
        negBase: 'torpe',
        negComp: 'más torpe'
      }
    }
  },
  {
    dimension: 'calmness',
    positive: 'calmer',
    negative: 'more nervous',
    posBase: 'calm',
    posComp: 'calmer',
    negBase: 'nervous',
    negComp: 'more nervous',
    noun: 'demeanor',
    es: {
      m: {
        posBase: 'tranquilo',
        posComp: 'más tranquilo',
        negBase: 'nervioso',
        negComp: 'más nervioso'
      },
      f: {
        posBase: 'tranquila',
        posComp: 'más tranquila',
        negBase: 'nerviosa',
        negComp: 'más nerviosa'
      }
    }
  },
  {
    dimension: 'generosity',
    positive: 'more generous',
    negative: 'stingier',
    posBase: 'generous',
    posComp: 'more generous',
    negBase: 'stingy',
    negComp: 'stingier',
    noun: 'generosity',
    es: {
      m: {
        posBase: 'generoso',
        posComp: 'más generoso',
        negBase: 'tacaño',
        negComp: 'más tacaño'
      },
      f: {
        posBase: 'generosa',
        posComp: 'más generosa',
        negBase: 'tacaña',
        negComp: 'más tacaña'
      }
    }
  },
  {
    dimension: 'friendliness',
    positive: 'friendlier',
    negative: 'more hostile',
    posBase: 'friendly',
    posComp: 'friendlier',
    negBase: 'hostile',
    negComp: 'more hostile',
    noun: 'sociability',
    es: {
      m: {
        posBase: 'amable',
        posComp: 'más amable',
        negBase: 'antipático',
        negComp: 'más antipático'
      },
      f: {
        posBase: 'amable',
        posComp: 'más amable',
        negBase: 'antipática',
        negComp: 'más antipática'
      }
    }
  }
];
