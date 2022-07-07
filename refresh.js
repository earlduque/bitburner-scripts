/** @param {NS} ns */
export async function main(ns) {
	// Script variables
	var script_name = "early.script";
	var script_ram = ns.getScriptRam(script_name);

	// Run hacknet
	ns.exec("hacknet.js", "home");

	// Array of all servers
	var servers_all = [];
	var servers0Port = [];
	var servers1Port = [];
	var servers2Port = [];
	var moneyless_servers = ["home"];
	scan_loop("home");

	function scan_loop(server_name) {
		var this_scan = ns.scan(server_name);
		for (var i in this_scan) {
			if (servers_all.indexOf(this_scan[i]) == -1 && this_scan[i] != server_name) {
				if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) == 0) continue;
				else if (ns.getServerNumPortsRequired(this_scan[i]) > 2) continue;
				else if (ns.getServerRequiredHackingLevel(this_scan[i]) > ns.getHackingLevel()) continue;

				servers_all.push(this_scan[i]);
				if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) != 0) moneyless_servers.push(this_scan[i]);
				else {
					if (ns.getServerNumPortsRequired(this_scan[i]) == 0) servers0Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 1) servers1Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 2) servers2Port.push(this_scan[i]);
				}
				scan_loop(this_scan[i]);
			}
		}
	}

	// Copy our scripts onto each server that requires 0 ports
	// to gain root access. Then use nuke() to gain admin access and
	// run the scripts.
	for (var i in servers0Port) {
		var serv = servers0Port[i];

		await ns.scp(script_name, serv);
		await ns.nuke(serv);
		ns.exec(script_name, serv, Math.floor(ns.getServerMaxRam(serv) / script_ram));
	}

	// Wait until we acquire the "BruteSSH.exe" program
	while (!ns.fileExists("BruteSSH.exe")) {
		await run_moneyless();
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh() and nuke()
	// to gain admin access and run the scripts.
	for (var i in servers1Port) {
		var serv = servers1Port[i];

		await ns.scp(script_name, serv);
		ns.brutessh(serv);
		await ns.nuke(serv);
		ns.exec(script_name, serv, Math.floor(ns.getServerMaxRam(serv) / script_ram));
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");

	// Wait until we acquire the "BruteSSH.exe" program
	while (!ns.fileExists("FTPCrack.exe")) {
		await run_moneyless();
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh(), ftpcrack(), and nuke()
	// to gain admin access and run the scripts.
	for (var i in servers2Port) {
		var serv = servers2Port[i];

		await ns.scp(script_name, serv);
		ns.brutessh(serv);
		ns.ftpcrack(serv);
		await ns.nuke(serv);
		ns.exec(script_name, serv, Math.floor(ns.getServerMaxRam(serv) / script_ram));
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");
	await run_moneyless();

	// fills the moneyless servers' remaining ram to put them to work
	async function run_moneyless() {
		for (var i in moneyless_servers) {
			var serv = moneyless_servers[i];

			await ns.scp("post-refresh.script", serv);
			var can_nuke = true;
			if (ns.getServerNumPortsRequired(serv) > 0 && ns.fileExists("BruteSSH.exe")) {
				ns.brutessh(serv);
				if (ns.getServerNumPortsRequired(serv) > 1 && ns.fileExists("FTPCrack.exe")) {
					ns.ftpcrack(serv);
				} else can_nuke = false;
			} else can_nuke = false;
			if (ns.getServerNumPortsRequired(serv) == 0 || can_nuke) await ns.nuke(serv);
			if (moneyless_servers[i] == "home") ns.exec("post-refresh.script", moneyless_servers[i], (Math.floor(ns.getServerMaxRam(moneyless_servers[i]) - ns.getScriptRam("refresh.script")) / ns.getScriptRam("post-refresh.script")));
			else ns.exec("post-refresh.script", moneyless_servers[i], Math.floor(ns.getServerMaxRam(moneyless_servers[i]) / ns.getScriptRam("post-refresh.script")));
		}
	}
}