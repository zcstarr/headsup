import { ethers } from 'ethers';

import Web3 from 'web3';
import HeadsUpServerClient from 'headsup-server-client';

export const web3 = new Web3((window as any).ethereum);
// export const IPFS_GATEWAY_BASE_URL = 'https://2eff.lukso.dev/ipfs/';
// export const IPFS_GATEWAY_BASE_URL = 'https://storage.swapp.land/ipfs/';
// 'https://swappland.mypinata.cloud/ipfs/'
export const FRONTEND_URI =
  process.env.REACT_APP_HEADSUP_FRONTEND_URI || 'http://localhost:9011';

export const IPFS_GATEWAY_BASE_URL =
  process.env.REACT_APP_HEADSUP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
export const SERVER_HOST = 'api.feedhead.xyz' || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT || 8081;
export const L16_RPC_URL = 'https://rpc.l16.lukso.network';
export const L16_CHAIN_ID = 2828;
export const HEADUPS_FACTORY_ADDR =
  process.env.REACT_APP_HEADSUP_MAIN_CONTRACT_ID ||
  '0xde8BaE72564ea5313756AAD83bA64567Bd0787F7';
export const API_BASE_URL = process.env.REACT_APP_HEADS_UP_ENV  ?  'https://api.feedhead.xyz' : 
`http://${SERVER_HOST}:${SERVER_PORT}`

export const COVER_META_ROUTE = `http://${API_BASE_URL}/covermeta`;
export const IMAGE_ROUTE = `http://${API_BASE_URL}/image`;

export const RPC_API_HOST = process.env.REACT_APP_HEADS_UP_ENV
  ? 'api.feedhead.xyz'
  : 'localhost';

export const apiClient = new HeadsUpServerClient({
  transport: {
    host: RPC_API_HOST,
    port: parseInt(`${SERVER_PORT}`, 10),
    type: 'https',
    path: '/rpc',
  },
});

// export const PROVIDER = new ethers.providers.JsonRpcBatchProvider(L16_RPC_URL);

// const signer = provider.getSigner();
