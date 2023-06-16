"use client";

import Hero from "@/components/hero";
import NavBar from "@/components/navbar";
import Wallets from "@/components/supportedWallets";

const Homepage = () => {
    return (
        <div className="w-full center flex-col bg-primary">
            <NavBar />
            <Hero />
            <Wallets />
        </div>
    );
}
 
export default Homepage;