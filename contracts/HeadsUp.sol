// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// Import this file to use console.log
import "hardhat/console.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0ERC725Account.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {LSP2Utils} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";
import {HeadsUpUtils} from "./HeadsUpUtils.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {GasLib} from "@erc725/smart-contracts/contracts/utils/GasLib.sol";
import "./Constants.sol";
bytes12 constant _FIX_LSP8_METADATA_JSON_KEY_PREFIX = 0x9a26b4060ae7f7d5e3cd0000;

string constant ARRAY_PREFIX = string("[]");
contract HeadsUp is IERC725Y, LSP8IdentifiableDigitalAsset{
 uint256 public tokenIdCounter;
 bytes32 public feedArrayKey;
 // All tokens have the same metadata so we reshare this dynamically calculated md;
 bytes public tokenMetadataJsonUrl; 
  constructor(string memory name,
              string memory symbol,
              bytes memory jsonUrl,
              address newOwner_address) LSP8IdentifiableDigitalAsset(name, symbol, newOwner_address) {
              // NOTE cannot take back the name
              string memory arrayName = string(abi.encodePacked(name, ARRAY_PREFIX));
              uint256 count = 0;
              // Key used for setting multiple issues data
              feedArrayKey = LSP2Utils.generateArrayKey(arrayName);

              _setData(_LSP4_METADATA_KEY, jsonUrl);
              //Set the newsletter array key
              _setData(feedArrayKey, abi.encodePacked(count));

              // uint256 tokenIds
              _setData(_LSP8_TOKENID_TYPE_KEY,abi.encodePacked(uint256(2)));
              // LSP2Utils.generateJSONURLValue(hashFunction,generateJSON(),"ipfs://QmTsz9Xykc5JUAfUa6wWNrnKmTjdDMGFJRmFfQEeLQ9x8u");
              // _setData(_LSP4_METADATA_KEY,abi.)
              string memory hashFunction = 'keccak256(utf8)';

              // Precompute dummy data if it's never set
              tokenMetadataJsonUrl = LSP2Utils.generateJSONURLValue(hashFunction,generateJSON(),"ipfs://QmTsz9Xykc5JUAfUa6wWNrnKmTjdDMGFJRmFfQEeLQ9x8u");


  }

  function computeView() public {

  }

  function setCollectionData(bytes memory jsonUrl) public onlyOwner {
      _setData(_LSP4_METADATA_KEY, jsonUrl);
  }

  function setUnifiedCollectionData(bytes memory jsonUrl) public onlyOwner {
      _setData(_LSP4_METADATA_KEY, jsonUrl);
      tokenMetadataJsonUrl = jsonUrl;
  }

//  "https://storage.swapp.land/ipfs/QmYycsFrPBMxXh87QgRnWXx3auvTYZrpnPVaW8kjsFUhbe"
  function generateJSON() public pure returns (string memory){
    return '{"LSP4Metadata":{"description":"tokenz"}}';
  }

  function generateCollectionJSON() public pure returns(string memory){
    return '{"LSP4Metadata":{"description":"token collection"}}';
  }

  function setCoverData(bytes memory jsonUrl) public onlyOwner{
    tokenMetadataJsonUrl = jsonUrl;
  }

  function mintFeedNft(bool force) public {
    
    //left cut 20bytes 
    
    // bytes32 tokendMetadataIdKey = LSP2Utils.generateMappingKey(_FIX_LSP8_METADATA_JSON_KEY_PREFIX, bytes20(abi.encodePacked(tokenIdCounter))); 
    _mint(msg.sender,bytes32(tokenIdCounter),force,bytes("mint token"));
      tokenIdCounter++;
    // bytes32 memory tokenMetadataKey = keccack(abi.encodePacked(_LSP8_METADATA_JSON_KEY_PREFIX,tokenIdCounter));
    // _setData(tokenMetadataIdKey, jsonUrlHash);
    // _mint(msg.sender,);
  }

  /*function generateJSON(uint256 tokenId) {

  }*/
  function getData(bytes32[] memory dataKeys) public view virtual override(IERC725Y, ERC725YCore) returns (bytes[] memory dataValues)
    {
      dataValues = new bytes[](dataKeys.length);
      // string memory hashFunction = 'keccak256(utf8)';
    for (uint256 i = 0; i < dataKeys.length; i = GasLib.uncheckedIncrement(i)) {
        if(bytes12(_FIX_LSP8_METADATA_JSON_KEY_PREFIX) ==  bytes12(dataKeys[i])){
            // uint256 tokenId = HeadsUpUtils.extractTokenIdFromKey(dataKeys[i]);
            // TODO just in case in the future we can do something more custom for each tokenId
            dataValues[i]= tokenMetadataJsonUrl; 
        }
        else {
              dataValues[i] = _getData(dataKeys[i]);
        }
      }

        return dataValues;
    }


  function getData(bytes32 key) public override(ERC725YCore, IERC725Y) view returns (bytes memory){
    if(bytes12(_FIX_LSP8_METADATA_JSON_KEY_PREFIX) ==  bytes12(key)){
      // string memory hashFunction = 'keccak256(utf8)';
      // uint256 tokenId = HeadsUpUtils.extractTokenIdFromKey(key) ;
      // return LSP2Utils.generateJSONURLValue(hashFunction,generateJSON(),"ipfs://QmYXXjL4f1pLTErZFBfdnDqDhB6d8AbawBAh18LQPmtxxe");
      return tokenMetadataJsonUrl; 
    }
      return super._getData(key);
  }

  function setNewIssue (bytes calldata content) public onlyOwner {
    
    uint256 numIssues = uint256(bytes32(_getData(feedArrayKey)));
    _setData(LSP2Utils.generateArrayElementKeyAtIndex(feedArrayKey, numIssues), content);
    unchecked {
      _setData(feedArrayKey, abi.encodePacked(numIssues + 1));
    }
  }

  function updateIssue (bytes calldata content, uint256 issueNumber) public onlyOwner {
    _setData(LSP2Utils.generateArrayElementKeyAtIndex(feedArrayKey, issueNumber), content);
  }

  function getNumberOfIssues() public view returns (uint256) {
    return uint256(bytes32(_getData(feedArrayKey)));
  }

  function getIssue(uint256 issueNumber) public view returns (bytes memory) {
    return _getData(LSP2Utils.generateArrayElementKeyAtIndex(feedArrayKey, issueNumber));
  }
}
