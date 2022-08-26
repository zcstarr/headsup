import Web3 from 'web3';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import HeadsUpFactory from '../artifacts/HeadsUpFactory.json';
import HeadsUp from '../artifacts/HeadsUp.json';
import { HEADUPS_FACTORY_ADDR } from './config';

const web3 = new Web3((window as any).ethereum);
const HEADUPS_TOKEN_ADDR = '0x6338b560a9B3FFE3411C0ecd2c55F2FebBD924ff';

export async function login(): Promise<string[]> {
  const accountsRequest: string[] = await web3.eth.requestAccounts();
  console.log(accountsRequest);
  const accounts: string[] = await web3.eth.getAccounts();
  return accounts;
}

export async function launchNewNFTFeed(
  acct: string,
  feedSymbol: string,
  feedName: string,
): Promise<string> {
  const contract = new web3.eth.Contract(
    HeadsUpFactory.abi as any,
    HEADUPS_FACTORY_ADDR,
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

/* export async function mintNewsletterNft(acct: string) {
  const contract = new web3.eth.Contract(
    HeadsUpFactory.abi as any,
    HEADUPS_FACTORY_ADDR,
    {
      gas: 5_000_000,
      gasPrice: '1000000000',
    },
  );

  await contract.methods['launchNewsletter(string,string)']('zane', 'shane')
    .send({
      from: acct,
    })
    .on('receipt', (receipt: any) => {
      console.log('txReciept', receipt);
    })
    .once('sending', (payload: unknown) => {
      console.log('sending', payload);
    });
}*/

export async function mintToken(acct: string, tokenAddr: string) {
  // TODO HEADUS as a param
  const contract = new web3.eth.Contract(HeadsUp.abi as any, tokenAddr, {
    gas: 5_000_000,
    gasPrice: '1000000000',
  });

  await contract.methods['mintNewsletterNft(bool)'](false)
    .send({
      from: acct,
    })
    .on('receipt', (receipt: any) => {
      console.log('txReceipt', receipt);
    })
    .once('sending', (payload: unknown) => {
      console.log('sending', payload);
    });
}
