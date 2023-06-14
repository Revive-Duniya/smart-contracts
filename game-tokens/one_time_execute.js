const fs = require("fs");
const {
    AccountId,
    PrivateKey,
    Client,
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    AccountCreateTransaction,
    Hbar,
    PublicKey,
    TokenCreateTransaction,
    CustomFractionalFee,
    TokenSupplyType
} = require("@hashgraph/sdk");

// Setup your .env path
require("dotenv").config();

// ipfs URI
metadata = "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json";

const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const operatorPublicKey = PublicKey.fromString(process.env.PUBLIC_KEY);
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const main = async () => {

    // Create DUN token

    const DUNtransaction = await new TokenCreateTransaction()
        .setTokenName("Duniya Token")
        .setTokenSymbol("DUN")
        .setSupplyType(TokenSupplyType.Finite)
        .setTreasuryAccountId(process.env.ACCOUNT_ID)        
        .setMaxSupply(30000000000)//300 MILLION + 00 (2 decimals)
        .setInitialSupply(10000000000)//150 MILLION + 00 (2 decimals)
        .setDecimals(2)
        // .setCustomFees(new CustomFractionalFee() //1% fees
        //     .setNumerator(1) // The numerator of the fraction
        //     .setDenominator(100) // The denominator of the fraction
        //     .setFeeCollectorAccountId(process.env.ACCOUNT_ID) // The account collecting the 10% custom fee each time the token is transferred
        // )
        .setFreezeKey(operatorPublicKey)
        .setWipeKey(operatorPublicKey)
        .setAdminKey(operatorPublicKey)
        .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
        .freezeWith(client);

    //Sign the transaction with the token operatorKey
    const DUNsignTx = await (await DUNtransaction.sign(operatorKey));

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const DUNtxResponse = await DUNsignTx.execute(client);

    //Get the receipt of the transaction
    const DUNreceipt = await DUNtxResponse.getReceipt(client);

    //Get the token ID from the receipt
    const DUNtokenId = DUNreceipt.tokenId;

    console.log(`DUN Token created with ID: ${DUNtokenId} \n`);


    // Create GRC token
    const GRCtransaction = await new TokenCreateTransaction()
        .setTokenName("Duniya Green Token")
        .setTokenSymbol("DGR")
        .setTreasuryAccountId(process.env.ACCOUNT_ID)
        .setInitialSupply(1000000000)//150 MILLION + 00 (2 decimals)
        .setDecimals(2)
        // .setCustomFees(new CustomFractionalFee() //1% fees
        //     .setNumerator(1) // The numerator of the fraction
        //     .setDenominator(100) // The denominator of the fraction
        //     .setFeeCollectorAccountId(process.env.ACCOUNT_ID) // The account collecting the 10% custom fee each time the token is transferred
        // )
        .setFreezeKey(operatorPublicKey)
        .setWipeKey(operatorPublicKey)
        .setAdminKey(operatorPublicKey)
        .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
        .freezeWith(client);

    //Sign the transaction with the token operatorKey
    const GRCsignTx = await (await GRCtransaction.sign(operatorKey));

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const GRCtxResponse = await GRCsignTx.execute(client);

    //Get the receipt of the transaction
    const GRCreceipt = await GRCtxResponse.getReceipt(client);

    //Get the token ID from the receipt
    const GRCtokenId = GRCreceipt.tokenId;

    console.log(`GRC Token created with ID: ${GRCtokenId} \n`);

    const json = JSON.stringify({ DUNTokenId:DUNtokenId,EVM_DUNTokenId:"ask developer",DGRCTokenId: GRCtokenId, EVM_GRCTokenId: "ask developer",deployerAddress:process.env.MY_ACCOUNT_ID });
    fs.writeFile('./deployed_data/deployed_data.json', json, 'utf8', () => { });

};

main();
