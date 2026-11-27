// FlClash 覆写脚本 - qi 全功能版 v3.7 (省额度版, 基于 v3.6 改)
// v3.7: 只修地区识别的一个老毛病, 分组/规则/DNS/测速节奏与 v3.6 完全一致。
//       三字母机场代码(FRA/HKG/SFO 等)以前是裸子串匹配: "San Francisco"
//       开头的 FRA 会把它撞进德国组, 又进不了美国组和"其他"组。全家族
//       (mihomo YAML/Surge/Loon/QuantumultX/Shadowrocket 同步)给三字母
//       代码统一加上与两字母代码同款的边界 (^|[^A-Za-z])CODE([^A-Za-z]|$);
//       美国组补 San Francisco/旧金山/迈阿密/亚特兰大/华盛顿, 印度补
//       Delhi, 越南补 Hanoi, 日本补 Fukuoka——这几个城市名以前靠代码
//       子串命中, 加边界后改靠城市名命中, 不回退。
// v3.6: 只改测速的两处毛病, 分组/规则/DNS/测速节奏与 v3.5 完全一致。
//       ①测速地址 cp.cloudflare.com -> www.gstatic.com/generate_204:
//         同一订阅在 v2rayNG 里大半节点能测出延迟, 在 FlClash 里却全超时
//         但实际能用——原测速地址经很多节点根本测不通, 误判成节点全死。
//       ②测速超时 3000 -> 5000 毫秒: 节点一多批量测速时 3 秒太紧,
//         好节点也被挤成超时。改完重新测速, 延迟数字才作数。
// v3.5: 落实两条硬规矩。①顺位兜底链: 带地区默认的精细分流组(AI/YouTube/Google/
//       Telegram/流媒体/游戏/社交/支付/加密货币)第一位改走「·顺位」故障转移链——
//       默认地区没节点时自动顺位落到下一个地区, 链尾压「♻️ 自动选择」, 组永不为空;
//       链只是默认、不是锁: 每个组里仍列全所有地区与分组, 随时可手动改选任何地区/节点。
//       ②家宽只许手动: 名字带家宽/住宅的节点从全部自动组剔除(自动选择/故障转移/
//       负载均衡/各地区自动组/低倍率与优选IP的自动组), 地区手动组里也不再直接列
//       家宽节点; 家宽只在「🏠 家宽节点」组和「👋 手动选择」里手动选。全部节点
//       都是家宽时, 自动组成员改压「🏠 家宽节点」组(订阅里没家宽才退「👋 手动选择」),
//       绝不以 DIRECT 作默认出口, 保证配置不因空组被内核拒绝加载。
//       其余(各组默认地区/测速节奏/规则/DNS/dialer-proxy 处理)与 v3.4 完全一致。
// v3.4: 每个精细分流组的第一位(默认选择)按全网主流推荐地区预置好, 用户需要时自己改:
//       AI=美国(机主指定) / YouTube=香港 / Google=香港 / FCM=故障转移(固定不跳)
//       Telegram=新加坡 / 流媒体=新加坡 / 游戏=日本 / 社交媒体=新加坡
//       支付=美国 / 加密货币=新加坡 / 测速=直连; 另新增「⭐ 优选IP」组:
//       名字里带"优选IP"的节点单独成组(自带自动测速), 各分流组里都能选到它。
//       其余(分组构成/规则/DNS/测速节奏)与 v3.3 完全一致。
// v3.3: 分流规则/分组/节点与 v3.2 完全一致, 只改测速节奏省 Cloudflare 额度:
//       所有自动组间隔 180 秒 -> 600 秒, 并打开懒测 (lazy: true, 只测正在用的组);
//       v3.2 的全主动测速一天能打近 20 万次连接, 会烧光自建节点账号 10 万次/天的免费额度。
// v3.2: 用户不介意费电/费流量, 测速改全主动: 所有自动组每 180 秒测一轮且不懒测,
//       全局自动选择容差 80->50, 选优更跟手; 故障转移/负载均衡同步改 180 秒主动检测。
// v3.1 修复: 保留被节点 dialer-proxy 引用的原始分组(如 ⚡ CF前置 链式前置组),
//           否则家宽等链式节点找不到前置, 内核校验失败导致整个配置无法启动。
// 参考全网主流方案(MyClash / HiClash / ACL4SSR / MetaCubeX)整合:
// 地区分组(通用识别, 换任何订阅可用) + 每地区自动选择 + 故障转移 + 负载均衡
// + 倍率分组(低倍率/高倍率) + 家宽单独成组(只许手动, 自动组全剔除) + 精细分流组
// + 四层去广告(ACL4SSR BanAD/BanProgramAD/BanEasyList + 内置广告分类, 带 UnBan 防误杀)
// + fake-ip 兼容名单(游戏联机/语音通话/时间同步不被假IP弄坏)
// + 冷启动优化(记住选择和 fake-ip 映射) + DNS 分流防污染
// 注意: url-test 测的是响应延迟不是下载带宽, 已做容差优化防乱跳; 真实网速偶尔手测确认。

