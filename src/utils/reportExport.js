function escapeCsv(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function downloadCsv({ filename, columns, rows }) {
  const header = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows
    .map((row) => columns.map((column) => escapeCsv(column.value(row))).join(","))
    .join("\r\n");
  const csv = `\uFEFF${header}\r\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printReport({ title, subtitle, summary = [], columns, rows }) {
  const printWindow = window.open("", "_blank", "width=1200,height=800");
  if (!printWindow) return false;

  const summaryHtml = summary.length
    ? `<section class="summary">${summary
        .map(
          (item) =>
            `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`
        )
        .join("")}</section>`
    : "";
  const tableHtml = `<table><thead><tr>${columns
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${escapeHtml(column.value(row))}</td>`)
          .join("")}</tr>`
    )
    .join("")}</tbody></table>`;

  printWindow.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #0f172a; font-family: Cairo, Tahoma, Arial, sans-serif; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    .subtitle { margin-bottom: 18px; color: #64748b; font-size: 12px; }
    .summary { display: grid; grid-template-columns: repeat(${Math.max(summary.length, 1)}, 1fr); gap: 8px; margin-bottom: 18px; }
    .summary div { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; }
    .summary span, .summary strong { display: block; }
    .summary span { color: #64748b; font-size: 11px; }
    .summary strong { margin-top: 4px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: right; vertical-align: top; }
    th { background: #f1f5f9; font-weight: 700; }
    tr { page-break-inside: avoid; }
  </style></head><body><h1>${escapeHtml(title)}</h1><div class="subtitle">${escapeHtml(subtitle || "")}</div>${summaryHtml}${tableHtml}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onafterprint = () => printWindow.close();
  printWindow.setTimeout(() => printWindow.print(), 250);
  return true;
}
