// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Assets is Ownable,ERC721Enumerable{
    uint256 public tokenIdNumber;
    mapping(address => uint256[]) public userOwnedNFTs;

    constructor() ERC721("Revive Duniya", "RDY") {}

    function myNft()public view returns(uint256[] memory){
        uint256[] memory array = new uint256[](tokenIdNumber);
        uint256 amountNFT = balanceOf(msg.sender);
        for(uint i=0;i<amountNFT;i++){
            array[i]=tokenOfOwnerByIndex(msg.sender,i);
        }
        return array;
    }

    
}
