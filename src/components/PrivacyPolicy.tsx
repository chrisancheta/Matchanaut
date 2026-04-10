import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyPolicyProps {
  trigger?: React.ReactNode;
}

export default function PrivacyPolicy({ trigger }: PrivacyPolicyProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#0A0D25] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-2xl relative my-auto flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--blue2)]/10 rounded-lg text-[var(--blue)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text)]">Privacy Policy</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto text-[var(--muted)] space-y-8 text-sm leading-relaxed">
              <div className="space-y-1">
                <p className="font-bold text-[var(--text)]">Effective Date: April 9, 2026</p>
                <p className="font-bold text-[var(--text)]">Last Updated: April 9, 2026</p>
              </div>

              <p>
                Matchanaut ("Matchanaut," "we," "us," or "our") provides an AI-powered application for
                comparing proposal and pricing files. This Privacy Policy describes how we handle information
                in connection with your use of the Matchanaut web application (the "Service").
              </p>

              <section className="space-y-3">
                <h3 className="text-[var(--text)] font-bold text-base">1. Scope of Policy</h3>
                <p>
                  This Privacy Policy applies to all users of the Service. By using Matchanaut, you acknowledge
                  and agree to the practices described herein.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-[var(--text)] font-bold text-base">2. Information We Process</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[var(--text)] font-bold">2.1 User-Provided Files</h4>
                    <p>
                      The Service allows users to upload files (e.g., Excel, PDF, or document formats) for comparison.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>These files are processed <span className="text-[var(--text)] font-bold">transiently and in-memory only</span></li>
                      <li>We do <span className="text-[var(--text)] font-bold">not store, retain, or archive</span> uploaded files</li>
                      <li>We do not associate uploaded content with any identifiable user</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[var(--text)] font-bold">2.2 Derived Data</h4>
                    <p>
                      During processing, the system may generate temporary structured data (e.g., normalized line
                      items, calculated differences, summaries).
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Such data exists <span className="text-[var(--text)] font-bold">only for the duration of the active session</span></li>
                      <li>No derived data is persisted after processing completes or the session ends</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-[var(--text)] font-bold text-base">3. No Data Retention</h3>
                <p>Matchanaut is designed with a <span className="text-[var(--blue)] font-bold">zero-retention architecture</span>:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>No databases store user content</li>
                  <li>No files are written to disk for persistent storage</li>
                  <li>No historical records of comparisons are maintained</li>
                </ul>
                <p>All data is permanently discarded upon:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Completion of processing</li>
                  <li>Page refresh</li>
                  <li>Session termination</li>
                </ul>
              </section>

              <section className="space-y-3 pb-4">
                <h3 className="text-[var(--text)] font-bold text-base">4. Use of Information</h3>
                <p>Information provided to the Service is used solely to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Parse and normalize uploaded documents</li>
                  <li>Match line items across versions</li>
                  <li>Compute pricing and quantity differences</li>
                  <li>Generate summary outputs and reports</li>
                </ul>
                <p className="font-bold text-[var(--text)]">We do not use uploaded data for:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Training machine learning models</li>
                  <li>Analytics or profiling</li>
                  <li>Marketing or advertising purposes</li>
                </ul>
              </section>
            </div>

            <div className="p-6 bg-black/20 flex justify-end shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-2.5 bg-[var(--blue2)] text-white rounded-xl font-bold hover:bg-[var(--blue2)]/90 transition-all shadow-lg shadow-[var(--blue2)]/20"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || <span className="hover:text-[var(--text)] transition-colors">Privacy Policy</span>}
      </div>
      {createPortal(modalContent, document.body)}
    </>
  );
}
