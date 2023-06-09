// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Subscriptions is Ownable {
    event subscriptions(address suscribedAddress,uint monthsSuscribed,uint totalUsers);

    struct User {
        address userAddr;
        uint256 renewTimestamp;
        uint256 subscriberLastPaid;
    }

    mapping(address => uint256) balanceOf;
    uint256 public suscriptionAmount;
    uint256 public tokenIdNumber;
    uint256 public amount;
    mapping(address => User) public userData;

    constructor(uint256 _suscriptionAmount) {
        suscriptionAmount = _suscriptionAmount;
    }

    function userSubscribe() public payable {
        require(msg.value >= suscriptionAmount);
        //if user does not own NFT
        //increase amount subscriptions
        if(balanceOf[msg.sender]==0){
            tokenIdNumber = tokenIdNumber + 1;

        }
        //renew subscriptions
        userData[msg.sender] = User(
            msg.sender,
            block.timestamp + 30 * 24 * 60 * 60,
            block.timestamp
        );

        amount += msg.value;
        balanceOf[msg.sender] += 1;
        emit subscriptions(msg.sender,balanceOf[msg.sender],tokenIdNumber);
    }

    function generateMetadata(
        uint256 tokenId,
        uint256 assetId,
        string memory name,
        string memory ipfsimage
    ) private pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name,
                        Strings.toString(tokenId),
                        '","assetid":"',
                        Strings.toString(assetId),
                        '", "description": "suscription of revive duniya game", "image": "data:image/svg+xml;base64,',
                        ipfsimage,
                        '"}'
                    )
                )
            )
        );

        string memory metadata = string(json);

        return metadata;
    }

    function isUserSuscribed(address _user) public view returns (bool) {
        return userData[_user].renewTimestamp > block.timestamp;
    }

    function setSubscriptionAmount(uint256 _amount) public onlyOwner {
        suscriptionAmount = _amount;
    }

    function withdrawmoney(address payable _receiver) public onlyOwner {
        suscriptionAmount = 0;
        _receiver.transfer(suscriptionAmount);
    }

    function withdrawspecificamount(address payable _receiver, uint256 _amount)
        public
        onlyOwner
    {
        _receiver.transfer(amount);
        amount -= _amount;
    }
}
