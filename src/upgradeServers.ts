import type { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
	// How much RAM each purchased server will have. In this case, it'll
	// be 8GB.
	const ram = ns.args[0] as number;

	// Iterator we'll use for our loop
	let i = 0;

	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	while (i < ns.getPurchasedServerLimit()) {
		const serverId = i < 10 ? `0${i}` : i;
		const serverHostname = `pserv-${serverId}`;

		const serverCost = ns.getPurchasedServerUpgradeCost(serverHostname, ram);
		const playerMoney = ns.getServerMoneyAvailable("home");

		const totalCost = serverCost * ns.getPurchasedServerLimit();

		if (ns.getServerMaxRam(serverHostname) >= ram) {
			++i;
			continue;
		}

		// Check if we have enough money to purchase a server
		if (playerMoney > serverCost) {
			// If we have enough money, then:
			//  1. Purchase the server
			//  2. Copy our hacking script onto the newly-purchased server
			//  3. Run our hacking script on the newly-purchased server with 3 threads
			//  4. Increment our iterator to indicate that we've bought a new server

			ns.upgradePurchasedServer(serverHostname, ram);

			ns.exec("autoHack.js", "home", 1);
			++i;
		} else {
			ns.print(`Server Upgrade Cost: ${serverCost}`);
			ns.print(`Server Upgrade Remaining Cost ${serverCost - playerMoney}`);
			ns.print(`Remaining: ${ns.getPurchasedServerLimit() - i}`);
			ns.print(`Total Remaining Cost: ${totalCost - serverCost * i}`);
		}
		//Make the script wait for a second before looping again.
		//Removing this line will cause an infinite loop and crash the game.
		await ns.sleep(1000);
	}
}
