require("dotenv").config();
const hre = require("hardhat");
const config = require('../config.json');
const bn = require("bignumber.js");
const { BigNumber } = require( 'ethers');

const setupContracts = async() => {

    const addr = config.addresses;

	const netinfo = await ethers.provider.getNetwork();
	var network = netinfo.name;
	if (network === "unknown")
		network = "mainnet";

    // DecentLabs token
    const DecentLabsCoin = await ethers.getContractFactory('DecentLabsTestCoin');
    const SeedLiquidity = await ethers.getContractFactory('SeedLiquidity');
    const decentLabsCoin = await (await DecentLabsCoin.deploy()).deployed();
    const seedLiquidity = await (await SeedLiquidity.deploy(decentLabsCoin.address)).deployed();
    return { deployedContracts: { decentLabsCoin, seedLiquidity} };
};

const log = (message, params) =>{
    if(process.env.CONSOLE_LOG === 'true') {
       console.log(message, params);
    }
}

const expandTo18Decimals = (n) => {
    return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

const encodePriceSqrt = (reserve1, reserve0) => {
    return new bn(reserve1.toString()).div(reserve0.toString()).sqrt().times(new bn(2).pow(96)).integerValue(BigNumber.FLOOR).toString(10);
}

const getMinTick = (tickSpacing) => { return Math.ceil(-887272 / tickSpacing) * tickSpacing}
const getMaxTick = (tickSpacing) => { return Math.floor(887272 / tickSpacing) * tickSpacing}

module.exports = { setupContracts, log, getMinTick, getMaxTick, encodePriceSqrt, expandTo18Decimals}
