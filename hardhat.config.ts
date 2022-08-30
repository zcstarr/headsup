/* eslint-disable import/no-unassigned-import */
import { HardhatUserConfig } from 'hardhat/config';
// eslint-disable-next-line import/no-unassigned-import
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    lukso: {
      url: 'https://rpc.l16.lukso.network',
    },
  },
  typechain: {
    target: 'web3-v1',
    outDir: 'src/typechain-types',
  },
};

export default config;
