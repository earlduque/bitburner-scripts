# bitburner-scripts

Just my script files for [BitBurner](https://store.steampowered.com/app/1812820/Bitburner/).

- [refresh.js](/refresh.js) is the starting point
  - it nukes then copies [early.script](/early.script) to all listed servers
  - and then runs [post-refresh.script](/post-refresh.script) on all moneyless servers
- [hacknet.script](/hacknet.script) buys the cheapest hacknet upgrades/purchase nodes until money runs out. This goes slow enough though that it should never end.
- [hacknet.js](/hacknet.js) is the same as above but runs in Netscript 2.0 so it's an instant max out then sleeps for 60 seconds.

I'm trying to not use any scripts from the community and make them on my own using only the docs
