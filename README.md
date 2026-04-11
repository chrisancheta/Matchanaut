# MATCHANAUT 🚀

**AI-Powered Proposal Comparison Engine**

MATCHANAUT is a professional procurement and sourcing tool designed to normalize and compare messy vendor proposals. Using the Google Gemini AI "Neural Engine," it identifies variances in quantity, price, and scope across multiple versions or competing vendor bids, providing strategic insights and actionable recommendations.

## 🌟 Key Features

- **Multi-Sheet Excel Parsing**: Automatically extracts line items, quantities, and unit prices from complex Excel workbooks (supports up to 3 sheets).
- **Intelligent Version Matching**: Row-independent matching that finds the same item even if descriptions or positions have shifted between versions.
- **Vendor Comparison Mode**: Maps competing proposals from different vendors, identifying "Changed," "New," and "Removed" scope items with confidence scoring.
- **Mission Control Dashboard**: High-level variance analysis including Total Variance, New Scope Impact, and Price Efficiency metrics.
- **Neural Engine Insights**: AI-generated strategic analysis and procurement recommendations for negotiation leverage.
- **Privacy-First Architecture**: Your data stays in your browser. API keys are stored in `localStorage`, and analysis happens directly between your browser and Google's AI.
- **Export Capabilities**: Generate professional Excel reports and PDF summaries of your findings.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **AI Engine**: Google Gemini AI (`@google/genai`)
- **Data Processing**: `xlsx` (SheetJS)
- **Document Generation**: `jspdf`, `jspdf-autotable`
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React

## 🚀 Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/matchanaut.git
   cd matchanaut
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 Usage Guide

1. **Launch the App**: Open the application in your browser.
2. **Configure API Key**: Click the **Key icon** in the top right to enter your Google Gemini API Key. You can get one at [Google AI Studio](https://aistudio.google.com/app/apikey).
3. **Select Comparison Type**: Choose between **Version Comparison** (same vendor, different versions) or **Vendor Comparison** (different vendors).
4. **Upload Files**: Drag and drop your "Baseline" (V1) and "Comparator" (V2) Excel files into the launchpad.
5. **Initiate Launch**: Click "Initiate Comparison" to start the Neural Engine analysis.
6. **Analyze Results**: Review the variance dashboard, AI insights, and the detailed differential table.
7. **Export**: Use the "Export Excel" or "Export PDF" buttons to save your report.

## 🔐 Environment Variables

This application primarily uses a "Bring Your Own Key" (BYOK) model where the user inputs their key in the UI. However, for development or deployment, you can use:

- `VITE_GEMINI_API_KEY`: (Optional) Pre-configure the Gemini API key.

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built for procurement professionals who need to see what actually changed.*
