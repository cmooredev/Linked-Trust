const { expect } = require("chai");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");



describe("Create Trust", function() {
  it("Should set the correct Trust conditions", async function() {
    const [authOne, authTwo] = await ethers.getSigners();
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    //deploy a lock contract where funds can be withdrawn one year in the future
    const Lock = await hre.ethers.getContractFactory("LinkingTrust");
    const lock = await Lock.deploy();
    await lock.deployed();

    //create a new trust
    await lock.createNewTrust(unlockTime, 1, authOne.address, authTwo.address);
    expect(await lock.getTrustUnlockTime(0)).to.equal(unlockTime);
  })
})
