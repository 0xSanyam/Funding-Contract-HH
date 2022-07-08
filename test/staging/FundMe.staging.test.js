// Staging test --> done on a tetnet
// See the integration and all

const { assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const { localChains } = require("../../hardhat-helper");

// ternary
localChains.includes(network.name)
	? describe.skip
	: describe("FundMe", function () {
			let fundMe;
			let owner;
			const sendEth = ethers.utils.parseEther("0.05");
			beforeEach(async function () {
				owner = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", owner);
			});

			it("Allows users to fund and withdraw", async function () {
				await fundMe.fund({ value: sendEth });
				await fundMe.efficientWithdraw();
				const newBalanceFundMe = await fundMe.provider.getBalance(
					fundMe.address
				);
				assert.equal(newBalanceFundMe.toString(), "0");
			});
	  });
