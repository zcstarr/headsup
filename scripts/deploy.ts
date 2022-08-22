// eslint-disable-next-line import/no-unassigned-import
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

async function main() {
  const HeadsUpFactory = await ethers.getContractFactory('HeadsUpFactory');
  const head = await HeadsUpFactory.deploy(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  );

  await head.deployed();

  console.log('Headsup with 1 ETH deployed to:', head.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
