const { expect } = require("chai");
const hre = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("Token Contract", function() {

  async function deployTokenFixture() {
    const LinkingTrust = await ethers.getContractFactory("LinkingTrust");
    const [owner, authOne, authTwo] = await ethers.getSigners();

    //deploy a lock contract where funds can be withdrawn one year in the future
    const linkingTrust = await LinkingTrust.deploy();
    await linkingTrust.deployed();

    return { LinkingTrust, linkingTrust, owner, authOne, authTwo };

  }

  describe("Create Trust", function() {
    it("Should set the correct unlockTime condition", async function() {

      const { linkingTrust, owner, authOne, authTwo } = await loadFixture(
          deployTokenFixture
      );
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

      //create a new trust
      await linkingTrust.createNewTrust(unlockTime, 1, authOne.address, authTwo.address);
      expect(await linkingTrust.getTrustUnlockTime(0)).to.equal(unlockTime);
    }

  );

    it("Should set the correct unlockPrice condition", async function() {

      const { linkingTrust, owner, authOne, authTwo } = await loadFixture(
          deployTokenFixture
      );
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

      //create a new trust
      await linkingTrust.createNewTrust(unlockTime, 1, authOne.address, authTwo.address);
      expect(await linkingTrust.getTrustUnlockPrice(0)).to.equal(1);
    });


  });

});
