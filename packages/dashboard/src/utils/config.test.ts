import { 
  Enviroments,
  isValidEnvironment,
  isValidPrincipalFromTextId,
} from './config';

describe('utils/config', () => {
  describe('isValidEnvironment', () => {
    describe('on valid environment variable', () => {
      it('should be truthy (production)', () => {
        const isValid = isValidEnvironment(Enviroments.production)
        expect(isValid).toBeTruthy();
      });

      it('should be truthy (staging)', () => {
        const isValid = isValidEnvironment(Enviroments.staging)
        expect(isValid).toBeTruthy();
      });

      it('should be truthy (development)', () => {
        const isValid = isValidEnvironment(Enviroments.development)
        expect(isValid).toBeTruthy();
      });

      it('should be truthy (test)', () => {
        const isValid = isValidEnvironment(Enviroments.test)
        expect(isValid).toBeTruthy();
      });
    });
  });
  
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
