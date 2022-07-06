// buy the cheapest upgrade/purchase node until money runs out

var keep_going = true;

while (keep_going) {
	var node_total = hacknet.numNodes();
	var current_cost = hacknet.getPurchaseNodeCost();
	var purchase = { "node": -1, "item": "" };

	for (var i = 0; i < node_total; ++i) {
		if (hacknet.getLevelUpgradeCost(i) < current_cost) {
			current_cost = hacknet.getLevelUpgradeCost(i);
			purchase.node = i;
			purchase.item = "level";
		}
		if (hacknet.getRamUpgradeCost(i) < current_cost) {
			current_cost = hacknet.getRamUpgradeCost(i);
			purchase.node = i;
			purchase.item = "ram";
		}
		if (hacknet.getCoreUpgradeCost(i) < current_cost) {
			current_cost = hacknet.getCoreUpgradeCost(i);
			purchase.node = i;
			purchase.item = "core";
		}
	}

	if (purchase.node == -1) {
		if (!hacknet.purchaseNode()) keep_going = false;
	} else {
		if (purchase.item == "level") {
			if (!hacknet.upgradeLevel(purchase.node, 1)) keep_going = false;
		} else if (purchase.item == "ram"){
			if (!hacknet.upgradeRam(purchase.node, 1)) keep_going = false;
		} else if (purchase.item == "core"){
			if (!hacknet.upgradeCore(purchase.node, 1)) keep_going = false;
		}
	}
}