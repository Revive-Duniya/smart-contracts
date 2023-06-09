// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaResponseCodes.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/IHederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/ExpiryHelper.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Subscriptions is ExpiryHelper {
    struct User {
        address userAddr;
        uint256 renewTimestamp;
        uint256 subscriberLastPaid;
    }
    mapping(address => uint256) public balanceOf;
    address public owner;
    address public NftAddress;
    uint256 public suscriptionAmount;
    uint256 public tokenIdNumber;
    mapping(address => User) public userData;

    constructor(uint256 _suscriptionAmount) {
        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](1);

        // Set this contract as supply
        keys[0] = getSingleKey(
            KeyType.SUPPLY,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        IHederaTokenService.HederaToken memory token;
        token.name = "Revive Duniya";
        token.symbol = "RDY";
        token.memo = "INSERT STACKUP NAME";
        token.treasury = address(this);
        token.tokenSupplyType = true; // set supply to FINITE
        token.maxSupply = 10;
        token.tokenKeys = keys;
        token.freezeDefault = false;
        // token.expiry = createAutoRenewExpiry(address(this), 7000000);

        (int256 responseCode, address createdToken) = HederaTokenService
            .createNonFungibleToken(token);

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("Failed to create non-fungible token");
        }
        NftAddress = createdToken;
        suscriptionAmount = _suscriptionAmount;
        owner = msg.sender;
    }

    function userSubscribe() public payable {
        require(msg.value > suscriptionAmount);
        //if user does not own NFT
        if (balanceOf[msg.sender] == 0) {
            //mint nft
            tokenIdNumber = tokenIdNumber + 1;
            // _safeMint(msg.sender, tokenIdNumber);
            // _setTokenURI(
            //     tokenIdNumber,
            //     generateMetadata(
            //         tokenIdNumber,
            //         1,
            //         "subscription",
            //         "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json"
            //     )
            // );
            (int256 response, , int64[] memory serial) = HederaTokenService
                .mintToken(NftAddress, 0, generateMetadata(
                    tokenIdNumber,
                    1,
                    "subscription",
                    "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json"
                ));

            if (response != HederaResponseCodes.SUCCESS) {
                revert("Failed to mint non-fungible token");
            }
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
        balanceOf[msg.sender] += 1;
    }

    function generateMetadata(
        uint256 tokenId,
        uint256 assetId,
        string memory name,
        string memory ipfsimage
    ) private pure returns (bytes[] memory) {
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

        bytes[] memory metadataBytes = new bytes[](1);
        metadataBytes[0] = bytes(metadata); // Convert string to bytes array

        return metadataBytes;
    }

    function isUserSuscribed(address _user)
        public
        view
        returns (bool, uint256)
    {
        return (
            userData[_user].renewTimestamp > block.timestamp,
            userData[_user].renewTimestamp
        );
    }

    function setSubscriptionAmount(uint256 _amount) public {
        require(msg.sender == owner);
        suscriptionAmount = _amount;
    }
}
