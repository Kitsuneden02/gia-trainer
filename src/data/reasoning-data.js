/**
 * GIA Reasoning Data: Comparative dimensions, bipolar adjectives, and entity pools.
 * Includes both base adjectives (for equative "not as [base] as" / "no es tan [base] como")
 * and comparative adjectives (for "is [comp] than" / "es [comp] que").
 */

export const REASONING_NAMES = [
  'Tom', 'Fred', 'Ben', 'Mary', 'Ana', 'John', 'Pete', 'Rachel',
  'Wendy', 'David', 'Lisa', 'Mark', 'Paul', 'Sam', 'Emma', 'Luke',
  'Alex', 'Jane', 'Sarah', 'Chris', 'Elena', 'Carlos', 'James', 'Lucy'
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
      posBase: 'pesado',
      posComp: 'más pesado',
      negBase: 'liviano',
      negComp: 'más liviano'
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
      posBase: 'alto',
      posComp: 'más alto',
      negBase: 'bajo',
      negComp: 'más bajo'
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
      posBase: 'rápido',
      posComp: 'más rápido',
      negBase: 'lento',
      negComp: 'más lento'
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
      posBase: 'viejo',
      posComp: 'más viejo',
      negBase: 'joven',
      negComp: 'más joven'
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
      posBase: 'brillante',
      posComp: 'más brillante',
      negBase: 'torpe',
      negComp: 'más torpe'
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
      posBase: 'fuerte',
      posComp: 'más fuerte',
      negBase: 'débil',
      negComp: 'más débil'
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
      posBase: 'rico',
      posComp: 'más rico',
      negBase: 'pobre',
      negComp: 'más pobre'
    }
  },
  {
    dimension: 'elevation',
    positive: 'higher',
    negative: 'lower',
    posBase: 'high',
    posComp: 'higher',
    negBase: 'low',
    negComp: 'lower',
    noun: 'position',
    es: {
      posBase: 'alto',
      posComp: 'más alto',
      negBase: 'bajo',
      negComp: 'más bajo'
    }
  },
  {
    dimension: 'arrival',
    positive: 'earlier',
    negative: 'later',
    posBase: 'early',
    posComp: 'earlier',
    negBase: 'late',
    negComp: 'later',
    noun: 'timing',
    es: {
      posBase: 'temprano',
      posComp: 'más temprano',
      negBase: 'tarde',
      negComp: 'más tarde'
    }
  },
  {
    dimension: 'temperature',
    positive: 'warmer',
    negative: 'colder',
    posBase: 'warm',
    posComp: 'warmer',
    negBase: 'cold',
    negComp: 'colder',
    noun: 'temperature',
    es: {
      posBase: 'cálido',
      posComp: 'más cálido',
      negBase: 'frío',
      negComp: 'más frío'
    }
  },
  {
    dimension: 'hardness',
    positive: 'harder',
    negative: 'softer',
    posBase: 'hard',
    posComp: 'harder',
    negBase: 'soft',
    negComp: 'softer',
    noun: 'hardness',
    es: {
      posBase: 'duro',
      posComp: 'más duro',
      negBase: 'blando',
      negComp: 'más blando'
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
      posBase: 'valiente',
      posComp: 'más valiente',
      negBase: 'tímido',
      negComp: 'más tímido'
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
      posBase: 'feliz',
      posComp: 'más feliz',
      negBase: 'triste',
      negComp: 'más triste'
    }
  }
];
