import type { NS } from "@ns";
import { listServers } from "./lib/listServers";

/** @param {NS} ns **/
export async function main(ns: NS) {
	const args = ns.flags([["help", false]]);
	if (args.help) {
		ns.tprint("This script auto hacks every unlocked server.");
		ns.tprint(`Usage: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

	const servers = listServers(ns).filter((s) => ns.hasRootAccess(s));
	// .concat(["home"]);
	let recommend = "foodnstuff";
	let recommendValue = 0;
	for (const server of servers) {
		const maxMoney = ns.getServerMaxMoney(server);
		const shouldHack =
			ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() / 2 &&
			maxMoney > 0;

		if (!shouldHack) continue;

		if (maxMoney > recommendValue) {
			recommend = server;
			recommendValue = maxMoney;
		}
	}

	ns.tprint(`Hacking: ${recommend}\n\n`);

	for (const server of servers) {
		// run deploy script
		if (ns.getServerMaxRam(server) > 0) {
			ns.scriptKill("basicHack.js", server);
			// run deploy.js summit-uni basicHack.js phantasy
			ns.exec("deploy.js", "home", 1, server, "basicHack.js", recommend);
			ns.tprint(`[${server}] Executing hacks!`);
		}
	}
}
