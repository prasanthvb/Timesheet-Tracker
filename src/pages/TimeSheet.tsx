import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Download, Printer, CheckCircle, Upload, ExternalLink, Search } from 'lucide-react';
import type { ExtractedData } from '../lib/mockData';
import { processImageToOCR } from '../lib/ocrService';
import { exportToExcel, mailExcelReport } from '../lib/exportExcel';

export default function TimeSheet() {
  const { type } = useParams<{ type: string }>();
  
  const [step, setStep] = useState<number>(0); // 0: Upload, 1: OCR Processing, 2: Dashboard
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData | null>(null);

  const isVaisesika = type === 'Vaisesika';
  const title = isVaisesika ? 'Vaisesika Timesheet' : 'Client Timesheet';
  const portalLink = isVaisesika 
    ? import.meta.env.VITE_VAISESIKA_TIMESHEET_URL 
    : import.meta.env.VITE_CLIENT_TIMESHEET_URL;

  const startOCR = async () => {
    if (!uploadedImage) return;
    setStep(1); // Set to processing
    
    // OCR processing using raw text conversion
    const portalType = isVaisesika ? 'our' : 'client';
    const extractedInfo = await processImageToOCR(uploadedImage, portalType); 
    
    setData(extractedInfo);
    setStep(2); // Set to Dashboard
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (step !== 0) return; // Only listen during upload step
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const src = event.target.result as string;
                setUploadedImage(src);
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [step]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const src = event.target.result as string;
          setUploadedImage(src);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => window.print();
  
  const handleExport = () => {
    if (data) exportToExcel(data, `${title.replace(' ', '_')}_Export`);
  };
  
  const handleEmail = () => {
    if (data) mailExcelReport(data, `${title.replace(' ', '_')}_Export`);
  };

  return (
    <div className="w-full mt-4 pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="!mb-2">{title}</h1>
          <p className="text-muted">Automated OCR Timesheet Extraction</p>
        </div>
        
        {step === 2 && (
          <div className="flex gap-4">
            <button className="btn btn-secondary" onClick={handleEmail}>
              <Mail size={16} /> Email Excel Report
            </button>
            <button className="btn btn-secondary" onClick={handleExport}>
              <Download size={16} /> Export Excel
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Print
            </button>
          </div>
        )}
      </div>

      {step === 0 && (
        <div className="flex flex-col items-center justify-center mt-4 w-full max-w-2xl mx-auto text-center">
          <div className="card glass-panel w-full p-8 mb-6">
            <h3>Step 1: Complete your timesheet</h3>
            <p className="text-muted mt-2 mb-6">Click the link below to access your portal, fill out your timesheet, and capture a screenshot of the completed view.</p>
            <a href={portalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary inline-flex items-center gap-2">
               Open {title} Portal <ExternalLink size={16} />
            </a>
          </div>

          <div className="card glass-panel w-full p-8 flex flex-col items-center">
            <h3>Step 2: Provide Screenshot</h3>
            <p className="text-muted mt-2 mb-6">Paste your screenshot from the clipboard or click below to upload.</p>
            
            {uploadedImage ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full border border-[var(--border)] rounded-md min-h-[200px] max-h-[400px] overflow-hidden mb-6 flex items-center justify-center bg-[var(--background)]">
                  <img src={uploadedImage} alt="Uploaded Timesheet" className="max-w-full max-h-[400px] object-contain" />
                  <button className="btn btn-secondary absolute bottom-4 right-4 shadow-lg text-xs py-1" onClick={() => setUploadedImage(null)}>Replace</button>
                </div>
                <button className="btn btn-primary text-lg py-3 px-8 group w-full sm:w-auto" onClick={startOCR}>
                  Generate Report
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[var(--primary)] rounded-lg p-12 flex flex-col items-center justify-center bg-[rgba(79,70,229,0.05)] cursor-pointer transition-colors hover:bg-[rgba(79,70,229,0.1)] w-full">
                <Upload size={48} className="text-[var(--primary)] mb-4" />
                <span className="text-lg font-medium">Click to upload image</span>
                <span className="text-sm text-muted mt-2">or press Ctrl+V / Cmd+V to paste</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center justify-center mt-12 w-full max-w-2xl mx-auto">
          <div className="card glass-panel w-full p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] animate-[pulse_1s_ease-in-out_infinite]"></div>
             
             <Search size={48} className="text-[var(--primary)] mx-auto mb-6 animate-bounce" />
             <h2 className="mb-2">Running OCR Analysis</h2>
             <p className="text-muted">Extracting JSON text data from image and analyzing billable hours...</p>
             
             {uploadedImage && (
               <div className="mt-8 relative max-w-md mx-auto border border-[var(--border)] rounded-md overflow-hidden bg-black/50">
                 <img src={uploadedImage} alt="Reading..." className="w-full opacity-50 grayscale" />
                 <div className="scanner-line"></div>
               </div>
             )}
          </div>
        </div>
      )}

      {step === 2 && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fade-in relative z-10">
          {/* Screenshot Panel */}
          <div className="card glass-panel flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2"><CheckCircle size={20} className="text-[var(--success)]" /> Processed Evidence</h3>
              <span className="badge badge-success">OCR Complete</span>
            </div>
            <div className="flex-1 overflow-hidden rounded-lg border border-[var(--border)] relative bg-[var(--background)]">
              <img 
                src={data.screenshot} 
                alt="Extracted Timesheet Portal Evidence" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Data Table Panel */}
          <div className="card glass-panel flex flex-col h-full">
             <h3 className="mb-4">Generated Dashboard Report</h3>
             <div className="table-wrapper mb-4 flex-1">
               <table>
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Project</th>
                     <th>Hours</th>
                     <th>Detection Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.entries.map((entry) => (
                     <tr key={entry.id}>
                       <td>{entry.date}</td>
                       <td>{entry.project}</td>
                       <td className="font-semibold text-white">{entry.hours} hrs</td>
                       <td>
                         <span className={`badge ${entry.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                           Extracted
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
                 <tfoot className="bg-[rgba(255,255,255,0.03)] border-t border-[var(--border)]">
                   <tr>
                     <td colSpan={2} className="text-right font-semibold">Total Verified Hours:</td>
                     <td className="font-semibold text-[var(--success)]">{data.totalHours} hrs</td>
                     <td></td>
                   </tr>
                 </tfoot>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
