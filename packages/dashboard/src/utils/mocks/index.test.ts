import { shouldUseMockup } from '.';

describe('utils/mocks', () => {
  describe('shouldUseMockup', () => {
    describe('on process.env.MOCKUP is string "true"', () => {
      it('should be truthy', () => {
        const res = shouldUseMockup("true");
        expect(res).toBeTruthy();
      });
    });
    describe('on process.env.MOCKUP is string "false"', () => {
      it('should be truthy', () => {
        const res = shouldUseMockup("false");
        expect(res).toBeFalsy();
      });
    });
    describe('on process.env.MOCKUP is undefined', () => {
      it('should be truthy', () => {
        const res = shouldUseMockup(undefined);
        expect(res).toBeFalsy();
      });
    });
  });
});