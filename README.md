<p align="center">
  <h1 align="center">cn-trip</h1>
  <p align="center">
    <strong>面向中国境内自由行场景的结构化旅行规划 Skill / Agent Spec。</strong>
  </p>
  <p align="center">
    让 AI 不只会“推荐去哪里”，而是能够围绕时间、预算、出发地、同行人、自驾意愿与出行偏好，<br/>
    生成一份可执行、可修改、可导出的旅行方案。
  </p>
  <p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
    <a href="https://img.shields.io/badge/platform-Codex%20%7C%20Claude%20%7C%20Claude%20Code%20%7C%20Agent-blue"><img src="https://img.shields.io/badge/platform-Codex%20%7C%20Claude%20%7C%20Claude%20Code%20%7C%20Agent-blue" alt="Platform"></a>
  </p>
  <p align="center">
    <a href="#项目定位">项目定位</a> ·
    <a href="#核心能力">核心能力</a> ·
    <a href="#快速开始">快速开始</a> ·
    <a href="#excel-输出模型">Excel 输出模型</a> ·
    <a href="#兼容性">兼容性</a>
  </p>
</p>

---

## 项目定位

`cn-trip` 既是一套**旅行规划规范**，也是一个**即下载即用的 Skill 包**——无论你用 Claude Code 还是 Codex CLI，克隆后进入目录即可使用，无需任何配置。

它既可以作为 **Codex Skill** 直接使用，也可以作为 **Claude 或其他 Agent 框架** 的规划规则复用。它关注的不是“生成一段旅游文案”，而是将旅行需求转化为一份**可执行、可审核、可导出**的结构化方案。

与普通的旅行提示词相比，`cn-trip` 更强调：

- 先问清约束，再开始推荐
- 先做预算拆分，再判断方案是否成立
- 同时输出主方案与备用方案
- 将美食、交通、住宿、门票、历史人文和来源信息纳入统一结构
- 面向多 sheet Excel 输出，而不是只生成一段长文本

## 适用范围

适合以下场景：

- 还没决定去哪，想先做目的地筛选
- 已有目的地，想生成完整自由行方案
- 想同时拿到主方案和备用方案
- 想把预算拆到交通、酒店、门票、餐饮等具体安排
- 想把结果整理成表格或 Excel

当前边界：

- 只做中国境内自由行
- 不做出境游
- 不负责机酒预订
- 不承诺实时导航
- 不把社媒经验直接当作确定事实

## 核心能力

### 1. 约束问诊

按步骤收集关键信息，而不是一次性让用户填一张大表。

重点字段包括：

- 是否已有目的地
- 出发地
- 出行日期
- 行程天数
- 单人预算
- 同行人类型
- 是否考虑自驾
- 返程约束

### 2. 目的地推荐与校验

- 对未定目的地用户：给出候选地并说明推荐依据
- 对已有目的地用户：围绕既定目的地规划，必要时指出明显不匹配点

### 3. 预算优先的规划逻辑

`cn-trip` 将预算作为规划前置条件，而不是结果附录。

主要原则：

- 先按单人预算拆分
- 再判断路线、天数、交通方式是否可行
- 若预算不足，明确指出冲突来源并给出更便宜的备选方案

### 4. 主方案 + 备用方案

默认生成两套方案：

- 主方案：均衡、可执行
- 备用方案：更省钱或更轻松

### 5. 店铺级美食推荐

不是只写“可以吃本地特色”，而是尽量给到：

- 店铺名称
- 位置或区域
- 推荐菜 / 吃法
- 人均参考
- 适合嵌入哪一段行程

### 6. 行程级预算下沉

预算拆分不仅保留总表，也尽量细到具体安排，例如：

- 去程高铁 / 航班大概多少钱
- 入住酒店大概多少钱
- 景区门票大概多少钱
- 对应餐饮店铺人均多少钱

## Excel 输出模型

默认采用 8 个 sheet：

1. `行程总览`
2. `详细行程（主方案）`
3. `详细行程（备用方案）`
4. `预算拆分`
5. `出行准备清单`
6. `美食攻略`
7. `景点历史人文`
8. `信息来源`

结构特点：

- `行程总览`：展示出发地、目的地、日期、返程计划、预算与亮点
- `详细行程`：细到每天 / 时段，并可挂接交通、酒店、门票、餐饮费用参考
- `预算拆分`：尽量回指具体安排，例如 `D1 去程高铁`、`D1 入住酒店`
- `美食攻略`：要求给到店铺名称、位置、推荐菜、人均、避坑点
- `景点历史人文`：补充重要景点的历史与文化背景
- `信息来源`：集中保存来源与核验状态，避免在各 sheet 中重复堆长链接

详细结构定义见：[references/excel-layout.md](./references/excel-layout.md)

## 兼容性

### Agent / Skill 兼容性

`cn-trip` 的**规划逻辑**是通用的，可用于：

- Claude Code（通过 `/cn-trip` 命令触发）
- Codex CLI（自动发现 Skill）
- 其他支持 Prompt / Tool / Workflow 的 Agent 系统

当前仓库同时提供了各平台的适配封装：

| 文件 | 适配平台 | 用途 |
|------|---------|------|
| `.claude/commands/cn-trip.md` | **Claude Code** | `/cn-trip` 斜杠命令触发 |
| `CLAUDE.md` | **Claude Code** | Claude 适配层，声明 `SKILL.md` 是唯一规则源 |
| `AGENTS.md` | **通用 Agent 框架** | Claude API、Anthropic SDK、GPTs、LangChain 等集成参考 |
| `SKILL.md` | **全部平台** | 核心流程与约束规则 |
| `.agents/skills/cn-trip/SKILL.md` | **Codex CLI** | Skill 自动发现入口 |
| `scripts/generate-excel.js` | **全部平台** | Node.js Excel 生成器（自动安装依赖） |
| `references/excel-layout.md` | **全部平台** | Excel 输出结构与校验契约 |

