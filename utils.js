require("dotenv").config();
const hre = require("hardhat");
const config = require('../config.json');

const setupContracts = async() => {
    
    const addr = config.addresses;

	const netinfo = await ethers.provider.getNetwork();
	var network = netinfo.name;
	if (network === "unknown")
		network = "mainnet";

    // get the contract factories
    const LiquiditySeed = await ethers.getContractFactory('LiquiditySeed');
    const SimpleToken = await ethers.getContractFactory('SimpleToken');
    let simpleToken = await (await SimpleToken.deploy()).deployed();
    let liquiditySeed = await (await LiquiditySeed.deploy(simpleToken.address)).deployed();


    const router = (await (await ethers.getContractFactory('MockTimeSwapRouter')).deploy(
        factory.address, weth9.address
      )) as ISwapRouter
      
    return [simpleToken, liquiditySeed];
};

const log = (message, params) =>{
    if(process.env.CONSOLE_LOG === 'true') {
       console.log(message, params);
    }
}

const getMinTick = (tickSpacing: number) => { return Math.ceil(-887272 / tickSpacing) * tickSpacing}
const getMaxTick = (tickSpacing: number) => { return Math.floor(887272 / tickSpacing) * tickSpacing}

module.exports = { setupContracts, log, getMinTick, getMaxTick }
