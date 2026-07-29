# cn-trip — Claude Code 适配层

`cn-trip` 按需触发，仅在用户输入 `/cn-trip` 时才执行。

这里的约定是：

- `SKILL.md` 是唯一规则源
- `references/excel-layout.md` 是唯一 Excel 输出契约
- `.claude/commands/cn-trip.md` 是 `/cn-trip` 命令定义
- `CLAUDE.md` 只负责说明这套规则，不再重复定义一套平行流程

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

进入会话后通过 `/cn-trip` 命令触发：

```text
/cn-trip 帮我规划一个国内自由行，从上海出发去云南玩 7 天，单人预算 6000
```

---

## 何时执行这套 Skill

**仅当用户输入 `/cn-trip` 命令时**，Claude 才按 `SKILL.md` 执行。普通对话、代码修改、文件操作等都不触发。

触发后必须遵守：

- 先说明边界，只做国内自由行规划，不做预订和实时导航
- 一步一步问，每次只推进一个决定
- 每次提问必须提供 `1`、`2`、`3` 选项和 `4` 自定义输入
- 在收集到最小约束闭环前，不要直接输出完整方案
- 先拆预算，再判断路线是否成立
- 先给结构化预览，再等待确认
- 预览未确认前，不要直接导出 Excel

---

## 触发方式

cn-trip 通过 `/cn-trip` 命令触发，命令内容定义在 `.claude/commands/cn-trip.md`。

与 Codex 的关系：

| 平台 | 规则源 | 触发方式 |
|------|--------|----------|
| Claude Code | `SKILL.md` + `references/excel-layout.md` | `/cn-trip` 命令 |
| Codex | `SKILL.md` + `references/excel-layout.md` | `AGENTS.md` + `.agents/skills/cn-trip/SKILL.md` |

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
