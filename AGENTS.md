# cn-trip — Agent 兼容性说明

`cn-trip` 是一套面向中国境内自由行的结构化旅行规划规范。本文档帮助各种 Agent 框架（Claude API、Anthropic SDK、OpenAI GPTs、通用 Agent 系统）理解和使用本项目的规划规则。

---

## 总览

`cn-trip` 不是一个传统插件或运行时库，而是一套**规划规则和输出契约**。任何具备以下能力的 Agent 都可以复用：

- 多轮对话（逐步问诊）
- 结构化输出（生成 JSON/Markdown/表格）
- 文件生成（创建 `.xlsx`）

---

## 核心文件的角色

| 文件 | 角色 | 必读 |
|------|------|------|
| `SKILL.md` | 规划流程、回答规则、预算逻辑、输出规范 | ✅ 必须 |
| `references/excel-layout.md` | 8-sheet Excel 结构、导出模式、校验清单 | ✅ 必须 |
| `CLAUDE.md` | Claude Code 专属适配 | ⬜ 仅 Claude |
| `.agents/skills/cn-trip/SKILL.md` | Codex Skill 入口（自动发现） | ✅ Codex |
| `AGENTS.md` | 本文档 — Agent 兼容总览 | ⬜ 参考 |

---

## 核心流程（通用）

任何 Agent 使用 `cn-trip` 时应遵循以下序列：

1. **说明边界** — 一段话说明能力范围（国内自由行，不涉及预订/导航）
2. **逐问收集约束** — 渐进式，每次一个决定，收集：目的地（有无）、出发地、日期、天数、预算、同行人、自驾意愿、返程约束
3. **目的地推荐或校验** — 无目的地则推荐 3 个候选（2 主流 + 1 小众）；有目的地则校验或挑战
4. **预算前置拆解** — 先拆单人预算，再判断路线可行性；预算不足时说明冲突并提供更便宜的备选
5. **来源分级收集** — 体验来源（小红书/马蜂窝）+ 事实来源（官方/12306/航司）；标注核验状态
6. **冻结方案** — 在导出前冻结结构化载荷，不要边写边查
7. **预览先行** — 在导出前以结构化短摘要展示方案
8. **支持修订** — 接受快速选项（更便宜/更轻松）和自由文本修改
9. **Excel 导出** — 用户确认后生成 8-sheet `.xlsx`

---

## 输出契约

### 默认方案结构
- **主方案**：均衡、可执行
- **备用方案**：更省钱或更轻松

### Excel 的 8 个 Sheet
1. 行程总览
2. 详细行程（主方案）
3. 详细行程（备用方案）
4. 预算拆分
5. 出行准备清单
6. 美食攻略
7. 景点历史人文
8. 信息来源

详细列定义见 `references/excel-layout.md`。

---

## API / SDK 集成建议

### 使用 Claude API / Anthropic SDK

将 `SKILL.md` 内容作为系统提示（system prompt）的一部分，配合 `references/excel-layout.md` 作为参考上下文：

```
system: 你是一个中国境内自由行规划助手。按以下规则工作：<SKILL.md 内容>
        Excel 输出结构参考：<references/excel-layout.md 内容>
```

建议使用 **工具调用（Tool Use）** 来实现 Excel 生成功能：定义一个 `generate_excel` 工具，接收结构化行程数据 JSON，返回 `.xlsx` 文件。

### 使用 OpenAI GPTs / Assistants API

类似方案：将 `SKILL.md` 放入 instructions，将 `excel-layout.md` 作为知识文件上传。

### 使用通用 Agent 框架（LangChain、CrewAI 等）

将 `SKILL.md` 作为规划流程的 Prompt Template，将 `excel-layout.md` 作为输出格式的 Reference。

---

## 平台差异速览

| 特性 | Claude Code | API / SDK | Codex | 其他 Agent |
|------|------------|-----------|-------|-----------|
| 触发方式 | 自然语言 / hooks | System prompt | `AGENTS.md` 自动加载 / skill 发现 | 自定义 |
| 元数据 | `.claude/settings.json` | 手动配置 | `.agents/skills/cn-trip/SKILL.md` | 自适配 |
| 工具调用 | Bash/WebFetch | Tool Use / Function Calling | Codex 内置 | 平台相关 |
| Excel 生成 | `node scripts/generate-excel.js` | 自定义工具 | `node scripts/generate-excel.js` | 平台相关 |

## Codex 下载即用

Codex CLI 进入本项目目录时会自动发现以下配置：

| 机制 | 文件 | 说明 |
|------|------|------|
| AGENTS.md 自动加载 | `AGENTS.md`（根目录） | Codex 自动读取，无需手动操作 |
| Skill 自动发现 | `.agents/skills/cn-trip/SKILL.md` | Codex 自动发现 skill |
| Excel 生成 | `scripts/generate-excel.js` | Node.js 脚本，自动安装依赖 |

克隆后进入目录即可使用，零配置。

---

## 设计原则（通用）

1. 先问清，再推荐
2. 先算预算，再润色路线
3. 先冻结结构化结果，再导出文件
4. 经验来源与事实来源分级使用
5. 输出必须可修改，而不是只可阅读
6. 优先稳定导出路径，避免脆弱链路反复重试
