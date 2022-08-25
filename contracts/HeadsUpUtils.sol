// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library HeadsUpUtils {

bytes32 constant BYTES20_MASK = 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; 
function extractTokenIdFromKey (bytes32 key) pure internal returns(uint256) {
      uint256 tokenId = uint256(key & BYTES20_MASK);
      return tokenId;
  }

}