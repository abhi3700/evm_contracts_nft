// TODO: Modify the unit test functions & filename
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

export function testERC20Token(): void {
  describe("ERC20 Token contract", () => {
    // let erc20TokenAddress: string;
    // let signers: Array<Signer>;
    let owner: SignerWithAddress,
      owner2: SignerWithAddress,
      addr1: SignerWithAddress,
      addr2: SignerWithAddress,
      addr3: SignerWithAddress;
    let erc20TokenContract: Contract;

    beforeEach(async () => {
      // get signers
      [owner, owner2, addr1, addr2, addr3] = await ethers.getSigners();

      // ---------------------------------------------------
      // deploy erc20 token contract
      const Erc20TokenFactory: ContractFactory =
        await ethers.getContractFactory("ERC20Token");
      erc20TokenContract = await Erc20TokenFactory.deploy(
        "Health Token",
        "HLT"
      );
      await erc20TokenContract.deployed();
      // erc20TokenAddress = erc20TokenContract.address;
      // console.log(`ERC20 Token contract address: ${erc20TokenContract.address}`);

      // expect(erc20TokenAddress).to.not.eq(0);

      // console.log(`ERC20 Token SC owner: ${await erc20TokenContract.owner()}`);

      // Mint some tokens (10 HLT) to each of addresses
      await erc20TokenContract.mint(
        addr1.address,
        BigNumber.from(String(10e18))
      );
      await erc20TokenContract.mint(
        addr2.address,
        BigNumber.from(String(10e18))
      );
      await erc20TokenContract.mint(
        addr3.address,
        BigNumber.from(String(10e18))
      );

      // verify balance of each address
      const addresses = [addr1, addr2, addr3];
      for (let index = 0; index < addresses.length; index++) {
        expect(
          await erc20TokenContract.balanceOf(addresses[index].address)
        ).to.eq(BigNumber.from(String(1e19)));
      }

      // Shortened to this 🔝
      // await expect(await erc20TokenContract.balanceOf(addr1.address)).to.eq(
      //   BigNumber.from(String(1e19))
      // );
      // expect(await erc20TokenContract.balanceOf(addr2.address)).to.eq(
      //   BigNumber.from(String(1e19))
      // );
      // expect(await erc20TokenContract.balanceOf(addr3.address)).to.eq(
      //   BigNumber.from(String(1e19))
      // );
    });

    describe("Ownable", async () => {
      it("Should have the correct owner", async () => {
        expect(await erc20TokenContract.owner()).to.equal(owner.address);
      });

      it("Owner is able to transfer ownership", async () => {
        await expect(erc20TokenContract.transferOwnership(owner2.address))
          .to.emit(erc20TokenContract, "OwnershipTransferred")
          .withArgs(owner.address, owner2.address);
      });
    });

    describe("Pausable", async () => {
      it("Owner is able to pause when NOT paused", async () => {
        await expect(erc20TokenContract.pause())
          .to.emit(erc20TokenContract, "Paused")
          .withArgs(owner.address);
      });

      it("Owner is able to unpause when already paused", async () => {
        erc20TokenContract.pause();

        await expect(erc20TokenContract.unpause())
          .to.emit(erc20TokenContract, "Unpaused")
          .withArgs(owner.address);
      });

      it("Owner is NOT able to pause when already paused", async () => {
        erc20TokenContract.pause();

        await expect(erc20TokenContract.pause()).to.be.revertedWith(
          "Pausable: paused"
        );
      });

      it("Owner is NOT able to unpause when already unpaused", async () => {
        erc20TokenContract.pause();

        erc20TokenContract.unpause();

        await expect(erc20TokenContract.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
      });
    });

    describe("Mint", async () => {
      it("Succeeds when owner mints token", async () => {
        // get the balance of addr2 before mint
        const balanceAddr2Before: BigNumber =
          await erc20TokenContract.balanceOf(addr2.address);

        // owner mint 1 wei to addr2
        await expect(erc20TokenContract.connect(owner).mint(addr2.address, 1))
          .to.emit(erc20TokenContract, "TokenMinted")
          .withArgs(addr2.address, 1);

        // get the balance of addr2 after mint
        const balanceAddr2After: BigNumber = await erc20TokenContract.balanceOf(
          addr2.address
        );

        await expect(balanceAddr2After.sub(balanceAddr2Before)).to.eq(
          BigNumber.from(String(1))
        );
      });

      it("Reverts when non-owner mints token", async () => {
        await expect(
          erc20TokenContract.connect(addr1).mint(addr2.address, 1)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Reverts when owner mints zero token", async () => {
        await expect(
          erc20TokenContract.connect(owner).mint(addr2.address, 0)
        ).to.be.revertedWith("amount must be positive");
      });

      it("Reverts when owner mints token to zero address", async () => {
        await expect(
          erc20TokenContract.connect(owner).mint(ZERO_ADDRESS, 1)
        ).to.be.revertedWith("ERC20: mint to the zero address");
      });

      it("Reverts when paused", async () => {
        erc20TokenContract.pause();

        // owner mint 1 wei to addr2
        await expect(
          erc20TokenContract.connect(owner).mint(addr2.address, 1)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("Burn", async () => {
      it("Succeeds when self burns token", async () => {
        // addr1 burn 1 wei to contract
        await expect(erc20TokenContract.connect(addr2).burn(addr2.address, 1))
          .to.emit(erc20TokenContract, "TokenBurnt")
          .withArgs(addr2.address, 1);
      });

      it("Succeeds when others burns token for you", async () => {
        // addr1 burn 1 wei to contract
        await expect(erc20TokenContract.connect(addr1).burn(addr2.address, 1))
          .to.emit(erc20TokenContract, "TokenBurnt")
          .withArgs(addr2.address, 1);
      });

      it("Reverts when self burns zero token", async () => {
        // addr1 burn 1 wei to contract
        // eslint-disable-next-line prettier/prettier
        await expect(erc20TokenContract.connect(addr2).burn(addr2.address, 0))
					.to.be.revertedWith("amount must be positive");
      });

      it("Reverts when burnt from zero address", async () => {
        // addr1 burn 1 wei to contract
        // eslint-disable-next-line prettier/prettier
        await expect(erc20TokenContract.connect(addr2).burn(ZERO_ADDRESS, 1)).to.be.revertedWith("ERC20: burn from the zero address");
      });

      it("Reverts when paused", async () => {
        erc20TokenContract.pause();

        // addr3 release amount to payee
        await expect(
          erc20TokenContract.connect(addr2).burn(addr2.address, 1)
        ).to.be.revertedWith("Pausable: paused");
      });
    });
  });
}
