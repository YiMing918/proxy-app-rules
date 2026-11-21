# 代理 APP 规则 · 插件 · 模块

全网主流代理 APP 的分流规则包：分组默认值全家统一（照 FlClash 覆写脚本 v3.4 那一套），自带去广告、网速优化、常用的插件 / 模块 / 重写清单，每个 APP 都配了点击级的新手用法说明。

## FlClash 覆写脚本（永久链接）

```
https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/FlClash_override.js
```

在 FlClash 里用这个链接导入覆写，链接永远不变；以后脚本升级还是这个地址，在 APP 里点一次「通过URL重新获取」就是新版。

## 全套规则包总索引

👉 [proxy_clients_rules/README.md](proxy_clients_rules/README.md)

覆盖 18 个 APP：

- 苹果：Shadowrocket（小火箭）、Loon、Quantumult X（圈 X）、Surge、Stash、Streisand、FoXray
- 安卓：FlClash、ClashMeta、Surfboard、sing-box 官方端、Karing、Hiddify、v2rayNG
- 电脑：Clash Verge Rev、Mihomo Party、V2rayN
- 路由器：OpenClash

两条全家通用的规矩：

1. **默认地区有顺位后备链**：比如 YouTube 默认走香港，订阅里没有香港节点就自动顺位日本、新加坡、美国……组永远不会空；同时每个组都能手动改选，默认不锁死。
2. **家宽节点只许手动**：名字带「家宽 / 住宅」的节点不进任何自动组、不参加测速，只放在专门的手动组里，需要时自己点开用。
