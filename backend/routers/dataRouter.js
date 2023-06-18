const express = require('express');
const ethers = require('ethers');
const axios = require('axios');
const dataRouter = express.Router();
async function getAccountId (evm_address){
    const profile_data = await axios.get(`${process.env.URL_MIRROR_NODE}/api/v1/accounts/${evm_address}`);
    const {account : account_id} = profile_data.data
    return account_id;

}
dataRouter.get('/getSubscriptionPrice', async (req, res) => {
    try {

        //generate signer from private key
        const rpc_url = process.env.NETWORK_RPC;
        const private_key = process.env.MY_PRIVATE_KEY_2;
        const provider = new ethers.providers.JsonRpcProvider(rpc_url);
        const wallet = new ethers.Wallet(private_key);
        const signer = wallet.connect(provider);

        //set the subscriptions contract
        const subscriptions_contracts = new ethers.Contract(process.env.SUBSCRIPTIONS_CONTRACT_ADDRESS, ABI_Subscriptions, signer);

        //fetch price
        const data = await subscriptions_contracts.suscriptionAmount();
        //fetch suscription renew date
        const suscription_amount = parseInt(data);

        return res.status(200).json({ status: 'succes', error: null, data: { suscription_amount }, message: '' });
    } catch (err) {
        console.log(err)
        return res.status(200).json({ status: 'fail', error: err, data: null, message: 'internal error' });
    }

})

dataRouter.get('/userSuscribed',async (req,res)=>{
    try {
        //get user address        
        const hedera_address = req.query.hedera_address;
        const address = req.query.address;
        if(hedera_address?.length === 0 && address?.length === 0){
            res.status(200).json({status:'fail', error:'please provide an user address', data: null,message:'please provide an user address'});
        }
        //generate signer from private key
        const rpc_url = process.env.NETWORK_RPC;
        const private_key = process.env.MY_PRIVATE_KEY_2;
        const provider = new ethers.providers.JsonRpcProvider(rpc_url);
        const wallet = new ethers.Wallet(private_key);
        const signer = wallet.connect(provider);

        //set the subscriptions contract
        const subscriptions_contracts = new ethers.Contract(process.env.SUBSCRIPTIONS_CONTRACT_ADDRESS, ABI_Subscriptions, signer);
        
        //fetch is user suscribed 
        const user_renew = await subscriptions_contracts.isUserSuscribed(address);
        const user_data = await subscriptions_contracts.userData(address);
        
        //fetch suscription renew date
        const renew_suscription_date = parseInt(user_data.renewTimestamp);
        return res.status(200).json({status:'succes', error:null, data: { isUsersuscribed:user_renew, renew_suscription_date },message:''});
      }catch(err){
        console.log(err)
        return res.status(200).json({status:'fail', error:err, data: null,message:'internal error, please try again later or try with a new address'});
      }
})

//queryparams = evmaddress
dataRouter.get('/balances',async (req,res)=>{
    try {
        //get user address        
        const evm_address = req.query.evmaddress;
        console.log(`${process.env.URL_MIRROR_NODE}/api/v1/accounts/${evm_address}`)
        //get account id from evm address
        const account_id = await getAccountId(evm_address);
        //extract account id
        console.log("hedera_account_id",account_id)
        //get tokens balances
        const response_dun_balances = await axios.get(`${process.env.URL_MIRROR_NODE}/api/v1/tokens/${process.env.DUN_ADDRESS}/balances?account.id=${account_id}`);
        const dun_balance = response_dun_balances.data.balances[0].balance;
        const response_grc_balances = await axios.get(`${process.env.URL_MIRROR_NODE}/api/v1/tokens/${process.env.GRC_ADDRESS}/balances?account.id=${account_id}`);
        const grc_balance = response_grc_balances.data.balances[0].balance;
        //format balances to mark the 2 decimals and make more visual
        const formattedBalance_dun = grc_balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
        const formattedBalance_grc = dun_balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
        console.log("balances","dun",dun_balance,"grc",grc_balance)
        return res.status(200).json({status:'succes', error:null, data: { balances : { dun : formattedBalance_dun, grc: formattedBalance_grc} },message:''});
      }catch(err){
        console.log(err)
        return res.status(200).json({status:'fail', error:err, data: null,message:'internal error, please try again later or try with a new address'});
      }
})
module.exports = dataRouter;