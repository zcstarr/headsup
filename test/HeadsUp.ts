import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import BN from 'bn.js';
// import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import web3 from 'web3';
import { encodeKeyName } from '@erc725/erc725.js/build/main/src/lib/encodeKeyName';
import { HeadsUp } from '../src/typechain-types';

const LSP8TokenIdType = {
  name: 'LSP8TokenIdType',
  key: '0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4',
  keyType: 'Singleton',
  valueType: 'uint256',
  valueContent: 'Number',
};

const LSP8MetadataJSON = {
  name: 'LSP8MetadataJSON:<uint256>',
  key: '0x9a26b4060ae7f7d5e3cd0000<uint256>',
  keyType: 'Mapping',
  valueType: 'bytes',
  valueContent: 'JSONURL',
};

/* enum TokenIdType {
  address = '1',
  number = '2',
  bytes32 = '3',
}*/

describe('HeadsUp', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployHeadsupContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const headsUpFactory = await ethers.getContractFactory('HeadsUp');
    const headsup = await headsUpFactory.deploy(
      'billy bob',
      'bbn',
      owner.address,
    );

    return { headsup: headsup as HeadsUp, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should set the right unlockTime', async function () {
      const { headsup } = await loadFixture(deployHeadsupContract);
      // const prefix = '0x9a26b4060ae7f7d500000000';
      const tokenId = new BN(1).toString('hex');
      // const key = encodeKeyName(LSP8MetadataJSON.name, tokenId);
      console.log(tokenId);
      // console.log(key);
      // '0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47'
      const key =
        '0x9a26b4060ae7f7d5e3cd00000000000000000000000000000000000000000000';
      
      const result = await headsup['getData(bytes32)'](key);

      const hashFunction = result.slice(0, 10);
      const hash = `0x${result.slice(0, 74)}`;
      const url = `0x${result.slice(74)}`;

      // check if it uses keccak256
      /// if (hashFunction === '0x6f357c6a') {
        // download the json file

        console.log(web3.utils.hexToUtf8(url).replace('ipfs://', ''));

        /* const json = await ipfsMini.catJSON(
        web3.utils.hexToUtf8(url).replace('ipfs://','')
    );*/

        // compare hashes
        /* if(web3.utils.keccak256(JSON.stringify(json)) === hash)
        return
            ? json
            : false
            */
     // }
      console.log(result);
      // expect(await lock.unlockTime()).to.equal(unlockTime);
    });
  });
});
