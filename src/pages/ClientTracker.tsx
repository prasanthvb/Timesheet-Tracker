import { useState, useEffect } from 'react';
import { Mail, Download, Printer, CheckCircle, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import { mockOurTimesheet, mockClientTimesheet } from '../lib/mockData';
import type { ExtractedData } from '../lib/mockData';

export default function ClientTracker() {
  const [step, setStep] = useState<number>(0);
  const [ourData, setOurData] = useState<ExtractedData | null>(null);
  const [clientData, setClientData] = useState<ExtractedData | null>(null);

  // Auto-run sequentially
  useEffect(() => {
    const runExtractionFlow = async () => {
      // Small delay before starting
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 1: Processing Our Timesheet
      setStep(1);
      await new Promise(r => setTimeout(r, 2000));
      setOurData(mockOurTimesheet);
      
      // Step 2: Processing Client Timesheet (Mandatory)
      setStep(2);
      await new Promise(r => setTimeout(r, 2500));
      setClientData(mockClientTimesheet);
      
      // Step 3: Comparison logic
      setStep(3);
    };
    
    runExtractionFlow();
  }, []);

  const handlePrint = () => window.print();
  const handleExport = () => alert('Mock: Exporting comparison to PDF/Excel...');
  const handleEmail = () => alert('Mock: Opening email client with comparison report attached...');

  // Comparison logic
  const isMatched = ourData?.totalHours === clientData?.totalHours;

  const renderDataSection = (title: string, data: ExtractedData | null, type: 'our' | 'client') => {
    if (!data) {
      return (
        <div className="card glass-panel flex flex-col items-center justify-center p-8 mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)] mb-4"></div>
          <p className="text-muted">Extracting data from {type === 'our' ? 'Internal Portal' : 'Client SSO'}...</p>
        </div>
      );
    }
    
    return (
      <div className="card glass-panel mt-6 animate-fade-in relative z-10 w-full">
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
                           {entry.status}
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
    <div className="w-full mt-4 pb-12">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
           <h1>Client Tracker</h1>
           <p className="text-muted text-lg flex items-center gap-2">
             <PlayCircle size={20} className="text-[var(--primary)]" />
             Sequential Automation Report
           </p>
        </div>
        
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={handleEmail} disabled={step < 3}>
            <Mail size={16} /> Email Report
          </button>
          <button className="btn btn-secondary" onClick={handleExport} disabled={step < 3}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handlePrint} disabled={step < 3}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full relative">
        <div className="absolute left-[30px] top-6 bottom-6 w-1 bg-[var(--border)] rounded-full hidden lg:block z-0 opacity-50"></div>
        
        {/* Scenario 1 result */}
        <div className="w-full ml-0 lg:ml-12 relative z-10 w-full">
           <div className="hidden lg:flex w-6 h-6 rounded-full bg-[var(--primary)] text-white items-center justify-center font-bold text-xs absolute -left-[75px] top-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]">1</div>
           <h2 className="mb-2">Phase 1: Vaisesika Timesheet</h2>
           {renderDataSection("Vaisesika Timesheet", ourData, 'our')}
        </div>

        {/* Scenario 2 result */}
        {step >= 2 && (
          <div className="w-full ml-0 lg:ml-12 mt-8 relative z-10 animate-fade-in w-full">
             <div className="hidden lg:flex w-6 h-6 rounded-full bg-[var(--secondary)] text-white items-center justify-center font-bold text-xs absolute -left-[75px] top-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]">2</div>
             <h2 className="mb-2">Phase 2: Client Timesheet Verification</h2>
             {renderDataSection("Client Timesheet", clientData, 'client')}
          </div>
        )}

        {/* Comparison Result */}
        {step === 3 && (
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
               
               {/* Day-by-Day comparison table */}
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
        )}
      </div>
    </div>
  );
}
