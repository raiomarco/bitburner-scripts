import type { NS } from "@ns";

export async function main(ns: NS) {
	const args = ns.flags([["help", false]]) as { help: boolean; _: string[] };
	if (args.help) {
		ns.tprint(
			"This script will share ram of the current server to boost faction reputation.",
		);
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}
	// eslint-disable-next-line no-constant-condition
	while (true) {
		await ns.share();
	}
}
