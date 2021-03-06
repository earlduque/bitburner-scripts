# bitburner-scripts

Just my script files for [BitBurner](https://store.steampowered.com/app/1812820/Bitburner/).

- [refresh.js](/refresh.js) is the starting point
  - it nukes then copies [early.script](/early.script) to all listed servers
  - and then runs [post-refresh.script](/post-refresh.script) on all moneyless servers and targets high earners (wip)
  - and then runs [post-refresh-home.js](/post-refresh-home.js) which targets all money servers evenly distributing the remaining threads.
  - `run refresh.js 1` will also start [hacknet.js](/hacknet.js)
  - `run refresh.js 2` will also start [createservers.js](/createservers.js)
  - `run refresh.js 3` will start both
  - `run refresh.js ls` will not run the actionable steps and simply log the found servers
- [hacknet.script](/hacknet.script) buys the cheapest hacknet upgrades/purchase nodes until money runs out. This goes slow enough though that it should never end.
- [hacknet.js](/hacknet.js) is the same as above but runs in Netscript 2.0 so it's an instant max out then sleeps for 60 seconds.
- [createservers.js](/createservers.js) purchases the smallest servers possible (2gb ram), moves the [myservers.js](/myservers.js) script to them and executes attacks against a money server. It continues to do this until you reach the maximum servers allowed, then begins to delete servers in favor for the next ram level (4gb, 8gb, 16gb, 32gb, etc.).
  - `run createservers.js delete` will delete all servers
  - `run createservers.js delete "server-name"` will delete the specific server
  - `run createservers.js -c int` will run for the designated number of cycles before stopping

Aliases I use:

- alias buyOpeners=buy bruteSSH.exe ; buy FTPcrack.exe ; buy relaySMTP.exe ; buy HTTPworm.exe ; buy SQLinject.exe
alias fullbackdoor=run BruteSSH.exe ; run FTPCrack.exe ; run relaySMTP.exe ; run HTTPWorm.exe ; run SQLInject.exe ; run NUKE.exe ; backdoor
- alias back1=home ; connect n00dles ; connect CSEC ; run BruteSSH.exe ; run FTPCrack.exe ; run relaySMTP.exe ; run HTTPWorm.exe ; run SQLInject.exe ; run NUKE.exe ; backdoor ; home ;
- alias back2=home ; connect sigma-cosmetics ; connect nectar-net ; connect neo-net ; connect avmnite-02h ; run BruteSSH.exe ; run FTPCrack.exe ; run relaySMTP.exe ; run HTTPWorm.exe ; run SQLInject.exe ; run NUKE.exe ; backdoor ; home ;
- alias back3=home ; connect harakiri-sushi ; connect max-hardware ; connect omega-net ; connect netlink ; connect I.I.I.I ; run BruteSSH.exe ; run FTPCrack.exe ; run relaySMTP.exe ; run HTTPWorm.exe ; run SQLInject.exe ; run NUKE.exe ; backdoor ; home ;
- alias back4=home ; connect sigma-cosmetics ; connect nectar-net ; connect neo-net ; connect the-hub ; connect syscore ; connect millenium-fitness ; connect aerocorp ; connect deltaone ; connect zeus-med; connect taiyang-digital ; connect run4theh111z ; run BruteSSH.exe ; run FTPCrack.exe ; run relaySMTP.exe ; run HTTPWorm.exe ; run SQLInject.exe ; run NUKE.exe ; backdoor; home ;
- alias buyall=buy bruteSSH.exe ; buy FTPcrack.exe ; buy relaySMTP.exe ; buy HTTPworm.exe ; buy SQLinject.exe ; buy ServerProfiler.exe ; buy DeepscanV1.exe ; buy DeepscanV2.exe ; buy AutoLink.exe ; buy Formulas.exe ;
- global alias refresh=run refresh.js

I'm trying to not use any scripts from the community and make them on my own using only the docs
