import { ethers } from 'ethers';

const ABI_Subscriptions = require("../../constants/subscriptionsABI.json");
const handler = async (req, res) => {
    if (req.method === 'GET') {
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
    
        res.status(200).json({status:'succes', error:null, data: { suscription_amount },message:''});
      }catch(err){
        res.status(200).json({status:'fail', error:err, data: null,message:'internal error'});
      }
    } else {
        res.status(200).json({status:'fail', error:null, data: null,message:'HTTP method not allowed'});
    }
  };
  
  export default handler;