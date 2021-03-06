import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import {
  createBookmarkExpandHandler,
  trimAccount,
  contractKeyPairedMetadataHandler,
} from './account';
import { DABCollection } from './dab';
import { Principal } from '@dfinity/principal';
import { parseUserRootBucketsResponse } from '@utils/account';
import { getRandomIdentity } from '@utils/principal';

describe('Account', () => {
  describe('trimAccount', () => {
    describe('should be valid', () => {
      test('on valid account string format (long)', () => {
        const mockAccount = '942x43-432jf2-53iasd-2342a-423asdg-53jdjo';
        const computed = trimAccount(mockAccount);
        const expected = '942x43...53jdjo';

        expect(computed).toBe(expected);
      });

      test('on valid account string format (short)', () => {
        const mockAccount = 'r89pz1-xxvasdg-bo423z';
        const computed = trimAccount(mockAccount);
        const expected = 'r89pz1...bo423z';

        expect(computed).toBe(expected);
      });

      test('on unexpected hash format (no dashes)', () => {
        const mockAccount = 'XxaHAUor89pz1reujdsdjskk3434xvasdgB35dso423z0djs12345';
        const computed = trimAccount(mockAccount);
        const expected = 'XxaHAU...s12345';

        expect(computed).toBe(expected);
      });
    });

    describe('should be empty', () => {
      test('on invalid account string format', () => {
        const mockAccount = '942x43jdjo';
        const computed = trimAccount(mockAccount);
        const expected = '';

        expect(computed).toBe(expected);
      });

      test('on empty account value', () => {
        const mockAccount = '';
        const computed = trimAccount(mockAccount);
        const expected = '';

        expect(computed).toBe(expected);
      });
    });
  });

  describe('createBookmarkExpandHandler', () => {
    describe('on create', () => {
      test('should return a function (collapsed)', () => {
        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.collapsed,
          setBookmarkColumnMode: jest.fn(),
        });
        expect(typeof bookmarkExpandHandler).toBe('function');
      });

      test('should return a function (expanded)', () => {
        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.expanded,
          setBookmarkColumnMode: jest.fn(),
        });
        expect(typeof bookmarkExpandHandler).toBe('function');
      });
    });

    describe('on created function handler call', () => {
      test('should call the setBookmarkColumnMode', () => {
        const setBookmarkColumnMode = jest.fn();
        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.expanded,
          setBookmarkColumnMode,
        });

        bookmarkExpandHandler();

        expect(setBookmarkColumnMode).toHaveBeenCalledTimes(1);
      });

      test('should call the setBookmarkColumnMode', () => {
        const setBookmarkColumnMode = jest.fn();
        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.expanded,
          setBookmarkColumnMode,
        });

        bookmarkExpandHandler();

        expect(setBookmarkColumnMode).toHaveBeenCalledTimes(1);
      });

      test('should compute to collapsed (when expanded)', () => {
        const setBookmarkColumnMode = (mode: BookmarkColumnModes) => {
          expect(mode).toBe(BookmarkColumnModes.collapsed);
        };

        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.expanded,
          setBookmarkColumnMode,
        });

        bookmarkExpandHandler();
      });

      test('should compute to expanded (when collapsed)', () => {
        const setBookmarkColumnMode = (mode: BookmarkColumnModes) => {
          expect(mode).toBe(BookmarkColumnModes.expanded);
        };

        const bookmarkExpandHandler = createBookmarkExpandHandler({
          bookmarkColumnMode: BookmarkColumnModes.collapsed,
          setBookmarkColumnMode,
        });

        bookmarkExpandHandler();
      });
    });
  });

  describe('parseUserRootBucketsResponse', () => {
    let identity = getRandomIdentity();
    let response = {};

    describe('on valid response', () => {
      beforeAll(() => {
        identity = getRandomIdentity();
        response = {
          contracts: [
            identity,
          ],
        };
      });

      afterAll(() => {
        identity = getRandomIdentity();
        response = {};
      });

      it('should parse the data', () => {
        const parsed = parseUserRootBucketsResponse({
          ...response,
          promisedTokenContractsPairedRoots: {},
        });
        expect(parsed).toBeTruthy();
      });

      it('should parse the data to the expected object type', () => {
        const parsed = parseUserRootBucketsResponse({
          ...response,
          promisedTokenContractsPairedRoots: {},
        });
        const expectedData = (async () => undefined)();
        expect(parsed).toStrictEqual(expectedData);
      });
    });

    describe('on invalid response', () => {
      describe('on missing contract field', () => {
        beforeAll(() => {
          identity = getRandomIdentity();
          response = {};
        });
  
        afterAll(() => {
          identity = getRandomIdentity();
          response = {};
        });
  
        it('should return empty list', () => {
          const parsed = parseUserRootBucketsResponse({
            ...response,
            promisedTokenContractsPairedRoots: {},
          });
          const expectedData = (async () => undefined)();
          expect(parsed).toStrictEqual(expectedData);
        });
      });

      describe('on invalid contract field', () => {
        beforeAll(() => {
          identity = getRandomIdentity();
          response = {
            contract: undefined,
          };
        });
  
        afterAll(() => {
          identity = getRandomIdentity();
          response = {};
        });
  
        it('should return empty list', () => {
          const parsed = parseUserRootBucketsResponse({
            ...response,
            promisedTokenContractsPairedRoots: {},
          });
          const expectedData = (async () => undefined)();
          expect(parsed).toStrictEqual(expectedData);
        });
      });
    });
  });

  describe('contractKeyPairedMetadataHandler', () => {
    describe('on valid dab collection', () => {
      const alicePrincipal = Principal.fromText('sgymv-uiaaa-aaaaa-aaaia-cai');
      const bobPrincipal = Principal.fromText('ai7t5-aibaq-aaaaa-aaaaa-c');
      const standard = 'Foobar';
      const dabCollection: DABCollection = [{
        description: '',
        icon: '',
        name: '',
        principal_id: alicePrincipal,
        standard,
      }, {
        description: '',
        icon: '',
        name: '',
        principal_id: bobPrincipal,
        standard,
      }];

      it('should create a list of token contract-metadata key pair', () => {
        const contractKeyPairedMetadata = contractKeyPairedMetadataHandler({
          dabCollection,
        });
        const expected = 2;

        expect(
          Object.keys(contractKeyPairedMetadata).length,
        ).toBe(expected);
      });

      it('should have a particular contract', () => {
        const contractKeyPairedMetadata = contractKeyPairedMetadataHandler({
          dabCollection,
        });

        expect(contractKeyPairedMetadata[alicePrincipal.toString()].standard).toBe(standard);
      });
    });
    
    describe('on invalid dab collection', () => {
      it('should return an empty object', () => {
        const contractKeyPairedMetadata = contractKeyPairedMetadataHandler({
          dabCollection: [],
        });

        expect(contractKeyPairedMetadata).toStrictEqual({});
      });
    });
  });
});
