import type { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
	// How much RAM each purchased server will have. In this case, it'll
	// be 8GB.
	const ram = ns.args[0] as number;

	const perServerCost = ns.getPurchasedServerCost(ram);
	const totalCost = perServerCost * ns.getPurchasedServerLimit();

	ns.tprint(`Cost per Server: ${perServerCost}`);
	ns.tprint(`Total cost: ${totalCost}`);

	// Iterator we'll use for our loop
	let i = 0;

	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	while (i < ns.getPurchasedServerLimit()) {
		// Check if we have enough money to purchase a server
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			// If we have enough money, then:
			//  1. Purchase the server
			//  2. Copy our hacking script onto the newly-purchased server
			//  3. Run our hacking script on the newly-purchased server with 3 threads
			//  4. Increment our iterator to indicate that we've bought a new server
			const hostname = ns.purchaseServer(`pserv-${i < 10 ? `0${i}` : i}`, ram);
			ns.exec("deploy.js", "home", 1, hostname, "basicHack.js", "phantasy");
			++i;
		} else {
			ns.print(`Server Cost: ${ns.getPurchasedServerCost(ram)}`);
			ns.print(
				`Server Remaining Cost ${ns.getPurchasedServerCost(ram) - ns.getServerMoneyAvailable("home")}`,
			);
			ns.print(`Remaining: ${ns.getPurchasedServerLimit() - i}`);
			ns.print(`Total Remaining Cost: ${totalCost - perServerCost * i}`);
		}
		//Make the script wait for a second before looping again.
		//Removing this line will cause an infinite loop and crash the game.
		await ns.sleep(1000);
	}
}
