import { dateRelative } from './date';
import dayjs from 'dayjs';

describe('date', () => {
  describe('dateRelative', () => {
    describe('for ISOString 2021-12-14T12:13:58.921Z', () => {
      const timezoneEuropeLondon = 'Europe/London';
      const timezoneAmericaLosAngels = 'America/Los_Angeles';
      const timestamp = '2021-12-10T15:00:00.000Z';
      const timestampPlusTenMinutes = '2021-12-10T15:10:00.000Z';
      const timestampPlusThirtyMinutes = '2021-12-10T15:30:00.000Z';
      const getNow = (
        timestamp: string,
        timezone: string,
      ) => dayjs.utc(timestamp).tz(timezone)

      describe('on timezone Europe/London', () => {
          it('should be a 10m difference', () => {
            const now = getNow(
              timestampPlusTenMinutes,
              timezoneEuropeLondon,
            );
            const humanFriendlyDate = dateRelative(
              timestamp,
              now,
            );

            const expected = '10 minutes ago';

            expect(humanFriendlyDate).toBe(expected);
          });

          it('should be a 30m difference', () => {
            const now = getNow(
              timestampPlusThirtyMinutes,
              timezoneEuropeLondon,
            );
            const humanFriendlyDate = dateRelative(
              timestamp,
              now,
            );

            const expected = '30 minutes ago';

            expect(humanFriendlyDate).toBe(expected);
          });
      });

      describe('on timezone America/Los Angeles', () => {
        it('should be a 10m difference', () => {
          const now = getNow(
            timestampPlusTenMinutes,
            timezoneAmericaLosAngels,
          );
          const humanFriendlyDate = dateRelative(
            timestamp,
            now,
          );

          const expected = '10 minutes ago';

          expect(humanFriendlyDate).toBe(expected);
        });

        it('should be a 30m difference', () => {
          const now = getNow(
            timestampPlusThirtyMinutes,
            timezoneAmericaLosAngels,
          );
          const humanFriendlyDate = dateRelative(
            timestamp,
            now,
          );

          const expected = '30 minutes ago';

          expect(humanFriendlyDate).toBe(expected);
        });
    });
    });
  });
});
