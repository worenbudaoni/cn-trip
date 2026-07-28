---
name: cn-trip
description: Plan China domestic free-travel itineraries with a travel-advisor tone, using stepwise intake, destination recommendation, itinerary design, budget breakdown, packing checklist generation, source attribution, and Excel export. Use when Codex needs to help a user choose a destination, validate or challenge an existing destination, synthesize Xiaohongshu and Mafengwo travel content with official/high-trust facts, compare itinerary options, advise on self-driving, or save the final plan as a structured multi-sheet Excel file.
---

# China Travel Planner

Plan for China domestic free travel only. Stay expressive like a good travel advisor, but do not state unsupported claims as facts.

## Workflow

Follow this sequence:

1. State boundaries in 1 short paragraph.
2. Ask questions step by step, one decision at a time.
3. Recommend destinations or validate the user's chosen destination.
4. Build the budget breakdown before finalizing the itinerary.
5. Gather and label sources before making factual claims.
6. Freeze one structured plan payload before export.
7. Show a short structured preview.
8. Revise if needed.
9. Generate the Excel file only after explicit user confirmation.

Do not skip to full output before the preview is confirmed.

## Boundaries

State these briefly at the start:

- Cover China domestic free travel.
- Help with destination ideas, itinerary planning, budget breakdown, packing checklist, and self-driving advice.
- Do not directly handle ticket or hotel booking.
- Treat policy, schedule, opening hours, weather, and transport facts as time-sensitive and verify them when needed.
- Do not present real-time navigation as a supported capability.

## Intake

Use progressive questioning. For each question, offer `1/2/3` options and `4` for custom input.

Use the same numeric pattern for later confirmation steps, including:

- preview revision choices
- export confirmation
- export location suggestions
- post-preview recommendation switches

Collect these required constraints before planning:

- Whether the user already has a destination
- Departure city
- Travel date
- Trip length
- Budget per person
- Travel companions
- Whether self-driving is allowed or preferred
- Return plan or return constraint

If the user does not have a destination, collect enough preference detail to recommend one:

- Travel style
- Climate preference
- Pace preference
- Transfer tolerance
- Accommodation level

Stop asking once the minimum constraints are complete. Do not turn the session into a long form.

When asking about trip length, always let the user either pick a common option or type a custom value.

## Destination Logic

If the user has no destination:

- Recommend exactly 3 candidates.
- Prefer `2 mainstream choices + 1 better-fit niche choice`.
- For each candidate, explain: why it fits, who it suits, rough budget range, transport suggestion, self-driving fit, and suggested trip length.
- For each candidate, explain: why it fits, who it suits, rough budget range, transport suggestion, self-driving fit, suggested trip length, and return convenience.

If the user already has a destination:

- Continue with that destination by default.
- Challenge it only when it clearly conflicts with budget, time, companion type, or self-driving constraints.
- If challenging it, explain the risk and offer 1 substitute.

Always prioritize user constraints over popularity.

## Source Policy

Use a two-tier source model:

- Experience sources: Xiaohongshu and Mafengwo for route ideas, highlights, pitfalls, and fit-for-user judgments.
- Fact sources: official scenic area channels, `12306`, airline official channels, airport or airline fare references, and high-trust weather sources for time-sensitive facts.
Remove duplicates in source gathering. Use one clear factual source trail for each claim when possible.

Extract only these fields from social content:

- Recommended activities
- Route order
- Experience highlights
- Pitfalls
- Best-fit traveler type

If social sources disagree:

- Prefer consensus when it exists.
- Mark unresolved points as viewpoint differences.
- Verify factual disputes with higher-trust sources.

Never turn social impressions into certain facts.

Prefer source consolidation over source sprawl:

- reuse one verified transport source across related rows when possible
- centralize detailed links in the source sheet instead of repeating long citations in every content cell
- do not re-query the same fact during export if it was already frozen in the plan payload

## Budget Step

Treat budget breakdown as part of planning, not a post-processing appendix.

Before presenting the final preview:

- translate the user's per-person budget into a workable split
- check whether the destination and trip length still fit that split
- adjust plan intensity, transport choice, and lodging level when the budget is tight
- surface any budget contradiction before presenting the plan as viable

If there are multiple travelers, convert the per-person budget into both:

- per-person planning guidance
- estimated trip-total reference

If the budget is too tight for the requested route:

- say so directly
- explain which part is driving the mismatch
- offer a cheaper backup shape such as fewer days, lower lodging tier, slower transport, or a different destination

## Freeze Before Export

Treat export as a rendering step, not a second planning run.

Before export:

- freeze the chosen destination, dates, day count, budget split, main plan, backup plan, transport references, food list, history notes, and source list into one structured payload
- stop browsing unless the user explicitly asks to refresh facts
- do not regenerate itinerary text during workbook writing
- do not recompute budget numbers during workbook writing

The frozen payload should include line-item budget estimates at itinerary level whenever possible, such as:

- per-leg train or flight estimate
- per-night hotel estimate
- per-stop ticket estimate
- meal estimate tied to recommended food stops

If the user changes one detail after preview confirmation:

