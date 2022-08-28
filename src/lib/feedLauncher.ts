import BN from 'bn.js';
import HeadsUpFactoryABI from '../artifacts/HeadsUpFactory.json';
import HeadsUpABI from '../artifacts/HeadsUp.json';
import { HeadsUpFactory, HeadsUp } from '../typechain-types/contracts';
import { HeadsUpDatum } from '../generated/headsup_datum_schema';
import * as config from './config';
import { ListResults } from './utils';

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

export async function mintFeed(acct: string, feedAddr: string) {
  let rcpt: any;
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;
  return new Promise((resolve) => {
    headsUp.methods
      .mintFeedNft(false)
      .send({
        from: acct,
      })
      .on('receipt', (receipt: any) => {
        rcpt = receipt;
      })
      .on('confirmation', (confirmation: number) => {
        if (confirmation === 1) {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(rcpt));
          resolve(rcpt);
        }
      });
  });
}

export async function getOwner(feedAddr: string) {
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;

  return headsUp.methods.owner().call();
}
export async function setNewIssue(
  acct: string,
  feedAddr: string,
  content: string,
) {
  let rcpt: any;
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;
  console.log(content);
  return new Promise((resolve) => {
    headsUp.methods
      .setNewIssue(content)
      .send({
        from: acct,
      })
      .on('receipt', (receipt: any) => {
        rcpt = receipt;
      })
      .on('confirmation', (confirmation: number) => {
        if (confirmation === 1) {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(rcpt));
          resolve(rcpt);
        }
      });
  });
}

export async function getNumberOfIssue(feedAddr: string): Promise<number> {
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;
  return new BN(await headsUp.methods.getNumberOfIssues().call()).toNumber();
}

export async function getIssue(feedAddr: string, issueNo: number) {
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;

  const result = await headsUp.methods.getIssue(issueNo).call();
  const decodedResult = config.web3.utils.hexToUtf8(result);
  return JSON.parse(decodedResult) as HeadsUpDatum;
}

export async function setCover(
  acct: string,
  feedAddr: string,
  jsonUrl: string,
) {
  let rcpt: any;
  const headsUp = new config.web3.eth.Contract(
    HeadsUpABI.abi as any,
    feedAddr,
  ) as any as HeadsUp;
  return new Promise((resolve) => {
    headsUp.methods
      .setCoverData(jsonUrl)
      .send({
        from: acct,
      })
      .on('receipt', (receipt: any) => {
        rcpt = receipt;
      })
      .on('confirmation', (confirmation: number) => {
        if (confirmation === 1) {
          // eslint-disable-next-line no-alert
          // alert(JSON.stringify(rcpt));
          resolve(rcpt);
        }
      });
  });
}

export async function launchNewNFTFeed(
  acct: string,
  feedSymbol: string,
  feedName: string,
  metdataJsonUrlHash: string,
): Promise<string> {
  return new Promise((resolve) => {
    let rcpt: any;
    const headsUp = new config.web3.eth.Contract(
      HeadsUpFactoryABI.abi as any,
      config.HEADUPS_FACTORY_ADDR,
    ) as any as HeadsUpFactory;
    headsUp.methods
      .launchNftFeed(feedSymbol, feedName, metdataJsonUrlHash)
      .send({
        from: acct,
      })
      .on('receipt', (receipt: any) => {
        rcpt = receipt;
      })
      .on('confirmation', (confirmation: number) => {
        if (confirmation === 1) {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(rcpt));
          resolve(rcpt.events.Launch.returnValues.to);
        }
      });
    /* headsUp.methods.
    contract.methods['launchNewsletter(string,string)'](feedSymbol, feedName, metdataUrl)
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
  */
  });
}
