import { parseISO, format, isToday, isYesterday } from 'date-fns';
import { th } from 'date-fns/locale';

export function formatBaht(amount: number): string {
  // Return format e.g. ฿1,234.56 or ฿1,234 (if integer)
  const formatted = new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `฿${formatted}`;
}

export function formatDayThai(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) {
    return 'วันนี้';
  }
  if (isYesterday(date)) {
    return 'เมื่อวาน';
  }
  
  // Format to e.g. '1 ก.ค. 69' or '1 ก.ค. 2026'
  // using date-fns with Thai locale
  const dayStr = format(date, 'd MMM ', { locale: th });
  // In Thai, Buddhist Era is normally used (AD + 543). Let's convert Year to BE
  const yearBE = date.getFullYear() + 543;
  return `${dayStr}${yearBE}`;
}

export function formatMonthThai(monthStr: string): string {
  // monthStr: 'YYYY-MM'
  const date = parseISO(`${monthStr}-01`);
  const monthName = format(date, 'MMMM', { locale: th });
  const yearBE = date.getFullYear() + 543;
  return `${monthName} ${yearBE}`;
}
