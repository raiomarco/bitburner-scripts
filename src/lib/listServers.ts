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

export function listServers(ns: NS) {
	const list: string[] = [];
	scan(ns, "", "home", list);
	return list;
}
