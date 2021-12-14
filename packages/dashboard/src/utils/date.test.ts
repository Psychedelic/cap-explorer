import { dateRelative } from './date';

describe('date', () => {
  describe('dateRelative', () => {
    describe('for date 10/12/2021 15h00 (as ISOString)', () => {
      const timezoneEuropeLondon = 'Europe/London';
      const timezoneAmericaLosAngels = 'America/Los_Angeles';
      const timestamp = '2021-12-10T15:00:00.000Z';
      const timestampMinusEigthHours = '2021-12-10T07:00:00.000Z';
      const timestampPlusThirtyMinutes = '2021-12-10T15:30:00.000Z';
      const timestampPlusTwoHours = '2021-12-10T17:00:00.000Z';
      const getNow = (
        timestamp: string,
        timeZone: string,
      ) => new Date(
        new Date(timestamp).toLocaleString("en-US", { timeZone }),
      ).toISOString();

      describe('on timezone Europe/London', () => {
          it('on checking immediately should describe as few seconds ago', () => {
            const now = getNow(
              timestamp,
              timezoneEuropeLondon,
            );
            const humanFriendlyDate = dateRelative(
              timestamp,
              now,
            );

            const expected = 'a few seconds ago';

            expect(humanFriendlyDate).toBe(expected);
          });

          it('on checking 30m after should be a 30m difference', () => {
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
        it('on a timestamp which is 8 hours earlier should show few seconds ago', () => {
          const now = getNow(
            timestamp,
            timezoneAmericaLosAngels,
          );
          const humanFriendlyDate = dateRelative(
            timestampMinusEigthHours,
            now,
          );

          const expected = 'a few seconds ago';

          expect(humanFriendlyDate).toBe(expected);
        });

        it('on 2 hours from source timestamp should be a 2 hours difference', () => {
          const now = getNow(
            timestampPlusTwoHours,
            timezoneAmericaLosAngels,
          );
          const humanFriendlyDate = dateRelative(
            timestampMinusEigthHours,
            now,
          );

          const expected = '2 hours ago';

          expect(humanFriendlyDate).toBe(expected);
        });
    });
    });
  });
});
