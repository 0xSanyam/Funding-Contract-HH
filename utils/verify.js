const { run } = require("hardhat");

async function verify(contractAddress, args) {
	console.log("Verifying Contract...");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (exc) {
		if (exc.message.toLowerCase().includes("already verified")) {
			console.log("Already Verified");
		} else {
			console.log(exc);
		}
	}
}

module.exports = { verify };
