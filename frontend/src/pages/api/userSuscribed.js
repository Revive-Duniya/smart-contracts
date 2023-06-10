import { ethers } from 'ethers';

const ABI_Subscriptions = require("../../constants/subscriptionsABI.json");
const handler = async (req, res) => {
    if (req.method === 'GET') {
      try {
        //get user address        
        const hedera_address = req.query.hedera_address;
        const address = req.query.address;
        if(hedera_address.length === 0 && address.length === 0){
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
    
        res.status(200).json({status:'succes', error:null, data: { isUsersuscribed:user_renew, renew_suscription_date },message:''});
      }catch(err){
        res.status(200).json({status:'fail', error:err, data: null,message:'internal error, please try again later or try with a new address'});
      }
    } else {
        res.status(200).json({status:'fail', error:null, data: null,message:'HTTP method not allowed'});
    }
  };
  
  export default handler;