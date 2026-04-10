import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Check, X, Info, Star, Activity, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export function SeeWhatChanged() {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <div className="bdot"></div> AI-powered comparison engine
        </div>
        <h1>
          See what changed<br />
          and <span className="h1b">why it matters.</span>
        </h1>
      </div>

      <div className="stage">
        <div className="orb orb-left"></div>
        <div className="orb orb-right"></div>
        <div className="orb orb-center-glow"></div>
        <div className="ring ring-left"></div>
        <div className="ring ring-right"></div>
        
        <svg className="arc-svg" viewBox="0 0 900 420" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M170 200 Q450 80 730 200" stroke="rgba(155,111,255,0.25)" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          <path d="M170 200 Q450 320 730 200" stroke="rgba(79,142,247,0.2)" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          <circle cx="170" cy="200" r="5" fill="rgba(155,111,255,0.5)" />
          <circle cx="730" cy="200" r="5" fill="rgba(79,142,247,0.5)" />
          <circle cx="450" cy="200" r="8" fill="rgba(79,142,247,0.6)" />
          <circle cx="450" cy="200" r="22" stroke="rgba(79,142,247,0.2)" strokeWidth="1" fill="none" />
        </svg>

        {/* Vendor A Floating Items */}
        <div className="absolute inset-0 z-[4]">
          <div className="floating-item animate-float8 left-[10%] top-[15%]" style={{ animationDelay: '0s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">VENDOR_ALPHA.xlsx</div>
          </div>
          <div className="floating-item animate-float8 left-[5%] top-[28%]" style={{ animationDelay: '0.5s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">Project Mgmt</div>
            <div className="f-price a">$45,000</div>
          </div>
          <div className="floating-item animate-float8 left-[12%] top-[42%]" style={{ animationDelay: '1.2s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">Cloud Infra</div>
            <div className="f-price a">$120,000</div>
          </div>
          <div className="floating-item animate-float8 left-[8%] top-[55%]" style={{ animationDelay: '0.8s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">Staff Aug.</div>
            <div className="f-price a">$200,000</div>
          </div>
          <div className="floating-item animate-float8 left-[15%] top-[68%]" style={{ animationDelay: '1.5s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">Contingency</div>
            <div className="f-price a">$30,000</div>
          </div>
          <div className="floating-item animate-float8 left-[10%] top-[82%]" style={{ animationDelay: '2s' }}>
            <div className="f-badge a">A</div>
            <div className="f-label">Total</div>
            <div className="f-price a">$413,000</div>
          </div>
        </div>

        {/* Vendor B Floating Items */}
        <div className="absolute inset-0 z-[4]">
          <div className="floating-item animate-float8 right-[10%] top-[12%]" style={{ animationDelay: '0.3s' }}>
            <div className="f-label">VENDOR_BETA.xlsx</div>
            <div className="f-badge b">B</div>
          </div>
          <div className="floating-item animate-float8 right-[5%] top-[25%]" style={{ animationDelay: '0.9s' }}>
            <div className="f-price b">$38,000</div>
            <div className="f-label">Project Mgmt</div>
            <div className="f-badge b">B</div>
          </div>
          <div className="floating-item animate-float8 right-[12%] top-[38%]" style={{ animationDelay: '1.4s' }}>
            <div className="f-price b">$95,000</div>
            <div className="f-label">Cloud Infra</div>
            <div className="f-badge b">B</div>
          </div>
          <div className="floating-item animate-float8 right-[8%] top-[52%]" style={{ animationDelay: '0.6s' }}>
            <div className="f-price b">$175,000</div>
            <div className="f-label">Staff Aug.</div>
            <div className="f-badge b">B</div>
          </div>
          <div className="floating-item animate-float8 right-[15%] top-[65%]" style={{ animationDelay: '1.8s' }}>
            <div className="f-price b">$50,000</div>
            <div className="f-label">Contingency</div>
            <div className="f-badge b">B</div>
          </div>
          <div className="floating-item animate-float8 right-[10%] top-[78%]" style={{ animationDelay: '2.2s' }}>
            <div className="f-price b">$376,000</div>
            <div className="f-label">Total</div>
            <div className="f-badge b">B</div>
          </div>
        </div>

        <div className="center-card">
          <div className="cc-head">
            <Info className="w-3 h-3" />
            AI Insight
          </div>
          <div className="cc-delta">$37,000</div>
          <div className="cc-sub">total delta, 4 variances found</div>
          <div className="cc-variances">
            <div className="cv">
              <div className="cv-label">Vendor A</div>
              <div className="cv-val text-[var(--red)]">$413,000</div>
            </div>
            <div className="cv">
              <div className="cv-label">Vendor B</div>
              <div className="cv-val text-[var(--green)]">$376,000</div>
            </div>
          </div>
          <div className="cc-body">
            Vendor B is <span className="text-[var(--blue)] font-medium">$37k cheaper</span> overall but allocates <span className="text-[var(--amber)] font-medium">67% more to contingency</span>. Cloud costs are 21% lower, possibly indicating a thinner architecture. <br />
            <span className="text-[var(--text)] font-medium">Challenge Vendor B's contingency before deciding.</span>
          </div>
          <div className="cc-tags">
            <span className="cc-tag">Risk: contingency padding</span>
            <span className="cc-tag">Delta: $37,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingFeatures() {
  const tickerItems = [
    { icon: Star, text: "Zero data retention", color: "b" },
    { icon: Check, text: "Neural normalization", color: "g" },
    { icon: Activity, text: "Exportable AI briefs", color: "b" }
  ];

  return (
    <>
      <div className="section bg-[var(--navy)] relative overflow-hidden">
        <p className="s-label">Why Matchanaut</p>
        <h2 className="s-title">Time better spent on strategy.</h2>
        <div className="before-after mb-16">
          <div className="ba-col before">
            <div className="col-label">Before Matchanaut</div>
            <div className="ba-item">
              <div className="ba-icon x">x</div>
              <span>Doom scrolling two spreadsheets side by side</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon x">x</div>
              <span>Praying you didn't miss a buried change</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon x">x</div>
              <span>Writing your own VLOOKUP formulas and conditional formatting</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon x">x</div>
              <span>"Track Changes" that track nothing useful</span>
            </div>
          </div>
          <div className="ba-col after">
            <div className="col-label">With Matchanaut</div>
            <div className="ba-item">
              <div className="ba-icon ok">→</div>
              <span>Every variance surfaced in minutes</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon ok">→</div>
              <span>AI flags the differences that actually matter</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon ok">→</div>
              <span>Structured insights, not raw data dumps</span>
            </div>
            <div className="ba-item">
              <div className="ba-icon ok">→</div>
              <span>Exportable briefs with talking points built in</span>
            </div>
          </div>
        </div>

        {/* Endless Ticker */}
        <div className="ticker-container">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className={cn("ticker-item", item.color)}>
                <item.icon className="w-3.5 h-3.5" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section border-t-[0.5px] border-b-[0.5px] border-[var(--border)]">
        <p className="s-label">How it works</p>
        <h2 className="s-title">No setup. No integrations.</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-emoji">🌍</div>
            <div className="step-header">
              <div className="step-num">1</div>
              <div className="step-title">Launch Prep</div>
            </div>
            <p className="step-desc">Upload two budget versions (original v. updated) or competing bids (vendor alpha v. vendor beta).</p>
          </div>
          <div className="step-card">
            <div className="step-emoji">🚀</div>
            <div className="step-header">
              <div className="step-num">2</div>
              <div className="step-title">Liftoff</div>
            </div>
            <p className="step-desc">The neural engine normalizes, matches, and maps every line item across both documents automatically.</p>
          </div>
          <div className="step-card">
            <div className="step-emoji">🌕</div>
            <div className="step-header">
              <div className="step-num">3</div>
              <div className="step-title">Lunar Landing</div>
            </div>
            <p className="step-desc">Receive a structured summary of every variance, flagged risks, and a recommendation you can act on immediately.</p>
          </div>
        </div>
      </div>
    </>
  );
}
