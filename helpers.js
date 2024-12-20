const { sqrt } = require("@uniswap/sdk-core");

exports.getPoolImmutables = async (poolContract) => {
    const [ token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    
    ]);
    const immutables = {
        token0: token0,
        token1: token1,
        fee: fee
    };
    return immutables;
}

exports.getPoolState = async (poolContract) => {

   const slot = await poolContract.slot0();
   const state = {
    sqrtPriceX96: await slot[0], 
   }
   return state
}