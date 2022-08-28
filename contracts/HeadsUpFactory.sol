// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// Import this file to use console.log
import "hardhat/console.sol";
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
  mapping(address => address[]) public userAddressToNewsletters;


  constructor(address _newOwner) {
    transferOwnership(_newOwner);
    
  }

  function launchNftFeed(string calldata name, string calldata symbol, bytes calldata jsonUrlHash) public {
    HeadsUp hup = new HeadsUp(name, symbol, jsonUrlHash, msg.sender);
    deployedContracts.push(address(hup));
    userAddressToNewsletters[address(msg.sender)].push(address(hup));
    emit Launch(msg.sender, address(hup));
  }

  function getNewsletters(address addr, uint offset, uint limit) public view returns(address [100] memory, uint){
      address[100] memory newsletters;
      uint count;
      if(limit > 100){
        revert ExceededOffsetLimit(limit);
      }
      uint boundary = offset + limit;
      
      for (uint i=offset; i < userAddressToNewsletters[addr].length && i < boundary; i++) {
        newsletters[i]=userAddressToNewsletters[addr][i];
        count = count + 1;
      }
      return (newsletters, count);
  }

}
