import * as XLSX from 'xlsx';
import { LineItem, ProposalData, ComparisonResult } from '../types';

export async function parseExcelFile(file: File): Promise<ProposalData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const items: LineItem[] = [];

        // Limit to first 3 worksheets as per constraints
        const sheetNames = workbook.SheetNames.slice(0, 3);
        let totalCost = 0;

        sheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          let sheetTotal = 0;
          let foundExplicitTotal = false;
          const sheetItems: LineItem[] = [];

          jsonData.forEach((row, index) => {
            if (!row || row.length < 1) return;

            const rowStr = row.map(c => String(c)).join(' ').toLowerCase();
            const isTotalRow = rowStr.includes('total') || rowStr.includes('sum') || rowStr.includes('subtotal');
            const numbers = row.filter(cell => typeof cell === 'number') as number[];

            // If it's a total/subtotal row, we use it for the sheet total but don't add to line items
            if (isTotalRow && numbers.length >= 1) {
              const total = numbers[numbers.length - 1];
              // We prefer "Grand Total" or "Total" over "Subtotal"
              if (!foundExplicitTotal || !rowStr.includes('subtotal')) {
                sheetTotal = total;
                foundExplicitTotal = true;
              }
              return; 
            }

            // Normal line item detection: must have a name and at least 2 numbers (Qty, Price)
            const itemCell = row.find(cell => typeof cell === 'string' && cell.trim().length > 2);
            if (itemCell && numbers.length >= 2) {
              const qty = numbers[0] || 0;
              const price = numbers[1] || 0;
              // If there's a 3rd number, it's likely the pre-calculated total in the sheet
              const rowTotal = numbers.length >= 3 ? numbers[2] : qty * price;

              sheetItems.push({
                item: String(itemCell).trim(),
                quantity: qty,
                unitPrice: price,
                total: rowTotal,
                worksheet: sheetName,
                rowNumber: index + 1
              });
            }
          });

          items.push(...sheetItems);
          
          if (foundExplicitTotal) {
            totalCost += sheetTotal;
          } else {
            // Fallback: sum items from this sheet if no explicit total was found
            totalCost += sheetItems.reduce((sum, i) => sum + i.total, 0);
          }
        });

        resolve({
          fileName: file.name,
          items,
          totalCost
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(comparison: ComparisonResult) {
  const wb = XLSX.utils.book_new();
  const currency = comparison.currencySymbol || '';

  // Summary Tab
  const summaryData = [
    ['MATCHANAUT Comparison Summary'],
    [''],
    ['Metric', 'Baseline (V1)', 'Comparator (V2)', 'Delta', 'Delta %'],
    [`Total Cost (${currency})`, comparison.summary.totalV1, comparison.summary.totalV2, comparison.summary.delta, `${(comparison.summary.deltaPercent * 100).toFixed(2)}%`],
    [`Added Items Impact (${currency})`, '', '', comparison.summary.addedImpact, ''],
    [`Removed Items Impact (${currency})`, '', '', comparison.summary.removedImpact, ''],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Diffs Tab
  const diffsData = [
    ['Status', 'Item', 'Qty V1', 'Qty V2', 'Qty Delta', `Price V1 (${currency})`, `Price V2 (${currency})`, `Price Delta (${currency})`, `Total V1 (${currency})`, `Total V2 (${currency})`, `Total Delta (${currency})`],
    ...comparison.diffs.map((d) => [
      d.status, d.item, d.qtyV1, d.qtyV2, d.qtyDelta, d.priceV1, d.priceV2, d.priceDelta, d.totalV1, d.totalV2, d.totalDelta
    ])
  ];
  const wsDiffs = XLSX.utils.aoa_to_sheet(diffsData);
  XLSX.utils.book_append_sheet(wb, wsDiffs, 'Differential');

  XLSX.writeFile(wb, `Matchanaut_Report_${new Date().getTime()}.xlsx`);
}
