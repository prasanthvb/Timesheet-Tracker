import { useState } from 'react';
import { Mail, Download, Printer, CheckCircle, XCircle, AlertTriangle, PlayCircle, ExternalLink, Upload, Search } from 'lucide-react';
import type { ExtractedData } from '../lib/mockData';
import { processImageToOCR } from '../lib/ocrService';
import { exportComparisonToExcel, mailComparisonReport } from '../lib/exportExcel';

export default function ClientTracker() {
  const [step, setStep] = useState<number>(0);
  const [ourImage, setOurImage] = useState<string | null>(null);
  const [clientImage, setClientImage] = useState<string | null>(null);
  const [ourData, setOurData] = useState<ExtractedData | null>(null);
  const [clientData, setClientData] = useState<ExtractedData | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'our' | 'client') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === 'our') setOurImage(event.target.result as string);
          else setClientImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!ourImage || !clientImage) return;
    setStep(1);
    
    // Process both images through OCR in parallel
    const [ourExtracted, clientExtracted] = await Promise.all([
      processImageToOCR(ourImage, 'our'),
      processImageToOCR(clientImage, 'client')
    ]);
    
    setOurData(ourExtracted);
    setClientData(clientExtracted);
    
    setStep(2);
  };
  
  const isMatched = ourData?.totalHours === clientData?.totalHours;

  const handlePrint = () => window.print();
  const handleExport = () => {
    if (ourData && clientData) exportComparisonToExcel(ourData, clientData, 'Vaisesika_Client_Comparison');
  };
  const handleEmail = () => {
    if (ourData && clientData) mailComparisonReport(ourData, clientData, 'Vaisesika_Client_Comparison');
  };

  const renderDataSection = (title: string, data: ExtractedData | null) => {
    if (!data) return null;
    
    return (
      <div className="card glass-panel mt-6 relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-6">
           <div className="md:w-1/3 min-w-[200px] border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)]">
              <div className="bg-[#1e293b] text-white p-2 text-center text-sm font-semibold border-b border-[var(--border)] relative z-20">
                {title} Verification Image
              </div>
              <img src={data.screenshot} alt="Screenshot" className="w-full h-full object-cover max-h-[180px]" />
           </div>
           
           <div className="flex-1 table-wrapper">
              <table className="w-full text-sm">
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Project/Code</th>
                     <th>Hours</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.entries.map((entry) => (
                     <tr key={entry.id}>
                       <td>{entry.date}</td>
                       <td>{entry.project}</td>
                       <td className="font-semibold">{entry.hours}h</td>
                       <td>
                         <span className={`badge ${entry.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                           Extracted
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
                 <tfoot>
                   <tr className="bg-[rgba(255,255,255,0.03)] border-t border-[var(--border)] text-[var(--success)] font-bold">
                     <td colSpan={2} className="text-right">Total Hours:</td>
                     <td colSpan={2}>{data.totalHours} hours</td>
                   </tr>
                 </tfoot>
              </table>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-4 pb-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 lg:gap-4">
        <div>
           <h1>Client Tracker</h1>
           <p className="text-muted text-lg flex items-center gap-2 mb-4">
             <PlayCircle size={20} className="text-[var(--primary)]" />
             Aggregated Timesheet Comparison & Report
           </p>
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
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-wrap gap-4 mt-2">
            <a href={import.meta.env.VITE_VAISESIKA_TIMESHEET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm flex items-center gap-2">
              Open Vaisesika Portal <ExternalLink size={16} />
            </a>
            <a href={import.meta.env.VITE_CLIENT_TIMESHEET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary !bg-[var(--secondary)] hover:!bg-[var(--secondary-hover)] text-sm flex items-center gap-2">
              Open Client Portal <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="card glass-panel p-8 flex flex-col items-center">
              <h3 className="mb-6 !text-[var(--primary)]">1. Vaisesika Timesheet Upload</h3>
              {ourImage ? (
                <div className="relative w-full border border-[var(--border)] rounded-md flex-1 min-h-[200px] overflow-hidden">
                  <img src={ourImage} alt="Vaisesika Timesheet" className="w-full h-full object-contain" />
                  <button className="btn btn-secondary absolute bottom-4 right-4 shadow-lg text-xs py-1" onClick={() => setOurImage(null)}>Replace</button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[var(--primary)] rounded-lg p-8 flex flex-col items-center justify-center bg-[rgba(79,70,229,0.05)] cursor-pointer transition-colors hover:bg-[rgba(79,70,229,0.1)] w-full flex-1 min-h-[200px]">
                  <Upload size={32} className="text-[var(--primary)] mb-4" />
                  <span className="font-medium">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'our')} />
                </label>
              )}
            </div>

            <div className="card glass-panel p-8 flex flex-col items-center">
              <h3 className="mb-6 !text-[var(--secondary)]">2. Client Timesheet Upload</h3>
              {clientImage ? (
                <div className="relative w-full border border-[var(--border)] rounded-md flex-1 min-h-[200px] overflow-hidden">
                  <img src={clientImage} alt="Client Timesheet" className="w-full h-full object-contain" />
                  <button className="btn btn-secondary absolute bottom-4 right-4 shadow-lg text-xs py-1" onClick={() => setClientImage(null)}>Replace</button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[var(--secondary)] rounded-lg p-8 flex flex-col items-center justify-center bg-[rgba(16,185,129,0.05)] cursor-pointer transition-colors hover:bg-[rgba(16,185,129,0.1)] w-full flex-1 min-h-[200px]">
                  <Upload size={32} className="text-[var(--secondary)] mb-4" />
                  <span className="font-medium">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'client')} />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
             <button 
               className="btn btn-primary text-lg py-4 px-12 group" 
               disabled={!ourImage || !clientImage}
               onClick={startAnalysis}
             >
               {!ourImage || !clientImage 
                 ? "Upload both screenshots to continue" 
                 : "Generate Report"}
             </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center justify-center mt-12 w-full max-w-2xl mx-auto">
          <div className="card glass-panel w-full p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] animate-[pulse_1s_ease-in-out_infinite]"></div>
             
             <Search size={48} className="text-[var(--primary)] mx-auto mb-6 animate-bounce" />
             <h2 className="mb-2">Running Dual-OCR Comparison</h2>
             <p className="text-muted">Extracting billable entries from both portals and running cross-validation algorithms...</p>
             
             <div className="flex justify-center gap-4 mt-8">
               <div className="relative w-1/2 max-w-[200px] border border-[var(--border)] rounded-md overflow-hidden bg-black/50">
                 <img src={ourImage!} alt="Reading Our..." className="w-full opacity-50 grayscale" />
                 <div className="scanner-line"></div>
               </div>
               <div className="relative w-1/2 max-w-[200px] border border-[var(--border)] rounded-md overflow-hidden bg-black/50">
                 <img src={clientImage!} alt="Reading Client..." className="w-full opacity-50 grayscale" />
                 <div className="scanner-line !animation-delay-500"></div>
               </div>
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6 w-full relative">
          <div className="absolute left-[30px] top-6 bottom-6 w-1 bg-[var(--border)] rounded-full hidden lg:block z-0 opacity-50"></div>
          
          <div className="w-full ml-0 lg:ml-12 relative z-10 w-full">
             <div className="hidden lg:flex w-6 h-6 rounded-full bg-[var(--primary)] text-white items-center justify-center font-bold text-xs absolute -left-[75px] top-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]">1</div>
             <h2 className="mb-2">Phase 1: Vaisesika Timesheet</h2>
             {renderDataSection("Vaisesika Timesheet", ourData)}
          </div>

          <div className="w-full ml-0 lg:ml-12 mt-8 relative z-10 w-full animate-fade-in">
             <div className="hidden lg:flex w-6 h-6 rounded-full bg-[var(--secondary)] text-white items-center justify-center font-bold text-xs absolute -left-[75px] top-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]">2</div>
             <h2 className="mb-2">Phase 2: Client Timesheet Verification</h2>
             {renderDataSection("Client Timesheet", clientData)}
          </div>

          <div className="w-full ml-0 lg:ml-12 mt-12 mb-8 relative z-10 animate-fade-in w-full">
            <div className="hidden lg:flex w-6 h-6 rounded-full bg-[#3b82f6] text-white items-center justify-center font-bold text-xs absolute -left-[75px] top-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]">3</div>
            
            <div className={`card ${isMatched ? 'border-l-4 border-l-[var(--success)] bg-[rgba(16,185,129,0.05)]' : 'border-l-4 border-l-[var(--danger)] bg-[rgba(239,68,68,0.05)]'} glass-panel w-full`}>
               <div className="flex items-start md:items-center gap-6 p-2 w-full">
                 <div className={`p-4 rounded-full ${isMatched ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'} text-white`}>
                   {isMatched ? <CheckCircle size={32} /> : <XCircle size={32} />}
                 </div>
                 <div className="flex-1">
                   <h2 className={isMatched ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
                     {isMatched ? 'Timesheets Matched' : 'Discrepancy Detected'}
                   </h2>
                   <p className="text-muted text-lg mt-1">
                     {isMatched 
                       ? `Internal DB and Client SSO both show exactly ${ourData?.totalHours} billable hours.` 
                       : `Mismatch: Internal portal shows ${ourData?.totalHours} hrs, but Client portal shows ${clientData?.totalHours} hrs.`
                     }
                   </p>
                 </div>
                 <div className="hidden md:block">
                   <div className="flex flex-col gap-2">
                     <span className="badge bg-[var(--surface)] border border-[var(--border)] text-white py-2 px-4 shadow">
                       Our: {ourData?.totalHours}h
                     </span>
                     <span className="badge bg-[var(--surface)] border border-[var(--border)] text-white py-2 px-4 shadow">
                       Client: {clientData?.totalHours}h
                     </span>
                   </div>
                 </div>
               </div>
               
               <div className="mt-8 table-wrapper">
                 <table className="w-full text-sm">
                   <thead>
                     <tr>
                       <th>Date</th>
                       <th>Our Hours</th>
                       <th>Client Hours</th>
                       <th>Match Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {ourData?.entries.map((ourEntry) => {
                       const clientEntry = clientData?.entries.find(e => e.date === ourEntry.date);
                       const hoursMatch = clientEntry?.hours === ourEntry.hours;
                       return (
                         <tr key={ourEntry.date}>
                           <td>{ourEntry.date}</td>
                           <td>{ourEntry.hours}h ({ourEntry.project})</td>
                           <td>{clientEntry ? `${clientEntry.hours}h (${clientEntry.project})` : 'Missing entry'}</td>
                           <td>
                             {hoursMatch ? (
                               <div className="match-success"><CheckCircle size={14} /> Passed</div>
                             ) : (
                               <div className="match-error"><AlertTriangle size={14} /> Failed</div>
                             )}
                           </td>
                         </tr>
                       )
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
