import type { NS } from "@ns";
import { listServers } from "./lib/listServers";

/** @param {NS} ns **/
export async function main(ns: NS) {
	const args = ns.flags([["help", false]]);
	if (args.help) {
		ns.tprint("This script auto shares every unlocked server.");
		ns.tprint(`Usage: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

	const servers = listServers(ns).filter((s) => ns.hasRootAccess(s));
	// .concat(["home"]);

	for (const server of servers) {
		// run deploy script
		if (ns.getServerMaxRam(server) > 0) {
			ns.scriptKill("basicHack.js", server);
			ns.scriptKill("share.js", server);
			// run deploy.js summit-uni basicHack.js phantasy
			ns.exec("deploy.js", "home", 1, server, "share.js");
			// ns.tprint(`[${server}] Executing share!`);
		}
	}

	ns.scriptKill("basicHack.js", "home");
	ns.scriptKill("share.js", "home");
	ns.exec("deploy.js", "home", 1, "--eco", "home", "share.js");
}
