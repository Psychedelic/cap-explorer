import { getRouteByName } from './routes';
import { qsE2ETestRunner } from './e2e';

describe('Routes', () => {
  describe('getRouteByName', () => {
    const ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...ENV };
    });

    afterAll(() => {
      process.env = ENV;
    });

    describe('on argument Home', () => {
      test('computes valid route', () => {
        (process.env.E2E_TEST_RUNNER as unknown as boolean) = false;

        const route = getRouteByName('Home');
        const expected = '/';
        expect(route).toBe(expected);
      });

      test('computes valid route (CI)', () => {
        (process.env.E2E_TEST_RUNNER as unknown as boolean) = true;

        const route = getRouteByName('Home');
        const expected = `/?${qsE2ETestRunner}`;
        expect(route).toBe(expected);
      });
    });
  });
});
