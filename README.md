# Vaisesika-TimeTracker

An automated, intelligent Timesheet Extraction and Comparison tool built with React, TypeScript, and Vite. This application utilizes client-side Optical Character Recognition (OCR) via `tesseract.js` to extract dates and billable hours directly from timesheet portal screenshots. It eliminates manual entry by parsing image data, converting it to structured JSON, and presenting it in a clean dashboard, out of which Excel reports can be generated directly.

## Features

- **Automated Timesheet Extraction:** Just upload or click-to-paste (`Ctrl+V` / `Cmd+V`) a screenshot of your timesheet.
- **Dual-Portal Validation:** Dedicated interfaces for processing internal (Vaisesika) and external (Client) timesheets.
- **Client Tracker Dashboard:** Compare extracted internal and client tracking hours side-by-side. Highlights matches or pinpoints discrepancies instantly.
- **Client-Side OCR Processing:** Powered by `tesseract.js`, the app reads text data securely entirely within your browser. 
- **Export to Excel:** Utilize the `xlsx` library to natively generate `.xlsx` audit reports to save locally or attach to emails.

## Prerequisites

- [Node.js](https://nodejs.org/) (Version 18+ is recommended)
- `npm` or `yarn`

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd Timesheet-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the project with the corresponding URLs for your Timesheet portals.

   ```env
   # .env
   VITE_VAISESIKA_TIMESHEET_URL=https://vaisesika.timesheet.example.com
   VITE_CLIENT_TIMESHEET_URL=https://client.timesheet.example.com
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will become accessible at `http://localhost:5173`. Any changes to the source code will auto-refresh the browser via Vite's HMR.

## Project Structure Highlights

- **`src/pages/`**: Contains the core routing screens (`Home.tsx`, `TimeSheet.tsx`, `ClientTracker.tsx`).
- **`src/lib/ocrService.ts`**: The dedicated parsing script that invokes Tesseract, runs text pattern recognition (Regex), and structures raw images to JSON entries.
- **`src/lib/exportExcel.ts`**: Helper utilities mapping JSON timesheet records to formatted downloadable `.xlsx` spreadsheets.

## Deployment & Build

To generate an optimized production build:
```bash
npm run build
```
This will compile TypeScript and output the static bundles into the `dist/` folder, ready for deployment.
