const { ContractCreateFlow, AccountAllowanceApproveTransaction, Client, PrivateKey, TokenAssociateTransaction, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters, ContractCallQuery, Hbar, ContractExecuteTransaction, PublicKey } = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require('fs');
//deploy with node deploy.js
async function deployFactoryContract() {
    //deploy to testnet
    const operatorKey = PrivateKey.fromStringED25519("302e020100300506032b6570042204208d9ddfcb9c80cb6f2181c07b44ebed3bfdadb051eadc80b3f94fcf65d629be5e");
    const operatorKeyP = PublicKey.fromString("302a300506032b65700321001c79ad748677f7822e5368c880a2a197c74a8158568f0946d34028b330a74007");

    const client = Client.forTestnet();
    //configure client
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    // Part 2 - Store the smart contract’s bytecode on Hedera
    //.json lo ha cogido del compilador de remix --> artifacts --> factory.json

    const bytecode = fs.readFileSync("./binaries/Subscriptions.bin");
    const contractCreate = new ContractCreateFlow()
        .setGas(1000000)
        .setBytecode(bytecode)
        .setConstructorParameters(new ContractFunctionParameters().addUint256(10000).addAddress('0x0000000000000000000000000000000000dc1af5'))//100HBAR SUBSCRIPTION PRICE

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
    const json = JSON.stringify({ contractAddressHedera: `${newContractId.shard.low}.${newContractId.shard.high}.${newContractId.num.low}`, evmContractAddress: "ask developer", deployerAddress: process.env.MY_ACCOUNT_ID });
    fs.writeFile('./deployed_data/deployed_data.json', json, 'utf8', () => { });

    console.log("The new contract ID is " + newContractId);
    //SDK Version: v2.11.0-beta.1
    //asociate token
    //Associate a token to an account and freeze the unsigned transaction for signing
    // const transactionAs = await new TokenAssociateTransaction()
    //     .setAccountId("0.0.4011011")
    //     .setTokenIds(["0.0.14424821"])
    //     .freezeWith(client);

    // //Sign with the private key of the account that is being associated to a token 
    // const signTxAs = await transactionAs.sign(operatorKey);

    // //Submit the transaction to a Hedera network    
    // const txResponseAs = await signTxAs.execute(client);

    // //Request the receipt of the transaction
    // const receiptAs = await txResponseAs.getReceipt(client);

    // //Get the transaction consensus status
    // const transactionStatus = receiptAs.status;

    // console.log("The transaction consensus status " + transactionStatus.toString());
    // buy subscription 
    //Aprove token Allowance
    const transactionAllowance = new AccountAllowanceApproveTransaction().approveTokenAllowance("0.0.14424821","0.0.4011011", `${newContractId.shard.low}.${newContractId.shard.high}.${newContractId.num.low}`,  100000).freezeWith(client);
    
    
    //Sign the transaction with the owner account key
    const signTx = (await transactionAllowance.sign(operatorKey));

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponseAllowance = await signTx.execute(client);

    //Request the receipt of the transaction
    const receiptAllowance = await txResponseAllowance.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receiptAllowance.status;

    console.log("The transaction consensus status is " + transactionStatus.toString());
    // User suscribe
    const createToken = new ContractExecuteTransaction()
        .setContractId(newContractId)
        .setGas(4000000) // Increase if revert
        .setPayableAmount(5) // Increase if revert
        .setFunction(
            "userSubscribe"
        );
    const createTokenTx = await createToken.execute(client);
    const createTokenRx = await createTokenTx.getRecord(client);

    console.log(`TSubscription bought`);

}
deployFactoryContract();