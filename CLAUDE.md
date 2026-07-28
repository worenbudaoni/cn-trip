# cn-trip — Claude Code 使用说明

`cn-trip` 是一套面向中国境内自由行的结构化旅行规划规范。本文件说明了如何在 **Claude Code** 中使用它。

---

## 快速开始

从 clone 到使用的最短路径：

```bash
git clone <repo-url>
cd cn-trip
claude
```

进入会话后，直接描述旅行需求即可（hooks 会自动加载项目上下文）：

```
帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

也可以显式触发：

```
cn-trip 帮我规划去云南
```

标准使用流程：

1. Claude 先说明边界，只做国内自由行规划，不做预订和实时导航
2. 然后逐步收集约束，而不是一次性抛整张表
3. 先拆预算，再给路线
4. 先给预览，再等用户确认
5. 只有确认后，才导出 Excel

---

## 核心文件

| 文件 | 用途 |
|------|------|
| `.claude/settings.json` | **Hook 配置** — SessionStart 自动加载 + `cn-trip` 前缀触发 |
| `SKILL.md` | **核心流程** — 触发场景、规划流程、约束规则、输出规范 |
| `scripts/generate-excel.js` | **Excel 生成器** — Node.js 脚本，自动安装依赖 |
| `references/excel-layout.md` | **Excel 输出契约** — 8 个 sheet 结构、导出模式、校验清单 |
| `CLAUDE.md` | Claude Code 项目指令（本文件） |
| `AGENTS.md` | 通用 Agent 框架适配说明 |

---

## 工作流程映射

`SKILL.md` 中的 9 步流程在 Claude Code 中的执行方式：

| 步骤 | 说明 | Claude Code 做法 |
|------|------|------------------|
| 1. 边界说明 | 简要说明能力范围 | 直接输出文字说明 |
| 2. 逐步问诊 | 渐进式收集约束条件 | 用自然语言一问一答，每次一个决定 |
| 3. 目的地推荐/校验 | 推荐候选或验证已有目的地 | 推理并输出推荐依据 |
| 4. 预算拆解 | 先拆预算再定路线 | 推理后输出预算分析 |
| 5. 来源收集与标注 | 分级管理信息来源 | 推理中确定来源类型 |
| 6. 冻结结构化载荷 | 确认方案后再导出 | 先输出结构化预览 |
| 7. 结构化预览 | 展示方案摘要 | 以 Markdown 展示核心结论 |
| 8. 修订 | 接受调整意见 | 自然语言交互修改 |
| 9. Excel 导出 | 用户确认后生成 .xlsx | 使用 shell/Bash 工具生成文件 |

**关键约束**：在预览确认之前，不要跳到完整输出。

---

## 工具映射

`cn-trip` 的一些需求对应 Claude Code 的内置工具：

- **Web 信息收集** → 使用 `WebFetch` 或 `WebSearch` 获取景点、交通、美食信息
- **Excel 生成** → 使用 `Bash`（shell）执行 `node scripts/generate-excel.js` 生成 `.xlsx`
- **文件读写** → 使用 `Write` / `Read` 处理文件

---

## 示例 Prompt

**完整规划：**
```
我想 8 月从上海出发去西藏玩 8 天，单人预算 5000，帮我做个规划
```

**目的地筛选：**
```
我想出去旅游，但不知道去哪。我在成都，5 天时间，预算 3000 左右
```

**方案调整：**
```
之前那个方案太贵了，帮我做一个更省钱的版本
```

---

## Excel 导出注意事项

- Claude Code 通过 `Bash` 工具执行 `node scripts/generate-excel.js` 来生成 `.xlsx` 文件
- 首次执行时脚本会自动安装 `exceljs` 到本地 `node_modules/`
- 默认导出到桌面，保存路径会报告给用户
- 文件名格式：`出发日期_目的地_天数_旅行方案.xlsx`
- 导出后应验证文件完整性，至少检查 8 个 sheet、中文 sheet 名、表头和代表性内容不出现 `?` 乱码

---

## Hook 自动触发（"下载即用"）

本项目的 hook 配置在 `.claude/settings.json` 中，**会随 git 提交一起分发**，clone 后即生效。

| Hook | 触发方式 | 说明 |
|------|----------|------|
| `SessionStart` | 进入目录自动加载 | 项目启动时注入 cn-trip 上下文，用户直接说自然语言即可 |
| `BeforeCommand`(cn-trip) | 输入 `cn-trip ...` | 显式前缀触发，适合在非旅行对话中主动调用 |

无需任何手动安装步骤。

---

## 与 Codex 的差异

| 方面 | Codex | Claude Code |
|------|-------|-------------|
| 触发方式 | 自然语言 / `AGENTS.md` / skill 自动发现 | 自然语言 / hooks |
| 元数据 | `AGENTS.md` + `.agents/skills/cn-trip/SKILL.md` | `CLAUDE.md` + `.claude/settings.json` |
| 工具调用 | Codex 内置机制 | `Bash` / `WebFetch` / `WebSearch` |
| Skill 安装 | 项目内自动发现 | 项目内直接使用 |
