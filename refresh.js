// Script variables
var script_name = "early.script";
var script_ram = getScriptRam(script_name);

// Array of all servers that don't need any ports opened
// to gain root access. These have 16 GB of RAM
var servers0Port = ["n00dles",
                    "foodnstuff",
                    "sigma-cosmetics",
                    "joesguns",
                    "nectar-net",
                    "hong-fang-tea",
                    "harakiri-sushi"];

// Array of all servers that only need 1 port opened
// to gain root access. These have 32 GB of RAM
var servers1Port = ["neo-net",
                    "zer0",
                    "max-hardware",
                    "iron-gym"];

// Array of all servers that need 2 ports opened
var servers2Port = ["silver-helix",
                    "phantasy",
                    "omega-net"];

var moneyless_servers = ["home",
                         "CSEC",
                         "avmnite-02h"];

// Copy our scripts onto each server that requires 0 ports
// to gain root access. Then use nuke() to gain admin access and
// run the scripts.
for (var i in servers0Port) {
    var serv = servers0Port[i];

    scp(script_name, serv);
    nuke(serv);
    exec(script_name, serv, Math.floor(getServerMaxRam(serv) / script_ram));
}

// Wait until we acquire the "BruteSSH.exe" program
while (!fileExists("BruteSSH.exe")) {
    sleep(60000);
}

// Copy our scripts onto each server that requires 1 port
// to gain root access. Then use brutessh() and nuke()
// to gain admin access and run the scripts.
for (var i in servers1Port) {
    var serv = servers1Port[i];

    scp(script_name, serv);
    brutessh(serv);
    nuke(serv);
    exec(script_name, serv, Math.floor(getServerMaxRam(serv) / script_ram));
}

// Wait until we acquire the "BruteSSH.exe" program
while (!fileExists("FTPCrack.exe")) {
    sleep(60000);
}

// Copy our scripts onto each server that requires 1 port
// to gain root access. Then use brutessh() and nuke()
// to gain admin access and run the scripts.
for (var i in servers2Port) {
    var serv = servers2Port[i];

    scp(script_name, serv);
    brutessh(serv);
    ftpcrack(serv);
    nuke(serv);
    exec(script_name, serv, Math.floor(getServerMaxRam(serv) / script_ram));
}

for (var i in moneyless_servers){
    var serv = moneyless_servers[i];
    
    scp("post-refresh.script", serv);
    brutessh(serv);
    ftpcrack(serv);
    nuke(serv);
    if (moneyless_servers[i] == "home") exec("post-refresh.script", moneyless_servers[i], (Math.floor(getServerMaxRam(moneyless_servers[i]) - getScriptRam("refresh.script")) / getScriptRam("post-refresh.script")));
    else exec("post-refresh.script", moneyless_servers[i], Math.floor(getServerMaxRam(moneyless_servers[i]) / getScriptRam("post-refresh.script")));
}