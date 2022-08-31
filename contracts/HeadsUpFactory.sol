// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// Import this file to use console.log
import "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0ERC725Account.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./HeadsUp.sol";

contract HeadsUpFactory is Ownable{


  /**
   * @dev Emitted when `value` tokens are moved from one account (`from`) to
   * another (`to`).
   *
   * Note that `value` may be zero.
   */
  event Launch(address indexed from, address indexed to);

  error ExceededOffsetLimit(uint256 limit);

  address[] public deployedContracts;
  mapping(address => address[]) public userAddressToFeeds;


  constructor(address _newOwner) {
    transferOwnership(_newOwner);
    
  }

  function launchNftFeed(string calldata name, string calldata symbol, bytes calldata jsonUrlHash) public {
    HeadsUp hup = new HeadsUp(name, symbol, jsonUrlHash, msg.sender);
    deployedContracts.push(address(hup));
    userAddressToFeeds[address(msg.sender)].push(address(hup));
    emit Launch(msg.sender, address(hup));
  }

  function getFeedsFrom(address addr, uint offset, uint limit) public view returns(address [100] memory, uint){
      address[100] memory feeds;
      uint count;
      if(limit > 100){
        revert ExceededOffsetLimit(limit);
      }
      uint boundary = offset + limit;
      
      for (uint i=offset; i < userAddressToFeeds[addr].length && i < boundary; i++) {
        feeds[i]=userAddressToFeeds[addr][i];
        count = count + 1;
      }
      return (feeds, count);
  }

  function getDeployedFeeds(uint offset, uint limit, bool descending) public view returns(address[100] memory, uint) {
      address[100] memory feeds;
      uint count;
      if(limit > 100){
        revert ExceededOffsetLimit(limit);
      }

      if(descending == true){
      uint start= deployedContracts.length - offset;
      
      for (uint i=start - 1; i >= 0; i--) {
        feeds[i] = deployedContracts[i];
        count = count + 1;
      }
      return (feeds, count);
      }

      uint edge = offset + limit;
      for (uint i=offset; i <deployedContracts.length && i < edge; i++) {
        feeds[i] = deployedContracts[i];
        count = count + 1;
      }
      return (feeds, count);

  }

}
