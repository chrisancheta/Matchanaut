import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ArrowRight, Loader2, AlertCircle, FileText, TrendingUp, Key, Sparkles } from 'lucide-react';
import { ComparisonResult } from './types';
import { parseExcelFile } from './services/excel';
import { normalizeAndCompare } from './services/gemini';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import LandingFeatures, { SeeWhatChanged } from './components/LandingFeatures';
import { VERSION_A_ITEMS, VERSION_B_ITEMS, VENDOR_A_ITEMS, VENDOR_B_ITEMS } from './constants/sampleData';
import { cn } from './lib/utils';

export default function App() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [comparisonType, setComparisonType] = useState<'version' | 'vendor'>('version');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const loadingMessages = ["Loading...", "Go Flight...", "Internal Power...", "Go For Launch...", "Liftoff..."];

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    setApiKey(savedKey);
  }, []);

  const handleLaunch = async () => {
    if (!file1 || !file2) return;
    
    const currentApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!currentApiKey) {
      setError('Please provide a Gemini API key in settings to continue.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const [v1, v2] = await Promise.all([
        parseExcelFile(file1),
        parseExcelFile(file2)
      ]);

      await runComparison(currentApiKey, v1, v2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during processing. Please check your API key and file formats.');
    } finally {
      setIsProcessing(false);
    }
  };

  const runComparison = async (apiKey: string, v1: any, v2: any) => {
    const aiResult = await normalizeAndCompare(apiKey, v1.items, v2.items, comparisonType);

    const totalV1 = v1.totalCost;
    const totalV2 = v2.totalCost;
    const delta = totalV2 - totalV1;
    const deltaPercent = totalV1 !== 0 ? delta / totalV1 : 0;

    const addedImpact = aiResult.diffs
      .filter(d => d.status === 'New')
      .reduce((sum, d) => sum + (d.totalV2 || 0), 0);
    
    const removedImpact = aiResult.diffs
      .filter(d => d.status === 'Removed')
      .reduce((sum, d) => sum + (d.totalV1 || 0), 0);

    const comparison: ComparisonResult = {
      v1,
      v2,
      diffs: aiResult.diffs,
      narrative: aiResult.narrative,
      comparisonType,
      currencySymbol: aiResult.currencySymbol,
      summary: {
        totalV1,
        totalV2,
        delta,
        deltaPercent,
        addedImpact,
        removedImpact,
        varianceDistribution: {
          price: 0.6,
          quantity: 0.3,
          scope: 0.1
        }
      }
    };

    setResult(comparison);
  };

  const handleTrySample = async () => {
    const currentApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!currentApiKey) {
      setError('Please provide a Gemini API key in settings to try sample data.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const isVersion = comparisonType === 'version';
      const v1Items = isVersion ? VERSION_A_ITEMS : VENDOR_A_ITEMS;
      const v2Items = isVersion ? VERSION_B_ITEMS : VENDOR_B_ITEMS;

      const v1 = {
        fileName: isVersion ? 'Budget_v1.xlsx' : 'Vendor_Alpha_Proposal.xlsx',
        items: v1Items,
        totalCost: v1Items.reduce((sum, item) => sum + item.total, 0)
      };

      const v2 = {
        fileName: isVersion ? 'Budget_v2.xlsx' : 'Vendor_Beta_Proposal.xlsx',
        items: v2Items,
        totalCost: v2Items.reduce((sum, item) => sum + item.total, 0)
      };

      await runComparison(currentApiKey, v1, v2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading sample data.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSession = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-all duration-300">
      {/* Navigation */}
      <nav>
        <a className="logo" href="#">
          <div className="logo-mark">
            <img 
              src="https://storage.googleapis.com/static.antigravity.dev/0969542a-8991-4e4c-9f89-8d146911c751.png" 
              alt="Matchanaut Logo" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="logo-name">MATCHANAUT</div>
          </div>
        </a>
        <div className="nav-r">
          <Settings trigger={
            <button className="ib">
              <Key className="w-3.5 h-3.5" />
            </button>
          } />
          <button 
            className="try-nav" 
            onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Try it now
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SeeWhatChanged />
              
              <LandingFeatures />

              <div ref={uploadSectionRef} className="upload-section scroll-mt-20 bg-[var(--navy)]">
                <p className="s-label">Get started</p>
                <h2 className="s-title mb-8">T-minus Minutes.</h2>

                <div className="mode-tabs">
                  <button 
                    className={cn("mtab", comparisonType === 'version' && "active")}
                    onClick={() => setComparisonType('version')}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="1" y="2" width="4" height="8" rx="1"/><rect x="7" y="2" width="4" height="8" rx="1"/>
                    </svg>
                    Compare Versions
                  </button>
                  <button 
                    className={cn("mtab", comparisonType === 'vendor' && "active")}
                    onClick={() => setComparisonType('vendor')}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1.5 9l2.5-2.5 2 2 4-4.5"/>
                    </svg>
                    Compare Proposals
                  </button>
                </div>

                <div className="upload-grid">
                  <FileUpload
                    label={comparisonType === 'version' ? 'Version A' : 'Proposal A'}
                    file={file1}
                    onFileSelect={setFile1}
                  />
                  <FileUpload
                    label={comparisonType === 'version' ? 'Version B' : 'Proposal B'}
                    file={file2}
                    onFileSelect={setFile2}
                  />
                </div>

                <div className="launch-wrap">
                  <button 
                    onClick={handleLaunch}
                    disabled={!file1 || !file2 || isProcessing}
                    className={cn(
                      "launch-btn",
                      file1 && file2 && !isProcessing && "ready"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {loadingMessages[loadingMessageIndex]}
                      </>
                    ) : (
                      <>
                        <span className="text-lg leading-none">🧑‍🚀</span>
                        Launch Matchanaut
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M2 7h10M8 3.5l3.5 3.5L8 10.5"/>
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleTrySample}
                    disabled={isProcessing}
                    className="mt-4 text-xs font-bold text-[var(--blue)] hover:text-[var(--blue2)] transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-3 h-3" />
                    {comparisonType === 'version' 
                      ? "Preview Compare Versions" 
                      : "Preview Compare Proposals"}
                  </button>
                  
                  {error && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-[var(--red)] text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-8"
            >
              <Dashboard result={result} onReset={resetSession} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-5 border-t border-[var(--border)] flex items-center justify-between">
        <span className="fc">© 2026 Matchanaut. All rights reserved.</span>
        <div className="fc flex gap-6">
          <PrivacyPolicy />
          <TermsOfService />
        </div>
      </footer>
    </div>
  );
}
