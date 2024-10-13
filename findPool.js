const { ethers } = require('ethers')
const { abi: UniswapV3Factory } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')


const address0 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
const address1 = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14'
const factoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c' // eth-sepolia address of Uniswap V3 Factory

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io")

  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV3Factory,
    provider
  )

  const feeTiers = [500, 3000, 10000]; // 0.05%, 0.3%, 1%

async function findPool() {
  for (const fee of feeTiers) {
    const poolAddress = await factoryContract.getPool(address0, address1, fee);
    console.log(`Pool address with fee tier ${fee}: ${poolAddress}`);
  }
}

findPool();

}

main()