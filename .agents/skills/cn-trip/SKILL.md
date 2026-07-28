---
name: cn-trip
description: Plan China domestic free-travel itineraries with budget breakdown, destination recommendation, and Excel export
---

# cn-trip — Codex Skill

This skill provides China domestic free-travel planning. For full detailed rules, read `SKILL.md` at the project root.

## Quick Start

When the user asks about travel planning:

1. State your scope (domestic free travel, no booking/navigation)
2. Collect constraints step by step: destination (or none), departure city, dates, days, budget, companions, self-driving
3. Recommend 3 destinations (2 mainstream + 1 niche) if none given; challenge conflicts if destination given
4. Break down budget before finalizing route
5. Freeze a structured plan before preview
6. Show a short structured preview
7. Revise if needed
8. Export Excel via Node.js: `node scripts/generate-excel.js --input plan.json --output 方案.xlsx`

## Key Constraints

- **Budget first**: break down per-person budget before selecting route details
- **Source tiers**: experience sources (Xiaohongshu/Mafengwo) vs fact sources (12306/official)
- **Freeze before export**: don't re-browse or re-compute during file writing
- **Two plans**: main (balanced) + backup (cheaper/lighter)
- **Node.js Excel**: prefer `scripts/generate-excel.js` over Python/openpyxl

## Excel Export

```bash
node scripts/generate-excel.js --input <plan.json> --output <output.xlsx>
```

The script auto-installs `exceljs` if needed. Read `references/excel-layout.md` for the 8-sheet structure.

## Source of Truth

This file is a summary. **For complete rules** (budget logic, destination logic, source policy, output style, preview format, export constraints), always read `SKILL.md` at the project root.
