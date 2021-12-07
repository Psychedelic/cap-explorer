import {
  createNFTDetailsHandlerPromiseList,
  GetNFTDetails,
} from './dab';
import {
  NFTDetails,
} from '@psychedelic/dab-js';

describe('Dab', () => {
  describe('createNFTDetailsHandlerPromiseList', () => {
    describe('on valid arguments', () => {
      const tokenId = 'qcg3w-tyaaa-aaaah-qakea-cai';
      const transactionEvents = [
        {
          amount: undefined,
          caller: undefined,
          details: [
            [
              "to",
              undefined
            ],
            [
              "token_id",
              undefined
            ],
          ],
          from: undefined,
          item: 1234n,
          operation: "transfer",
          time: "06/12/2021",
          to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
        },
        {
          amount: undefined,
          caller: undefined,
          details: [
            [
              "to",
              undefined
            ],
            [
              "token_id",
              undefined
            ],
          ],
          from: undefined,
          item: 2345n,
          operation: "transfer",
          time: "06/12/2021",
          to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
        }
      ];
      const nftItemDetails = {
        [tokenId]: {
          4071: {
            canister: tokenId,
            index: 4071n,
            metadata: {
              desc: "",
              id: 4071n,
              name: "ICPunk #4071",
              url: "/Token/4071",
            },
            name: "ICPunk #4071",
            standard: "ICPunks",
            url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/4071",
          },
        },
      };
      const standard = 'icpunks';
      const callback = async ({
        tokenId,
        tokenIndex,
        standard,
      }: GetNFTDetails) => {
        return ({
          index: BigInt(tokenIndex),
          canister: tokenId,
          id: tokenIndex.toString(),
          name: 'foobar',
          url: 'http://www.site/image.jpg',
          metadata: {},
          standard,
          collection: {},
        } as NFTDetails);
      };

      it('should provide a list of promises', async () => {
        const promises = await createNFTDetailsHandlerPromiseList({
          nftItemDetails,
          standard,
          tokenId,
          transactionEvents,
          callback,
        });

        expect(promises).toBeTruthy();
      });

      it('should provide the expected number of results', async () => {
        const promises = await createNFTDetailsHandlerPromiseList({
          nftItemDetails,
          standard,
          tokenId,
          transactionEvents,
          callback,
        });

        const count = Object.keys(transactionEvents).length;

        expect(promises?.length == count).toBeTruthy();
      });
    });
  });
});