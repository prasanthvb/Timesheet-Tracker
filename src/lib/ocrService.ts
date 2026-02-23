import Tesseract from 'tesseract.js';
import type { TimesheetEntry, ExtractedData } from './mockData';

export async function processImageToOCR(imageSrc: string, portal: 'our' | 'client'): Promise<ExtractedData> {
  const result = await Tesseract.recognize(imageSrc, 'eng', {
    logger: m => console.log(m),
  });

  const text = result.data.text;
  console.log("Raw OCR JSON Text Extraction:", JSON.stringify(text));

  // Heuristic parser to detect Date/Day and Hours from OCR text lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const entries: TimesheetEntry[] = [];
  let totalHours = 0;
  
  // Regex to capture standard day names or short names
  const dayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i;
  // Regex to capture dates like MM/DD/YYYY, YYYY-MM-DD, or DD-MM-YYYY
  const dateRegex = /(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/;
  // Regex to capture hours like numbers up to 24 with optional decimal (e.g., 8, 8.5)
  // We'll look for independent numbers 
  const numRegex = /\b([0-9]|1[0-9]|2[0-4])(\.\d{1,2})?\b/g;

  let idCounter = 1;

  for (const line of lines) {
    let dateStr = "";
    
    // Check for explicit date
    const dateMatch = line.match(dateRegex);
    if (dateMatch) {
      dateStr = dateMatch[0];
    } else {
      // Check for day of week
      const dayMatch = line.match(dayRegex);
      if (dayMatch) {
         dateStr = dayMatch[0];
      }
    }
    
    // If we have some date/day identifier on this line, try to finding billable hours
    if (dateStr) {
      // Find all numbers on the line
      const numbers = [...line.matchAll(numRegex)].map(m => parseFloat(m[0]));
      // Eliminate typical year numbers like 2026 
      const hourCandidates = numbers.filter(n => n > 0 && n <= 24);
      
      if (hourCandidates.length > 0) {
        // Assume the last viable number on the line is the logged hours (as tables often have hours on the right)
        const hours = hourCandidates[hourCandidates.length - 1];
        
        // Mock a project based on the portal type, since OCR might not reliably parse project names without fixed columns
        const project = portal === 'our' ? 'Internal Dev' : 'Client Project';
        
        entries.push({
          id: String(idCounter++),
          date: dateStr,
          project,
          hours,
          status: 'Approved'
        });
        
        totalHours += hours;
      }
    }
  }

  // Fallback if no entries found from OCR (it can be bad depending on image quality)
  // We provide a fallback just so the UI does not completely break if OCR returns garbage
  if (entries.length === 0) {
    entries.push({
      id: '1',
      date: 'OCR Output Fallback',
      project: portal === 'our' ? 'Internal Dev' : 'Client Project',
      hours: 8,
      status: 'Pending'
    });
    totalHours = 8;
  }

  return {
    portal,
    screenshot: imageSrc,
    entries,
    totalHours
  };
}
