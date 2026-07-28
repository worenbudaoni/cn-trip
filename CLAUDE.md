# cn-trip — Claude Code 适配层

`cn-trip` 在 Claude Code 中也应按 skill 的方式使用。

这里的约定是：

- `SKILL.md` 是唯一规则源
- `references/excel-layout.md` 是唯一 Excel 输出契约
- `.claude/settings.json` 负责把这套 skill 规则注入 Claude 会话
- `CLAUDE.md` 只负责说明 Claude Code 如何加载和执行这套 skill，不再重复定义一套平行流程

---

## Source Of Truth

Claude Code 处理旅行需求时，必须以以下文件为准：

1. `SKILL.md`
2. `references/excel-layout.md`
3. `scripts/generate-excel.js`

其中：

- `SKILL.md` 定义边界、逐步问诊、`1/2/3/4` 选项、预算前置、预览确认、导出时机
- `references/excel-layout.md` 定义 8-sheet 结构、列名、导出模式和校验要求
- `scripts/generate-excel.js` 是实际导出引擎

如果 `CLAUDE.md` 与 `SKILL.md` 有任何冲突，以 `SKILL.md` 为准。

---

## 快速开始

```bash
git clone <repo-url>
cd cn-trip
claude
```

进入会话后直接提出旅行需求，例如：

```text
帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

也可以显式触发：

```text
cn-trip 帮我规划去云南
```

---

## Claude 必须如何执行这套 Skill

当用户提出国内自由行需求时，Claude 必须严格按 `SKILL.md` 执行，至少包括：

- 先说明边界，只做国内自由行规划，不做预订和实时导航
- 一步一步问，每次只推进一个决定
- 每次提问必须提供 `1`、`2`、`3` 选项和 `4` 自定义输入
- 在收集到最小约束闭环前，不要直接输出完整方案
- 先拆预算，再判断路线是否成立
- 先给结构化预览，再等待确认
- 预览未确认前，不要直接导出 Excel

Claude 不应把这套流程当成普通自由对话，而应当把它当成项目内置 skill 来执行。

---

## Hook 角色

`.claude/settings.json` 的作用不是定义另一套规则，而是把 skill 规则注入 Claude 会话：

- `SessionStart`：进入项目时加载 `cn-trip` 上下文
- `BeforeCommand`：当用户输入 `cn-trip ...` 时显式触发这套 skill

如果删除 `.claude/settings.json`，Claude 仍然能读取仓库文件，但“进入目录即可按 skill 工作”的开箱即用体验会明显变差。

---

## Claude 与 Codex 的关系

两边都使用同一套 skill 规则，但接入机制不同：

| 平台 | 规则源 | 接入方式 |
|------|--------|----------|
| Claude Code | `SKILL.md` + `references/excel-layout.md` | `.claude/settings.json` + `CLAUDE.md` |
| Codex | `SKILL.md` + `references/excel-layout.md` | `AGENTS.md` + `.agents/skills/cn-trip/SKILL.md` |

结论：

- Claude 也用 skill
- 只是 Claude 不走 Codex 那套 `.agents/skills/...` 自动发现机制
- Claude 走的是 hook 注入 + 项目适配说明

---

## Excel 导出

Claude Code 导出时应直接调用：

```bash
node scripts/generate-excel.js --input plan.json --output 出发日期_目的地_天数_旅行方案.xlsx
```

要求：

- 首次执行时允许脚本自动安装 `exceljs`
- 不要在导出阶段重新规划路线
- 写入后要检查中文 sheet 名、表头和代表性内容不乱码
- 未通过校验时，不要宣称导出成功
