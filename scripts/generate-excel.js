#!/usr/bin/env node

/**
 * cn-trip Excel 生成器
 *
 * 用法:
 *   node scripts/generate-excel.js --input plan.json --output 方案.xlsx
 *   node scripts/generate-excel.js --stdin < plan.json
 *
 * 输入 JSON 结构见 README。
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ─── 参数解析 ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let inputPath, outputPath, useStdin = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' && args[i + 1]) inputPath = args[++i];
  else if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--stdin') useStdin = true;
}

if (!inputPath && !useStdin) {
  console.error('用法: node scripts/generate-excel.js --input plan.json --output result.xlsx');
  process.exit(1);
}

// ─── 延迟加载 exceljs（自动安装） ─────────────────────────────────────────────

async function loadExcelJS() {
  try {
    return require('exceljs');
  } catch {
    console.log('正在安装 exceljs...');
    const { execSync } = require('child_process');
    execSync('npm install --no-save --no-package-lock exceljs', {
      cwd: __dirname + '/..',
      stdio: 'inherit'
    });
    return require('exceljs');
  }
}

// ─── 工具 ─────────────────────────────────────────────────────────────────────

function loadJSON(filePath) {
  return JSON.parse(stripBom(fs.readFileSync(filePath, 'utf-8')));
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, '');
}

function sheetDefaults(sheet) {
  sheet.properties = { defaultRowHeight: 20 };
  sheet.pageSetup = { orientation: 'portrait', fitToPage: true, fitToWidth: 1 };
}

function headerRow(sheet, columns, data) {
  const row = sheet.addRow(data);
  row.font = { bold: true, size: 11, name: '微软雅黑' };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F0FE' } };
  row.alignment = { vertical: 'middle', wrapText: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  return row;
}

function dataRow(sheet, data) {
  const row = sheet.addRow(data);
  row.font = { size: 10, name: '微软雅黑' };
  row.alignment = { vertical: 'top', wrapText: true };
  return row;
}

function stringifyCellValue(cellValue) {
  if (cellValue === undefined || cellValue === null) return '';
  if (typeof cellValue === 'object') {
    if (cellValue.richText) {
      return cellValue.richText.map(part => part.text || '').join('');
    }
    if (cellValue.text) {
      return String(cellValue.text);
    }
    if (cellValue.result !== undefined && cellValue.result !== null) {
      return String(cellValue.result);
    }
    if (cellValue.hyperlink && cellValue.text) {
      return String(cellValue.text);
    }
  }
  return String(cellValue);
}

function visualTextWidth(text) {
  let width = 0;
  for (const char of text) {
    width += /[^\x00-\xff]/.test(char) ? 2 : 1;
  }
  return width;
}

function autoColWidths(sheet, minWidth = 8, maxWidth = 40) {
  const maxColumnCount = sheet.actualColumnCount || 0;

  for (let colNumber = 1; colNumber <= maxColumnCount; colNumber++) {
    let maxLen = minWidth;

    sheet.eachRow({ includeEmpty: true }, row => {
      const cellText = stringifyCellValue(row.getCell(colNumber).value).trim();
      if (!cellText) return;

      const candidateWidth = Math.ceil(visualTextWidth(cellText) * 1.1) + 2;
      if (candidateWidth > maxLen) {
        maxLen = Math.min(candidateWidth, maxWidth);
      }
    });

    sheet.getColumn(colNumber).width = maxLen;
  }
}

function estimateWrappedLineCount(text, width) {
  if (!text) return 1;
  const lines = stringifyCellValue(text).split(/\r?\n/);
  return lines.reduce((count, line) => {
    const effectiveWidth = Math.max(1, Math.floor(width || 12));
    return count + Math.max(1, Math.ceil(visualTextWidth(line) / effectiveWidth));
  }, 0);
}

function autoRowHeights(sheet, options = {}) {
  const {
    minHeight = 20,
    maxHeight = 160,
    headerHeight = 24,
    perLineHeight = 18
  } = options;

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.height = headerHeight;
      return;
    }

    let maxLines = 1;
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const columnWidth = sheet.getColumn(colNumber).width || 12;
      const lineCount = estimateWrappedLineCount(cell.value, columnWidth - 2);
      if (lineCount > maxLines) {
        maxLines = lineCount;
      }
    });

    row.height = Math.min(maxHeight, Math.max(minHeight, maxLines * perLineHeight));
  });
}

function finalizeSheetLayout(sheet, options = {}) {
  autoColWidths(sheet, options.minWidth, options.maxWidth);
  autoRowHeights(sheet, options);
}

function pickFirst(...values) {
  return values.find(value => value !== undefined && value !== null && value !== '');
}

function normalizeOverviewRows(data) {
  if (Array.isArray(data.overview)) {
    return data.overview;
  }

  if (Array.isArray(data.overviews)) {
    return data.overviews;
  }

  if (data.overview && (data.overview.main || data.overview.backup)) {
    return [data.overview.main, data.overview.backup].filter(Boolean);
  }

  const rows = [];
  if (data.mainOverview) {
    rows.push({
      方案: pickFirst(data.mainOverview.方案, '主方案'),
      ...data.mainOverview
    });
  }
  if (data.backupOverview) {
    rows.push({
      方案: pickFirst(data.backupOverview.方案, '备用方案'),
      ...data.backupOverview
    });
  }
  if (rows.length > 0) {
    return rows;
  }

  if (data.overview && typeof data.overview === 'object') {
    return [data.overview];
  }

  return [];
}

// ─── Sheet 生成器 ─────────────────────────────────────────────────────────────

function buildSheet1行程总览(wb, data) {
  const sheet = wb.addWorksheet('行程总览');
  sheetDefaults(sheet);
  const overviewRows = normalizeOverviewRows(data);
  headerRow(sheet, null, ['方案', '出发地', '目的地', '出行日期', '天数', '返程计划',
    '同行人', '单人预算档位', '是否建议自驾', '单人预算估算', '预估总预算',
    '交通参考', '核心亮点', '关键避坑点']);
  overviewRows.forEach(row => dataRow(sheet, [
    row.方案 || '', row.出发地 || '', row.目的地 || '', row.出行日期 || '',
    row.天数 || '', row.返程计划 || '', row.同行人 || '', row.单人预算档位 || '',
    row.是否建议自驾 || '', row.单人预算估算 || '', row.预估总预算 || '',
    row.交通参考 || '', row.核心亮点 || '', row.关键避坑点 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 48, maxHeight: 120 });
}

function buildSheet详细行程(wb, name, planData) {
  const sheet = wb.addWorksheet(name);
  sheetDefaults(sheet);
  headerRow(sheet, null, ['天数', '时段', '城市/区域', '安排', '建议停留时长',
    '交通方式', '交通费用参考', '交通参考依据', '住宿费用参考', '门票/体验费用参考',
    '餐饮店铺推荐', '餐饮费用参考', '返程衔接', '是否适合自驾', '餐饮建议', '备注']);
  (planData || []).forEach(row => dataRow(sheet, [
    row.天数 || '', row.时段 || '', row.城市区域 || row['城市/区域'] || '',
    row.安排 || '', row.建议停留时长 || '', row.交通方式 || '',
    row.交通费用参考 || '', row.交通参考依据 || '', row.住宿费用参考 || '',
    row.门票体验费用参考 || row['门票/体验费用参考'] || '',
    row.餐饮店铺推荐 || '', row.餐饮费用参考 || '',
    row.返程衔接 || '', row.是否适合自驾 || '', row.餐饮建议 || '', row.备注 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 56, maxHeight: 220 });
}

function buildSheet4预算拆分(wb, data) {
  const sheet = wb.addWorksheet('预算拆分');
  sheetDefaults(sheet);
  headerRow(sheet, null, ['方案', '天数/时段', '关联安排', '费用类别',
    '节省估算', '均衡估算', '舒适估算', '说明']);
  (data.budget || []).forEach(row => dataRow(sheet, [
    row.方案 || '', row.天数时段 || row['天数/时段'] || '',
    row.关联安排 || '', row.费用类别 || '',
    row.节省估算 || '', row.均衡估算 || '', row.舒适估算 || '', row.说明 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 48, maxHeight: 180 });
}

function buildSheet5出行准备清单(wb, data) {
  const sheet = wb.addWorksheet('出行准备清单');
  sheetDefaults(sheet);
  headerRow(sheet, null, ['类别', '物品/事项', '是否必需', '适用原因', '备注']);
  (data.packingList || []).forEach(row => dataRow(sheet, [
    row.类别 || '', row['物品/事项'] || row.物品事项 || '',
    row.是否必需 || '', row.适用原因 || '', row.备注 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 48, maxHeight: 180 });
}

function buildSheet6美食攻略(wb, data) {
  const sheet = wb.addWorksheet('美食攻略');
  sheetDefaults(sheet);
  headerRow(sheet, null, ['城市/区域', '美食类型', '店铺名称', '位置', '推荐内容',
    '推荐理由', '推荐菜/吃法', '适合时段', '人均参考', '避坑点', '来源依据']);
  (data.food || []).forEach(row => dataRow(sheet, [
    row.城市区域 || row['城市/区域'] || '', row.美食类型 || '', row.店铺名称 || '',
    row.位置 || '', row.推荐内容 || '', row.推荐理由 || '',
    row['推荐菜/吃法'] || row.推荐菜吃法 || '', row.适合时段 || '',
    row.人均参考 || '', row.避坑点 || '', row.来源依据 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 56, maxHeight: 220 });
}

function buildSheet7景点历史人文(wb, data) {
  const sheet = wb.addWorksheet('景点历史人文');
  sheetDefaults(sheet);
  headerRow(sheet, null, ['景点/区域', '历史人文主题', '背景简介', '推荐看点',
    '建议停留时长', '适合人群', '备注', '来源依据']);
  (data.history || []).forEach(row => dataRow(sheet, [
    row.景点区域 || row['景点/区域'] || '', row.历史人文主题 || '',
    row.背景简介 || '', row.推荐看点 || '', row.建议停留时长 || '',
    row.适合人群 || '', row.备注 || '', row.来源依据 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 56, maxHeight: 220 });
}

function buildSheet8信息来源(wb, data) {
  const sheet = wb.addWorksheet('信息来源');
  sheetDefaults(sheet);
  headerRow(sheet, null, ['信息类型', '结论或用途', '来源名称', '来源链接',
    '来源级别', '核验状态', '备注']);
  (data.sources || []).forEach(row => dataRow(sheet, [
    row.信息类型 || '', row['结论或用途'] || row.结论用途 || '',
    row.来源名称 || '', row.来源链接 || '',
    row.来源级别 || '', row.核验状态 || '', row.备注 || ''
  ]));
  finalizeSheetLayout(sheet, { minWidth: 10, maxWidth: 56, maxHeight: 220 });
}

function ensureOutputDirectory(filePath) {
  const dir = path.dirname(path.resolve(filePath));
  fs.mkdirSync(dir, { recursive: true });
}

function isLikelyTemporaryPlanFile(filePath) {
  if (!filePath) return false;

  const resolvedPath = path.resolve(filePath);
  const baseName = path.basename(resolvedPath).toLowerCase();
  const parentDir = path.dirname(resolvedPath).toLowerCase();
  const cwd = process.cwd().toLowerCase();
  const tempDir = os.tmpdir().toLowerCase();

  const temporaryNamePatterns = [
    /^temp[_-]/,
    /^tmp[_-]/,
    /^cn-trip-temp[_-]/,
    /_temp\./,
    /_tmp\./
  ];

  const hasTemporaryName = temporaryNamePatterns.some(pattern => pattern.test(baseName));
  const isInSafeCleanupDirectory = parentDir === cwd || parentDir === tempDir;

  return hasTemporaryName && isInSafeCleanupDirectory;
}

function cleanupTemporaryInputFile(filePath) {
  if (!isLikelyTemporaryPlanFile(filePath)) {
    return;
  }

  try {
    fs.unlinkSync(path.resolve(filePath));
    console.log(`🧹 已清理临时文件: ${path.resolve(filePath)}`);
  } catch (error) {
    console.warn(`⚠️  临时文件清理失败: ${path.resolve(filePath)} (${error.message})`);
  }
}

function needsUnicodeSafeRename(filePath) {
  return /[^\x00-\x7F]/.test(path.basename(filePath));
}

async function writeWorkbookWithSafePath(workbook, outputFile) {
  const resolvedOutput = path.resolve(outputFile);
  ensureOutputDirectory(resolvedOutput);

  if (!needsUnicodeSafeRename(resolvedOutput)) {
    await workbook.xlsx.writeFile(resolvedOutput);
    return resolvedOutput;
  }

  const tempName = `cn-trip-${Date.now()}.xlsx`;
  const tempPath = path.join(os.tmpdir(), tempName);
  await workbook.xlsx.writeFile(tempPath);
  fs.renameSync(tempPath, resolvedOutput);
  return resolvedOutput;
}

async function validateWorkbook(ExcelJS, outputFile) {
  const expectedSheets = [
    '行程总览',
    '详细行程（主方案）',
    '详细行程（备用方案）',
    '预算拆分',
    '出行准备清单',
    '美食攻略',
    '景点历史人文',
    '信息来源'
  ];
  const expectedHeaders = {
    '行程总览': ['方案', '出发地', '目的地'],
    '详细行程（主方案）': ['天数', '时段', '城市/区域', '安排', '餐饮建议'],
    '详细行程（备用方案）': ['天数', '时段', '城市/区域', '安排', '餐饮建议'],
    '预算拆分': ['方案', '天数/时段', '关联安排'],
    '出行准备清单': ['类别', '物品/事项', '是否必需'],
    '美食攻略': ['城市/区域', '美食类型', '店铺名称'],
    '景点历史人文': ['景点/区域', '历史人文主题', '背景简介'],
    '信息来源': ['信息类型', '结论或用途', '来源名称']
  };

  const reopened = new ExcelJS.Workbook();
  await reopened.xlsx.readFile(outputFile);
  const actualSheets = reopened.worksheets.map(sheet => sheet.name);

  if (actualSheets.length !== expectedSheets.length) {
    throw new Error(`sheet 数量不正确: ${actualSheets.length}`);
  }

  for (const expectedSheet of expectedSheets) {
    if (!actualSheets.includes(expectedSheet)) {
      throw new Error(`缺少 sheet: ${expectedSheet}`);
    }
    if (/\?{1,}/.test(expectedSheet)) {
      throw new Error(`sheet 名乱码: ${expectedSheet}`);
    }
  }

  for (const [sheetName, headers] of Object.entries(expectedHeaders)) {
    const sheet = reopened.getWorksheet(sheetName);
    const firstRow = sheet.getRow(1);
    const values = firstRow.values.slice(1).map(value => String(value || ''));
    for (const header of headers) {
      if (!values.includes(header)) {
        throw new Error(`${sheetName} 表头缺失: ${header}`);
      }
    }
    const sampledRows = [1, 2, Math.min(sheet.rowCount, 3)]
      .filter((rowNumber, index, rows) => rows.indexOf(rowNumber) === index);
    for (const rowNumber of sampledRows) {
      const row = sheet.getRow(rowNumber);
      const rowText = row.values.slice(1).map(value => String(value || '')).join(' | ');
      if (/\?{1,}/.test(rowText)) {
        throw new Error(`${sheetName} 第 ${rowNumber} 行出现乱码`);
      }
    }
  }
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  const planData = useStdin
    ? JSON.parse(stripBom(fs.readFileSync(0, 'utf-8')))
    : loadJSON(inputPath);

  const outputFile = outputPath || (inputPath
    ? inputPath.replace(/\.json$/, '.xlsx')
    : '旅行方案.xlsx');

  const ExcelJS = await loadExcelJS();
  const wb = new ExcelJS.Workbook();
  wb.creator = 'cn-trip';
  wb.created = new Date();
  wb.views = [{ x: 0, y: 0 }];

  // 按标准顺序构建 8 个 sheet
  buildSheet1行程总览(wb, planData);
  buildSheet详细行程(wb, '详细行程（主方案）', planData.mainPlan);
  buildSheet详细行程(wb, '详细行程（备用方案）', planData.backupPlan);
  buildSheet4预算拆分(wb, planData);
  buildSheet5出行准备清单(wb, planData);
  buildSheet6美食攻略(wb, planData);
  buildSheet7景点历史人文(wb, planData);
  buildSheet8信息来源(wb, planData);

  const writtenFile = await writeWorkbookWithSafePath(wb, outputFile);
  await validateWorkbook(ExcelJS, writtenFile);
  cleanupTemporaryInputFile(inputPath);
  console.log(`✅ Excel 已生成: ${writtenFile}`);

  // 简单校验
  const stats = fs.statSync(writtenFile);
  if (stats.size < 1000) {
    console.warn('⚠️  文件过小，请检查内容是否完整');
  }
}

main().catch(err => {
  console.error('❌ 生成失败:', err.message);
  process.exit(1);
});
