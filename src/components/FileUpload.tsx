import React from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ label, file, onFileSelect }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div 
      className={cn(
        "ucard group",
        file && "border-[var(--blue)]"
      )}
      onClick={() => !file && document.getElementById(`file-input-${label}`)?.click()}
    >
      <div className="u-icon">
        {file ? (
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="w-[18px] h-[18px] text-[var(--green)]">
            <path d="M2 6l2.5 2.5L10 3.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="w-[18px] h-[18px] text-[var(--muted)]">
            <path d="M9 12V4M6 7l3-3 3 3M3 12v2.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V12" />
          </svg>
        )}
      </div>
      
      <div className="u-ver">{label}</div>
      
      {file ? (
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-[var(--text)] truncate max-w-full px-4">
            {file.name}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="text-[9px] uppercase tracking-widest text-[var(--red)] hover:underline"
          >
            Remove File
          </button>
        </div>
      ) : (
        <div className="u-pick">Select file to upload</div>
      )}

      <input
        type="file"
        id={`file-input-${label}`}
        style={{ display: 'none' }}
        accept=".xlsx,.xls,.csv,.pdf"
        onChange={handleFileChange}
      />
    </div>
  );
}
