import type { AutocompleteData, NS } from "@ns";

function recursiveScan(
	ns: NS,
	parent: string,
	server: string,
	target: string,
	route: string[],
) {
	const children = ns.scan(server);
	for (const child of children) {
		if (parent === child) {
			continue;
		}
		if (child === target) {
			route.unshift(child);
			route.unshift(server);
			return true;
		}

		if (recursiveScan(ns, server, child, target, route)) {
			route.unshift(server);
			return true;
		}
	}
	return false;
}

/** @param {NS} ns */
export async function main(ns: NS) {
	const args = ns.flags([["help", false]]) as { help: boolean; _: string[] };
	const route: string[] = [];
	const server = args._[0];
	if (!server || args.help) {
		ns.tprint(
			"This script helps you find a server on the network and shows you the path to get to it.",
		);
		ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles`);
		return;
	}

	recursiveScan(ns, "", "home", server, route);
	for (const i in route) {
		await ns.sleep(500);
		const extra = (i as unknown as number) > 0 ? "└ " : "";
		ns.tprint(`${" ".repeat(i as unknown as number)}${extra}${route[i]}`);
	}
}

export function autocomplete(data: AutocompleteData) {
	return data.servers;
}
