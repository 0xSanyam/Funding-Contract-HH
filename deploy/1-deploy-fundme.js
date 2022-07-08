// module.exports = async (hre) => {
// 	const { getNamedAccounts, deployments } = hre;
// };

const { networks, localChains } = require("../hardhat-helper");
// same as
/*
const helper = require("../hardhat-helper");
const networks = helper.networks;
*/
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

// exporting for "hardhat deploy"
module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	let ethUsdPriceFeedAddress;
	if (localChains.includes(network.name)) {
		const ethUsdAggregator = await deployments.get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	} else {
		ethUsdPriceFeedAddress = networks[chainId]["ethUsdPriceFeedAddress"];
	}

	// for localhost or hardhat network we will use a mock
	const args = [ethUsdPriceFeedAddress];
	const fundMe = await deploy(
		"FundMe",
		/*overrides*/ {
			from: deployer,
			args: args, // price feed address
			log: true,
			waitConfirmations: network.config.blockConfirmations || 1,
		}
	);
	if (!localChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
		await verify(fundMe.address, args);
	}
	log("---------------------------------------------------------------");
};

module.exports.tags = ["all", "fundMe"];
