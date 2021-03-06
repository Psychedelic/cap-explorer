import {
  toTransactionTime,
} from './transactions';

describe('utils/transactions', () => {
  describe('toTransactionTime', () => {
    describe('on valid service time', () => {
      it('should return valid transaction time (large number)', () => {
        const time = 1600000000000n;
        const result = toTransactionTime(time);
        const expected = '2020-09-13T12:26:40.000Z';
        expect(result).toBe(expected);
      })
    });
    describe('on invalid service time', () => {
      it('should return empty (too large number)', () => {
        const time = 16000000000000000000n;
        const result = toTransactionTime(time);
        expect(result).toBeUndefined();
      })
    });
  });
});