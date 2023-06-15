export const formatBalance = (rawBalance) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
};

// chain ID HEX
// export const formatChainAsNum = (chainIdHex) => {
//     const chainIdNum = parseInt(chainIdHex);
//     return chainIdNum;
// };
  