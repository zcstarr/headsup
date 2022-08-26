
import BN from "bn.js";
import HeadsUpFactoryABI from '../artifacts/HeadsUpFactory.json';
import { HeadsUpFactory } from '../typechain-types/contracts';
import * as config from './config';
import { ListResults } from "./utils";


export async function getFeeds(upAcct: string, offset: number, limit: number) {
  const headsUp = new config.web3.eth.Contract(
    HeadsUpFactoryABI.abi as any,
    config.HEADUPS_FACTORY_ADDR,
  ) as any as HeadsUpFactory;
  const result = await headsUp.methods
    .getNewsletters(upAcct, offset, limit)
    .call();
  const list = result[0] || [];
  const count = new BN(result[1]);
  console.log(list, count);
  return [list, count] as ListResults<string>;
}

export async function launchNewNFTFeed(
  acct: string,
  feedSymbol: string,
  feedName: string,
): Promise<string> {
  const contract = new config.web3.eth.Contract(
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
