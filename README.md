# 代理 APP 规则 · 插件 · 模块

**一套分流规则，全平台代理 APP 通用。** 分组默认、去广告、网速优化全部预置好——按你的 APP 挑一份文件导入，再导入你自己的节点订阅，就能用。不用懂规则语法，不用自己拼配置。

![覆盖 APP](https://img.shields.io/badge/覆盖_APP-18-blue) ![家族](https://img.shields.io/badge/家族-7-green) ![规则来源](https://img.shields.io/badge/规则来源-官方_+_知名维护源-orange)

> 本仓库只提供**配置文件**，不提供任何节点、订阅或账号。节点请用你自己的订阅。

## ⭐ FlClash 永久链接（站长主入口）

```
https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/FlClash_override.js
```

FlClash →「覆写」→「通过 URL 导入」粘贴上面这条即可。脚本有新版时，在覆写页对它点一次**「通过URL重新获取」**——链接永远不变，不用换。

## 🚀 快速开始（三步）

1. 在下面**全家总表**里找到你用的 APP，复制它的一键链接。
2. 打开 APP，用「从 URL 导入配置 / 覆写」粘贴链接导入（每个家族文件夹的 README 里有点击级步骤）。
3. 先导入**你自己的节点订阅**，再把这份配置**点选启用**——导入了不点选等于没生效，这是最容易漏的一步。

## 📦 全家总表（平台 / APP / 文件 / 一键链接）

链接都是 jsDelivr 国内镜像（gcore），手机直连可达；把 `gcore.jsdelivr.net` 换成 `cdn.jsdelivr.net`，或改用 GitHub 原始地址（`raw.githubusercontent.com/YiMing918/proxy-app-rules/main/...`），效果一样。

### 安卓

| APP | 用哪个文件 | 一键链接 | 详细说明 |
|---|---|---|---|
| FlClash | mihomo/FlClash_override.js（覆写脚本） | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/FlClash_override.js | [mihomo/README.md](mihomo/README.md) |
| Clash Meta for Android | mihomo/mihomo-universal.yaml | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/mihomo-universal.yaml | [mihomo/README.md](mihomo/README.md) |
| Surfboard | surge/Surge.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/surge/Surge.conf | [surge/README.md](surge/README.md) |
| Karing | sing-box/sing-box-config.json | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/sing-box/sing-box-config.json | [sing-box/README.md](sing-box/README.md) |
| Hiddify | sing-box/sing-box-config.json | 同上 | [sing-box/README.md](sing-box/README.md) |
| NekoBox | sing-box/sing-box-config.json | 同上 | [sing-box/README.md](sing-box/README.md) |
| v2rayNG | xray/v2rayNG-V2rayN-routing.json | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/xray/v2rayNG-V2rayN-routing.json | [xray/README.md](xray/README.md) |

### 苹果（iOS / iPadOS）

| APP | 用哪个文件 | 一键链接 | 详细说明 |
|---|---|---|---|
| Shadowrocket（小火箭） | shadowrocket/Shadowrocket.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/shadowrocket/Shadowrocket.conf | [shadowrocket/README.md](shadowrocket/README.md) |
| Loon | loon/Loon.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/loon/Loon.conf | [loon/README.md](loon/README.md) |
| Quantumult X（圈 X） | quantumultx/QuantumultX.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/quantumultx/QuantumultX.conf | [quantumultx/README.md](quantumultx/README.md) |
| Surge | surge/Surge.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/surge/Surge.conf | [surge/README.md](surge/README.md) |
| Stash | mihomo/mihomo-universal.yaml | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/mihomo-universal.yaml | [mihomo/README.md](mihomo/README.md) |
| Streisand | sing-box/sing-box-config.json | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/sing-box/sing-box-config.json | [sing-box/README.md](sing-box/README.md) |
| FoXray | xray/xray-routing.json（路由段，需拼完整配置） | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/xray/xray-routing.json | [xray/README.md](xray/README.md) |
| Karing / Hiddify | sing-box/sing-box-config.json | 同 Streisand | [sing-box/README.md](sing-box/README.md) |

### 电脑

| APP | 用哪个文件 | 一键链接 | 详细说明 |
|---|---|---|---|
| Clash Verge Rev | mihomo/mihomo-universal.yaml | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/mihomo-universal.yaml | [mihomo/README.md](mihomo/README.md) |
| Mihomo Party | mihomo/mihomo-universal.yaml | 同上 | [mihomo/README.md](mihomo/README.md) |
| V2rayN | xray/v2rayNG-V2rayN-routing.json | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/xray/v2rayNG-V2rayN-routing.json | [xray/README.md](xray/README.md) |
| Karing / Hiddify | sing-box/sing-box-config.json | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/sing-box/sing-box-config.json | [sing-box/README.md](sing-box/README.md) |
| Surge（Mac） | surge/Surge.conf | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/surge/Surge.conf | [surge/README.md](surge/README.md) |

### 软路由

| APP | 用哪个文件 | 一键链接 | 详细说明 |
|---|---|---|---|
| OpenClash | mihomo/mihomo-universal.yaml | https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/mihomo/mihomo-universal.yaml | [mihomo/README.md](mihomo/README.md) |

老版 v2rayNG 还有一份三栏粘贴版：`xray/v2rayNG-custom-rules.txt`（链接：https://gcore.jsdelivr.net/gh/YiMing918/proxy-app-rules@main/xray/v2rayNG-custom-rules.txt ）。

## 📁 文件夹地图

| 文件夹 | 是什么 |
|---|---|
| [mihomo/](mihomo/README.md) | FlClash 覆写脚本（永久链接）+ mihomo 通用 YAML，Clash 系全家共用 |
| [sing-box/](sing-box/README.md) | sing-box 一份 JSON 通吃 SFA / Karing / Hiddify / NekoBox / Streisand |
| [surge/](surge/README.md) | Surge 配置，Surfboard 可直接导入 |
| [shadowrocket/](shadowrocket/README.md) | 小火箭完整配置 |
| [loon/](loon/README.md) | Loon 完整配置（预置秋风去广告插件） |
| [quantumultx/](quantumultx/README.md) | 圈 X 完整配置（预置去广告分流 + 重写） |
| [xray/](xray/README.md) | v2rayNG / V2rayN 路由 + Xray 原生路由段 |

## 📏 两条硬规矩（全套统一）

**规矩一：默认地区没节点，会自动顺位，不会让组空着。**
每个用途组的第一顺位只是「默认」，不是唯一。比如 YouTube 默认香港，但你的订阅里一个香港节点都没有时，组不会失效——它默认走一条「顺位兜底链」：香港 → 日本 → 新加坡 → 美国 → 台湾 → 韩国 → 其余各地区 → 自动选择（压尾）。链上哪个地区有节点就用哪个，只要订阅里还有任何节点，这个组就有得用。其他用途组同理：先走自己的偏好地区（AI 美国打头、流媒体 新加坡→美国），再按统一顺序补位，最后压自动选择。
**但这只是默认行为，没有锁死**：点开任何用途组，所有地区组都列全了，随时能自己改选任何地区组或具体节点，改完立即生效。

**规矩二：家宽节点只许手动，绝不自动。**
名字里带「家宽 / 住宅 / 家庭宽带 / Residential」的节点，只出现在「🏠 家宽节点」这一个组里（纯手动选）。所有自动组——自动选择、故障转移、负载均衡、每一个地区组——都把它们剔干净了。原因：免费家宽上一秒能用、下一秒超时，混进自动组会把测速和自动切换全带乱。需要家宽时自己去家宽组里点开用。

> 两条规矩在各家族的落地程度不一样（有的家族机制上做不到满格），差异如实写在下面「各家族出入」和各家族 README 里，不假装等效。FlClash 覆写脚本已升 v3.5，两条规矩全部对齐（顺位链作默认第一位、家宽只在手动组）；mihomo 通用 YAML 同样已按新规矩落地。

## 🎛️ 分组默认总表（全套统一，源头是 FlClash v3.5）

| 分组 | 默认走哪条线 | 说明 |
|---|---|---|
| 🚀 节点选择 | ♻️ 自动选择 | 总开关，平时不用动 |
| 🤖 AI服务 | 🇺🇸 美国 | ChatGPT、Claude 等 |
| 📺 YouTube | 🇭🇰 香港 | |
| 🔍 Google服务 | 🇭🇰 香港 | |
| 🔔 FCM推送 | 🛡️ 故障转移 | 安卓推送通道，坏了自动换下一个 |
| ✈️ Telegram | 🇸🇬 新加坡 | |
| 🎬 流媒体 | 🇸🇬 新加坡 | Netflix、Disney+、HBO、Spotify、Emby |
| 🎮 游戏平台 | 🇯🇵 日本 | Steam 等（Steam 下载本身直连） |
| 🐙 GitHub | ♻️ 自动选择 | |
| 📱 社交媒体 | 🇸🇬 新加坡 | X、Facebook、Instagram、TikTok |
| 💰 支付平台 | 🇺🇸 美国 | PayPal 等（以账号注册地为准） |
| ₿ 加密货币 | 🇸🇬 新加坡 | |
| ⏩ 测速 | 直连 | 测速网站不走代理，结果才准 |
| 📺 哔哩哔哩 | 直连 | |
| 🍎 苹果服务 | 直连 | |
| Ⓜ️ 微软服务 | 直连 | |
| 🖥️ 远控工具 | 直连 | TeamViewer、AnyDesk、ToDesk |
| 🛑 广告拦截 / 🍃 应用净化 | 拒绝（REJECT） | 想临时放行广告就把分组改成 DIRECT |
| 🐟 漏网之鱼 | 跟「🚀 节点选择」一样 | 没被任何规则认领的流量 |

测速节奏全套统一：**间隔 600 秒、懒测速（只测在用的组）、容差 50 毫秒**——这是省订阅额度的设计（全主动测速一天能烧掉自建节点的大半免费额度），不要改小间隔。

## ⚖️ 各家族出入（如实说明）

| 家族 | 规矩一（顺位兜底） | 规矩二（家宽手动） | 其他主要出入 |
|---|---|---|---|
| FlClash 覆写脚本 v3.5 | ✅ fallback 顺位链作默认第一位，组内仍可手动任选 | ✅ 家宽只在 🏠 家宽节点与 👋 手动选择两个手动组 | 地区识别最全；倍率按节点名数字精确算 |
| mihomo 通用 YAML | ✅ fallback 顺位链 | ✅ 全部自动组剔除家宽 | 与 JS 的差别：倍率靠正则近似 |
| sing-box | ⚠️ 半自动：默认组排第一顺位，但某组为空时选择器不会自己跳，要手动切一次 | ✅ 家宽不进任何自动组 | 不按节点名分地区：每地区组要把占位节点换成你的真实节点（见家族 README） |
| Surge / Surfboard | ✅ fallback 顺位链 | ✅ | Surfboard 不支持模块/脚本，个别 Surge 参数会被忽略 |
| Shadowrocket | ✅ fallback 顺位链 | ✅ | 地区组不能在组内逐个挑节点（语法限制），去手动选择里挑 |
| Loon | ✅ fallback 顺位链 | ✅ | DNS 不按国内外分流（统一国内加密 DNS） |
| Quantumult X | ✅ available 顺位链 | ✅ | 故障转移没有检查间隔参数（连接失败即时顺延） |
| Xray（v2rayNG 等） | ❌ 没有「组」的概念：所有走代理的服务共用你当前选中的一个节点 | ➖ 天然满足（没有任何自动组），但也没有家宽分组 | 按服务分地区、自动测速、故障转移这三样机制上做不到；直连类与广告类与全套一致 |

## 🔄 更新与维护

- 配置里引用的规则集（分流/去广告）都是**远程引用**：APP 会按配置里写的周期（一般每天）自己去来源站拉新，不用你管。
- 本仓库的文件有更新时：在 APP 里对这份配置点一次「更新 / 重新导入」即可；FlClash 覆写脚本点一次「通过URL重新获取」。
- 本仓库的每份配置都经过对应内核或结构校验才发布（mihomo / sing-box / Xray 官方内核实测，其余做分组引用闭环核对）。

## 📚 规则来源与致谢

规则版权归各原作者，本仓库只是把它们按统一分组编排进各 APP 的配置。

| 来源 | 用在哪 | 最近更新（2026-11-21 核查） |
|---|---|---|
| [ACL4SSR](https://github.com/ACL4SSR/ACL4SSR) | mihomo 家族去广告四件套 | 2026-11（持续更新） |
| [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) | Surge / 小火箭 / Loon / 圈 X 的分流规则与分应用脚本 | 2026-10（持续更新） |
| [SagerNet sing-geosite / sing-geoip](https://github.com/SagerNet/sing-geosite) | sing-box 官方规则集 | sing-box 官方组织维护 |
| [TG-Twilight/AWAvenue-Ads-Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule)（秋风去广告） | 全家族的广告补强层 | 2026-11（持续更新） |
| [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community) | Xray 家族的 geosite 分类 | 2026-11（持续更新） |
| [Loyalsoldier/geoip](https://github.com/Loyalsoldier/geoip) | Loon 的 GeoIP 数据库 | 长期维护的社区源 |

## ⚠️ 安全提醒

- 插件、模块、重写是**别人写的代码**，装了能改你 APP 里的内容。本仓库只列长期维护的知名源（见各家族 README 的清单），**别装来路不明的插件/模块**。
- 本仓库所有配置都**不用装证书**就能用核心功能（分流 + 域名去广告）；只有装「改内容」的重写类插件时才需要装证书，装不装自己决定。
- 配置里不会有任何节点、账号或密钥；你的订阅链接只填在你自己的 APP 里，别发给别人。

## 免责

本仓库仅为个人自用的配置整理，不提供任何代理服务、节点或订阅，不保证适用于所有网络环境；使用第三方规则/插件的风险由使用者自行承担。
