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
    <a href="https://img.shields.io/badge/platform-Codex%20%7C%20Claude%20%7C%20Agent-blue"><img src="https://img.shields.io/badge/platform-Codex%20%7C%20Claude%20%7C%20Agent-blue" alt="Platform"></a>
    <a href="https://img.shields.io/badge/os-Windows%20%7C%20Linux%20%7C%20CentOS%20%7C%20macOS-orange"><img src="https://img.shields.io/badge/os-Windows%20%7C%20Linux%20%7C%20CentOS%20%7C%20macOS-orange" alt="OS"></a>
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

`cn-trip` 是一套面向中国境内自由行的结构化旅行规划规范。

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

当前仓库同时提供了一套 **Codex 风格适配封装**：

- `SKILL.md`
- `agents/openai.yaml`
- `references/excel-layout.md`

因此需要区分两层：

- 作为规划规范：通用
- 作为安装即用的 Skill 包：当前优先适配 Codex 类机制

### 操作系统兼容性

规划规范本身可在以下环境中复用：

- Windows
- Linux
- CentOS
- macOS

需要区分的是：

- **规划层**：跨平台
- **本地 Excel 导出层**：取决于是否接入稳定导出器

也就是说，本仓库中的 Markdown 规则天然跨平台；真正的 `.xlsx` 自动生成是否稳定，取决于你的导出实现，而不是本仓库本身。

## 快速开始

### 在 Codex 中使用

将目录放入本地 skill 目录：

```text
~/.codex/skills/cn-trip
```

示例：

```text
用 $cn-trip 帮我规划一个国内自由行
```

```text
我想 8 月从上海出发去西藏玩 8 天，单人预算 5000，$cn-trip
```

### 在 Claude 或其他 Agent 中使用

建议将以下两个文件作为核心输入：

- `SKILL.md`
- `references/excel-layout.md`

说明：

- `SKILL.md` 定义规划流程和回答规则
- `excel-layout.md` 定义输出结构和导出校验契约
- `agents/openai.yaml` 属于 Codex / OpenAI 风格元数据，不保证其他平台直接识别

## 仓库结构

```text
cn-trip/
├── SKILL.md
├── README.md
├── LICENSE
├── agents/
│   └── openai.yaml
└── references/
    └── excel-layout.md
```

文件说明：

- `SKILL.md`
  Skill 主入口，定义触发场景、规划流程和约束规则

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

本仓库定义的是 **Excel 输出契约**，不等于天然内置一个跨平台导出程序。

更合理的落地方式是分层：

### 规划层

由 `cn-trip` 负责：

- 问诊
- 目的地推荐
- 预算拆分
- 行程生成
- 美食 / 文化信息整理
- Excel 结构组织

### 导出层

由本地导出器、脚本或受控程序负责：

- 生成真实 `.xlsx`
- 校验 sheet 名和中文文本完整性
- 保存到指定路径

这样做的好处是：

- 规划逻辑可复用
- 平台差异被隔离
- 导出问题不会污染规划流程

## 后续扩展方向

如果你希望把它进一步做成多平台可复用的完整项目，建议后续补充：

- Claude 专用适配说明
- 通用 JSON Schema
- 独立跨平台 Excel 导出器
- 平台级安装与集成脚本

## License

See [LICENSE](./LICENSE).
