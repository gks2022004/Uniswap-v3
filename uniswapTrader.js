const { ethers } = require("ethers");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: SwapRouterABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const { getPoolImmutables, getPoolState } = require('./helpers.js');
const ERC20ABI = require('./abi.json');

require('dotenv').config();
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");
const poolAddress = "0xbA57Efa18073647E5269DB04Ff70B8e26Fd0BEaF" // UNI/WETH for sepolia get this by running ./findPool.js
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564" // Uniswap V3 Router address

const name0 = "Wrapped Ether"
const symbol0 = "WETH"
const decimals0 = 18
const address0 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14" // WETH address

const name1 = 'USDC Token'
const symbol1 = 'USDC'
const decimals1 = 18
const address1 = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'

async function main() {
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
    const immutables = await getPoolImmutables(poolContract);
    const state = await getPoolState(poolContract);

    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);
    const connectedWallet = wallet.connect(provider);

    const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, provider);

    const inputAmount = 0.001 // 0.001 => 10^18
    const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
     decimals0
    )


    const approvalAmount = (amountIn * 100000).toString()
    const tokenContract0 = new ethers.Contract(
        address0,
        ERC20ABI,
        provider
      )  

    const approvalResponse = await tokenContract0.connect(connectedWallet).approve(
        swapRouterAddress,
        approvalAmount
      )  

    const params = {
        tokenIn: immutables.token1,
        tokenOut: immutables.token0,
        fee: immutables.fee,
        recipient: WALLET_ADDRESS,
        deadline: Math.floor(Date.now() / 1000) + (60 * 10),
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      }
 
     
      const transaction = await swapRouterContract.connect(connectedWallet).exactInputSingle(
        params,
        { gasLimit: ethers.utils.hexlify(1000000) }
      );
      
      console.log('Transaction sent, waiting for confirmation...', transaction.hash);
      
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
      
}

main()

