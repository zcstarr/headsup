// eslint-disable-next-line import/no-unassigned-import
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import web3 from 'web3';

const deployKey = process.env.LUKSO_DEPLOY_KEY;
async function main() {
  if (!deployKey) {
    throw new Error('crash no LUKSO_DEPLOY_KEY');
  }
  const RPC_HOST = 'https://rpc.l16.lukso.network';
  const provider = new ethers.providers.JsonRpcBatchProvider(RPC_HOST);
  const signer = new ethers.Wallet(deployKey, provider);
  const HeadsUpFactory = await ethers.getContractFactory(
    'HeadsUpFactory',
    signer,
  );
  console.log(deployKey);
  console.log(await signer.getAddress());
  console.log(await signer.getBalance());
  const head = await HeadsUpFactory.deploy(
    '0xe1373Df18919752371D462A329f3a5F34D43aee0',
    {
      gasLimit: 20000000,
      gasPrice: await provider.getGasPrice(),
    },
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
