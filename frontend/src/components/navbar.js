"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "./common/button";
import UserProfile from '/public/images/UserProfile.png';
import Logo from '/public/images/logo.png';

const NavBar = () => {
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