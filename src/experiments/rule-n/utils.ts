import { Bit } from '../../types';

function generateRuleSet(rule: number, { BYTE_LENGTH: BITS = 8 } = {}) {
  const ruleSet: Record<string, Bit> = {};

  rule
    .toString(2)
    .padStart(BITS, '0')
    .split('')
    .reverse()
    .forEach((bit, index) => {
      const pattern = index.toString(2).padStart(3, '0');
      ruleSet[pattern] = Number(bit) as Bit;
    });

  return ruleSet;
}

export default { generateRuleSet };
