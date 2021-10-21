import { isValidPrincipalFromTextId } from './config';

describe('utils/config', () => {
  describe('isValidPrincipalFromTextId', () => {
    const validdPrincipalTextId = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
    const invalidPrincipalTextId = 'wu-tang-clan-dolla-dolla-bill-yo';

    describe('on valid principal (text id)', () => {
      it('should be truthy', () => {
        const isValid = isValidPrincipalFromTextId(validdPrincipalTextId);
        expect(isValid).toBeTruthy();
      });
    });

    describe('on invalid principal (text id)', () => {
      it('should be falsy', () => {
        const isValid = isValidPrincipalFromTextId(invalidPrincipalTextId);
        expect(isValid).toBeFalsy();
      });

      it('should be falsy', () => {
        const isValid = isValidPrincipalFromTextId(undefined);
        expect(isValid).toBeFalsy();
      });
    });
  });
});
