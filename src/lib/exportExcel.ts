import * as XLSX from 'xlsx';
import type { ExtractedData } from './mockData';

export function exportToExcel(data: ExtractedData, filename: string) {
  // Map extracted entries to Excel rows
  const worksheetData = data.entries.map((entry) => ({
    'Date/Day': entry.date,
    'Project': entry.project,
    'Hours': entry.hours,
    'Status': entry.status,
  }));
  
  // Add total hours as final row
  worksheetData.push({
    'Date/Day': 'TOTAL',
    'Project': '',
    'Hours': data.totalHours,
    'Status': 'Approved' as 'Approved' | 'Pending' | 'Rejected',
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheet');

  // Trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function mailExcelReport(data: ExtractedData, filename: string) {
  // In a pure client-side application, we cannot attach a file to a mailto link automatically due to security sandbox constraints.
  // Instead, we will generate the excel file and alert the user to attach it manually,
  // or put the content in the body of the email.
  
  exportToExcel(data, filename);

  const subject = encodeURIComponent(`${filename} Report`);
  const body = encodeURIComponent(`Please find attached the exported Timesheet ${filename} report summary.\n\nTotal Hours: ${data.totalHours}\n\nThis data was extracted via OCR automation.`);
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export function exportComparisonToExcel(ourData: ExtractedData, clientData: ExtractedData, filename: string) {
  // Map our extracted entries to Excel rows and try to find matching client entries
  const isMatched = ourData.totalHours === clientData.totalHours;
  
  const worksheetData = ourData.entries.map((ourEntry) => {
    const clientEntry = clientData.entries.find(e => e.date === ourEntry.date);
    const hoursMatch = clientEntry?.hours === ourEntry.hours;
    
    return {
      'Date/Day': ourEntry.date,
      'Our Project': ourEntry.project,
      'Our Hours': ourEntry.hours,
      'Client Hours': clientEntry ? clientEntry.hours : 0,
      'Match Status': hoursMatch ? 'Passed' : 'Failed'
    }
  });
  
  // Add total hours as final row
  worksheetData.push({
    'Date/Day': 'TOTAL STATUS',
    'Our Project': isMatched ? 'MATCHED' : 'DISCREPANCY',
    'Our Hours': ourData.totalHours,
    'Client Hours': clientData.totalHours,
    'Match Status': isMatched ? 'Passed' : 'Failed',
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheet_Comparison');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function mailComparisonReport(ourData: ExtractedData, clientData: ExtractedData, filename: string) {
  exportComparisonToExcel(ourData, clientData, filename);

  const subject = encodeURIComponent(`${filename} Comparison Report`);
  const isMatched = ourData.totalHours === clientData.totalHours;
  
  const body = encodeURIComponent(`Please find attached the exported comparison ${filename} report.\n\nOur Total Hours: ${ourData.totalHours}\nClient Total Hours: ${clientData.totalHours}\nStatus: ${isMatched ? 'MATCHED' : 'DISCREPANCY DETECTED'}\n\nThis robust analysis was completed via automated OCR tracking.`);
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
