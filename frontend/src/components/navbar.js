"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HashConnect } from "hashconnect";
import CustomButton from "./common/button";
import UserProfile from '/public/images/UserProfile.png';
import Logo from '/public/images/logo.png';

const NavBar = () => {
    const [hashconnect, setHashconnect] = useState(null);

    const appMetadata = {
        name: "Revive Duniya",
        description: "A web3 game",
        url: "https://revive-duniya.vercel.app/",
        icon: "https://github.com/codewithmide/revive-duniya/blob/main/frontend/src/app/favicon.ico",
    };
      
    const handleConnectWallet = async () => {
        if (!hashconnect) {
          const newHashConnect = new HashConnect();
          setHashconnect(newHashConnect);
      
          // Register events if needed
          newHashConnect.pairingEvent.once((pairingData) => {
            // Handle pairing event
          });
      
          // Call init function to initialize and retrieve data
          const initData = await newHashConnect.init(appMetadata, "testnet", false);
          // Do something with the initData, such as displaying the pairing code
      
          // Connect to local wallet (HashPack)
          newHashConnect.connectToLocalWallet();
        } else {
          // If hashconnect already exists, you can use it directly
          hashconnect.connectToLocalWallet();
        }
      };
      

      
    return (
        <div className="py-3 w-[90%] between">
            <div>
                <Link href="/">
                    <Image src={Logo} alt="logo" width={70} height={70}/>
                </Link>
            </div>
            <ul className="bg-gradient backdrop-blur-20 h-[45px] lg:ml-16 w-1/2 uppercase oxanium text-white text-[0.7rem] center gap-6">
                <li className="hover:scale-105 duration-300 transition cursor-pointer">Home</li>
                <li className="hover:scale-105 duration-300 transition cursor-pointer">Play Game</li>
                <li className="hover:scale-105 duration-300 transition cursor-pointer">Competitions</li>
                <li className="hover:scale-105 duration-300 transition cursor-pointer">Trending NFTs</li>
            </ul>
            <div className="center gap-3">
                <div>
                    <CustomButton
                    padding=".6rem 1.7rem"
                    backgroundColor="#AD1AAF"
                    textColor="#FFF"
                    onClick={handleConnectWallet}
                    >
                        Connect wallet
                    </CustomButton>
                </div>
                <div className="rounded-full hover:scale-95 transition duration-300">
                    <Image src={UserProfile} alt="user profile image" width={32} height={32}/>
                </div>
            </div>
        </div>
    );
}
 
export default NavBar;