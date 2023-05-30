const { ContractCreateFlow, Client, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters, ContractCallQuery, Hbar, ContractExecuteTransaction } = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require('fs');
//deploy with node deploy.js
async function deployFactoryContract() {
    //deploy to testnet
    const client = Client.forTestnet();
    //configure client
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    // Part 2 - Store the smart contract’s bytecode on Hedera
    //.json lo ha cogido del compilador de remix --> artifacts --> factory.json

    let helloHedera = require("./contracts/AssetsByteCode.json");
    const bytecode = helloHedera.data.bytecode.object;
    const contractCreate = new ContractCreateFlow()
        .setGas(1000000)
        .setBytecode(bytecode)
        .setConstructorParameters(new ContractFunctionParameters().addUint256(100))//100HBAR SUBSCRIPTION PRICE

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
    const json = JSON.stringify({ contractAddressHedera: `${newContractId.shard.low}.${newContractId.shard.high}.${newContractId.num.low}`, evmContractAddress: "ask developer",deployerAddress:process.env.MY_ACCOUNT_ID });
    fs.writeFile('./deployed_data/deployed_data.json', json, 'utf8', () => { });

    console.log("The new contract ID is " + newContractId);
    //SDK Version: v2.11.0-beta.1

}
deployFactoryContract();