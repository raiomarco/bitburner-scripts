import type { NS } from "@ns";

export async function main(ns: NS) {
	const args = ns.flags([["help", false]]) as { help: boolean };
	if (args.help) {
		ns.tprint("This script will just be the start point after reset.");
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

	ns.exec("autoUnlock.js", "home");
	await ns.sleep(1000);
	ns.exec("autoHack.js", "home");
	ns.exec("purchaseServers.js", "home", 1);
}
