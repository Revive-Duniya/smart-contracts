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
	TokenAssociateTransaction
} = require("@hashgraph/sdk");

// Setup your .env path
require("dotenv").config();

// ipfs URI
metadata = "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json";

const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// Account creation function
async function accountCreator(pvKey, iBal) {
	const response = await new AccountCreateTransaction()
		.setInitialBalance(new Hbar(iBal))
		.setKey(pvKey.publicKey)
		.setMaxAutomaticTokenAssociations(10)
		.execute(client);
	const receipt = await response.getReceipt(client);
	return receipt.accountId;
}

const main = async () => {
	// Init Alice account
	const aliceKey = PrivateKey.generateED25519();
	const aliceId = await accountCreator(aliceKey, 100);

	const bytecode = fs.readFileSync("./binaries/NFTCreator_sol_NFTCreator.bin");

	// Create contract
	const createContract = new ContractCreateFlow()
		.setGas(4000000) // Increase if revert
		.setBytecode(bytecode) // Contract bytecode

	const createContractTx = await createContract.execute(client);
	const createContractRx = await createContractTx.getReceipt(client);
	const contractId = createContractRx.contractId;

	console.log(`Contract created with ID: ${contractId} \n`);

	// Create NFT from precompile
	const createToken = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(4000000) // Increase if revert
		.setPayableAmount(50) // Increase if revert
		.setFunction(
			"createNft",
			new ContractFunctionParameters()
				.addString("Revive Duniya") // NFT name
				.addString("DUN") // NFT symbol
				.addString("Just a memo") // NFT memo
				.addInt64(1000000000) // NFT max supply
				.addInt64(7000000) // Expiration: Needs to be between 6999999 and 8000001
		);
	const createTokenTx = await createToken.execute(client);
	const createTokenRx = await createTokenTx.getRecord(client);
	const tokenIdSolidityAddr = createTokenRx.contractFunctionResult.getAddress(0);
	const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);

	console.log(`Token created with ID: ${tokenId} \n`);
	//--------------
	//ASSOCIATE TOKEN TO THE ACCOUNT
	//--------------
	//Associate a token to an account and freeze the unsigned transaction for signing
	const transaction = await new TokenAssociateTransaction()
		.setAccountId(process.env.ACCOUNT_ID)
		.setTokenIds([`${tokenId.shard.low}.${tokenId.shard.high}.${tokenId.num.low}`])
		.freezeWith(client);

	//Sign with the private key of the account that is being associated to a token 
	const signTx = await transaction.sign(operatorKey);

	//Submit the transaction to a Hedera network    
	const txResponse = await signTx.execute(client);

	//Request the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the transaction consensus status
	const transactionStatus = receipt.status;

	console.log("The transaction consensus status " + transactionStatus.toString());
	//--------------
	//ASSET CREATION TEST
	//--------------
	// Create NFT from precompile
	const createdAsset = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(4000000) // Increase if revert
		.setFunction(
			"addAsset",
			new ContractFunctionParameters()
				.addString("character 1") // asset name
				.addString("ipfs://testdfwsssssssswefewfrwfdfwtwwrewjkowjkedjk") // ipfs uri
				.addUint256(10) // Asset Price
		);
	//--------------
	//ASSET MINTING TEST
	//--------------
	const createdAssetTx = await createdAsset.execute(client);
	const createdAssetRx = await createdAssetTx.getRecord(client);
	console.log('Asset created correctly');
	const mintedasset = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(4000000) // Increase if revert
		.setPayableAmount(20) // Increase if revert
		.setFunction(
			"mintAsset",
			new ContractFunctionParameters()
				.addUint256(1) // Asset ID
		);
	const mintedassetTx = await mintedasset.execute(client);
	const mintedassetRx = await mintedassetTx.getRecord(client);
	console.log('Asset bought correctly at address ' + process.env.ACCOUNT_ID);




};

main();
