import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "./common/button";
import UserProfile from "/public/images/UserProfile.png";
import Logo from "/public/images/logo.png";
import { formatBalance } from "../utils";
import detectEthereumProvider from "@metamask/detect-provider";

const NavBar = () => {
  const [hasProvider, setHasProvider] = useState(null);
  const [wallet, setWallet] = useState({ address: "", balance: "" });

  const connectWallet = async () => {
    const provider = await detectEthereumProvider({ silent: true });
    setHasProvider(Boolean(provider));

    if (provider) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length > 0) {
          updateWallet(accounts[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const disconnectWallet = () => {
    setWallet({ address: "", balance: "" });
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts[0]);
      } else {
        setWallet({ address: "", balance: "" });
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const updateWallet = async (address) => {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    setWallet({ address, balance });
  };

  return (
    <div className="py-3 w-[90%] between">
      <div>
        <Link href="/">
          <Image src={Logo} alt="logo" width={70} height={70} />
        </Link>
      </div>
      <ul className="bg-gradient backdrop-blur-20 h-[45px] lg:ml-16 w-1/2 uppercase oxanium text-white text-[0.7rem] center gap-6">
        <li className="hover:scale-105 duration-300 transition cursor-pointer">Home</li>
        <li className="hover:scale-105 duration-300 transition cursor-pointer">Play Game</li>
        <li className="hover:scale-105 duration-300 transition cursor-pointer">Competitions</li>
        <li className="hover:scale-105 duration-300 transition cursor-pointer">Trending NFTs</li>
      </ul>
      <div className="center gap-3">
        {wallet.address ? (
          <>
            <div className="text-white text-[.9rem] oxanium">Wallet Balance: {formatBalance(wallet.balance)}</div>
          </>
        ) : (
          <CustomButton
            padding=".6rem 1.7rem"
            backgroundColor="#fcb70c"
            textColor="#000000"
            onClick={connectWallet}
          >
            Connect Wallet
          </CustomButton>
        )}
        <div className="rounded-full hover:scale-95 transition duration-300">
          <Image src={UserProfile} alt="user profile image" width={32} height={32} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
