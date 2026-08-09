import { cleanDigits } from './currency';

describe('cleanDigits', () => {
  it('converts a plain digit string into a decimal value divided by 100', () => {
    expect(cleanDigits('300')).toBe(3);
  });

  it('converts a single digit into cents', () => {
    expect(cleanDigits('5')).toBe(0.05);
  });

  it('strips non-digit characters before converting', () => {
    expect(cleanDigits('R$ 1.234,56')).toBe(1234.56);
  });

  it('strips letters and symbols mixed with digits', () => {
    expect(cleanDigits('abc123def')).toBe(1.23);
  });

  it('returns 0 for an empty string', () => {
    expect(cleanDigits('')).toBe(0);
  });

  it('returns 0 when the string has no digits at all', () => {
    expect(cleanDigits('R$ ,')).toBe(0);
  });

  it('handles large numbers correctly', () => {
    expect(cleanDigits('100000000')).toBe(1000000);
  });

  it('handles leading zeros', () => {
    expect(cleanDigits('000050')).toBe(0.5);
  });
});
