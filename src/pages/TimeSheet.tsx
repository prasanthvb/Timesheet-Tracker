import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Download, Printer, CheckCircle, Clock } from 'lucide-react';
import { mockOurTimesheet, mockClientTimesheet } from '../lib/mockData';
import type { ExtractedData } from '../lib/mockData';

export default function TimeSheet() {
  const { type } = useParams<{ type: string }>();
  
  const [step, setStep] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [data, setData] = useState<ExtractedData | null>(null);

  const title = type === 'our' ? 'Our Timesheet' : 'Client Timesheet';

  useEffect(() => {
    // Simulate SSO Navigation -> Landing -> Screenshot -> Data Extraction
    const sequence = async () => {
      setStep(1); // Navigating to SSO
      await new Promise(r => setTimeout(r, 1500));
      setStep(2); // Landing in timesheet
      await new Promise(r => setTimeout(r, 1500));
      setStep(3); // Taking screenshot & getting daily time
      await new Promise(r => setTimeout(r, 2000));
      
      const mocked = type === 'our' ? mockOurTimesheet : mockClientTimesheet;
      setData(mocked);
      setShowPopup(true); // Show proceed popup 
    };
    
    sequence();
  }, [type]);

  const handleProceed = () => {
    setShowPopup(false);
    setStep(4); // Display Data
  };

  const handlePrint = () => window.print();
  const handleExport = () => alert('Mock: Exporting to PDF/Excel...');
  const handleEmail = () => alert('Mock: Opening email client with report attached...');

  // Extraction Process Screen
  if (step < 4) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 w-full max-w-2xl mx-auto">
        <h2 className="mb-8">Processing {title}...</h2>
        
        <div className="w-full glass-panel p-8">
          <div className="steps-container">
             <div className={`step-item ${step > 0 ? 'completed' : step === 0 ? 'active' : ''}`}>1<span className="step-label">Launch SSO</span></div>
             <div className={`step-item ${step > 1 ? 'completed' : step === 1 ? 'active' : ''}`}>2<span className="step-label">Access Portal</span></div>
             <div className={`step-item ${step > 2 ? 'completed' : step === 2 ? 'active' : ''}`}>3<span className="step-label">Extract & Capture</span></div>
             <div className={`step-item ${step > 3 ? 'completed' : step === 3 ? 'active' : ''}`}>4<span className="step-label">Review</span></div>
          </div>

          <div className="browser-mockup mt-8">
            <div className="browser-header">
              <div className="browser-dots">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
              </div>
              <div className="browser-address">
                https://sso.{type}.timesheet.internal/login
              </div>
            </div>
            <div className="browser-body flex items-center justify-center">
              {step === 1 && <div className="text-center"><Clock className="animate-pulse-btn text-[var(--primary)] mb-4 mx-auto" size={32} /> Authenticating...</div>}
              {step === 2 && <div className="text-center text-[var(--success)]"><CheckCircle className="mb-4 mx-auto" size={32} /> Access Granted. Loading Dashboard...</div>}
              {step === 3 && (
                <>
                  <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    Running Visual Scraper & Data Extractor...
                  </div>
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" className="opacity-50 browser-screenshot-img object-cover h-[200px]" alt="Background Page" />
                  <div className="scanner-line"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* The Action Popup */}
        {showPopup && (
           <div className="modal-overlay">
             <div className="modal-content text-center">
               <div className="w-16 h-16 bg-[rgba(16,185,129,0.1)] text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
               </div>
               <h3>Extraction Complete</h3>
               <p className="text-muted mt-2 mb-6">
                 Successfully navigated to {title} portal, captured screenshot, and extracted daily timesheet data. 
               </p>
               <button className="btn btn-primary w-full" onClick={handleProceed}>
                 Proceed to application for processing
               </button>
             </div>
           </div>
        )}
      </div>
    );
  }

  // Display Complete Data
  if (!data) return null;

  return (
    <div className="w-full mt-4 pb-12 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="!mb-2">{title} Results</h1>
          <p className="text-muted">Extracted from {type === 'our' ? 'Internal SSO' : 'Client SSO'}</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={handleEmail}>
            <Mail size={16} /> Email Report
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Screenshot Panel */}
        <div className="card glass-panel flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2"><Clock size={20} className="text-[var(--primary)]" /> Portal Evidence</h3>
            <span className="badge badge-success">Verified Image</span>
          </div>
          <div className="flex-1 overflow-hidden rounded-lg border border-[var(--border)] relative bg-[var(--background)]">
            <img 
              src={data.screenshot} 
              alt="Extracted Timesheet Portal Evidence" 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>
        </div>

        {/* Data Table Panel */}
        <div className="card glass-panel flex flex-col h-full">
           <h3 className="mb-4">Extracted Timesheet Data</h3>
           <div className="table-wrapper mb-4 flex-1">
             <table>
               <thead>
                 <tr>
                   <th>Date</th>
                   <th>Project</th>
                   <th>Hours</th>
                   <th>Status</th>
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
                         {entry.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
               <tfoot className="bg-[rgba(255,255,255,0.03)] border-t border-[var(--border)]">
                 <tr>
                   <td colSpan={2} className="text-right font-semibold">Total Weekly Hours:</td>
                   <td className="font-semibold text-[var(--success)]">{data.totalHours} hrs</td>
                   <td></td>
                 </tr>
               </tfoot>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
