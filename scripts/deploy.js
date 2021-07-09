const config = require('../config.json');
const fs = require('fs');
let root = {}
let network = 'mainnet'

async function main() {
	const addr = config.addresses;

	const netinfo = await ethers.provider.getNetwork();
	network = netinfo.name;
	if (network === "unknown")
		network = "mainnet";

	const chainId = netinfo.chainId;
	console.log("============================================================");
	console.log("");
	console.log("Deployment Started ...");
	console.log("Deploying on " + network + " (chainId: " + chainId + ") ...");

	// get the signers
	let owner, addr1;
	[owner, addr1, ...addrs] = await ethers.getSigners();

	const ownerAddress = await owner.getAddress();
	console.log("");
	console.log("Deploying from account: " + ownerAddress);
	console.log("");

	const DecentLabsCoin = await ethers.getContractFactory('DecentLabsTestCoin');
	const decentLabsCoin = await (await DecentLabsCoin.deploy()).deployed();
	console.log("PlexusCoin is deployed at: ", decentLabsCoin.address);
	console.log("Successfully Deployed!");
	console.log("============================================================");
}

main()
	.then(() => process.exit(0))
	.catch(error => {
			console.error(error);
			process.exit(1);
	});
