// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// Import this file to use console.log
import "hardhat/console.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0ERC725Account.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP2Utils} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";
import "@erc725/smart-contracts/contracts/ERC725Y.sol";

string constant ARRAY_PREFIX = string("[]");
contract HeadsUp is LSP8IdentifiableDigitalAsset{
 bytes32 public newsletterArrayKey;
  constructor(string memory name,
              string memory symbol,
              address newOwner_address) LSP8IdentifiableDigitalAsset(name, symbol, newOwner_address) {
              // NOTE cannot take back the name
              string memory arrayName = string(abi.encodePacked(name, ARRAY_PREFIX));
              uint256 count = 0;
              newsletterArrayKey = LSP2Utils.generateArrayKey(arrayName);
              _setData(newsletterArrayKey, abi.encodePacked(count));
  }

  function mintNewsletterNft(bool force) public {
    // _mint(msg.sender,);
  }

  function setNewIssue (bytes calldata content) public onlyOwner {
    
    uint256 numIssues = uint256(bytes32(_getData(newsletterArrayKey)));
    _setData(LSP2Utils.generateArrayElementKeyAtIndex(newsletterArrayKey, numIssues), content);
    unchecked {
      _setData(newsletterArrayKey, abi.encodePacked(numIssues + 1));
    }
  }

  function updateIssue (bytes calldata content, uint256 issueNumber) public onlyOwner {
    _setData(LSP2Utils.generateArrayElementKeyAtIndex(newsletterArrayKey, issueNumber), content);
  }

  function getNumberOfIssues() public view returns (uint256) {
    return uint256(bytes32(_getData(newsletterArrayKey)));
  }

  function getIssue(uint256 issueNumber) public view returns (bytes memory) {
    return _getData(LSP2Utils.generateArrayElementKeyAtIndex(newsletterArrayKey, issueNumber));
  }
}
