import type { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
	const targets = ns.args as string[];
	for (const target of targets) {
		// verify server name
		if (!ns.serverExists(target))
			return ns.tprint(`[${target}] Servidor não existe!`);

		// check route
		// follow route

		// verify root access
		// if (ns.hasRootAccess(target))
		//   return ns.tprint(`[${target}] Você ja manda aqui`);

		// verify user hack level
		// const playerHckLvl = ns.getHackingLevel();
		// verify port openers available
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
			ns.brutessh(target);
			openPorts++;
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			programs.ftp = true;
			ns.ftpcrack(target);
			openPorts++;
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			programs.smtp = true;
			ns.relaysmtp(target);
			openPorts++;
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			programs.http = true;
			ns.httpworm(target);
			openPorts++;
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			programs.sql = true;
			ns.sqlinject(target);
			openPorts++;
		}

		// verify server hack level requirement
		// const serverHckReq = ns.getServerRequiredHackingLevel(target);
		// verify N ports requirement
		const serverPortReq = ns.getServerNumPortsRequired(target);

		// if (serverHckReq > playerHckLvl) {
		//   return ns.tprint(`Precisa de mais lvl de hack (${playerHckLvl}/${serverHckReq})`);
		// } else
		if (serverPortReq > openPorts) {
			return ns.tprint(
				`[${target}] Precisa de mais portas (${openPorts}/${serverPortReq})`,
			);
		}

		// if is possible to hack, nuke it
		ns.nuke(target);

		// go back to home
		ns.tprint(`[${target}] Hack concluido com sucesso!`);

		// run deploy script
		if (ns.getServerMaxRam(target) > 0) {
			// run deploy.js summit-uni basicHack.js phantasy
			ns.exec("deploy.js", "home", 1, target, "basicHack.js", "phantasy");
			ns.tprint(`[${target}] Executing hacks!`);
		} else {
			ns.tprint(`[${target}] No RAM :(`);
		}
	}
}
