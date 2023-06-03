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
    }
    event CreatedToken(address tokenAddress);
    event MintedToken(int64[] serialNumbers);
    event Response(int256 response);

    mapping(uint=>Asset) public assets;
    mapping(string=>Asset) public assetid;
    address public NftCollectionAddress;
    address public owner;
    uint256 public lockupAmount = 100000000000;

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

    function addAsset(string memory name, string memory ipfsimage) public {}

    function hideAsset(uint256 _assetId) public {}

    function generateMetadata(uint256 tokenId,uint256 assetId, string memory name,string memory ipfsimage)
        private
        pure
        returns (string memory)
    {
        
    }

    function mintNFT(address token, bytes[] memory metadata) private {
        (int256 response, , int64[] memory serial) = HederaTokenService
            .mintToken(token, 0, metadata);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to mint non-fungible token");
        }

        emit MintedToken(serial);
    }

    
}
