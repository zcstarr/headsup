import BN from 'bn.js';
import { generateSchemasFromDynamicKeys } from '@erc725/erc725.js/build/main/src/lib/utils';
import { ERC725JSONSchema } from '@erc725/erc725.js/build/main/src/types/ERC725JSONSchema';
import LSP8DigitalAssetABI from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import {
  encodeValueContent,
  decodeValueContent,
  decodeValueType,
} from '@erc725/erc725.js/build/main/src/lib/encoder';
import HeadsUpFactoryABI from '../artifacts/HeadsUpFactory.json';
import HeadsUpABI from '../artifacts/HeadsUp.json';
import { HeadsUpFactory, HeadsUp } from '../typechain-types/contracts';
import { HeadsUpDatum } from '../generated/headsup_datum_schema';
import { LSP4Metadata } from '../generated/lsp4_metadata_schema';
import { LSP8IdentifiableDigitalAsset } from '../typechain-types/@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset';
import * as config from './config';
import { ListResults } from './utils';
import { fetchLSP8Metadata } from './lsp8';

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
const LSP8MetadataJSON = {
  name: 'LSP8MetadataJSON:<uint256>',
  key: '0x9a26b4060ae7f7d5e3cd0000<uint256>',
  keyType: 'Mapping',
  valueType: 'bytes',
  valueContent: 'JSONURL',
} as ERC725JSONSchema;

export function getTokenIdMetadataKey(id: BN): string {
  const tokenMetadataKeyParts = {
    keyName: `LSP8MetadataJSON:<uint256>`,
    dynamicKeyParts: id.toString(),
  };
  const resultSchema = generateSchemasFromDynamicKeys(
    [tokenMetadataKeyParts],
    [LSP8MetadataJSON],
  );
  return resultSchema[0].key;
}

export function decodeJSONUrlValue(value: string): string {
  const { url } = decodeValueContent('JSONURL', value) as { url: string };
  return url;
}

export function convertIPFSUrl(url: string): string {
  return url.replace('ipfs://', config.IPFS_GATEWAY_BASE_URL);
}
export interface SimpleMeta {
  imageUrl?: string;
  desc?: string;
}

export async function getTokenName(feedAddr: string): Promise<string> {
  if (!feedAddr) {
    throw new Error('no feed');
  }
  const lsp8Contract = new config.web3.eth.Contract(
    LSP8DigitalAssetABI.abi as any,
    feedAddr,
  ) as any as LSP8IdentifiableDigitalAsset;

  const rawName = await lsp8Contract.methods['getData(bytes32)'](
    '0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af1',
  ).call();
  return config.web3.utils.hexToUtf8(rawName);
}

export async function getTokenTopLevelMetadata(
  feedAddr: string,
): Promise<SimpleMeta> {
  const lsp8Contract = new config.web3.eth.Contract(
    LSP8DigitalAssetABI.abi as any,
    feedAddr,
  ) as any as LSP8IdentifiableDigitalAsset;

  const jsonURLRaw = await lsp8Contract.methods['getData(bytes32)'](
    '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
  ).call();
  const url = decodeJSONUrlValue(jsonURLRaw);
  const ipfsUrl = convertIPFSUrl(url);
  console.log(ipfsUrl);
  const response = await (await fetch(ipfsUrl)).json();
  const value = response.data as { LSP4Metadata: LSP4Metadata };
  console.log(value);
  const { images } = value.LSP4Metadata;
  let imageUrl: undefined | string;
  if (images) {
    imageUrl = images[0][0]?.url;
  }
  return { imageUrl, desc: value.LSP4Metadata.description };
}

export async function getTokenIdMetadata(
  feedAddr: string,
): Promise<SimpleMeta> {
  const lsp8Contract = new config.web3.eth.Contract(
    LSP8DigitalAssetABI.abi as any,
    feedAddr,
  ) as any as LSP8IdentifiableDigitalAsset;

  const keyName = await getTokenIdMetadataKey(new BN('0'));
  const jsonURLRaw = await lsp8Contract.methods['getData(bytes32)'](
    keyName,
  ).call();
  const url = decodeJSONUrlValue(jsonURLRaw);
  const ipfsUrl = convertIPFSUrl(url);
  const response = await (await fetch(ipfsUrl)).json();
  const value = response as { LSP4Metadata: LSP4Metadata };
  const { images } = value.LSP4Metadata;
  let imageUrl: undefined | string;
  if (images) {
    imageUrl = images[0][0]?.url;
    imageUrl = imageUrl ? convertIPFSUrl(imageUrl) : imageUrl;
  }
  return { imageUrl, desc: value.LSP4Metadata.description };
}

export async function getTokenMetadata(feedAddr: string) {
  const metadata = await fetchLSP8Metadata('0', feedAddr, config.web3);
  return metadata;
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