function main(config) {
  if (!config || !Array.isArray(config.proxies) || config.proxies.length === 0) {
    return config;
  }

  var allNames = config.proxies.map(function (p) { return p && p.name; }).filter(Boolean);

  // 只过滤明显不是节点的信息条目, 其余全保留(包括家宽/住宅)
  var excludeRe = /(剩余流量|流量剩余|距离下次重置|到期|过期|官网|请更新订阅|更新订阅)/i;
  var usable = allNames.filter(function (n) { return !excludeRe.test(n); });
  var pool = usable.length > 0 ? usable : allNames;

  // ---------- v3.5 规矩二: 家宽/住宅只许手动 ----------
  // autoPool 是剔除家宽后的池子: 一切自动组(自动选择/故障转移/负载均衡/
  // 各地区自动组/倍率与优选IP的自动组)只准用它; 家宽节点只进
  // 「🏠 家宽节点」和「👋 手动选择」两个纯手动组。
  var homeRe = /(家宽|住宅|家庭宽带|residential)/i;
  function isHome(n) { return homeRe.test(n); }
  var autoPool = pool.filter(function (n) { return !isHome(n); });
  // 全部节点都是家宽时 autoPool 为空: 自动组成员改压「🏠 家宽节点」组
  // (全家宽订阅正是站长的真实场景; 若订阅里连家宽节点也没有, 才退
  // 「👋 手动选择」)。绝不以 DIRECT 作默认出口: mihomo 里 DIRECT 不是
  // inert 占位, 而是真的会承载流量的出口, 支付/加密货币等敏感流量会
  // 从真实 IP 直连目标站点。家宽组是纯手动 select 组, 经它出流量仍由
  // 用户在该组里手动选节点, 只是不再让自动链静默直连。
  // 注: autoMembers 只定自动组(AUTO/故障转移/负载均衡)与 9 条顺位链的
  // 链尾; 家宽组本身在下面由 homeNodes 生成, 全家宽时一定存在。
  var autoMembers = autoPool.length > 0 ? autoPool : (pool.some(isHome) ? ["🏠 家宽节点"] : ["👋 手动选择"]);

  var TEST_URL = "https://www.gstatic.com/generate_204";
  function autoGroup(name, members, tolerance) {
    return {
      name: name, type: "url-test", proxies: members,
      url: TEST_URL, interval: 600, tolerance: tolerance || 50,
      lazy: true, timeout: 5000, "max-failed-times": 3
    };
  }

  // ---------- 地区分组(通用识别: 国旗/中文/英文/城市/机场代码/缩写) ----------
  var regions = [
    { label: "🇭🇰 香港",   re: /(🇭🇰|(^|[^A-Za-z])HKG([^A-Za-z]|$)|香港|Hong\s?Kong|(^|[^A-Za-z])HK([^A-Za-z]|$))/i },
    { label: "🇹🇼 台湾",   re: /(🇹🇼|(^|[^A-Za-z])TPE([^A-Za-z]|$)|(^|[^A-Za-z])KHH([^A-Za-z]|$)|台湾|臺灣|台北|臺北|高雄|新北|桃园|Taiwan|(^|[^A-Za-z])TW([^A-Za-z]|$))/i },
    { label: "🇯🇵 日本",   re: /(🇯🇵|(^|[^A-Za-z])NRT([^A-Za-z]|$)|(^|[^A-Za-z])HND([^A-Za-z]|$)|(^|[^A-Za-z])KIX([^A-Za-z]|$)|(^|[^A-Za-z])NGO([^A-Za-z]|$)|(^|[^A-Za-z])FUK([^A-Za-z]|$)|日本|东京|東京|大阪|名古屋|福冈|Japan|Tokyo|Osaka|Fukuoka|(^|[^A-Za-z])JP([^A-Za-z]|$))/i },
    { label: "🇰🇷 韩国",   re: /(🇰🇷|(^|[^A-Za-z])ICN([^A-Za-z]|$)|(^|[^A-Za-z])GMP([^A-Za-z]|$)|韩国|韓國|首尔|首爾|釜山|Korea|Seoul|(^|[^A-Za-z])KR([^A-Za-z]|$))/i },
    { label: "🇸🇬 新加坡", re: /(🇸🇬|(^|[^A-Za-z])SIN([^A-Za-z]|$)|新加坡|狮城|獅城|Singapore|(^|[^A-Za-z])SG([^A-Za-z]|$))/i },
    { label: "🇲🇾 马来西亚", re: /(🇲🇾|(^|[^A-Za-z])KUL([^A-Za-z]|$)|马来西亚|馬來西亞|吉隆坡|Malaysia|Kuala\s?Lumpur|(^|[^A-Za-z])MY([^A-Za-z]|$))/i },
    { label: "🇹🇭 泰国",   re: /(🇹🇭|(^|[^A-Za-z])BKK([^A-Za-z]|$)|(^|[^A-Za-z])DMK([^A-Za-z]|$)|泰国|泰國|曼谷|Thailand|Bangkok|(^|[^A-Za-z])TH([^A-Za-z]|$))/i },
    { label: "🇻🇳 越南",   re: /(🇻🇳|(^|[^A-Za-z])SGN([^A-Za-z]|$)|(^|[^A-Za-z])HAN([^A-Za-z]|$)|越南|胡志明|河内|河內|Vietnam|Hanoi|(^|[^A-Za-z])VN([^A-Za-z]|$))/i },
    { label: "🇮🇩 印尼",   re: /(🇮🇩|(^|[^A-Za-z])CGK([^A-Za-z]|$)|印尼|印度尼西亚|雅加达|Indonesia|Jakarta|(^|[^A-Za-z])ID([^A-Za-z]|$))/i },
    { label: "🇵🇭 菲律宾", re: /(🇵🇭|(^|[^A-Za-z])MNL([^A-Za-z]|$)|菲律宾|菲律賓|马尼拉|Philippines|Manila|(^|[^A-Za-z])PH([^A-Za-z]|$))/i },
    { label: "🇮🇳 印度",   re: /(🇮🇳|(^|[^A-Za-z])DEL([^A-Za-z]|$)|(^|[^A-Za-z])BOM([^A-Za-z]|$)|印度|孟买|孟買|德里|India|Delhi|Mumbai|(^|[^A-Za-z])IN([^A-Za-z]|$))/i },
    { label: "🇦🇺 澳大利亚", re: /(🇦🇺|(^|[^A-Za-z])SYD([^A-Za-z]|$)|(^|[^A-Za-z])MEL([^A-Za-z]|$)|(^|[^A-Za-z])BNE([^A-Za-z]|$)|澳大利亚|澳洲|悉尼|墨尔本|墨爾本|Australia|Sydney|Melbourne|(^|[^A-Za-z])AU([^A-Za-z]|$))/i },
    { label: "🇺🇸 美国",   re: /(🇺🇸|(^|[^A-Za-z])LAX([^A-Za-z]|$)|(^|[^A-Za-z])SFO([^A-Za-z]|$)|(^|[^A-Za-z])SJC([^A-Za-z]|$)|(^|[^A-Za-z])SEA([^A-Za-z]|$)|(^|[^A-Za-z])ORD([^A-Za-z]|$)|(^|[^A-Za-z])DFW([^A-Za-z]|$)|(^|[^A-Za-z])JFK([^A-Za-z]|$)|(^|[^A-Za-z])EWR([^A-Za-z]|$)|(^|[^A-Za-z])IAD([^A-Za-z]|$)|(^|[^A-Za-z])MIA([^A-Za-z]|$)|(^|[^A-Za-z])ATL([^A-Za-z]|$)|美国|美國|旧金山|舊金山|洛杉矶|洛杉磯|纽约|紐約|硅谷|矽谷|圣何塞|聖何塞|西雅图|芝加哥|达拉斯|達拉斯|迈阿密|United\s?States|America|Francisco|Miami|Atlanta|Washington|Los\s?Angeles|New\s?York|San\s?Jose|San\s?Francisco|Seattle|Chicago|Dallas|(^|[^A-Za-z])US([^A-Za-z]|$))/i },
    { label: "🇨🇦 加拿大", re: /(🇨🇦|(^|[^A-Za-z])YYZ([^A-Za-z]|$)|(^|[^A-Za-z])YVR([^A-Za-z]|$)|加拿大|多伦多|多倫多|温哥华|溫哥華|Canada|Toronto|Vancouver|(^|[^A-Za-z])CA([^A-Za-z]|$))/i },
    { label: "🇬🇧 英国",   re: /(🇬🇧|(^|[^A-Za-z])LHR([^A-Za-z]|$)|英国|英國|伦敦|倫敦|London|United\s?Kingdom|Britain|(^|[^A-Za-z])UK([^A-Za-z]|$)|(^|[^A-Za-z])GB([^A-Za-z]|$))/i },
    { label: "🇩🇪 德国",   re: /(🇩🇪|(^|[^A-Za-z])FRA([^A-Za-z]|$)|(^|[^A-Za-z])MUC([^A-Za-z]|$)|德国|德國|法兰克福|法蘭克福|慕尼黑|Germany|Frankfurt|(^|[^A-Za-z])DE([^A-Za-z]|$))/i },
    { label: "🇫🇷 法国",   re: /(🇫🇷|(^|[^A-Za-z])CDG([^A-Za-z]|$)|(^|[^A-Za-z])ORY([^A-Za-z]|$)|法国|法國|巴黎|France|Paris|(^|[^A-Za-z])FR([^A-Za-z]|$))/i },
    { label: "🇳🇱 荷兰",   re: /(🇳🇱|(^|[^A-Za-z])AMS([^A-Za-z]|$)|荷兰|荷蘭|阿姆斯特丹|Netherlands|Amsterdam|(^|[^A-Za-z])NL([^A-Za-z]|$))/i },
    { label: "🇷🇺 俄罗斯", re: /(🇷🇺|(^|[^A-Za-z])SVO([^A-Za-z]|$)|俄罗斯|俄羅斯|莫斯科|Russia|Moscow|(^|[^A-Za-z])RU([^A-Za-z]|$))/i },
    { label: "🇹🇷 土耳其", re: /(🇹🇷|(^|[^A-Za-z])IST([^A-Za-z]|$)|土耳其|伊斯坦布尔|Turkey|Istanbul|(^|[^A-Za-z])TR([^A-Za-z]|$))/i },
    { label: "🇧🇷 巴西",   re: /(🇧🇷|(^|[^A-Za-z])GRU([^A-Za-z]|$)|巴西|圣保罗|聖保羅|Brazil|Sao\s?Paulo|(^|[^A-Za-z])BR([^A-Za-z]|$))/i }
  ];

  var assigned = {};
  var regionSelectors = [];
  var regionGroups = [];
  regions.forEach(function (r) {
    var members = autoPool.filter(function (n) {
      if (assigned[n]) return false;
      if (r.re.test(n)) { assigned[n] = true; return true; }
      return false;
    });
    if (members.length === 0) return;
    var autoName = r.label + "自动";
    regionGroups.push(autoGroup(autoName, members, 50));
    regionGroups.push({ name: r.label, type: "select", proxies: [autoName].concat(members) });
    regionSelectors.push(r.label);
  });
  // 同步点(L11): 「🌍 其他」组没有独立正则, 由上面 regions 表逐个认领后剩下
  // 的 rest 自动得到; YAML 版 mihomo-universal.yaml 里「🌍 其他自动」/「🌍 其他」
  // 的 exclude-filter 是手写巨型正则。地区表改一处, 另一处也要同步改。
  var rest = autoPool.filter(function (n) { return !assigned[n]; });
  if (rest.length > 0) {
    regionGroups.push(autoGroup("🌍 其他自动", rest, 50));
    regionGroups.push({ name: "🌍 其他", type: "select", proxies: ["🌍 其他自动"].concat(rest) });
    regionSelectors.push("🌍 其他");
  }

  // ---------- 属性分组: 家宽 / 倍率 ----------
  // 家宽只在这里成组(纯手动 select), 外加「👋 手动选择」里也能手动选到;
  // 地区组和一切自动组里都没有家宽(v3.5 规矩二)。倍率/优选IP 的手动组照旧
  // 列全节点(手动选不受限), 只有它们的自动子组用剔了家宽的成员。
  var extraSelectors = [];
  var extraGroups = [];

  var homeNodes = pool.filter(isHome);
  if (homeNodes.length > 0) {
    extraGroups.push({ name: "🏠 家宽节点", type: "select", proxies: homeNodes.slice() });
    extraSelectors.push("🏠 家宽节点");
  }

  function rateOf(name) {
    var m = name.match(/(?:倍率\s*)?(\d+(?:\.\d+)?)\s*(?:x|倍)/i) || name.match(/[x×]\s*(\d+(?:\.\d+)?)/i);
    return m ? parseFloat(m[1]) : null;
  }
  var lowRate = pool.filter(function (n) { var r = rateOf(n); return r !== null && r < 1; });
  var highRate = pool.filter(function (n) { var r = rateOf(n); return r !== null && r >= 2; });
  if (lowRate.length > 0) {
    var lowAuto = lowRate.filter(function (n) { return !isHome(n); });
    if (lowAuto.length > 0) {
      extraGroups.push(autoGroup("💰 低倍率自动", lowAuto, 50));
      extraGroups.push({ name: "💰 低倍率", type: "select", proxies: ["💰 低倍率自动"].concat(lowRate) });
    } else {
      // 低倍率节点全是家宽: 不建自动子组, 只留手动组
      extraGroups.push({ name: "💰 低倍率", type: "select", proxies: lowRate.slice() });
    }
    extraSelectors.push("💰 低倍率");
  }
  if (highRate.length > 0) {
    extraGroups.push({ name: "💎 高倍率", type: "select", proxies: highRate.slice() });
    extraSelectors.push("💎 高倍率");
  }

  // 优选IP单独成组: 这类节点名字里没有地区词, 进不了地区组,
  // 单独拢成一组(自带自动测速), 方便在各分流组里一键选到这一整组。
  var prefNodes = pool.filter(function (n) { return /优选IP/i.test(n); });
  if (prefNodes.length > 0) {
    var prefAuto = prefNodes.filter(function (n) { return !isHome(n); });
    if (prefAuto.length > 0) {
      extraGroups.push(autoGroup("⭐ 优选IP自动", prefAuto, 50));
      extraGroups.push({ name: "⭐ 优选IP", type: "select", proxies: ["⭐ 优选IP自动"].concat(prefNodes) });
    } else {
      extraGroups.push({ name: "⭐ 优选IP", type: "select", proxies: prefNodes.slice() });
    }
    extraSelectors.push("⭐ 优选IP");
  }

  // ---------- 主策略组 ----------
  var MAIN = "🚀 节点选择";
  var AUTO = "♻️ 自动选择";
  var FALLBACK = "🛡️ 故障转移";
  var LB = "⚖️ 负载均衡";
  var MANUAL = "👋 手动选择";
  var FINAL = "🐟 漏网之鱼";
  var mainOptions = [AUTO, FALLBACK, LB].concat(regionSelectors, extraSelectors, [MANUAL, "DIRECT"]);

  var groups = [];
  groups.push({ name: MAIN, type: "select", proxies: mainOptions.slice() });
  groups.push(autoGroup(AUTO, autoMembers, 50));
  groups.push({
    name: FALLBACK, type: "fallback", proxies: autoMembers.slice(),
    url: TEST_URL, interval: 600, lazy: true, timeout: 5000, "max-failed-times": 3
  });
  groups.push({
    name: LB, type: "load-balance", strategy: "consistent-hashing", proxies: autoMembers.slice(),
    url: TEST_URL, interval: 600, lazy: true, timeout: 5000
  });
  groups.push({ name: MANUAL, type: "select", proxies: pool.slice() });

  // ---------- 精细分流组 ----------
  // v3.5 规矩一: 带地区默认的组, 第一位改走「·顺位」兜底链(见下方 chainDefs),
  // 默认地区是链首, 没节点自动顺位往下, 链尾压自动选择; 链只是默认不是锁——
  // 组里照旧列全: 默认地区、总开关、自动组、全部地区、附加组、手动选择,
  // 用户随时可改选任何一个。无地区默认的组(FCM/测速/哔哩/苹果/微软/远控等)与 v3.4 一致。
  function svcOptions(preferred, chainName) {
    var list = [];
    function push(x) { if (x && list.indexOf(x) < 0) list.push(x); }
    if (chainName) push(chainName);
    (preferred || []).forEach(function (p) {
      if (p === "DIRECT" || p === MAIN || p === AUTO || p === FALLBACK || p === MANUAL ||
          regionSelectors.indexOf(p) >= 0 || extraSelectors.indexOf(p) >= 0) push(p);
    });
    push(MAIN); push(AUTO); push(FALLBACK);
    regionSelectors.forEach(push);
    extraSelectors.forEach(push);
    push(MANUAL);
    return list;
  }
  // 顺位链地区顺序: 链首几位按各组用途的通行最优排(与全家其他包口径一致),
  // 后面统一接 CHAIN_TAIL, 订阅里没有的地区在生成时自动跳过, 最后压自动选择。
  var CHAIN_TAIL = ["🇲🇾 马来西亚", "🇹🇭 泰国", "🇻🇳 越南", "🇮🇩 印尼", "🇵🇭 菲律宾", "🇮🇳 印度", "🇦🇺 澳大利亚", "🇨🇦 加拿大", "🇬🇧 英国", "🇩🇪 德国", "🇫🇷 法国", "🇳🇱 荷兰", "🇷🇺 俄罗斯", "🇹🇷 土耳其", "🇧🇷 巴西"];
  var chainDefs = {
    "🤖 AI服务":   ["🇺🇸 美国", "🇸🇬 新加坡", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"],
    "📺 YouTube":  ["🇭🇰 香港", "🇯🇵 日本", "🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇰🇷 韩国"],
    "🔍 Google服务": ["🇭🇰 香港", "🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇯🇵 日本", "🇰🇷 韩国"],
    "✈️ Telegram": ["🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"],
    "🎬 流媒体":   ["🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"],
    "🎮 游戏平台": ["🇯🇵 日本", "🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇭🇰 香港", "🇰🇷 韩国"],
    "📱 社交媒体": ["🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"],
    "💰 支付平台": ["🇺🇸 美国", "🇸🇬 新加坡", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"],
    "₿ 加密货币": ["🇸🇬 新加坡", "🇺🇸 美国", "🇹🇼 台湾", "🇯🇵 日本", "🇭🇰 香港", "🇰🇷 韩国"]
  };
  function chainGroup(svcName) {
    var members = [];
    chainDefs[svcName].concat(CHAIN_TAIL).forEach(function (r) {
      if (regionSelectors.indexOf(r) >= 0 && members.indexOf(r) < 0) members.push(r);
    });
    members.push(AUTO);
    return {
      name: svcName + "·顺位", type: "fallback", proxies: members,
      url: TEST_URL, interval: 600, lazy: true, timeout: 5000, "max-failed-times": 3
    };
  }
  var serviceGroups = [
    { name: "🤖 AI服务", proxies: svcOptions(["🇺🇸 美国"], "🤖 AI服务·顺位") },
    { name: "📺 YouTube", proxies: svcOptions(["🇭🇰 香港", "🇯🇵 日本"], "📺 YouTube·顺位") },
    { name: "🔍 Google服务", proxies: svcOptions(["🇭🇰 香港"], "🔍 Google服务·顺位") },
    { name: "🔔 FCM推送", proxies: svcOptions([FALLBACK]) },
    { name: "✈️ Telegram", proxies: svcOptions(["🇸🇬 新加坡"], "✈️ Telegram·顺位") },
    { name: "🎬 流媒体", proxies: svcOptions(["🇸🇬 新加坡", "🇺🇸 美国"], "🎬 流媒体·顺位") },
    { name: "🎮 游戏平台", proxies: svcOptions(["🇯🇵 日本"], "🎮 游戏平台·顺位") },
    { name: "🐙 GitHub", proxies: svcOptions([AUTO]) },
    { name: "📱 社交媒体", proxies: svcOptions(["🇸🇬 新加坡"], "📱 社交媒体·顺位") },
    { name: "💰 支付平台", proxies: svcOptions(["🇺🇸 美国"], "💰 支付平台·顺位") },
    { name: "₿ 加密货币", proxies: svcOptions(["🇸🇬 新加坡"], "₿ 加密货币·顺位") },
    { name: "⏩ 测速", proxies: svcOptions(["DIRECT"]) },
    { name: "📺 哔哩哔哩", proxies: svcOptions(["DIRECT"]) },
    { name: "🍎 苹果服务", proxies: svcOptions(["DIRECT"]) },
    { name: "Ⓜ️ 微软服务", proxies: svcOptions(["DIRECT"]) },
    { name: "🖥️ 远控工具", proxies: svcOptions(["DIRECT"]) }
  ];
  serviceGroups.forEach(function (s) {
    if (chainDefs[s.name]) groups.push(chainGroup(s.name));
    groups.push({ name: s.name, type: "select", proxies: s.proxies.slice() });
  });
  groups.push({ name: "🛑 广告拦截", type: "select", proxies: ["REJECT", "DIRECT"] });
  groups.push({ name: "🍃 应用净化", type: "select", proxies: ["REJECT", "DIRECT"] });
  groups.push({ name: FINAL, type: "select", proxies: mainOptions.slice() });

  // ---------- 保留链式代理依赖的原始分组 ----------
  // 有些订阅的家宽等节点是链式节点(dialer-proxy 先经前置组再出去),
  // 删掉被引用的前置组, 内核会报 "dialer-proxy not found" 并拒绝加载整个配置。
  var generatedNames = {};
  groups.concat(regionGroups, extraGroups).forEach(function (g) { generatedNames[g.name] = true; });
  var originalGroups = Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [];
  var origByName = {};
  originalGroups.forEach(function (g) { if (g && g.name) origByName[g.name] = g; });
  var proxyByName = {};
  config.proxies.forEach(function (p) { if (p && p.name) proxyByName[p.name] = p; });
  var needed = {};
  config.proxies.forEach(function (p) { if (p && p["dialer-proxy"]) needed[p["dialer-proxy"]] = true; });
  var queue = Object.keys(needed);
  while (queue.length > 0) {
    var cur = queue.shift();
    var og = origByName[cur];
    if (og && Array.isArray(og.proxies)) {
      og.proxies.forEach(function (m) {
        if (origByName[m] && !needed[m]) { needed[m] = true; queue.push(m); }
      });
    }
  }
  var preserved = [];
  Object.keys(needed).forEach(function (n) {
    if (generatedNames[n] || proxyByName[n]) return;
    if (origByName[n]) { preserved.push(origByName[n]); return; }
    // 原配置里也没有这个组: 兜底新建, 成员为所有非链式、非家宽节点, 保证链不断
    // (家宽只许手动, 不能让链式节点自动经家宽前置拨出; 复用上面的 isHome 判断)。
    // front 为空时才回落 DIRECT: 这个前置组本身不承载最终出口选择, 只被链式节点
    // 当 dialer-proxy 用, 空组会让内核报 dialer-proxy not found 而拒绝加载整个
    // 配置; DIRECT 在此只是让链式节点能直连其上游服务器的保命占位。
    var front = pool.filter(function (x) { var px = proxyByName[x]; return !isHome(x) && !(px && px["dialer-proxy"]); });
    preserved.push({ name: n, type: "select", proxies: front.length > 0 ? front : ["DIRECT"] });
  });
  groups = groups.concat(regionGroups, extraGroups, preserved);
  config["proxy-groups"] = groups;

  // ---------- 去广告规则集(ACL4SSR, 每日自动更新, UnBan 先行防误杀) ----------
  function adProvider(url, file, format) {
    return { type: "http", behavior: "classical", format: format || "text", interval: 86400, url: url, path: "./ruleset/" + file };
  }
  config["rule-providers"] = {
    UnBan: adProvider("https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@a7bdd9c97c3c/Clash/UnBan.list", "UnBan.list"),
    BanAD: adProvider("https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@a7bdd9c97c3c/Clash/BanAD.list", "BanAD.list"),
    BanProgramAD: adProvider("https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@a7bdd9c97c3c/Clash/BanProgramAD.list", "BanProgramAD.list"),
    BanEasyList: adProvider("https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@a7bdd9c97c3c/Clash/BanEasyList.list", "BanEasyList.list"),
    // 秋风去广告(AWAvenue): 与 YAML 版 rule-provider 同名/同 behavior/同 interval,
    // format 为 yaml(与 YAML 版一致), 规则位置见下面 rules(白名单之后、服务分流之前)。
    AWAvenue: adProvider("https://cdn.jsdelivr.net/gh/TG-Twilight/AWAvenue-Ads-Rule@8965815bf397/Filters/AWAvenue-Ads-Rule-Clash-Classical.yaml", "AWAvenue.yaml", "yaml")
  };

  // ---------- 分流规则(顺序即优先级) ----------
  config.rules = [
    // 防误杀白名单最先
    "RULE-SET,UnBan,DIRECT",
    // 去广告: 程序广告(APP开屏/内嵌) + 秋风去广告补强 + 广告域名 + EasyList + 内置广告分类
    "RULE-SET,BanProgramAD,🍃 应用净化",
    "RULE-SET,AWAvenue,🍃 应用净化",
    "RULE-SET,BanAD,🛑 广告拦截",
    "RULE-SET,BanEasyList,🛑 广告拦截",
    "GEOSITE,category-ads-all,🛑 广告拦截",
    // 局域网/私有直连
    "GEOIP,private,DIRECT,no-resolve",
    "GEOSITE,private,DIRECT",
    // AI
    "DOMAIN-SUFFIX,openai.com,🤖 AI服务",
    "DOMAIN-SUFFIX,chatgpt.com,🤖 AI服务",
    "DOMAIN-SUFFIX,oaistatic.com,🤖 AI服务",
    "DOMAIN-SUFFIX,anthropic.com,🤖 AI服务",
    "DOMAIN-SUFFIX,claude.ai,🤖 AI服务",
    "DOMAIN-SUFFIX,perplexity.ai,🤖 AI服务",
    "DOMAIN-SUFFIX,x.ai,🤖 AI服务",
    "DOMAIN-SUFFIX,grok.com,🤖 AI服务",
    "DOMAIN-SUFFIX,poe.com,🤖 AI服务",
    "DOMAIN-SUFFIX,deepseek.com,🤖 AI服务",
    "GEOSITE,openai,🤖 AI服务",
    "GEOSITE,category-ai-!cn,🤖 AI服务",
    // 常用国外服务
    "GEOSITE,youtube,📺 YouTube",
    "DOMAIN,mtalk.google.com,🔔 FCM推送",
    "DOMAIN-SUFFIX,fcm.googleapis.com,🔔 FCM推送",
    "GEOSITE,google,🔍 Google服务",
    "GEOSITE,telegram,✈️ Telegram",
    "GEOIP,telegram,✈️ Telegram,no-resolve",
    "GEOSITE,netflix,🎬 流媒体",
    "GEOSITE,disney,🎬 流媒体",
    "GEOSITE,hbo,🎬 流媒体",
    "GEOSITE,spotify,🎬 流媒体",
    "DOMAIN-KEYWORD,emby,🎬 流媒体",
    "GEOSITE,github,🐙 GitHub",
    "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
    "DOMAIN-SUFFIX,steamstatic.com,DIRECT",
    "GEOSITE,steam,🎮 游戏平台",
    "GEOSITE,twitter,📱 社交媒体",
    "GEOSITE,facebook,📱 社交媒体",
    "GEOSITE,instagram,📱 社交媒体",
    "GEOSITE,tiktok,📱 社交媒体",
    "GEOSITE,paypal,💰 支付平台",
    "GEOSITE,category-cryptocurrency,₿ 加密货币",
    "DOMAIN-SUFFIX,speedtest.net,⏩ 测速",
    "DOMAIN-SUFFIX,ookla.com,⏩ 测速",
    "DOMAIN-KEYWORD,speedtest,⏩ 测速",
    // 国内服务(默认直连, 组里可改)
    "GEOSITE,bilibili,📺 哔哩哔哩",
    "GEOSITE,apple,🍎 苹果服务",
    "GEOSITE,microsoft,Ⓜ️ 微软服务",
    "DOMAIN-SUFFIX,teamviewer.com,🖥️ 远控工具",
    "DOMAIN-SUFFIX,anydesk.com,🖥️ 远控工具",
    "DOMAIN-SUFFIX,todesk.com,🖥️ 远控工具",
    // 国内外分流兜底
    "GEOSITE,cn,DIRECT",
    "GEOIP,CN,DIRECT",
    "GEOSITE,geolocation-!cn,🚀 节点选择",
    "MATCH,🐟 漏网之鱼"
  ];

  // ---------- 网速/连接优化 ----------
  config["tcp-concurrent"] = true;
  config["unified-delay"] = true;
  config["global-client-fingerprint"] = "chrome";
  config.profile = { "store-selected": true, "store-fake-ip": true };
  config.sniffer = {
    enable: true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": false,
    sniff: {
      HTTP: { ports: [80, "8080-8880"] },
      TLS: { ports: [443, 8443] },
      QUIC: { ports: [443, 8443] }
    }
  };

  // ---------- DNS: 国内/国外分开解析防污染, fake-ip 兼容名单 ----------
  config.dns = {
    enable: true,
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
      "*.lan", "*.local", "localhost", "localhost.ptlogin2.qq.com",
      "time.*.com", "time.*.gov", "ntp.*.com", "ntp.*.org",
      "+.stun.*.*", "+.stun.*.*.*", "stun.*.*", "stun.*.*.*",
      "*.battlenet.com", "*.blizzard.com",
      "*.srv.nintendo.net", "*.stun.playstation.net", "+.sonyentertainmentnetwork.com",
      "*.xboxlive.com",
      "*.msftconnecttest.com", "*.msftncsi.com",
      "*.music.163.com", "*.126.net"
    ],
    "use-hosts": true,
    "respect-rules": true,
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    nameserver: ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "nameserver-policy": {
      "geosite:cn,private": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
      "geosite:geolocation-!cn": ["https://dns.cloudflare.com/dns-query", "https://dns.google/dns-query"]
    }
  };

  return config;
}
