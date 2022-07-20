/** @param {NS} ns */
export async function main(ns) {

	var wordy_logs = ["disableLog",
		"sleep",
		"exec",
		"getServerMaxRam",
		"nuke",
		"scp",
		"getServerNumPortsRequired",
		"scan",
		"getServerRequiredHackingLevel",
		"getServerMaxMoney",
		"fileExists",
		"brutessh",
		"ftpcrack",
		"relaysmtp",
		"httpworm",
		"sqlinject",
		"scriptKill",
		"getHackingLevel",
		"getServerUsedRam"
	];
	for (var log_name in wordy_logs) ns.disableLog(wordy_logs[log_name]);

	// Script variables
	var script_name = "early.script";
	var script_ram = ns.getScriptRam(script_name);

	// Run hacknet and/or servers
	if (ns.args[0] == 1) ns.exec("hacknet.js", "home", 1);
	//else if (ns.args[0] == 2) ns.exec("createservers.js", "home", 1);
	else if (ns.args[0] == 3) {
		ns.exec("hacknet.js", "home", 1);
		//ns.exec("createservers.js", "home", 1);
	}

	// Array of all servers
	var servers_all = [];
	var servers0Port = [];
	var servers1Port = [];
	var servers2Port = [];
	var servers3Port = [];
	var servers4Port = [];
	var servers5Port = [];
	var moneyless_servers = ["home"];
	scan_loop("home");

	function scan_loop(server_name) {
		if (ns.args[0] == "ls" && ns.args[1] == "slow") {
			ns.print("Scanning " + server_name);
		}
		var this_scan = ns.scan(server_name);
		for (var i in this_scan) {
			if (servers_all.indexOf(this_scan[i]) == -1 && this_scan[i] != server_name && this_scan[i] != "home" && this_scan[i].indexOf("weaken-") == -1) {
				if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) == 0) continue;
				else if (!ns.fileExists("BruteSSH.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 0) continue;
				else if (!ns.fileExists("FTPCrack.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 1) continue;
				else if (!ns.fileExists("relaySMTP.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 2) continue;
				else if (!ns.fileExists("HTTPWorm.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 3) continue;
				else if (!ns.fileExists("SQLInject.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 4) continue;
				else if (ns.getServerRequiredHackingLevel(this_scan[i]) > ns.getHackingLevel()) continue;

				servers_all.push(this_scan[i]);
				if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) != 0) moneyless_servers.push(this_scan[i]);
				else {
					if (ns.getServerNumPortsRequired(this_scan[i]) == 0) servers0Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 1) servers1Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 2) servers2Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 3) servers3Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 4) servers4Port.push(this_scan[i]);
					else if (ns.getServerNumPortsRequired(this_scan[i]) == 5) servers5Port.push(this_scan[i]);
				}
				scan_loop(this_scan[i]);
			}
		}
	}

	if (ns.args[0] == "ls") {
		ns.print({ "0": servers0Port, "1": servers1Port, "2": servers2Port, "3": servers3Port, "4": servers4Port, "5": servers5Port, "moneyless": moneyless_servers, "all": servers_all });
		return;
	}

	// Copy our scripts onto each server that requires 0 ports
	// to gain root access. Then use nuke() to gain admin access and
	// run the scripts.
	for (var i in servers0Port) {
		var serv = servers0Port[i];

		await ns.scp(script_name, serv);
		await ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
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
		ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");

	// Wait until we acquire the "FTPCrack.exe" program
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
		ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");

	// Wait until we acquire the "relaySMTP.exe" program
	while (!ns.fileExists("relaySMTP.exe")) {
		await run_moneyless();
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh(), ftpcrack(), and nuke()
	// to gain admin access and run the scripts.
	for (var i in servers3Port) {
		var serv = servers3Port[i];

		await ns.scp(script_name, serv);
		ns.brutessh(serv);
		ns.ftpcrack(serv);
		ns.relaysmtp(serv);
		ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");

	// Wait until we acquire the "HTTPWorm.exe" program
	while (!ns.fileExists("HTTPWorm.exe")) {
		await run_moneyless();
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh(), ftpcrack(), and nuke()
	// to gain admin access and run the scripts.
	for (var i in servers4Port) {
		var serv = servers4Port[i];

		await ns.scp(script_name, serv);
		ns.brutessh(serv);
		ns.ftpcrack(serv);
		ns.relaysmtp(serv);
		ns.httpworm(serv);
		ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");

	// Wait until we acquire the "SQLInject.exe" program
	while (!ns.fileExists("SQLInject.exe")) {
		await run_moneyless();
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh(), ftpcrack(), and nuke()
	// to gain admin access and run the scripts.
	for (var i in servers5Port) {
		var serv = servers5Port[i];

		await ns.scp(script_name, serv);
		ns.brutessh(serv);
		ns.ftpcrack(serv);
		ns.relaysmtp(serv);
		ns.httpworm(serv);
		ns.sqlinject(serv);
		ns.nuke(serv);
		let threads = Math.floor(ns.getServerMaxRam(serv) / script_ram);
		ns.exec(script_name, serv, threads > 0 ? threads : 1);
		await ns.sleep(100);
	}

	// cancel the "waiting" script
	if (ns.scriptRunning("post-refresh.script", "home")) ns.scriptKill("post-refresh.script", "home");
	await run_moneyless(true);

	// fills the moneyless servers' remaining ram to put them to work
	async function run_moneyless(run_final) {
		for (var i in moneyless_servers) {
			var serv = moneyless_servers[i];

			await ns.scp("post-refresh.script", serv);
			var can_nuke = true;
			if (ns.getServerNumPortsRequired(serv) > 0 && ns.fileExists("BruteSSH.exe")) {
				ns.brutessh(serv);
				if (ns.getServerNumPortsRequired(serv) > 1 && ns.fileExists("FTPCrack.exe")) {
					ns.ftpcrack(serv);
					if (ns.getServerNumPortsRequired(serv) > 1 && ns.fileExists("relaySMTP.exe")) {
						ns.relaysmtp(serv);
						if (ns.getServerNumPortsRequired(serv) > 1 && ns.fileExists("HTTPWorm.exe")) {
							ns.httpworm(serv);
							if (ns.getServerNumPortsRequired(serv) > 1 && ns.fileExists("SQLInject.exe")) {
								ns.sqlinject(serv);
							} else can_nuke = false;
						} else can_nuke = false;
					} else can_nuke = false;
				} else can_nuke = false;
			} else can_nuke = false;
			if (ns.getServerNumPortsRequired(serv) == 0 || can_nuke) await ns.nuke(serv);
			let threads = 1;
			if (moneyless_servers[i] == "home") {
			ns.scriptKill("post-refresh-home.js", "home");
			threads = Math.floor(ns.getServerMaxRam(moneyless_servers[i]) - ns.getServerUsedRam("home")) / ns.getScriptRam("post-refresh-home.js", "home");
			const money_servers = Array.prototype.concat(servers0Port, servers1Port, servers2Port, servers3Port, servers4Port, servers5Port);
			let scripts = Math.floor(threads / money_servers.length);
			for (var server_i in money_servers) {
				ns.exec("post-refresh-home.js", "home", scripts > 0 ? scripts : 1, money_servers[server_i]);
			}
			// Run servers
			if (run_final && (ns.args[0] == 2 || ns.args[0] == 3)) ns.exec("createservers.js", "home", 1, JSON.stringify(money_servers));
			} else {
				threads = Math.floor(ns.getServerMaxRam(moneyless_servers[i]) / ns.getScriptRam("post-refresh.script"));
				ns.exec("post-refresh.script", moneyless_servers[i], threads > 0 ? threads : 1);
			}
			await ns.sleep(100);
		}
	}
}