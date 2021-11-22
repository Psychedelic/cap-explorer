import { decodeTokenId } from './token';

describe('token', () => {
  describe('decodeTokenId', () => {
    describe('on valid principal', () => {
      const aliceValidPrincipal = '6maer-5qkor-uwiaa-aaaaa-b4apt-yaqca-aaehv-q';
      const aliceIndex = 8683;
      const jackValidPrincipal = '572sb-rikor-uwiaa-aaaaa-b4apt-yaqca-aaeia-a';
      const jackIndex = 8704;
      
      it('should return expected index (Alice)', () => {
        const decoded = decodeTokenId(aliceValidPrincipal);
        expect(decoded).toBe(aliceIndex);
      });

      it('should return expected index (Jack)', () => {
        const decoded = decodeTokenId(jackValidPrincipal);
        expect(decoded).toBe(jackIndex);
      });
    });
    describe('on invalid principal', () => {
      const invalidPrincipal = '32x-2-323dxcxxccc';

      it('should fail', () => {
        const decoded = decodeTokenId(invalidPrincipal);
        expect(decoded).toThrow();
      });
    });
  });
});
