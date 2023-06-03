// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaResponseCodes.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/IHederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/ExpiryHelper.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Assets is ExpiryHelper {
    struct Asset {
        string name;
        string ipfsimageUri;
        bool hidden;
        uint assetId;
        uint price;
    }
    event CreatedToken(address tokenAddress);
    event MintedToken(int64[] serialNumbers);
    event Response(int256 response);

    mapping(uint=>Asset) public assetsData; //Name => Asset
    mapping(string=>uint) public assetsId;
    Asset[] assets;
    uint public assetsAmount;
    uint public tokenAmount;
    address public NftCollectionAddress;
    address public owner;

    constructor() payable {
        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](1);

        // Set this contract as supply
        keys[0] = getSingleKey(
            KeyType.SUPPLY,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        IHederaTokenService.HederaToken memory token;
        token.name = "REVIVE DUNIYA";
        token.symbol = "RDY";
        token.memo = "";
        token.treasury = address(this);
        token.tokenSupplyType = false; // set supply to FINITE
        token.tokenKeys = keys;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), 7000000);

        (int256 responseCode, address createdToken) = HederaTokenService
            .createNonFungibleToken(token);

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("Failed to create non-fungible token");
        }
        NftCollectionAddress = createdToken;
        owner = msg.sender;
    }

    function addAsset(string memory name, string memory ipfsimage,uint price) public {
        require(owner == msg.sender);
        require(assetsId[name] == 0,"Asset created");
        assetsAmount += 1;
        assetsId[name] = assetsAmount;
        assetsData[assetsAmount] = Asset(name,ipfsimage,false,assetsAmount,price);
        assets.push(Asset(name,ipfsimage,false,assetsAmount,price));
    }

    function hideAsset(uint256 _assetId) public {
        require(owner == msg.sender);
        assetsData[_assetId].hidden = true;
        assets[_assetId -1].hidden = true;
    }

    function show(uint256 _assetId) public {
        require(owner == msg.sender);
        assetsData[_assetId].hidden = false;
        assets[_assetId -1].hidden = false;

    }

    function getAllAssets()public view returns(Asset[] memory){
        return assets;
    }

    function mintAsset(uint256 _assetId)public payable{
        //require asset bought
        require(assetsData[_assetId].price >= msg.value);
        //increase tokenAmount
        tokenAmount += 1;
        //create metadata 
        bytes[] memory metadata = generateMetadata(tokenAmount,_assetId,assetsData[_assetId].name,assetsData[_assetId].ipfsimageUri);


        (int256 response, , int64[] memory serial) = HederaTokenService
            .mintToken(NftCollectionAddress, 0, metadata);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to mint non-fungible token");
        }
    }

    function generateMetadata(uint256 tokenId,uint256 assetId, string memory name,string memory ipfsimage)
        private
        pure
        returns (bytes[] memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name,
                        Strings.toString(tokenId),
                        '","assetid":"',Strings.toString(assetId),'", "description": "An in-game monster", "image": "data:image/svg+xml;base64,',
                        ipfsimage,
                        '"}'
                    )
                )
            )
        );

        string memory metadata = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        bytes[] memory metadataBytes = new bytes[](1);
        metadataBytes[0] = bytes(metadata); // Convert string to bytes array

        return metadataBytes;
    }

}
