import React, { useState, useEffect } from "react";
import Image from "next/image";
import nftOne from '/public/images/nft1.png';
import nftTwo from '/public/images/nftTwo.png';
import nftThree from '/public/images/nftThree.png';

const Hero = () => {
    const [activeCard, setActiveCard] = useState(null);

    const handleClick = (card) => {
        setActiveCard(card);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            switch (activeCard) {
                case 'survivalist':
                    setActiveCard('labourer');
                    break;
                case 'labourer':
                    setActiveCard('forager');
                    break;
                case 'forager':
                    setActiveCard('survivalist');
                    break;
                default:
                    setActiveCard('survivalist');
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeCard]);

    return (
        <div className="w-[90%] h-[88vh] between">
            <div className="w-[50%] flex gap-6 flex-col">
                <h1 className="text-[3.5rem] text-white oxanium uppercase font-bold leading-[60px]">
                    <span className="text-lightPurple">Revive Duniya: </span>Unleash the Power of a Reborn World!
                </h1>
                <p className="paragraph text-md lato font-light leading-[25px]">
                    Join these characters in their fight for survival and quest to build a new, and more sustainable world where man and the environment are safer, healthier and happier.
                </p>
            </div>
            <div className="center gap-6 w-1/2 relative">
                <div
                    className={`nft-1 center flex-col gap-4 rounded-[2rem] p-[1rem] ${activeCard === 'survivalist' ? 'z-10 transition-all duration-500 transform translate-y-0 scale-1' : 'transition-all duration-500 transform translate-y-10 scale-0.9'}`}
                    onClick={() => handleClick('survivalist')}
                >
                    <Image src={nftOne} alt="nft" width={200} height={200}/>
                    <div className="text-white text-md center flex-col oxanium font-light">
                        <p className="capitalize">The Survivalist</p>
                        <p className="mb-4">$2,000</p>
                    </div>
                </div>
                <div
                    className={`nft-1 center flex-col gap-4 rounded-[2rem] p-[1rem] absolute ${activeCard === 'labourer' ? 'z-10 transition-all duration-500 transform translate-y-0 scale-1' : 'transition-all duration-500 transform translate-y-10 scale-0.9'}`}
                    onClick={() => handleClick('labourer')}
                >
                    <Image src={nftTwo} alt="nft" width={200} height={200}/>
                    <div className="text-white text-md center flex-col oxanium  font-light">
                        <p className="capitalize">The Labourer</p>
                        <p className="mb-4">$5,000</p>
                    </div>
                </div>
                <div
                    className={`nft-1 center flex-col gap-4 rounded-[2rem] p-[1rem] ${activeCard === 'forager' ? 'z-10 transition-all duration-500 transform translate-y-0 scale-1' : 'transition-all duration-500 transform translate-y-10 scale-0.9'}`}
                    onClick={() => handleClick('forager')}
                >
                    <Image src={nftThree} alt="nft" width={200} height={200}/>
                    <div className="text-white text-md center flex-col oxanium font-light">
                        <p className="capitalize">The Forager</p>
                        <p className="mb-4">$4,000</p>
                    </div>
                </div>
            </div>
        </div>       
    );
}

export default Hero;
