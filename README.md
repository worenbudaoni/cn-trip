# cn-trip

Structured China domestic trip planning for AI agents.

`cn-trip` is a reusable planning spec for China domestic free-travel workflows. It can be used as:

- a Codex skill out of the box
- a prompt/workflow asset for Claude or other agent frameworks
- a planning layer in front of a separate Excel exporter

It is designed to turn vague travel requests into structured, reviewable trip plans with budget logic, transport references, food recommendations, cultural context, and spreadsheet-ready output rules.

## Highlights

- China domestic free-travel focused
- Step-by-step intake instead of one-shot generic itinerary generation
- Main plan and backup plan by default
- Per-person budget driven planning
- Transport-aware output with train / flight references
- Food recommendations at shop level with location cues
- Historical and cultural context for major stops
- Structured multi-sheet Excel output contract
- Works as a general planning spec across Windows, Linux, CentOS, and macOS

## Compatibility

### Agent compatibility

Core planning logic is platform-agnostic.

It can be reused in:

- Codex
- Claude
- other agent systems that support prompt rules, tool use, or workflow orchestration

Current repository packaging is strongest for Codex-style skill loading because it includes:

- `SKILL.md`
- `agents/openai.yaml`
- `references/excel-layout.md`

Other agents can still use the same planning rules, but may need their own adapter layer.

### OS compatibility

The planning specification itself is cross-platform:

- Windows
- Linux
- CentOS
- macOS

What varies by environment is not the planning logic, but the local `.xlsx` export implementation. If a stable exporter is attached, the same planning rules can be used across all major desktop/server environments.

## What This Project Does

`cn-trip` covers the planning side of a trip workflow:

1. Collect constraints through guided questions
2. Recommend or validate destinations
3. Build a per-person budget split before finalizing the route
4. Gather high-trust and experience-based sources
5. Produce a balanced main plan and a backup option
6. Organize the result into a spreadsheet-ready structure

It is intended for use cases such as:

- undecided destination selection
- destination-specific itinerary generation
- route comparison
- cost-sensitive planning
- spreadsheet-based travel planning output

## Scope

Current scope:

- China domestic free travel
- itinerary planning
- food and cultural recommendations
- source-aware planning
- Excel-oriented structured output

Out of scope:

- outbound travel
- visa handling
- direct hotel or flight booking
- guaranteed real-time navigation

## Output Model

The default workbook model contains 8 sheets:

1. `行程总览`
2. `详细行程（主方案）`
3. `详细行程（备用方案）`
4. `预算拆分`
5. `出行准备清单`
6. `美食攻略`
7. `景点历史人文`
8. `信息来源`

The model is intentionally structured for editing, not just reading.

Key behaviors:

- food guidance is shop-based, not just dish-based
- itinerary rows can point to recommended shops
- budget can be pushed down to itinerary-level line items
- transport references should be auditable through the source sheet

## Repository Layout

```text
cn-trip/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
└── references/
    └── excel-layout.md
```

File responsibilities:

- `SKILL.md`
  Main planning workflow and operational rules
- `agents/openai.yaml`
  Codex/OpenAI-style metadata
- `references/excel-layout.md`
  Workbook structure, export modes, and validation rules

## Quick Start

### Use with Codex

Place the folder under your local skill directory:

```text
~/.codex/skills/cn-trip
```

Example prompts:

```text
Use $cn-trip to plan a China domestic free-travel itinerary.
```

```text
I want an 8-day Tibet trip from Shanghai in August, budget 5000 per person. Use $cn-trip.
```

### Use with Claude or other agents

Use:

- `SKILL.md` as the primary workflow spec
- `references/excel-layout.md` as the spreadsheet/output contract

Do not assume other platforms will consume `agents/openai.yaml` directly.

## Excel Export Positioning

This repository defines a stable Excel output contract. It does not, by itself, guarantee a bundled cross-platform exporter.

In practice, treat the system as two layers:

1. Planning layer
   `cn-trip` defines the planning logic and spreadsheet structure
2. Export layer
   a local exporter, controlled script, or platform-specific tool writes the actual `.xlsx`

This separation is deliberate. It keeps the planning workflow reusable even when the export runtime differs across environments.

## Design Principles

- Ask before assuming
- Budget before polishing
- Use sources with clear trust boundaries
- Freeze structured output before export
- Keep spreadsheet output editable
- Prefer reliable export paths over clever but brittle ones

## Recommended Extensions

If you want to turn this into a broader multi-agent package, the next useful additions are:

- a Claude-specific adapter
- a general JSON schema for plan payloads
- a cross-platform Excel exporter
- install scripts for different agent ecosystems

## License

See [LICENSE](LICENSE).
