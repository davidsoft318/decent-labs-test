const { expect } = require('chai');
const { setupContracts, encodePriceSqrt, expandTo18Decimals, getMinTick, getMaxTick} = require('./helper');
const { FeeAmount, TICK_SPACINGS } = require('../constants');

describe('Deploying the Decent Labs contracts', () => {
  let decentLabsCoin, seedLiquidity;

  before(async () => {
    const { deployedContracts } = await setupContracts();
    decentLabsCoin = deployedContracts.decentLabsCoin;
    seedLiquidity = deployedContracts.seedLiquidity;
    const tickUpper = getMaxTick(TICK_SPACINGS.MEDIUM);
    const tickLower = getMinTick(TICK_SPACINGS.MEDIUM);
    const amount0 = expandTo18Decimals(1000);
    const amount1 = expandTo18Decimals(1);
    const initPrice = encodePriceSqrt(amount1, amount0);

    let owner, addr1;
    [owner, addr1, ...addrs] = await ethers.getSigners();
    seedLiquidity = seedLiquidity.connect(owner);
    await seedLiquidity.initializeLiquidity(FeeAmount.MEDIUM, tickLower, tickUpper, amount0, amount1, initPrice);
  });

  describe('Test Decent Labs contract deployment', () => {
    it('Should set the deployed contracts to the correct owner', async function () {
      await seedLiquidity.getPoolInfo(FeeAmount.MEDIUM, -2, 2);
    });
  });

});
