import type { NS } from "@ns";

function scan(ns: NS, parent: string, server: string, list: string[]) {
	const children = ns.scan(server);
	for (const child of children) {
		if (parent === child) {
			continue;
		}
		list.push(child);

		scan(ns, server, child, list);
	}
}

export function list_servers(ns: NS) {
	const list: string[] = [];
	scan(ns, "", "home", list);
	return list;
}

/** @param {NS} ns **/
export async function main(ns: NS) {
	const args = ns.flags([
		["help", false],
		["filter", false],
	]);
	if (args.help) {
		ns.tprint("This script lists all servers on which you can run scripts.");
		ns.tprint(`Usage: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

	const servers = list_servers(ns)
		.filter((s) => ns.hasRootAccess(s))
		.concat(["home"]);
	let recommend = "";
	let recommendValue = 0;
	for (const server of servers) {
		const used = ns.getServerUsedRam(server);
		const max = ns.getServerMaxRam(server);
		const maxMoney = ns.getServerMaxMoney(server);
		const shouldHack =
			ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() / 2 &&
			maxMoney > 0;

		if (args.filter && !shouldHack) continue;

		ns.tprint(
			`${server} is opened. ${used} GB / ${max} GB (${((100 * used) / max).toFixed(2)}%) | MaxMoney: ${maxMoney} | hack?: ${shouldHack}`,
		);

		if (maxMoney > recommendValue) {
			recommend = server;
			recommendValue = maxMoney;
		}
	}
	ns.tprint(`\n\n    Recommended: ${recommend}\n\n`);
}