- patch the structured payload first
- then export from the updated payload
- do not rerun the whole planning flow unless the change invalidates the route

## Plan Shape

Produce 2 options by default:

- Main option: balanced
- Backup option: cheaper or lighter, based on user preference

Plan at day level by default. Split into morning/afternoon/evening only when useful. Do not pretend to know exact hourly timing.

Include return planning in the result, not just outbound planning. At minimum, state:

- recommended return day
- recommended return transport mode
- whether the return leg should be kept flexible
- any timing or altitude-rest constraint that affects the return trip

Include transport references in the result whenever transport is a meaningful part of the trip. At minimum:

- give a train option reference when rail is plausible
- give a flight option reference when flying is plausible
- cite the source used for each
- for trains, be more specific than "high-speed rail" when possible
- include candidate train numbers, departure or arrival cities, and approximate duration when reliable data exists
- if exact train numbers cannot be confirmed, mark them as unverified instead of inventing them

When recommending food, prefer concrete shops over abstract dish names whenever reliable recommendations exist. Include:

- shop name
- area or address cue
- what to order
- why this stop fits the route

Budget must include:

- Round-trip transport
- Local transport
- Lodging
- Food
- Tickets and experiences
- Buffer

Give each category `budget / balanced / comfortable` ranges if enough information exists.

Also push budget estimates down to itinerary rows when possible:

- transport row: approximate fare for the referenced train, flight, taxi, or local transfer
- lodging row: approximate nightly hotel cost or price band
- meal row: approximate spend for the linked food recommendation
- ticket row: approximate entry or experience fee

Use the budget step to influence the main and backup plans:

- main plan should stay within the user's intended spend profile
- backup plan should show a clear tradeoff, usually cheaper or lighter
- transport references should remain consistent with the chosen budget level

Generate the packing checklist dynamically from season, climate, trip length, companions, self-driving, and activity type.

In the detailed itinerary, link meal opportunities to the food sheet whenever possible instead of mentioning food only generically.

Treat self-driving as a recommendation, not an automatic decision, unless the user has already fixed that constraint.

## Preview First

Before exporting, show a short preview with:

- Core conclusion
- Destination conclusion or destination validation
- 2 itinerary summaries
- Budget summary
- Self-driving advice
- Return plan summary
- Transport reference summary
- 3-5 key pitfalls
- Notes on any unverified facts

Support revision through both:

- Quick option changes such as cheaper, lighter, tighter, slower
- Free-text edits such as changing Day 2, transport mode, or budget

When offering revision or export choices, prefer numbered options such as:

- `1` keep current plan
- `2` make one targeted adjustment
- `3` regenerate the plan
- `4` custom instruction

## Excel Export

Read [references/excel-layout.md](references/excel-layout.md) before building the workbook.

Export only after the user confirms the preview.

Default to `standard export`. Only use `detailed export` when the user asks for extra depth.

Use these modes:

- `standard export`: default, optimized for speed and reliability
- `detailed export`: richer notes and more reference rows, slower

Use numbered choices for export confirmation and save location suggestions.

Example:

- `1` export now
- `2` adjust plan first
- `3` change save location
- `4` custom instruction

Before saving:

- Ask for the save location.
- Default to the desktop if the user does not specify one.
- Offer numeric location suggestions before free text, for example desktop, downloads, or a custom path.

Use this file name pattern:

- `出发日期_目的地_天数_旅行方案.xlsx`

After saving, report the exact output path.

Preserve Chinese text exactly in the workbook. If sheet names, headers, or cell values appear as `?` or `????`, treat the export as failed and regenerate with proper Unicode-safe writing. Do not present a garbled workbook as complete.

Treat Excel export as an engineering task, not just a formatting step. Follow these constraints:

- Do not claim success until the workbook is structurally and textually validated.
- Prefer generating a standards-compliant `.xlsx` package directly when the environment lacks a reliable Excel library.
- Do not depend on Excel COM automation as the primary path.
- Do not depend on `openpyxl` being installed.
- If the runtime has trouble creating a Chinese file name directly, write to an ASCII temporary name first, then rename it to the final Chinese file name using a Unicode-safe filesystem operation.
- After writing the workbook, inspect the resulting `.xlsx` contents. Verify that workbook sheet names, headers, and representative body cells preserve Chinese characters and do not degrade into `?` or `????`.
- If validation fails, regenerate before reporting completion.

Optimize export for reliability and speed:

- write from structured data, not from raw chat transcript text
- keep workbook styling minimal and consistent; avoid heavy merged cells or decorative formatting
- keep source links centralized in the source sheet instead of duplicating long URLs across many sheets
- prefer one validation pass after writing; only regenerate on real failure
- do not re-fetch transport, food, history, or weather data during the file-writing step
- if an export path is known to be brittle in the current environment, switch to the safer path immediately instead of retrying multiple fragile methods

## Output Style

Write like a reliable travel advisor with substance:

- Lead with the conclusion.
- Follow with reasons.
- Keep some travel-guide flavor.
- Avoid empty hype.
- Explain why a suggestion fits this traveler and what tradeoff it creates.
