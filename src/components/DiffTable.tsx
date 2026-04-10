import React from 'react';
import { DiffItem } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface DiffTableProps {
  diffs: DiffItem[];
  currencySymbol?: string;
  comparisonType?: 'version' | 'vendor';
}

export default function DiffTable({ diffs, currencySymbol, comparisonType }: DiffTableProps) {
  const currency = currencySymbol || '';
  const isVendor = comparisonType === 'vendor';

  const formatQty = (val: number | null | undefined) => {
    if (val === 0) return '0';
    if (!val) return '0';
    const rounded = Math.round(val * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
  };

  if (diffs.length === 0) {
    return (
      <div className="p-12 text-center bg-[rgba(255,255,255,0.04)] rounded-2xl border border-[rgba(255,255,255,0.09)]">
        <AlertCircle className="w-12 h-12 text-[var(--muted2)] mx-auto mb-4" />
        <p className="text-[var(--muted)] font-medium">No significant differences detected between proposals.</p>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl border border-[rgba(255,255,255,0.09)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.09)]">
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-white">Status</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-white">Item / Description</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-white text-right">Qty (V1 → V2)</th>
              <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-white text-right">Price (V1 → V2)</th>
              {isVendor && <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-white text-right">Match Confidence (%)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {diffs.map((diff, i) => (
              <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                <td className="p-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    diff.status === 'New' && "bg-[rgba(52,211,153,0.1)] text-[var(--green)] border border-[rgba(52,211,153,0.2)]",
                    diff.status === 'Removed' && "bg-[rgba(248,113,113,0.1)] text-[var(--red)] border border-[rgba(248,113,113,0.2)]",
                    diff.status === 'Changed' && "bg-[rgba(79,142,247,0.1)] text-[var(--blue)] border border-[rgba(79,142,247,0.2)]"
                  )}>
                    {diff.status === 'New' && <ArrowUpRight className="w-3 h-3" />}
                    {diff.status === 'Removed' && <ArrowDownRight className="w-3 h-3" />}
                    {diff.status === 'Changed' && <Minus className="w-3 h-3" />}
                    {diff.status}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-medium text-[var(--text)] text-sm">{diff.item || 'Unnamed Item'}</p>
                  {diff.notes && diff.notes.toLowerCase() !== 'null' && (
                    <p className="text-[11px] text-[var(--muted2)] mt-0.5">{diff.notes}</p>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm text-[var(--text)]">
                      {formatQty(diff.qtyV1)} → {formatQty(diff.qtyV2)}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold flex items-center gap-1",
                      (diff.qtyDelta || 0) > 0 ? "text-[var(--red)]" : (diff.qtyDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                    )}>
                      {(diff.qtyDelta || 0) > 0 ? '↑' : (diff.qtyDelta || 0) < 0 ? '↓' : ''}
                      {formatQty(Math.abs(diff.qtyDelta || 0))} ({(diff.qtyDeltaPercent > 0 ? '+' : '')}{(diff.qtyDeltaPercent * 100).toFixed(1)}%)
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm text-[var(--text)]">
                      {currency}{(diff.priceV1 || 0).toLocaleString()} → {currency}{(diff.priceV2 || 0).toLocaleString()}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold flex items-center gap-1",
                      (diff.priceDelta || 0) > 0 ? "text-[var(--red)]" : (diff.priceDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                    )}>
                      {(diff.priceDelta || 0) > 0 ? '↑' : (diff.priceDelta || 0) < 0 ? '↓' : ''}
                      {currency}{Math.abs(diff.priceDelta || 0).toLocaleString()} ({(diff.priceDeltaPercent || 0) > 0 ? '+' : ''}{((diff.priceDeltaPercent || 0) * 100).toFixed(1)}%)
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold mt-1",
                      (diff.totalDelta || 0) > 0 ? "text-[var(--red)]" : (diff.totalDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                    )}>
                      Total Impact: {currency}{Math.abs(diff.totalDelta || 0).toLocaleString()} ({(diff.totalDeltaPercent || 0) > 0 ? '+' : ''}{((diff.totalDeltaPercent || 0) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </td>
                {isVendor && (
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "font-mono text-sm font-bold",
                        (diff.confidence || 0) >= 0.9 ? "text-[var(--green)]" : (diff.confidence || 0) >= 0.7 ? "text-[var(--blue)]" : "text-[var(--amber)]"
                      )}>
                        {((diff.confidence || 0) * 100).toFixed(0)}%
                      </span>
                      <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-wider">
                        Match Rate
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
