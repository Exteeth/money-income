import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatMonthThai } from '../../utils/format';
import styles from './Header.module.css';

interface HeaderProps {
  currentMonth: string; // 'YYYY-MM'
  onChangeMonth: (month: string) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentMonth, 
  onChangeMonth, 
  title = 'กำเงิน' 
}) => {
  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevYearStr = prevDate.getFullYear();
    const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0');
    onChangeMonth(`${prevYearStr}-${prevMonthStr}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    const nextYearStr = nextDate.getFullYear();
    const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    onChangeMonth(`${nextYearStr}-${nextMonthStr}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>{title}</div>
        <div className={styles.badge}>
          <div className={styles.statusDot}></div>
          <span>OFFLINE READY</span>
        </div>
      </div>
      
      <div className={styles.monthSelector}>
        <button onClick={handlePrevMonth} className={styles.arrowButton} aria-label="เดือนก่อนหน้า">
          <ChevronLeft size={20} />
        </button>
        
        <div className={styles.currentMonthDisplay}>
          <Calendar size={16} className={styles.calendarIcon} />
          <span>{formatMonthThai(currentMonth)}</span>
        </div>
        
        <button onClick={handleNextMonth} className={styles.arrowButton} aria-label="เดือนถัดไป">
          <ChevronRight size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
