import React from 'react';
import { ComparisonResult } from '../types';
import { DollarSign, TrendingUp, PackagePlus, PackageMinus, Download, RefreshCw, FileText, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import DiffTable from './DiffTable';
import Narrative from './Narrative';
import { exportToExcel } from '../services/excel';
import { exportToPDF } from '../services/pdf';

interface DashboardProps {
  result: ComparisonResult;
  onReset: () => void;
}

export default function Dashboard({ result, onReset }: DashboardProps) {
  const currency = result.currencySymbol || '';
  
  const stats = [
    {
      label: 'Total Variance',
      value: `${currency}${Math.abs(result.summary.delta || 0).toLocaleString()}`,
      sub: `${(result.summary.delta || 0) >= 0 ? '↑' : '↓'} ${((result.summary.deltaPercent || 0) * 100).toFixed(1)}%`,
      icon: DollarSign,
      color: (result.summary.delta || 0) > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]',
      bg: (result.summary.delta || 0) > 0 ? 'bg-[rgba(248,113,113,0.1)]' : 'bg-[rgba(52,211,153,0.1)]'
    },
    {
      label: 'New Scope Impact',
      value: `${currency}${(result.summary.addedImpact || 0).toLocaleString()}`,
      sub: 'Added line items',
      icon: PackagePlus,
      color: 'text-[var(--blue)]',
      bg: 'bg-[rgba(79,142,247,0.1)]'
    },
    {
      label: 'Removed Scope Impact',
      value: `${currency}${(result.summary.removedImpact || 0).toLocaleString()}`,
      sub: 'Removed line items',
      icon: PackageMinus,
      color: 'text-[var(--amber)]',
      bg: 'bg-[rgba(251,191,36,0.1)]'
    },
    {
      label: 'Price Efficiency',
      value: `${((result.summary.varianceDistribution?.price || 0) * 100).toFixed(1)}%`,
      sub: 'Price variance weight',
      icon: TrendingUp,
      color: 'text-[rgba(155,111,255,1)]',
      bg: 'bg-[rgba(155,111,255,0.1)]'
    }
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-medium text-[var(--text)] tracking-tight">Mission Control Dashboard</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Analyzing <span className="font-mono text-[var(--text)]">{result.v1.fileName}</span> vs <span className="font-mono text-[var(--text)]">{result.v2.fileName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToExcel(result)}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => exportToPDF(result)}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB]/90 transition-all shadow-lg shadow-[#2563EB]/20"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[rgba(255,255,255,0.04)] p-6 rounded-2xl border border-[rgba(255,255,255,0.09)]"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 mx-auto", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1 text-center">{stat.label}</p>
            <p className={cn("text-2xl font-medium tracking-tight text-center", stat.color)}>{stat.value}</p>
            <p className={cn(
              "text-xs font-medium mt-1 text-center",
              stat.label === 'Total Variance' 
                ? ((result.summary.delta || 0) > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]')
                : 'text-[var(--muted)]'
            )}>
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* AI Narrative */}
      <Narrative text={result.narrative} />

      {/* Diff Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-[var(--text)] uppercase tracking-tight">Differential Findings</h2>
          <span className="text-[10px] font-bold text-white bg-[rgba(255,255,255,0.06)] px-2.5 py-1 rounded-full uppercase tracking-widest">
            {result.diffs.length} CHANGES DETECTED
          </span>
        </div>
        <DiffTable 
          diffs={result.diffs} 
          currencySymbol={result.currencySymbol} 
          comparisonType={result.comparisonType}
        />
      </div>
    </div>
  );
}
