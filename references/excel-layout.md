# Excel Layout

Use a multi-sheet workbook. Keep cells structured and editable. Do not dump long prose into Excel.

Default workbook structure:

1. 行程总览
2. 详细行程（主方案）
3. 详细行程（备用方案）
4. 预算拆分
5. 出行准备清单
6. 美食攻略
7. 景点历史人文
8. 信息来源

## Export Modes

Use `standard export` by default.

### Standard export

Optimize for speed and reliability:

- keep row counts tight
- keep text concise
- keep one main citation trail per recommendation family
- avoid repeating long rationale in multiple sheets

Suggested limits:

- `详细行程（主方案）`: up to 3 rows per day by default
- `详细行程（备用方案）`: up to 3 rows per day by default
- `美食攻略`: 6-8 entries total unless the trip spans multiple cities
- `景点历史人文`: 5-8 entries total
- `信息来源`: only sources actually used in the plan

### Detailed export

Use only when the user explicitly asks for extra depth.

Allowed expansions:

- more food entries
- more history notes
- more source rows
- more time-split itinerary rows

## Sheet 1: 行程总览

Purpose: quick summary for reading and comparison.

Suggested columns:

- 方案
- 出发地
- 目的地
- 出行日期
- 天数
- 返程计划
- 同行人
- 单人预算档位
- 是否建议自驾
- 单人预算估算
- 预估总预算
- 交通参考
- 核心亮点
- 关键避坑点

## Sheet 2: 详细行程（主方案）

Purpose: editable day-by-day itinerary for the main plan.

Suggested columns:

- 天数
- 时段
- 城市/区域
- 安排
- 建议停留时长
- 交通方式
- 交通费用参考
- 交通参考依据
- 住宿费用参考
- 门票/体验费用参考
- 餐饮店铺推荐
- 餐饮费用参考
- 返程衔接
- 是否适合自驾
- 餐饮建议
- 备注

Use day-level rows by default. Add morning/afternoon/evening rows only when the split improves clarity.

## Sheet 3: 详细行程（备用方案）

Purpose: editable day-by-day itinerary for the backup plan.

Suggested columns:

- 天数
- 时段
- 城市/区域
- 安排
- 建议停留时长
- 交通方式
- 交通费用参考
- 交通参考依据
- 住宿费用参考
- 门票/体验费用参考
- 餐饮店铺推荐
- 餐饮费用参考
- 返程衔接
- 是否适合自驾
- 餐饮建议
- 备注

Use the same structure as the main plan sheet so the two plans are easy to compare.

## Sheet 4: 预算拆分

Purpose: transparent cost planning.

Suggested columns:

- 方案
- 天数/时段
- 关联安排
- 费用类别
- 节省估算
- 均衡估算
- 舒适估算
- 说明

Required categories:

- 往返交通
- 当地交通
- 住宿
- 餐饮
- 门票/体验
- 机动金额

For transport-heavy trips, make `往返交通` and `当地交通` more granular when possible, such as:

- 去程火车/机票
- 返程火车/机票
- 市内打车/地铁/公交
- 城际接驳

When possible, tie budget rows back to specific itinerary arrangements, for example:

- `D1 去程高铁`
- `D1 入住酒店`
- `D2 景区门票`
- `D2 晚餐推荐店`

When rail is plausible, include reference train numbers, departure station, arrival station, and approximate duration if the source supports it.

## Sheet 5: 出行准备清单

Purpose: practical packing and preparation checklist.

Suggested columns:

- 类别
- 物品/事项
- 是否必需
- 适用原因
- 备注

Adapt the rows to season, destination climate, trip length, companion type, self-driving, and activity scene.

## Sheet 6: 美食攻略

Purpose: give practical eating recommendations instead of generic food lists.

Suggested columns:

- 城市/区域
- 美食类型
- 店铺名称
- 位置
- 推荐内容
- 推荐理由
- 推荐菜/吃法
- 适合时段
- 人均参考
- 避坑点
- 来源依据

Prefer local specialties, representative neighborhoods, and meal-context advice over inflated "must eat" lists.
Default to concise, high-signal entries rather than exhaustive restaurant dumping.
Prefer actual shop recommendations with location cues over generic "try local noodles" advice.

Each food row should be linkable from the detailed itinerary through `餐饮店铺推荐`.

## Sheet 7: 景点历史人文

Purpose: add historical and cultural context that helps the traveler understand the destination.

Suggested columns:

- 景点/区域
- 历史人文主题
- 背景简介
- 推荐看点
- 建议停留时长
- 适合人群
- 备注
- 来源依据

Keep entries concise and factual. Do not invent history or folklore.
Prefer one clean historical note per major stop over many shallow notes.

## Sheet 8: 信息来源

Purpose: separate inspiration from factual verification.

Suggested columns:

- 信息类型
- 结论或用途
- 来源名称
- 来源链接
- 来源级别
- 核验状态
- 备注

Use source levels:

- `体验来源` for Xiaohongshu and Mafengwo style content
- `事实来源` for official or high-trust sources

Use verification status values such as:

- `已核验`
- `未完成事实核验`
- `观点分歧`

For transport references, record enough detail to audit the recommendation. Prefer including:

- 交通类型
- 参考车次/航班
- 出发站/机场
- 到达站/机场
- 预计时长
- 查询日期

Keep this sheet as the canonical place for long links and fine-grained source details. Other sheets should reference the source briefly instead of copying full URLs repeatedly.

## Preview Shape Before Export

Before writing the workbook, show a short preview in chat with:

- Destination result
- 2 plan summaries
- Budget summary
- Self-driving recommendation
- Return plan summary
- Transport reference summary
- Key pitfalls
- Unverified or disputed items

## Export Integrity

Write a real `.xlsx` workbook with intact Unicode text.

If the workbook contains garbled Chinese such as `?` or `????` in sheet names, headers, or content, consider the export failed and regenerate it before presenting success.

Long-text presentation is part of export integrity:

- long cells must use wrapped text instead of overflowing visually
- rows containing long notes, remarks, food recommendations, or source explanations must be tall enough to show the wrapped content
- do not leave itinerary or note cells visually clipped just because the raw text exists in the cell

## Save Flow

Use numbered options for export and location confirmation whenever possible.

Suggested export confirmation:

- `1` 直接导出
- `2` 先微调方案
- `3` 更改保存位置
- `4` 自定义要求

Suggested location choices:

- `1` 桌面
- `2` 下载
- `3` 当前项目目录
- `4` 自定义路径

If the user does not choose a location, default to desktop.

## Validation Checklist

Before reporting success, verify all of the following:

- The file opens as a valid `.xlsx` zip package.
- `xl/workbook.xml` keeps Chinese sheet names intact.
- Worksheet headers keep Chinese text intact.
- Representative body cells keep Chinese text intact.
- Representative long-text rows are not visually clipped by insufficient row height.
- The final file name matches `出发日期_目的地_天数_旅行方案.xlsx`.
- The final save path is reported back to the user.
- The workbook contains all 8 expected sheets with the exact intended names.
- Export mode matches user intent: default `standard`, only `detailed` when requested.
