// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaResponseCodes.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/IHederaTokenService.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";
// import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/ExpiryHelper.sol";
// import "@openzeppelin/contracts/utils/Base64.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
import "./HederaResponseCodes.sol";
import "./IHederaTokenService.sol";
import "./HederaTokenService.sol";
import "./ExpiryHelper.sol";
import "./KeyHelper.sol";
import "./Base64.sol";
import "./Strings.sol";
contract Subscriptions is ExpiryHelper, KeyHelper, HederaTokenService {
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
    address public tokenaddress;

    constructor(uint256 _suscriptionAmount,address _tokenaddress) {
        HederaTokenService.associateToken(address(this),_tokenaddress);
        suscriptionAmount = _suscriptionAmount;
        tokenaddress = _tokenaddress;
    }

    function userSubscribe() public payable {
        //receive tokens
        //int responseCode = HederaTokenService.approve(
            //tokenaddress,
            //address(this),
            //2000
        //);
        //if (responseCode != HederaResponseCodes.SUCCESS) {
            //revert("Allowance Failed");
        //}
        //just check the approved amount
        HederaTokenService.allowance(
            tokenaddress,
            msg.sender,            
            address(this)
        );
        //receive tokens
        int response = HederaTokenService.transferToken(
            tokenaddress,
            msg.sender,
            address(this),
            int64(int(suscriptionAmount))
        );
        if (response != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
        
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

    function isUserSuscribed(address _user) public view returns (bool) {
        return userData[_user].renewTimestamp > block.timestamp;
    }

    function setSubscriptionAmount(uint256 _amount) public {
        suscriptionAmount = _amount;
    }

    function withdrawmoney(address payable _receiver) public {
        //send tokens
        int response = HederaTokenService.transferToken(
            tokenaddress,
            address(this),
            _receiver,
            int64(int(amount))
        );
        if (response != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
        amount = 0;
    }

    function withdrawspecificamount(address payable _receiver, uint256 _amount)
        public
    {
        //send tokens
        int response = HederaTokenService.transferToken(
            tokenaddress,
            address(this),
            _receiver,
            int64(int(_amount))
        );
        if (response != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
        amount -= _amount;
    }
}
