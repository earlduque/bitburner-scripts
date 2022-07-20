/** @param {NS} ns */
export async function main(ns) {

	var wordy_logs = ["disableLog",
		"getServerMoneyAvailable",
		"scp",
		"exec",
		"getServerMaxRam",
		"deleteServer",
		"getServerMaxMoney",
		"getServerNumPortsRequired",
		"scan",
		"getHackingLevel",
		"getServerRequiredHackingLevel"];
	for (var log_name in wordy_logs) ns.disableLog(wordy_logs[log_name]);


	if (ns.args[0] == "delete" && ns.args[1] && ns.args[1] != "") {
		ns.scriptKill("myservers.js", ns.args[1]);
		ns.deleteServer(ns.args[1]);
		return;
	}

	var servers_all = [];
	scan_loop("home", ns.args[0] == "delete" ? true : false);
	//ns.print(servers_all);

	function scan_loop(server_name, include_hn) {
		var this_scan = ns.scan(server_name);
		for (var i in this_scan) {
			if (servers_all.indexOf(this_scan[i]) == -1 && this_scan[i] != server_name) {
				if (!include_hn) {
					if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) == 0) continue;
					else if (!ns.fileExists("BruteSSH.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 0) continue;
					else if (!ns.fileExists("FTPCrack.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 1) continue;
					else if (!ns.fileExists("relaySMTP.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 2) continue;
					else if (!ns.fileExists("HTTPWorm.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 3) continue;
					else if (!ns.fileExists("SQLInject.exe", "home") && ns.getServerNumPortsRequired(this_scan[i]) > 4) continue;
					else if (ns.getServerRequiredHackingLevel(this_scan[i]) > ns.getHackingLevel()) continue;
					else if (ns.getServerMaxMoney(this_scan[i]) == 0 && ns.getServerMaxRam(this_scan[i]) != 0) continue;
				}
				servers_all.push(this_scan[i]);
				scan_loop(this_scan[i]);
			}
		}
	}

	var myserver = "myservers.js";
	var hn = "weaken-";
	var ram = 8;
	var sn = ns.getPurchasedServers().length;
	var cycles = ns.args[1] || 0;

	if (ns.args[0] == "delete") {
		for (var i in servers_all) {
			if (servers_all[i].indexOf(hn) > -1) {
				ns.print("deleting " + servers_all[i]);
				ns.scriptKill("myservers.js", servers_all[i]);
				ns.deleteServer(servers_all[i]);
			}
		}
		return;
	}

	while (true) {
		if (ram > 1048576) break;
		var keep_going = true;
		let existing_servers = ns.getPurchasedServers();
		let sorted_servers = existing_servers
			.map(n => n.split('-')
				.map(num => parseFloat(num) || num))
			.sort((a, b) => a[1] - b[1] || a[2] - b[2])
			.map(n => n.join('-'));
		//ns.print(sorted_servers);

		if (ns.args[0] == "push") {
			for (var push_i in sorted_servers) {
				ns.scriptKill(myserver, sorted_servers[push_i]);
				await move_script(sorted_servers[push_i], sorted_servers[push_i].split('-')[2]);
			}
			return;
		}

		if (sorted_servers.length == ns.getPurchasedServerLimit()) {
			for (var i in sorted_servers) {
				var this_server = sorted_servers[i].split("-");
				if (!ns.fileExists(myserver, sorted_servers[i])) await move_script(sorted_servers[i], this_server[2]);

				if (this_server[1] < ram) {
					if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
						ns.scriptKill(myserver, sorted_servers[i]);
						if (!ns.deleteServer(sorted_servers[i])) {
							ns.print("failed to delete " + sorted_servers[i]);
							return;
						}
						//ns.print("purchasing " + hn + (parseInt(ram) * 2) + "-" + this_server[2]);
						let new_server = ns.purchaseServer(hn + ram + "-" + this_server[2], ram);
						if (new_server == "") {
							keep_going = false;
							break;
						} else {
							await move_script(new_server, this_server[2]);
							if (ns.args[0] == "-c") {
								cycles--;
								if (cycles == 0) {
									ns.print(ns.args[1] + " cycles completed");
									return;
								}
							}
						}
					} else {
						// ns.print('home: ' + ns.getServerMoneyAvailable("home"));
						// ns.print(ram + '_cost: ' + ns.getPurchasedServerCost(ram));
						keep_going = false;
						break;
					};

				} else {
					if (sorted_servers.length == parseInt(i) + 1) {
						ram = parseInt(ram) * 2;
						break;
					}
				}
			}
		} else {
			ns.print("purchasing " + hn + ram + "-" + sn);
			let new_server = ns.purchaseServer(hn + ram + "-" + sn, ram);
			if (new_server == "") {
				keep_going = false;
			} else {
				await move_script(new_server, sn);
				if (ns.args[0] == "-c") {
					cycles--;
					if (cycles == 0) {
						ns.print(ns.args[1] + " cycles completed");
						return;
					}
				}
				sn++;
			}
		}

		if (!keep_going) {
			await ns.sleep(60000);
		} else {
			//await ns.sleep(500);
		}
	}

	if (ram > 1048576) {
		var final_servers = ns.getPurchasedServers();
		for (var server_final in final_servers) {
			await move_script(final_servers[server_final]);
		}
	}

	async function move_script(server_name) {
		await ns.scp(myserver, server_name);
		ns.scriptKill(myserver, server_name);
		const money_servers = JSON.parse(ns.args[0]);
		var threads = Math.floor(ns.getServerMaxRam(server_name) / ns.getScriptRam(myserver, server_name) / money_servers.length);
		//ns.print(server_name + ': maxram=' + ns.getServerMaxRam(server_name) + ' scriptram=' + ns.getScriptRam(myserver, server_name) + ' length=' + money_servers.length + ' threads=' + threads);
		//ns.exec(myserver, server_name, threads > 0 ? threads : 1, servers_all[servers_all.length - parseInt(target_server)] || servers_all[servers_all.length - 1]);
		for (var server_i in money_servers) {
			ns.exec(myserver, server_name, threads > 0 ? threads : 1, money_servers[server_i]);
		}
	}
}

/*
for (var server_i in money_servers) {
					ns.exec("post-refresh-home.js", "home", scripts > 0 ? scripts : 1, money_servers[server_i]);
				}
*/