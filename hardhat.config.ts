/* eslint-disable import/no-unassigned-import */
import { HardhatUserConfig } from 'hardhat/config';
// eslint-disable-next-line import/no-unassigned-import
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  typechain: {
    outDir: 'src/typechain-types',
  },
};

export default config;
