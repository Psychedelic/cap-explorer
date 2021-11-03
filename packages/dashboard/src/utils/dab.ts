import config from '../config';
import { getCanisterInfo } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent'

export default {};

export const getDabMetadata = async ({
  canisterId,
}: {
  canisterId: string,
}) => {
  let metadata: Awaited<ReturnType<typeof getCanisterInfo>>;

  const httpAgentArgs = {
    host: config.host,
    canisterId,
  };
  
  try {
    const agent = new HttpAgent(httpAgentArgs);

    // TODO: check why tsc fails for agent type
    metadata = await getCanisterInfo(canisterId, (agent as any));
  } catch (err) {
    console.warn(`Oops! Metadata for ${canisterId} not found in dab!`);
  }

  return metadata;
}