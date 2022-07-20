/** @param {NS} ns */
export async function main(ns) {

	var wordy_logs = ["disableLog",
		"sleep",
		"getServerSecurityLevel",
		"getServerMoneyAvailable"
	];
	for (var log_name in wordy_logs) ns.disableLog(wordy_logs[log_name]);

	// Defines the "target server", which is the server
	// that we're going to hack. In this case, it's "n00dles"
	var target = ns.args[0] || ns.getHostname();

	// Defines how much money a server should have before we hack it
	// In this case, it is set to 75% of the server's max money
	var moneyThresh = ns.getServerMaxMoney(target) * 0.75;

	// Defines the maximum security level the target server can
	// have. If the target's security level is higher than this,
	// we'll weaken it before doing anything else
	var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

	// Infinite loop that continously hacks/grows/weakens the target server
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		/*} else if (ns.getServerMoneyAvailable(target) == 0) {
			if (ns.getServerSecurityLevel("home") > ns.getServerMinSecurityLevel("home") + 5) await ns.weaken("home");
			else await ns.hack("home");*/
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target, 1);
		} else {
			// Otherwise, hack it
			// await ns.hack(target);
		}
		await ns.sleep(500);
	}
}