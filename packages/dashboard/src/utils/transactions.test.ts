import {
  toTransactionTime,
  findDescriptionFieldByName,
} from './transactions';
import { Principal } from "@dfinity/principal";

const randomPrincipalIdAlice = 'wtsvk-no3pg-kspfk-ee7fr-ugbb6-w5cpi-2ikft-guspj-leiao-cyz7r-4qe';
const randomPrincipalIdBob = 'anvdy-audqm-4rjxv-giu3g-onj7o-3oeo4-uncre-mapet-zm3tm-hpl5c-yqe';

const principalAlice = Principal.fromText(randomPrincipalIdAlice);
const principalBob = Principal.fromText(randomPrincipalIdBob);

describe('utils/transactions', () => {
  describe('toTransactionTime', () => {
    describe('on valid service time', () => {
      it('should return valid transaction time (large number)', () => {
        const time = 1600000000000n;
        const result = toTransactionTime(time);
        const expected = '13/09/2020';
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
  describe('findDescriptionFieldByName', () => {
    describe('on valid details', () => {
      const details = [
        [
          "to",
          {
            "Principal": principalAlice,
          }
        ],
        [
          "from",
          {
            "Principal": principalBob,
          },
        ],
      ];

      it('should return a text principal id (to)', () => {
        const pid = findDescriptionFieldByName('to', details);
        expect(pid).toBeTruthy();
      });

      it('should return a matching (Alice) text principal id (to)', () => {
        const pid = findDescriptionFieldByName('to', details);
        expect(pid).toBe(randomPrincipalIdAlice);
      });

      it('should return a text principal id (from)', () => {
        const pid = findDescriptionFieldByName('from', details);
        expect(pid).toBeTruthy();
      });

      it('should return a matching (Bob) text principal id (from)', () => {
        const pid = findDescriptionFieldByName('from', details);
        expect(pid).toBe(randomPrincipalIdBob);
      });
    });

    describe('on invalid details', () => {
      const details = [
        [
          "to",
          {
            "Principal": null,
          }
        ],
      ];

      it('should return empty string (to)', () => {
        const pid = findDescriptionFieldByName('to', details);
        expect(pid).toBe('');
      });

      it('should return empty string (from)', () => {
        const pid = findDescriptionFieldByName('from', details);
        expect(pid).toBe('');
      });
    });
  });
});