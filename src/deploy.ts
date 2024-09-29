import type { NS } from "@ns";

/** @param {NS} ns **/
export async function main(ns: NS) {
	const args = ns.flags([
		["help", false],
		["eco", false],
	]) as { help: boolean; _: string[]; eco: boolean };
	if (args.help || args._.length < 2) {
		ns.tprint(
			"This script deploys another script on a server with maximum threads possible.",
		);
		ns.tprint(`Usage: run ${ns.getScriptName()} HOST SCRIPT ARGUMENTS`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles basic_hack.js foodnstuff`);
		return;
	}

	const host = args._[0];
	const script = args._[1];
	// const target = args._[2]
	const script_args = args._.slice(2);

	if (!ns.serverExists(host)) {
		ns.tprint(`Server '${host}' does not exist. Aborting.`);
		return;
	}
	// else if (!ns.serverExists(target)) {
	//     ns.tprint(`Server '${target}' does not exist. Aborting.`);
	//     return;
	// }

	if (!ns.ls(ns.getHostname()).find((f) => f === script)) {
		ns.tprint(`Script '${script}' does not exist. Aborting.`);
		return;
	}

	let threads = Math.floor(
		(ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) /
			ns.getScriptRam(script),
	);

	if (args.eco) {
		threads = Math.floor(threads * 0.8);
	}

	ns.tprint(
		`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${script_args}`,
	);
	ns.scp(script, host, ns.getHostname());
	ns.exec(script, host, threads, ...script_args);
}
