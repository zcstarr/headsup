import { ethers } from 'ethers';

export const IPFS_GATEWAY_BASE_URL = 'https://2eff.lukso.dev/ipfs/';
export const L16_RPC_URL = 'https://rpc.l16.lukso.network';
export const L16_CHAIN_ID = 2828;
export const HEADUPS_FACTORY_ADDR =
  '0xd75bD9212bbF63630c5659A9F663228C78827Cf0';

export const PROVIDER = new ethers.providers.JsonRpcBatchProvider(L16_RPC_URL);
// const signer = provider.getSigner();