// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaResponseCodes.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/IHederaTokenService.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/ExpiryHelper.sol";
import "./HederaResponseCodes.sol";
import "./IHederaTokenService.sol";
import "./HederaTokenService.sol";
import "./ExpiryHelper.sol";
import "./KeyHelper.sol";
import "./Base64.sol";
import "./Strings.sol";

contract Assets is ExpiryHelper, KeyHelper, HederaTokenService {
    struct Asset {
        string name;
        string ipfsimageUri;
        bool hidden;
        uint assetId;
        uint price;
    }
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
        
        owner = msg.sender;
    }

    function getAssets() public view returns(Asset[] memory) {
        return assets;
    }

    function createNft(
            string memory name, 
            string memory symbol, 
            string memory memo, 
            int64 maxSupply,  
            int64 autoRenewPeriod
        ) external payable returns (address){
        require(NftCollectionAddress != address(0));
        IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](1);
        // Set this contract as supply for the token
        keys[0] = getSingleKey(KeyType.SUPPLY, KeyValueType.CONTRACT_ID, address(this));

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = memo;
        token.treasury = address(this);
        token.tokenSupplyType = true; // set supply to FINITE
        token.maxSupply = maxSupply;
        token.tokenKeys = keys;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod); // Contract auto-renews the token

        (int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(token);

        if(responseCode != HederaResponseCodes.SUCCESS){
            revert("Failed to create non-fungible token");
        }
        NftCollectionAddress = createdToken;
        return createdToken;
    }

    

    function addAsset(string memory name, string memory ipfsimage,uint price) public {
        require(owner == msg.sender);
        require(assetsId[name] == 0,"Asset created");
        assetsAmount += 1;
        assetsId[name] = assetsAmount;
        assetsData[assetsAmount] = Asset(name,ipfsimage,false,assetsAmount,price);
        assets.push(Asset(name,ipfsimage,false,assetsAmount,price));
    }

    function updateAssetPrice(uint256 _price) {
        require(owner == msg.sender);
        assetsData[_assetId].price = _price;
        assets[_assetId -1].price = _price;
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

    




    // function createNft(
    //         string memory name,
    //         string memory symbol,
    //         string memory memo,
    //         int64 maxSupply,
    //         int64 autoRenewPeriod
    //     ) external payable returns (address){

    //     IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](1);
    //     // Set this contract as supply for the token
    //     keys[0] = getSingleKey(KeyType.SUPPLY, KeyValueType.CONTRACT_ID, address(this));

    //     IHederaTokenService.HederaToken memory token;
    //     token.name = name;
    //     token.symbol = symbol;
    //     token.memo = memo;
    //     token.treasury = address(this);
    //     token.tokenSupplyType = true; // set supply to FINITE
    //     token.maxSupply = maxSupply;
    //     token.tokenKeys = keys;
    //     token.freezeDefault = false;
    //     token.expiry = createAutoRenewExpiry(address(this), 7000000);

    //     (int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(token);

    //     if(responseCode != HederaResponseCodes.SUCCESS){
    //         revert("Failed to create non-fungible token");
    //     }
    //     return createdToken;
    // }

    // function mintNft(
    //     address token,
    //     bytes[] memory metadata
    // ) external returns(int64){

    //     (int response, , int64[] memory serial) = HederaTokenService.mintToken(token, 0, metadata);

    //     if(response != HederaResponseCodes.SUCCESS){
    //         revert("Failed to mint non-fungible token");
    //     }

    //     return serial[0];
    // }

    // function transferNft(
    //     address token,
    //     address receiver,
    //     int64 serial
    // ) external returns(int){

    //     HederaTokenService.associateToken(receiver, token);
    //     int response = HederaTokenService.transferNFT(token, address(this), receiver, serial);

    //     if(response != HederaResponseCodes.SUCCESS){
    //         revert("Failed to transfer non-fungible token");
    //     }

    //     return response;
    // }
    // uint256 public tokenIdNumber;
    // mapping(address => uint256[]) public userOwnedNFTs;

    // function myNft()public view returns(uint256[] memory){
    //     uint256[] memory array = new uint256[](tokenIdNumber);
    //     uint256 amountNFT = balanceOf(msg.sender);
    //     for(uint i=0;i<amountNFT;i++){
    //         array[i]=tokenOfOwnerByIndex(msg.sender,i);
    //     }
    //     return array;
    // }
}
