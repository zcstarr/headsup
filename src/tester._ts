/* eslint-disable camelcase */
import { ethers } from 'ethers';
// eslint-disable-next-line import/no-extraneous-dependencies
import BN from 'bn.js';
import { EventFragment } from 'ethers/lib/utils';
// eslint-disable-next-line camelcase
import {
  HeadsUp,
  HeadsUpFactory__factory,
  HeadsUpFactory,
  HeadsUp__factory,
} from './typechain-types';

// const RPC_HOST = 'https://mainnet.infura.io/v3/6d6c70e65c77429482df5b64a4d0c943';
const RPC_HOST = 'http://localhost:8545';

let CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
CONTRACT_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9';
CONTRACT_ADDRESS = '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690';
CONTRACT_ADDRESS = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
CONTRACT_ADDRESS = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';

async function getSingleEventFromTxLog(
  event: EventFragment,
  logs: ethers.providers.Log[],
  abiInterface: ethers.utils.Interface,
): Promise<ethers.utils.LogDescription> {
  for (const log of logs) {
    try {
      const logDesc = abiInterface.parseLog(log);
      if (event.name === logDesc.name) {
        return logDesc;
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  throw new Error('Could not find event');
}

interface LaunchEventArgs {
  to: string;
  from: string;
}
async function getLaunchEventFromLogs(
  headsUpFactory: HeadsUpFactory,
  logs: ethers.providers.Log[],
): Promise<LaunchEventArgs> {
  const eventDesc = headsUpFactory.interface.events['Launch(address,address)'];
  const result = await getSingleEventFromTxLog(
    eventDesc,
    logs,
    headsUpFactory.interface,
  );
  const { to, from } = result.args as any;
  return { to, from };
}

type ListResults<T> = [T[], ethers.BigNumber];

function parseListResult<T>(result: ListResults<T>): T[] {
  const [values, size] = result;
  const parsedList = [];
  const len = size.toNumber();
  for (let i = 0; i < len; i++) {
    parsedList.push(values[i]);
  }
  return parsedList;
}

async function init() {
  const provider = new ethers.providers.JsonRpcBatchProvider(RPC_HOST);
  const signer = provider.getSigner();

  const headsUpFactory = HeadsUpFactory__factory.connect(
    CONTRACT_ADDRESS,
    signer,
  );
  const factoryOwner = await headsUpFactory.owner();
  console.log(factoryOwner);
  const headsUpTx = await headsUpFactory.launchNewsletter(
    'firstNewsletter',
    'FNS',
  );
  const result = await headsUpTx.wait();
  const { to } = await getLaunchEventFromLogs(headsUpFactory, result.logs);
  await headsUpFactory.launchNewsletter('first', 'fnss');
  await headsUpTx.wait();

  const headsUp = await HeadsUp__factory.connect(to, signer);
  const owner = await headsUp.owner();
  const value = Buffer.from('the king of france');
  headsUp.setNewIssue(value);
  const issue = await headsUp.getIssue(0);
  const issuesCreated = await headsUp.getNumberOfIssues();
  console.log(owner);
  console.log(issuesCreated);
  console.log(Buffer.from(issue.slice(2), 'hex').toString('utf8'));
  /* const res = await headsUpFactory.getNewsletters(owner, 0, 10);
  const values = parseListResult(res);
  console.log(values);
  */

  // const r = headsUpFactory.interface.parseLog(result.logs[4]);

  /* const filter = {
    address: CONTRACT_ADDRESS,
    topics: [headsUpFactory.interface.events['Launch(address,address)']],
  };*/
}

init();
/*


 newsletterAddress = NewsletterFactory.makeNewsletter("ownerAddress")
 newsletter = NewsLetter.at("newsletter")
 markdownText = text
 newsletter.updateIssueOnChain("markdownText")
 newsletter.getLatestIssue()
 newsletter.getIssue("1") => {
  data: string
  uri: undefined
 }
 newsletter.getIssueIds(): []
 






*/
