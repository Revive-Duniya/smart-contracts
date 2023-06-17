// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
 import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";

//import "./HederaTokenService.sol";

//farming
contract Pool is HederaTokenService {
    struct User {
        uint lendedAmount;
        uint startTimestamp;
        uint lockedRewards;//when user deposit tokens when he already have tokens, the timestamp is reseted and the rewards of the previous deposit gets stored here
    }
    address public lendedToken;
    address public rewardedToken;
    uint public lendedTokenAmount;
    uint public rewardedTokenAmount;
    mapping(address=>User) public userData;
    uint public apy;
    constructor(address _lendedToken, address _rewardedToken, uint _apy){
        int responseAssociation = HederaTokenService.associateToken(address(this),_lendedToken);
            if (responseAssociation != HederaResponseCodes.SUCCESS) {
                revert("Association Failed");
        }
        int responseAssociation2 = HederaTokenService.associateToken(address(this),_rewardedToken);
            if (responseAssociation2 != HederaResponseCodes.SUCCESS) {
                revert("Association Failed");
        }
        apy = _apy;
        lendedToken = _lendedToken;
        rewardedToken = _rewardedToken;
    }

    function updateApy()public{

    }

    function depositLendTokens()public{

    }

    function withdrawTokens()public{

    }

    //admin only
    function depositRewardAmount()public{

    }

    
}