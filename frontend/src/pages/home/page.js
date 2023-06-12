"use client";

import Hero from "@/components/hero";
import NavBar from "@/components/navbar";

const Homepage = () => {
    return (
        <div className="w-full center flex-col bg-primary">
            <NavBar />
            <Hero />
        </div>
    );
}
 
export default Homepage;