// Unit test --> done locally
// Individual units are tested

const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { localChains } = require("../../hardhat-helper");
let fundMe;
let owner;
let mockV3Aggregator;
const sendEth = ethers.utils.parseEther("1");

!localChains.includes(network.name)
	? describe.skip
	: describe("FundMe", function () {
			beforeEach(async function () {
				owner = (await getNamedAccounts()).deployer;
				await deployments.fixture(["all"]);
				fundMe = await ethers.getContract("FundMe", owner);
				mockV3Aggregator = await ethers.getContract(
					"MockV3Aggregator",
					owner
				);
			});
			describe("constructor", function () {
				it("Sets the aggregator addresses correctly", async function () {
					const response = await fundMe.getPriceFeed();
					assert.equal(response, mockV3Aggregator.address);
				});
			});
			describe("fund", async function () {
				it("Fails if enough ETH is not sent", async function () {
					await expect(fundMe.fund()).to.be.revertedWith(
						"fund__SendMore"
					);
				});
				it("Maps the amount funded to respective addresses", async function () {
					await fundMe.fund({ value: sendEth });
					const response = await fundMe.getAddressToAmountFunded(
						owner
					);
					assert.equal(response.toString(), sendEth.toString());
				});
				it("Make funders list", async function () {
					await fundMe.fund({ value: sendEth });
					const response = await fundMe.getFunders(0);
					assert.equal(response, owner);
				});
			});
			describe("withdraw", async function () {
				beforeEach(async function () {
					await fundMe.fund({ value: sendEth });
				});
				it("Can withdraw Eth in case of a single funder", async function () {
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const ownerBalance = await fundMe.provider.getBalance(
						owner
					);
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					// bignumber --> .mul instead of *
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const newFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const newOwnerBalance = await fundMe.provider.getBalance(
						owner
					);

					assert.equal(newFundMeBalance, 0);
					// bignumbers --> .add instead of +
					// owner spent some gas when the withdraw function was called so that should
					// also be considered
					assert.equal(
						startingFundMeBalance.add(ownerBalance).toString(),
						newOwnerBalance.add(gasCost).toString()
					);
				});
				it("Can withdraw Eth in case of multiple funders", async function () {
					const accounts = await ethers.getSigners();
					// 0th index is the owner/deployer
					for (let i = 1; i < 7; i++) {
						const fundMeConnect = await fundMe.connect(accounts[i]);
						await fundMeConnect.fund({ value: sendEth });
					}
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const ownerBalance = await fundMe.provider.getBalance(
						owner
					);

					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const newFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const newOwnerBalance = await fundMe.provider.getBalance(
						owner
					);

					assert.equal(newFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(ownerBalance).toString(),
						newOwnerBalance.add(gasCost).toString()
					);

					await expect(fundMe.getFunders(0)).to.be.reverted;
					for (i = 1; i < 7; i++) {
						assert.equal(
							await fundMe.getAddressToAmountFunded(
								accounts[i].address
							),
							0
						);
					}
				});
				it("Only the owner should be able to withraw the funds!", async function () {
					const accounts = await ethers.getSigners();
					const attacker = accounts[2];
					const fundMeConnect = await fundMe.connect(attacker);

					await expect(fundMeConnect.withdraw()).to.be.revertedWith(
						"FundMe__NotOwner"
					);
				});
			});

			describe("efficient withdraw", async function () {
				beforeEach(async function () {
					await fundMe.fund({ value: sendEth });
				});
				it("Can withdraw Eth in case of a single funder", async function () {
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const ownerBalance = await fundMe.provider.getBalance(
						owner
					);
					const transactionResponse =
						await fundMe.efficientWithdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					// bignumber --> .mul instead of *
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const newFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const newOwnerBalance = await fundMe.provider.getBalance(
						owner
					);

					assert.equal(newFundMeBalance, 0);
					// bignumbers --> .add instead of +
					// owner spent some gas when the withdraw function was called so that should
					// also be considered
					assert.equal(
						startingFundMeBalance.add(ownerBalance).toString(),
						newOwnerBalance.add(gasCost).toString()
					);
				});
				it("Can withdraw Eth in case of multiple funders", async function () {
					const accounts = await ethers.getSigners();
					// 0th index is the owner/deployer
					for (let i = 1; i < 7; i++) {
						const fundMeConnect = await fundMe.connect(accounts[i]);
						await fundMeConnect.fund({ value: sendEth });
					}
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const ownerBalance = await fundMe.provider.getBalance(
						owner
					);

					const transactionResponse =
						await fundMe.efficientWithdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const newFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const newOwnerBalance = await fundMe.provider.getBalance(
						owner
					);

					assert.equal(newFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(ownerBalance).toString(),
						newOwnerBalance.add(gasCost).toString()
					);

					await expect(fundMe.getFunders(0)).to.be.reverted;
					for (i = 1; i < 7; i++) {
						assert.equal(
							await fundMe.getAddressToAmountFunded(
								accounts[i].address
							),
							0
						);
					}
				});
				// it("Only the owner should be able to withraw the funds!", async function () {
				// 	const accounts = await ethers.getSigners();
				// 	const attacker = accounts[2];
				// 	const fundMeConnect = await fundMe.connect(attacker);

				// 	await expect(fundMeConnect.efficientWithdraw()).to.be.revertedWith(
				// 		"FundMe__NotOwner"
				// 	);
				// });
			});
	  });
