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
    <a href="https://github.com/worenbudaoni/cn-trip/stargazers"><img src="https://img.shields.io/github/stars/worenbudaoni/cn-trip?style=social" alt="GitHub Stars"></a>
    <a href="https://github.com/worenbudaoni/cn-trip/forks"><img src="https://img.shields.io/github/forks/worenbudaoni/cn-trip?style=social" alt="GitHub Forks"></a>
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

- Codex
- Claude
- 其他支持 Prompt / Tool / Workflow 的 Agent 系统

当前仓库同时提供了各平台的适配封装：

| 文件 | 适配平台 | 用途 |
|------|---------|------|
| `.claude/settings.json` | **Claude Code** | Hook 配置：SessionStart 自动加载 + `cn-trip` 前缀触发 |
| `CLAUDE.md` | **Claude Code** | 项目指令与工作流映射 |
| `AGENTS.md` | **通用 Agent 框架** | Claude API、Anthropic SDK、GPTs、LangChain 等集成参考 |
| `SKILL.md` | **全部平台** | 核心流程与约束规则 |
| `.agents/skills/cn-trip/SKILL.md` | **Codex CLI** | Skill 自动发现入口 |
| `scripts/generate-excel.js` | **全部平台** | Node.js Excel 生成器（自动安装依赖） |
| `references/excel-layout.md` | **全部平台** | Excel 输出结构与校验契约 |

因此需要理解两层：

- **作为规划规范**：通用，所有平台都能用
- **作为安装即用的 Skill 包**：根据平台选择对应的适配文件

## 快速开始

**克隆项目，进入目录，直接使用。** 无需手动安装或复制任何文件。

### 在 Claude Code 中使用

```bash
git clone <repo-url>
cd cn-trip
claude
```

进入项目后直接自然语言描述需求即可（hook 会自动加载规划流程）：

```text
帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

也可以在非旅行对话中主动触发：

```text
cn-trip 帮我规划去云南
```

自动生效的机制：
- `.claude/settings.json` hooks → SessionStart 自动注入上下文 + `cn-trip` 前缀触发

### 在 Codex CLI 中使用

```bash
git clone <repo-url>
cd cn-trip
codex
```

Codex 会自动加载项目配置，直接描述需求即可：

```text
帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

自动生效的机制：
- `AGENTS.md` → Codex 启动时自动读取项目指令
- `.agents/skills/cn-trip/SKILL.md` → Codex 自动发现 skill

### 在 Claude API / Anthropic SDK 中使用

参考 `AGENTS.md`，将 `SKILL.md` 内容作为 System Prompt 的一部分注入，配合 `references/excel-layout.md` 作为输出结构参考。

建议通过 Tool Use / Function Calling 实现 Excel 生成能力。

### 在其他 Agent 框架（GPTs、LangChain 等）中使用

参考 `AGENTS.md` 的通用集成建议：

- `SKILL.md` → 规划流程 Prompt Template
- `references/excel-layout.md` → 输出格式 Reference
- 根据平台能力选择 Excel 生成方案（自定义工具 / 代码执行 / 文件生成 API）

## 仓库结构

```text
cn-trip/
├── .claude/
│   └── settings.json              # Claude Code hook 配置（SessionStart + cn-trip 前缀）
├── .agents/
│   └── skills/
│       └── cn-trip/
│           └── SKILL.md            # Codex CLI skill 入口（自动发现）
├── CLAUDE.md                       # Claude Code 项目指令
├── AGENTS.md                       # 通用 Agent 框架适配说明
├── SKILL.md                        # 核心流程与约束规则（全部平台共用）
├── README.md
├── LICENSE
├── scripts/
│   └── generate-excel.js           # Node.js Excel 生成器（自动安装依赖）
├── agents/
│   └── openai.yaml                 # Codex / OpenAI 风格元数据
└── references/
    └── excel-layout.md             # Excel 输出结构定义
```

文件说明：

- `.claude/settings.json`
  Claude Code hook 配置。SessionStart 自动注入 cn-trip 上下文，BeforeCommand 支持 `cn-trip` 前缀触发

- `.agents/skills/cn-trip/SKILL.md`
  Codex CLI skill 入口。放入 `.agents/skills/` 下后 Codex 会自动发现

- `CLAUDE.md`
  Claude Code 项目指令，定义工作流映射与工具使用方式

- `AGENTS.md`
  通用 Agent 框架适配说明，帮助 Claude API、Anthropic SDK、GPTs、LangChain 等集成本规范

- `SKILL.md`
  核心流程，定义触发场景、规划流程、预算逻辑、输出规范和 Excel 导出规则

- `scripts/generate-excel.js`
  Node.js Excel 生成器。生成 8-sheet `.xlsx`，自动安装 `exceljs` 依赖，不需 Python

- `references/excel-layout.md`
  Excel 输出结构、导出模式和校验约定

- `agents/openai.yaml`
  Codex / OpenAI 风格的 Skill 元数据

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
