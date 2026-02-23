import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Grid, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const startScenario = (scenario: string) => {
    if (scenario === 'all') {
      navigate('/tracker');
    } else {
      navigate(`/timesheet/${scenario}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="text-center mb-8">
        <h1>Select Timesheet Portal</h1>
        <p className="text-muted text-lg">Automate Timesheet extraction and comparison</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div 
          className={`card glass-panel cursor-pointer card-hover ${hovered === 'Vaisesika' ? 'ring-2 ring-primary' : ''}`}
          onMouseEnter={() => setHovered('Vaisesika')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => startScenario('Vaisesika')}
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(79,70,229,0.1)] text-[var(--primary)] flex items-center justify-center mb-4">
              <Briefcase size={32} />
            </div>
            <h2> Vaisesika Timesheet</h2>
            <p className="text-muted mt-2 text-sm">
              Navigate to internal SSO, capture daily entries, and return structured data.
            </p>
            <button className="btn btn-primary mt-6 w-full group">
              Start extraction <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          className={`card glass-panel cursor-pointer card-hover ${hovered === 'client' ? 'ring-2 ring-secondary' : ''}`}
          onMouseEnter={() => setHovered('client')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => startScenario('client')}
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] text-[var(--secondary)] flex items-center justify-center mb-4">
              <Building2 size={32} />
            </div>
            <h2>Client Timesheet</h2>
            <p className="text-muted mt-2 text-sm">
              Navigate to Client SSO, extract weekly billing hours, and process screenshot.
            </p>
            <button className="btn btn-primary mt-6 w-full group !bg-[var(--secondary)] hover:!bg-[var(--secondary-hover)]">
              Start extraction <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          className={`card glass-panel cursor-pointer card-hover ${hovered === 'all' ? 'ring-2 ring-[var(--danger)]' : ''}`}
          onMouseEnter={() => setHovered('all')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => startScenario('all')}
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(239,68,68,0.1)] text-[var(--danger)] flex items-center justify-center mb-4">
              <Grid size={32} />
            </div>
            <h2>All Timesheets</h2>
            <p className="text-muted mt-2 text-sm">
              Sequential extraction of both portals, generate Client Tracker comparison report.
            </p>
            <button className="btn btn-primary mt-6 w-full group !bg-[var(--danger)] hover:!bg-[#dc2626]">
              Run Tracker <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
