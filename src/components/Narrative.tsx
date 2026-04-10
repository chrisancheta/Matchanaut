import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface NarrativeProps {
  text: string;
}

export default function Narrative({ text }: NarrativeProps) {
  if (!text || text.toLowerCase() === 'null') return null;

  // Robust parser for AI generated content
  // Split by double newline, or by lines that look like headers (e.g. "Strategic Analysis:")
  const sections: string[] = [];
  const rawLines = text.split('\n');
  let currentSection: string[] = [];

  rawLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
        currentSection = [];
      }
      return;
    }

    // If line looks like a header (short, no bullet, ends with colon or is bold)
    const isHeader = trimmed.length < 60 && 
                    !trimmed.startsWith('*') && 
                    !trimmed.startsWith('-') && 
                    (trimmed.endsWith(':') || (trimmed.startsWith('**') && trimmed.endsWith('**')));

    if (isHeader && currentSection.length > 0) {
      sections.push(currentSection.join('\n'));
      currentSection = [line];
    } else {
      currentSection.push(line);
    }
  });

  if (currentSection.length > 0) {
    sections.push(currentSection.join('\n'));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[rgba(155,111,255,0.1)] rounded-lg">
          <Sparkles className="w-5 h-5 text-[rgba(155,111,255,1)]" />
        </div>
        <h2 className="text-xl font-medium text-[var(--text)] uppercase tracking-tight">Neural Engine Insights</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgba(255,255,255,0.04)] p-8 rounded-2xl border border-[rgba(255,255,255,0.09)]"
      >
        <div className="space-y-10">
          {sections.map((section, i) => {
            const lines = section.split('\n').filter(l => l.trim());
            const firstLine = lines[0] || '';
            // Robust title detection: short lines that don't look like bullets
            const isTitle = firstLine.length < 100 && 
                           !firstLine.trim().startsWith('*') && 
                           !firstLine.trim().startsWith('-') && 
                           !firstLine.trim().startsWith('1.');
            
            const title = isTitle ? firstLine.replace(/^[#*-\s]+/, '').replace(/[*_]/g, '').replace(/[:]$/, '').trim() : 'Analysis Insight';
            const contentLines = isTitle ? lines.slice(1) : lines;

            return (
              <div key={i} className="space-y-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)] pb-3">
                  {title.toLowerCase().includes('recommendation') ? (
                    <Zap className="w-4 h-4 text-[var(--amber)]" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-[var(--blue)]" />
                  )}
                  {title}
                </h3>
                <div className="text-sm text-[var(--muted)] leading-relaxed">
                  <ul className="space-y-4">
                    {contentLines.map((line, li) => {
                      const cleanLine = line.replace(/^[#*-\s]+/, '').trim();
                      if (!cleanLine) return null;
                      return (
                        <li key={li} className="flex gap-4 items-start">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)] shrink-0 shadow-[0_0_8px_rgba(79,142,247,0.5)]" />
                          <span className="flex-1 text-[rgba(255,255,255,0.85)]">{cleanLine}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
