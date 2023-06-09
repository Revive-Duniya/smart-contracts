// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Subscriptions is Ownable, ERC721URIStorage {
    struct User {
        address userAddr;
        uint256 renewTimestamp;
        uint256 subscriberLastPaid;
    }

    uint256 public suscriptionAmount;
    uint256 public tokenIdNumber;
    mapping(address => User) public userData;

    constructor(uint256 _suscriptionAmount) ERC721("Revive Duniya", "RDY") {
        suscriptionAmount = _suscriptionAmount;
    }

    function userSubscribe() public payable {
        //if user does not own NFT
        if (balanceOf(msg.sender) == 0) {
            //mint nft
            tokenIdNumber = tokenIdNumber + 1;
            _safeMint(msg.sender, tokenIdNumber);
            _setTokenURI(tokenIdNumber,generateMetadata(tokenIdNumber, 1, "subscription", "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json"));
            //renew subscriptions
            userData[msg.sender] = User(
                msg.sender,
                block.timestamp + 30 * 24 * 60 * 60,
                block.timestamp
            );
        }
        //if user owns NFT, check if they have paid their subscription, if not pay and update due date and subscription status, also tier upgrade option
        else {
            //renew subscriptions
            userData[msg.sender] = User(
                msg.sender,
                block.timestamp + 30 * 24 * 60 * 60,
                block.timestamp
            );
        }
    }

    function generateMetadata(uint256 tokenId,uint256 assetId, string memory name,string memory ipfsimage)
        private
        pure
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name,
                        Strings.toString(tokenId),
                        '","assetid":"',Strings.toString(assetId),'", "description": "suscription of revive duniya game", "image": "data:image/svg+xml;base64,',
                        ipfsimage,
                        '"}'
                    )
                )
            )
        );

        string memory metadata = string(
            json
        );

        return metadata;
    }


    function isUserSuscribed(address _user) public view returns(bool,uint256){
        return (userData[_user].renewTimestamp > block.timestamp,userData[_user].renewTimestamp);
    }

    function setSubscriptionAmount(uint _amount)public onlyOwner{
        suscriptionAmount = _amount;
    }

  

    
}
