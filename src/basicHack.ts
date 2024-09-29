import type { NS } from "@ns";

export async function main(ns: NS) {
	const args = ns.flags([["help", false]]) as { help: boolean; _: string[] };
	const hostname = args._[0];
	if (args.help || !hostname) {
		ns.tprint("This script will generate money by hacking a target server.");
		ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles`);
		return;
	}
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (
			ns.getServerSecurityLevel(hostname) >
			ns.getServerMinSecurityLevel(hostname)
		) {
			await ns.weaken(hostname);
		} else if (
			ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname)
		) {
			await ns.grow(hostname);
		} else {
			await ns.hack(hostname);
		}
	}
}
