import Web3, {ContractOptions} from 'web3';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import HeadsUpFactoryABI from '../artifacts/HeadsUpFactory.json';
import HeadsUpABI from '../artifacts/HeadsUp.json';
import {
  HeadsUp,
  HeadsUpFactory__factory,
  HeadsUpFactory,
  HeadsUp__factory,
} from '../typechain-types';
import * as config from './config';

const web3 = new Web3((window as any).ethereum);

export function getFeedLauncherContract(options: ContractOptions) {
  const signer = config.PROVIDER.getSigner();
  return new web3.eth.Contract(
    HeadsUpFactoryABI.abi as any,
    config.HEADUPS_FACTORY_ADDR,
    {
      gas: 5_000_000,
      gasPrice: '1000000000',
    },
}

export async function launchNewNFTFeed(
  acct: string,
  feedSymbol: string,
  feedName: string,
): Promise<string> {
  const contract = new web3.eth.Contract(
    HeadsUpFactoryABI.abi as any,
    config.HEADUPS_FACTORY_ADDR,
    {
      gas: 5_000_000,
      gasPrice: '1000000000',
    },
  );

  return new Promise((resolve) => {
    let rcpt: any;
    contract.methods['launchNewsletter(string,string)'](feedSymbol, feedName)
      .send({
        from: acct,
      })
      .on('receipt', (receipt: any) => {
        rcpt = receipt;
        console.log('txReciept', receipt);
      })
      .on('confirmation', (confirmation: number) => {
        if (confirmation === 1) {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(rcpt));
          resolve(rcpt.events.Launch.returnValues.to);
        }
      })
      .once('sending', (payload: unknown) => {
        console.log('sending', payload);
      });
  });
}
