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
	const args = ns.flags([["help", false]]);
	if (args.help) {
		ns.tprint("This script auto unlock the serves.");
		ns.tprint(`Usage: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

	// const playerHckLvl = ns.getHackingLevel();

	const programs = {
		ssh: false,
		ftp: false,
		smtp: false,
		http: false,
		sql: false,
	};

	let openPorts = 0;

	if (ns.fileExists("BruteSSH.exe", "home")) {
		programs.ssh = true;
		openPorts++;
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		programs.ftp = true;
		openPorts++;
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		programs.smtp = true;
		openPorts++;
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		programs.http = true;
		openPorts++;
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		programs.sql = true;
		openPorts++;
	}

	const servers = list_servers(ns).filter(
		(s) => !ns.hasRootAccess(s) && ns.getServerNumPortsRequired(s) <= openPorts,
	);
	// .concat(["home"]);

	for (const server of servers) {
		if (programs.ssh) {
			ns.brutessh(server);
		}
		if (programs.ftp) {
			ns.ftpcrack(server);
		}
		if (programs.smtp) {
			ns.relaysmtp(server);
		}
		if (programs.http) {
			ns.httpworm(server);
		}
		if (programs.sql) {
			ns.sqlinject(server);
		}
		ns.nuke(server);
		ns.tprint(`[${server}] Hack concluido com sucesso!`);

		// if (playerHckLvl >= ns.getServerRequiredHackingLevel(server)) {
		//   backdoor
		// }
	}

	ns.exec("autoHack.js", "home");
}
