/** @param {NS} ns */
export async function main(ns) {
	ns.print("Start");
	/// buy the cheapest upgrade/purchase node until money runs out
	// .script version runs slowly so this is actually a viable "keep running forever in background
	// .js runs almost instantly if you want to max out immediately

	var keep_going = true;

	while (true) {
		var node_total = ns.hacknet.numNodes();
		var current_cost = ns.hacknet.getPurchaseNodeCost();
		var purchase = { "node": -1, "item": "" };

		for (var i = 0; i < node_total; ++i) {
			if (ns.hacknet.getLevelUpgradeCost(i) < current_cost) {
				current_cost = ns.hacknet.getLevelUpgradeCost(i);
				purchase.node = i;
				purchase.item = "level";
			}
			if (ns.hacknet.getRamUpgradeCost(i) < current_cost) {
				current_cost = ns.hacknet.getRamUpgradeCost(i);
				purchase.node = i;
				purchase.item = "ram";
			}
			if (ns.hacknet.getCoreUpgradeCost(i) < current_cost) {
				current_cost = ns.hacknet.getCoreUpgradeCost(i);
				purchase.node = i;
				purchase.item = "core";
			}
		}

		ns.print("Purchasing: " + purchase.node + '-' + purchase.item);
		if (purchase.node == -1) {
			if (ns.hacknet.purchaseNode() == -1) keep_going = false;
		} else {
			if (purchase.item == "level") {
				if (!ns.hacknet.upgradeLevel(purchase.node, 1)) keep_going = false;
			} else if (purchase.item == "ram") {
				if (!ns.hacknet.upgradeRam(purchase.node, 1)) keep_going = false;
			} else if (purchase.item == "core") {
				if (!ns.hacknet.upgradeCore(purchase.node, 1)) keep_going = false;
			}
		}
		if (!keep_going) {
			await ns.sleep(60000);
			keep_going = true;
		} else await ns.sleep(500);
	}
	ns.print("End");
}