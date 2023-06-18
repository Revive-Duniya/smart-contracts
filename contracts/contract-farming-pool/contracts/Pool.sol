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
    address public owner;
    address public lendedToken;
    address public rewardedToken;
    uint public lendedTokenAmount;
    uint public rewardedTokenAmount;
    mapping(address=>User) public userData;
    uint public apy;

    constructor(address _lendedToken, address _rewardedToken, uint _apy){
        int responseAssociation = HederaTokenService.associateToken(address(this),_lendedToken);
            if (responseAssociation != HederaResponseCodes.SUCCESS) {
                revert("Association lending Failed");
        }
        int responseAssociation2 = HederaTokenService.associateToken(address(this),_rewardedToken);
            if (responseAssociation2 != HederaResponseCodes.SUCCESS) {
                revert("Association reward Failed");
        }
        apy = _apy;
        lendedToken = _lendedToken;
        rewardedToken = _rewardedToken;
        owner = msg.sender;
    }

    function updateApy(uint _apy)public{
        require(msg.sender==owner);
        apy = _apy;
    }

    function depositLendTokens(uint _amount)public{
        //transfer tokens
        int responseTransfer = HederaTokenService.transferToken(
            lendedToken,
            msg.sender,
            address(this),
            int64(int(_amount))
        );
        if (responseTransfer != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
        //calculate rewards since last deposit
        uint rewards = calculateRewards(userData[msg.sender].lendedAmount,userData[msg.sender].startTimestamp);
        //actual accumulated rewards
        uint accumulatedRewards = userData[msg.sender].lockedRewards;
        //update user data
        userData[msg.sender] = User(userData[msg.sender].lendedAmount+_amount,block.timestamp,accumulatedRewards+rewards);
        //update total amount 
        lendedTokenAmount += _amount;
    }

    function calculateRewards(uint _amountLended,uint startTimestamp) private view returns (uint){
        uint duration = block.timestamp - startTimestamp;
        if(duration > 864000){ //minium 10 days lock for get rewards
           return duration * (apy * _amountLended/100) / 31536000; 
        }else{
            return 0;
        }
    }

    function getUserRewards(address _user) public returns (uint){

    }

    function withdrawTokens()public{

    }

    //admin only
    function depositRewardAmount()public{

    }

    
}