因此需要理解两层：

- **作为规划规范**：通用，所有平台都能用
- **作为安装即用的 Skill 包**：根据平台选择对应的适配文件

## 快速开始

`cn-trip` 的目标是：**clone 下来，进入目录，马上能用。**

前提：

- 已安装 `git`
- 已安装 `Node.js`
- 已安装你要使用的 Agent CLI：`claude` 或 `codex`

### 1. 克隆项目

```bash
git clone <repo-url>
cd cn-trip
```

### 2. 选择运行方式

#### Claude Code

```bash
claude
```

进入会话后，通过 `/cn-trip` 命令触发：

```text
/cn-trip 帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

生效机制：

- `SKILL.md` 是 Claude 与 Codex 共用的规则源
- `references/excel-layout.md` 是共用的 Excel 输出契约
- `.claude/commands/cn-trip.md` 定义了 `/cn-trip` 命令的触发内容
- `CLAUDE.md` 说明何时执行这套 skill，不再重复定义平行规则

#### Codex CLI

```bash
codex
```

进入会话后，同样直接描述需求：

```text
帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

Codex 侧的生效机制：

- 根目录 `AGENTS.md` 会被自动读取
- `.agents/skills/cn-trip/SKILL.md` 会被自动发现
- 根目录 `SKILL.md` 是完整规则源

### 3. 对话会如何进行

无论是 Claude Code 还是 Codex，正常流程都应是：

1. 先说明边界，只做国内自由行，不做预订和实时导航
2. 逐步收集约束：目的地、出发地、日期、天数、预算、同行人、自驾、返程
3. 先做预算拆解，再判断路线是否成立
4. 先给预览，再让你确认或修改
5. 只有在你明确确认后，才导出 Excel

### 4. 导出 Excel

仓库内置导出脚本：

```bash
node scripts/generate-excel.js --input plan.json --output 出发日期_目的地_天数_旅行方案.xlsx
```

说明：

- 首次执行时会自动安装 `exceljs` 到本地 `node_modules/`
- 默认导出 8 个 sheet
- 脚本会在写入后校验 sheet 名、表头和代表性中文内容，避免把乱码文件当成功

### 5. 用在 API / SDK / 其他 Agent 框架

如果你不是直接用 Claude Code 或 Codex CLI，而是要接入自己的 Agent：

- 把 `SKILL.md` 作为规划流程规则
- 把 `references/excel-layout.md` 作为 Excel 输出契约
- 用 `node scripts/generate-excel.js` 作为导出工具

更详细的接入说明见 [AGENTS.md](./AGENTS.md)。

## 仓库结构

```text
cn-trip/
├── .claude/
│   └── commands/
│       └── cn-trip.md              # Claude Code `/cn-trip` 命令定义
├── .agents/
│   └── skills/
│       └── cn-trip/
│           └── SKILL.md            # Codex CLI skill 入口（自动发现）
├── AGENTS.md                       # 通用 Agent 框架适配说明
├── CLAUDE.md                       # Claude Code 项目指令
├── SKILL.md                        # 核心流程与约束规则（全部平台共用）
├── README.md
├── LICENSE
├── scripts/
│   └── generate-excel.js           # Node.js Excel 生成器
└── references/
    └── excel-layout.md             # Excel 输出结构定义
```

文件说明：

- `.claude/commands/cn-trip.md`
  Claude Code 斜杠命令。用户在会话中输入 `/cn-trip` 后触发 cn-trip 规划流程

- `.agents/skills/cn-trip/SKILL.md`
  Codex CLI skill 入口。放入 `.agents/skills/` 下后 Codex 会自动发现

- `CLAUDE.md`
  Claude Code 适配层。说明 `/cn-trip` 何时触发，以及如何执行根目录 `SKILL.md`

- `AGENTS.md`
  通用 Agent 框架适配说明，帮助 Claude API、Anthropic SDK、GPTs、LangChain 等集成本规范

- `SKILL.md`
  核心流程与唯一规则源，定义触发场景、规划流程、预算逻辑、输出规范和 Excel 导出规则

- `scripts/generate-excel.js`
  Node.js Excel 生成器。生成 8-sheet `.xlsx`，自动安装 `exceljs` 依赖

- `references/excel-layout.md`
  Excel 8-sheet 结构定义、导出模式和校验约定

## 设计原则

`cn-trip` 采用以下原则约束规划过程：

1. 先问清，再推荐
2. 先算预算，再润色路线
3. 先冻结结构化结果，再导出文件
4. 经验来源与事实来源分级使用
5. 输出必须可修改，而不是只可阅读
6. 优先稳定导出路径，避免脆弱链路反复重试

## 关于 Excel 导出

本仓库同时提供了 **Excel 输出契约** 和 **Node.js 生成器**：

- `references/excel-layout.md` → 8 个 sheet 的列定义与校验标准
- `scripts/generate-excel.js` → 把结构化 JSON 生成为 `.xlsx` 的实际引擎

生成器基于 Node.js + `exceljs`，会自动安装依赖。Claude Code 和 Codex CLI 都使用 `node scripts/generate-excel.js` 调用。

### 导出流程

```text
1. AI 完成规划，冻结结构化数据
2. 写入临时 JSON 文件
3. 执行 node scripts/generate-excel.js --input plan.json --output 方案.xlsx
4. 验证中文完整性，报告保存路径
```

## License

[LICENSE](./LICENSE).

---

## 友情链接

- [LINUX DO](https://linux.do/) —— 新的理想型社区，技术爱好者的聚集地。