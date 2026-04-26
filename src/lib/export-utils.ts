/**
 * Excel export utility.
 *
 * Generates a SpreadsheetML 2003 (.xls) file — a native Excel XML format that
 * Excel, Numbers, LibreOffice, and Google Sheets all open directly. No library
 * dependency required.
 *
 * Usage:
 *   exportToExcel({
 *     filename: "candidates",
 *     sheetName: "Candidates",
 *     columns: [
 *       { header: "Name", key: "name", width: 28 },
 *       { header: "Score", key: "score", type: "number", width: 10 },
 *     ],
 *     rows: [{ name: "Jane", score: 92 }],
 *   });
 */

export type ExcelCellType = "string" | "number" | "date";

export type ExcelColumn<T> = {
  header: string;
  key: keyof T | ((row: T) => unknown);
  type?: ExcelCellType;
  width?: number; // characters
};

export type ExportOptions<T> = {
  filename: string;
  sheetName?: string;
  columns: ExcelColumn<T>[];
  rows: T[];
};

function xmlEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\r?\n/g, "&#10;");
}

function inferType(value: unknown, declared?: ExcelCellType): ExcelCellType {
  if (declared) return declared;
  if (typeof value === "number" && Number.isFinite(value)) return "number";
  if (value instanceof Date) return "date";
  return "string";
}

function cellValue(value: unknown, type: ExcelCellType): string {
  if (value === null || value === undefined) return "";
  if (type === "number") {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? String(n) : "";
  }
  if (type === "date") {
    const d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return "";
    // SpreadsheetML accepts ISO 8601
    return d.toISOString().slice(0, 19);
  }
  return xmlEscape(value);
}

function xmlType(type: ExcelCellType): string {
  if (type === "number") return "Number";
  if (type === "date") return "DateTime";
  return "String";
}

function getCellValue<T>(row: T, col: ExcelColumn<T>): unknown {
  if (typeof col.key === "function") return col.key(row);
  return (row as Record<string, unknown>)[col.key as string];
}

function buildWorkbookXml<T>(opts: ExportOptions<T>): string {
  const sheetName = opts.sheetName ?? "Sheet1";
  // Excel sheet-name sanitization: strip : \ / ? * [ ]  and cap at 31 chars
  const safeSheetName =
    sheetName.replace(/[:\\/?*[\]]/g, "").slice(0, 31) || "Sheet1";

  const columnsXml = opts.columns
    .map(
      (c) =>
        `<Column ss:AutoFitWidth="0" ss:Width="${Math.max(24, (c.width ?? Math.max(c.header.length + 4, 14)) * 7)}"/>`,
    )
    .join("");

  const headerCellsXml = opts.columns
    .map(
      (c) =>
        `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${xmlEscape(c.header)}</Data></Cell>`,
    )
    .join("");

  const dataRowsXml = opts.rows
    .map((row) => {
      const cells = opts.columns
        .map((col) => {
          const rawValue = getCellValue(row, col);
          const t = inferType(rawValue, col.type);
          const v = cellValue(rawValue, t);
          return `<Cell ss:StyleID="sBody"><Data ss:Type="${xmlType(t)}">${v}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Recruit</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Inter" ss:Size="11" ss:Color="#1F1B17"/>
    </Style>
    <Style ss:ID="sHeader">
      <Alignment ss:Vertical="Center" ss:Horizontal="Left"/>
      <Font ss:FontName="Inter" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#EA6814" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#C75510"/>
      </Borders>
    </Style>
    <Style ss:ID="sBody">
      <Alignment ss:Vertical="Center" ss:Horizontal="Left" ss:WrapText="1"/>
      <Font ss:FontName="Inter" ss:Size="11" ss:Color="#1F1B17"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EF"/>
      </Borders>
    </Style>
  </Styles>
  <Worksheet ss:Name="${xmlEscape(safeSheetName)}">
    <Table>
      ${columnsXml}
      <Row ss:Height="24">${headerCellsXml}</Row>
      ${dataRowsXml}
    </Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <FreezePanes/>
      <FrozenNoSplit/>
      <SplitHorizontal>1</SplitHorizontal>
      <TopRowBottomPane>1</TopRowBottomPane>
      <ActivePane>2</ActivePane>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;
  return header;
}

function triggerDownload(filename: string, mime: string, data: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob(["﻿", data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Release the blob URL on the next tick so the download dialog can read it first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function exportToExcel<T>(opts: ExportOptions<T>): void {
  const xml = buildWorkbookXml(opts);
  const filename = `${opts.filename}-${timestamp()}.xls`;
  triggerDownload(filename, "application/vnd.ms-excel;charset=utf-8", xml);
}
