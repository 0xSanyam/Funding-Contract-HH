const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
	const { deployer } = await getNamedAccounts;
	const fundMe = await ethers.getContract("FundMe", deployer);
	const balance = await fundMe.provider.getBalance(fundMe.address);
	console.log("Withdrawing...");
	const transactionResponse = await fundMe.efficientWithdraw();
	await transactionResponse.wait(1);
	console.log(`Withdrawal of ${balance / 1e18} Eth is done!`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
