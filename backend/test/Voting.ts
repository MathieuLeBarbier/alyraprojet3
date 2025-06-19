const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { BN } = require("ethereumjs-util");
import { ethers } from "hardhat";


describe("testing Storage", function () {
  
    async function deployStorageFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Storage = await ethers.getContractFactory("Storage");
        const storage = await Storage.deploy(0);
        return { storage, owner, otherAccount };
    }

    async function deployStorageFixture5() {
      const [owner, otherAccount] = await ethers.getSigners();
      const Storage = await ethers.getContractFactory("Storage");
      const storage = await Storage.deploy(5);
      return { storage, owner, otherAccount };
  }
    async function deployStorageFixture2() { 
        const { storage, owner, otherAccount } = await loadFixture(deployStorageFixture);
        await storage.store(2);
        return { storage, owner, otherAccount };
    }


  describe("Deploy", function () { 
    it("Should deploy with number 0", async function () {
      const { storage } = await loadFixture(deployStorageFixture5);

      expect(await storage.retrieve()).to.equal(5);
    });
    it("Should deploy with number 2", async function () {
        const { storage } = await loadFixture(deployStorageFixture2);
  
        expect(await storage.retrieve()).to.equal(2);
      });
  });

  describe("Setter", function () {
    it("Should set and get number 8", async function () {
        const { storage } = await loadFixture(deployStorageFixture);
        await storage.store(8);
        expect(await storage.retrieve()).to.equal(8);
      });
  });

  describe("increment", function () {
    it("Should increment once", async function () {
        const { storage } = await loadFixture(deployStorageFixture);
         let value = await storage.retrieve();
        await storage.increment();
        expect(await storage.retrieve()).to.equal(value + new BN(1));
    });

    it("Should increment 4 time", async function () {
        const { storage } = await loadFixture(deployStorageFixture);
        await storage.increment();
        await storage.increment();        
        await storage.increment();
        await storage.increment();
        expect(await storage.retrieve()).to.equal(4);
    });

    it("cant increment 10 time", async function () {
        const { storage } = await loadFixture(deployStorageFixture);
        await storage.increment();
        await storage.increment();        
        await storage.increment();
        await storage.increment();
        await storage.increment();
        await storage.increment();
        await storage.increment();
        await storage.increment();

        expect(await storage.increment()).to.be.revertedWith("trop grand nombre2");
    });
    it("Should emit event", async function () {
        const { storage } = await loadFixture(deployStorageFixture);
        await expect(storage.increment())
                  .to.emit(storage, "numberSet")
                  .withArgs(1); 
    });
  });
  describe("deploy2", function () {
    let storage : any ;
    beforeEach(async function () {
        const fixture  = await loadFixture(deployStorageFixture2);
        storage = fixture.storage;
    });

    it("Should get a context where number is 2", async function () {
        expect(await storage.retrieve()).to.equal(2);
      });

    it("Should increment to 3", async function () {
        await storage.increment();
        expect(await storage.retrieve()).to.equal(3);
      });
    it("Should increment to 3", async function () {
        await storage.increment();
        expect(await storage.retrieve()).to.equal(3);
      });
  });

});