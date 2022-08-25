/* eslint-disable import/no-unassigned-import */
import { HardhatUserConfig } from 'hardhat/config';
// eslint-disable-next-line import/no-unassigned-import
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    lukso: {
      url: 'https://rpc.l16.lukso.network',
    },
  },
  typechain: {
    outDir: 'src/typechain-types',
  },
};

export default config;
