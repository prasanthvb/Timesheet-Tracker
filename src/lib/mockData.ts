export interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  hours: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ExtractedData {
  portal: 'our' | 'client';
  screenshot: string;
  entries: TimesheetEntry[];
  totalHours: number;
}

export const mockOurTimesheet: ExtractedData = {
  portal: 'our',
  screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
  totalHours: 40,
  entries: [
    { id: '1', date: '2026-02-17', project: 'Internal Dev', hours: 8, status: 'Approved' },
    { id: '2', date: '2026-02-18', project: 'Internal Dev', hours: 8, status: 'Approved' },
    { id: '3', date: '2026-02-19', project: 'Internal Dev', hours: 8, status: 'Approved' },
    { id: '4', date: '2026-02-20', project: 'Internal Dev', hours: 8, status: 'Approved' },
    { id: '5', date: '2026-02-21', project: 'Internal Dev', hours: 8, status: 'Approved' },
  ],
};

export const mockClientTimesheet: ExtractedData = {
  portal: 'client',
  screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
  totalHours: 40, // change to matching hours for scenario 3
  entries: [
    { id: '1', date: '2026-02-17', project: 'Client ABC Phase 2', hours: 8, status: 'Approved' },
    { id: '2', date: '2026-02-18', project: 'Client ABC Phase 2', hours: 8, status: 'Approved' },
    { id: '3', date: '2026-02-19', project: 'Client ABC Phase 2', hours: 8, status: 'Approved' },
    { id: '4', date: '2026-02-20', project: 'Client ABC Phase 2', hours: 8, status: 'Approved' },
    { id: '5', date: '2026-02-21', project: 'Client ABC Phase 2', hours: 8, status: 'Pending' },
  ],
};
