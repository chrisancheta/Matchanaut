import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ComparisonResult } from '../types';

export function exportToPDF(comparison: ComparisonResult) {
  const doc = new jsPDF() as any;
  const currency = comparison.currencySymbol || '';

  // Title
  doc.setFontSize(22);
  doc.text('MATCHANAUT Comparison Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 28);

  // Summary
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('Summary Metrics', 14, 40);

  const summaryRows = [
    ['Metric', 'Baseline (V1)', 'Comparator (V2)', 'Delta', 'Delta %'],
    ['Total Cost', 
      `${currency}${(comparison.summary.totalV1 || 0).toLocaleString()}`, 
      `${currency}${(comparison.summary.totalV2 || 0).toLocaleString()}`, 
      `${currency}${(comparison.summary.delta || 0).toLocaleString()}`, 
      `${((comparison.summary.deltaPercent || 0) * 100).toFixed(2)}%`
    ],
    ['Added Impact', '', '', `${currency}${(comparison.summary.addedImpact || 0).toLocaleString()}`, ''],
    ['Removed Impact', '', '', `${currency}${(comparison.summary.removedImpact || 0).toLocaleString()}`, ''],
  ];

  doc.autoTable({
    startY: 45,
    head: [summaryRows[0]],
    body: summaryRows.slice(1),
    theme: 'striped',
  });

  // Narrative
  const finalY = (doc as any).lastAutoTable.finalY || 45;
  doc.setFontSize(16);
  doc.text('AI Narrative Insights', 14, finalY + 15);
  
  doc.setFontSize(10);
  const splitNarrative = doc.splitTextToSize(comparison.narrative, 180);
  doc.text(splitNarrative, 14, finalY + 25);

  // Diffs
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Line Item Differentials', 14, 20);

  const diffRows = comparison.diffs.map(d => [
    d.status,
    d.item,
    d.qtyV1,
    d.qtyV2,
    `${currency}${(d.priceV1 || 0).toLocaleString()}`,
    `${currency}${(d.priceV2 || 0).toLocaleString()}`,
    `${currency}${(d.totalDelta || 0).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: 25,
    head: [['Status', 'Item', 'Qty V1', 'Qty V2', 'Price V1', 'Price V2', 'Total Delta']],
    body: diffRows,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillStyle: [37, 99, 235] }
  });

  doc.save(`Matchanaut_Report_${new Date().getTime()}.pdf`);
}
