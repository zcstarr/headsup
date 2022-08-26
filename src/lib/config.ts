import { ethers } from 'ethers';
import Web3 from 'web3';
import HeadsUpServerClient from 'headsup-server-client';

export const web3 = new Web3((window as any).ethereum);
export const IPFS_GATEWAY_BASE_URL = 'https://2eff.lukso.dev/ipfs/';
export const SERVER_HOST = process.env.SERVER_HOST || 'https://localhost';
export const SERVER_PORT = process.env.SERVER_PORT || 8081;
export const L16_RPC_URL = 'https://rpc.l16.lukso.network';
export const L16_CHAIN_ID = 2828;
export const HEADUPS_FACTORY_ADDR =
  '0xd75bD9212bbF63630c5659A9F663228C78827Cf0';

export const apiClient = new HeadsUpServerClient({
  transport: {
    host: SERVER_HOST,
    port: 8081,
    type: 'http',
    path: '/rpc',
  },
});

// export const PROVIDER = new ethers.providers.JsonRpcBatchProvider(L16_RPC_URL);

// const signer = provider.getSigner();
