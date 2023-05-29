// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Subscriptions is ERC721, Ownable {
    struct User {
        address userAddr;
        uint256 renewTimestamp;
        uint256 subscriberLastPaid;
        string userName;
    }

    uint256 public suscriptionAmount;
    uint256 public tokenIdNumber;
    mapping(address => User) public userData;

    constructor(uint256 _suscriptionAmount) ERC721("Revive Duniya", "RDY") {
        suscriptionAmount = _suscriptionAmount;
    }

    function userSubscribe(string memory _username) public payable {
        //if user does not own NFT
        if (balanceOf(msg.sender) == 0) {
            //mint nft
            tokenIdNumber = tokenIdNumber + 1;
            _safeMint(msg.sender, tokenIdNumber);
            //renew subscriptions
            userData[msg.sender] = User(
                msg.sender,
                block.timestamp + 30 * 24 * 60 * 60,
                block.timestamp,
                _username
            );
        }
        //if user owns NFT, check if they have paid their subscription, if not pay and update due date and subscription status, also tier upgrade option
        else {
            //renew subscriptions
            userData[msg.sender] = User(
                msg.sender,
                block.timestamp + 30 * 24 * 60 * 60,
                block.timestamp,
                userData[msg.sender].userName
            );
        }
    }

    function isUserSuscribed(address _user) public view returns(bool){
        return userData[_user].renewTimestamp > block.timestamp;
    }

    function setSubscriptionAmount(uint _amount)public onlyOwner{
        suscriptionAmount = _amount;
    }

    
}
