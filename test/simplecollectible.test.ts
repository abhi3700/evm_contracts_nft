import { ethers } from "hardhat";
import chai from "chai";
import {
  BigNumber,
  Contract /* , Signer */ /* , Wallet */,
  ContractFactory,
} from "ethers";
import { /* deployContract, */ solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  // MAX_UINT256,
  // TIME,
  ZERO_ADDRESS,
  // asyncForEach,
  // deployContractWithLibraries,
  // getCurrentBlockTimestamp,
  // getUserTokenBalance,
  // getUserTokenBalances,
  // setNextTimestamp,
  // setTimestamp,
} from "./testUtils";

chai.use(solidity);
const { expect } = chai;

export function testSimpleCollectible(): void {
  describe("Simple Collectible", () => {
    // let erc20TokenAddress: string;
    // let signers: Array<Signer>;
    let owner: SignerWithAddress,
      owner2: SignerWithAddress,
      addr1: SignerWithAddress,
      addr2: SignerWithAddress,
      addr3: SignerWithAddress;
    let simpleCollectibleContract: Contract;

    beforeEach(async () => {
      // get signers
      [owner, owner2, addr1, addr2, addr3] = await ethers.getSigners();

      // ---------------------------------------------------
      // deploy erc20 token contract
      const SimpleCollectibleFactory: ContractFactory =
        await ethers.getContractFactory("SimpleCollectible");
      simpleCollectibleContract = await SimpleCollectibleFactory.deploy();
      await simpleCollectibleContract.deployed();
      // simpleCollectibleAddress = simpleCollectibleContract.address;
      // console.log(`ERC20 Token contract address: ${simpleCollectibleContract.address}`);

      // expect(erc20TokenAddress).to.not.eq(0);

      // console.log(`ERC20 Token SC owner: ${await simpleCollectibleContract.owner()}`);
    });

    describe("Ownable", async () => {
      it("Should have the correct owner", async () => {
        expect(await simpleCollectibleContract.owner()).to.equal(owner.address);
      });

      it("Owner is able to transfer ownership", async () => {
        await expect(
          simpleCollectibleContract.transferOwnership(owner2.address)
        )
          .to.emit(simpleCollectibleContract, "OwnershipTransferred")
          .withArgs(owner.address, owner2.address);
      });
    });

    describe("Pausable", async () => {
      it("Owner is able to pause when NOT paused", async () => {
        await expect(simpleCollectibleContract.pause())
          .to.emit(simpleCollectibleContract, "Paused")
          .withArgs(owner.address);
      });

      it("Owner is able to unpause when already paused", async () => {
        simpleCollectibleContract.pause();

        await expect(simpleCollectibleContract.unpause())
          .to.emit(simpleCollectibleContract, "Unpaused")
          .withArgs(owner.address);
      });

      it("Owner is NOT able to pause when already paused", async () => {
        simpleCollectibleContract.pause();

        await expect(simpleCollectibleContract.pause()).to.be.revertedWith(
          "Pausable: paused"
        );
      });

      it("Owner is NOT able to unpause when already unpaused", async () => {
        simpleCollectibleContract.pause();

        simpleCollectibleContract.unpause();

        await expect(simpleCollectibleContract.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
      });
    });

    describe("Create Collectible", async () => {
      // it("Succeeds when owner mints token", async () => {
      //   // get the balance of addr2 before mint
      //   const balanceAddr2Before: BigNumber =
      //     await simpleCollectibleContract.balanceOf(addr2.address);
      //   // owner mint 1 wei to addr2
      //   await expect(
      //     simpleCollectibleContract.connect(owner).mint(addr2.address, 1)
      //   )
      //     .to.emit(simpleCollectibleContract, "TokenMinted")
      //     .withArgs(addr2.address, 1);
      //   // get the balance of addr2 after mint
      //   const balanceAddr2After: BigNumber =
      //     await simpleCollectibleContract.balanceOf(addr2.address);
      //   await expect(balanceAddr2After.sub(balanceAddr2Before)).to.eq(
      //     BigNumber.from(String(1))
      //   );
      // });
      // it("Reverts when non-owner mints token", async () => {
      //   await expect(
      //     simpleCollectibleContract.connect(addr1).mint(addr2.address, 1)
      //   ).to.be.revertedWith("Ownable: caller is not the owner");
      // });
      // it("Reverts when owner mints zero token", async () => {
      //   await expect(
      //     simpleCollectibleContract.connect(owner).mint(addr2.address, 0)
      //   ).to.be.revertedWith("amount must be positive");
      // });
      // it("Reverts when owner mints token to zero address", async () => {
      //   await expect(
      //     simpleCollectibleContract.connect(owner).mint(ZERO_ADDRESS, 1)
      //   ).to.be.revertedWith("ERC20: mint to the zero address");
      // });
      // it("Reverts when paused", async () => {
      //   simpleCollectibleContract.pause();
      //   // owner mint 1 wei to addr2
      //   await expect(
      //     simpleCollectibleContract.connect(owner).mint(addr2.address, 1)
      //   ).to.be.revertedWith("Pausable: paused");
      // });
    });

    describe("Burn", async () => {
      // it("Succeeds when self burns token", async () => {
      //   // addr1 burn 1 wei to contract
      //   await expect(
      //     simpleCollectibleContract.connect(addr2).burn(addr2.address, 1)
      //   )
      //     .to.emit(simpleCollectibleContract, "TokenBurnt")
      //     .withArgs(addr2.address, 1);
      // });
      // it("Succeeds when others burns token for you", async () => {
      //   // addr1 burn 1 wei to contract
      //   await expect(
      //     simpleCollectibleContract.connect(addr1).burn(addr2.address, 1)
      //   )
      //     .to.emit(simpleCollectibleContract, "TokenBurnt")
      //     .withArgs(addr2.address, 1);
      // });
      // it("Reverts when self burns zero token", async () => {
      //   // addr1 burn 1 wei to contract
      //   // eslint-disable-next-line prettier/prettier
      //   await expect(
      //     simpleCollectibleContract.connect(addr2).burn(addr2.address, 0)
      //   ).to.be.revertedWith("amount must be positive");
      // });
      // it("Reverts when burnt from zero address", async () => {
      //   // addr1 burn 1 wei to contract
      //   // eslint-disable-next-line prettier/prettier
      //   await expect(
      //     simpleCollectibleContract.connect(addr2).burn(ZERO_ADDRESS, 1)
      //   ).to.be.revertedWith("ERC20: burn from the zero address");
      // });
      // it("Reverts when paused", async () => {
      //   simpleCollectibleContract.pause();
      //   // addr3 release amount to payee
      //   await expect(
      //     simpleCollectibleContract.connect(addr2).burn(addr2.address, 1)
      //   ).to.be.revertedWith("Pausable: paused");
      // });
    });
  });
}
