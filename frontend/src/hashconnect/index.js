import { HashConnect } from 'hashconnect';
import toast from 'react-hot-toast';

const hashconnect = new HashConnect();

const appMetadata = {
  name: "Revive Duniya",
  description: "A blockchain game web application",
  icon: "https://github.com/codewithmide/revive-duniya/blob/main/frontend/src/app/favicon.ico"
};

export const pairHashpack = async () => {
  const initData = await hashconnect.init(appMetadata, "mainnet", false);

  hashconnect.foundExtensionEvent.once((walletMetadata) => {
    console.log(walletMetadata);
    hashconnect.connectToLocalWallet(initData.pairingString, walletMetadata);
  });

  hashconnect.pairingEvent.once((pairingData) => {
    console.log(`Wallet paired \n`, pairingData);
    const accountId = document.getElementById('accountId');
    accountId.innerHTML = pairingData.accountIds[0];

    toast.success('Wallet connected successfully');
  })
}