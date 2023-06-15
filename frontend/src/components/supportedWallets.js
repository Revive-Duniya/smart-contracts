import Image from "next/image";
import { supportedWallet } from "@/utils/wallets";

const Wallets = () => {

    
    return (
        <div className="my-12 center flex-col gap-12">
            <div>
                <p className="gradient lato text-center">Connect with world’s most trusted and fastest wallets</p>
                <h1 className="text-white text-[3.5rem] leading-[100px] text-center capitalize oxanium">wallets we support</h1>
            </div>
            <div className="center gap-12">
                {supportedWallet.map((wallet, index) => (
                    <div key={index} className="center flex-col bgWalletGradient p-6">
                        <div className="p-6 rounded-full walletGradient">
                            <Image src={wallet.picture} width={60} height={60} alt="wallet img"/>
                        </div>
                        <div className="mt-4 text-white oxanium">
                            {wallet.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default Wallets;