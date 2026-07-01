import React, { useState } from 'react';
import { parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { X, Calendar } from 'lucide-react';
import { type Transaction, type Category } from '../../types';
import { formatDayThai, formatBaht } from '../../utils/format';
import TransactionItem from '../Transaction/TransactionItem';
import styles from './CalendarView.module.css';

interface CalendarViewProps {
  currentMonth: string; // 'YYYY-MM'
  transactions: Transaction[] | undefined;
  categories: Category[] | undefined;
  onDelete: (id: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  transactions = [],
  categories = [],
  onDelete
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Parse current month
  const firstDay = startOfMonth(parseISO(`${currentMonth}-01`));
  const lastDay = endOfMonth(firstDay);

  // Get all days in month
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

  // Get index of the first day (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = getDay(firstDay);

  // Calendar headers
  const weekdays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  // Map transactions of this month
  const dailyData: Record<string, { income: number; expense: number; txs: Transaction[] }> = {};
  
  (transactions || []).forEach(tx => {
    if (!dailyData[tx.date]) {
      dailyData[tx.date] = { income: 0, expense: 0, txs: [] };
    }
    dailyData[tx.date].txs.push(tx);
    if (tx.type === 'income') {
      dailyData[tx.date].income += tx.amount;
    } else {
      dailyData[tx.date].expense += tx.amount;
    }
  });

  const handleDayClick = (dateStr: string) => {
    const data = dailyData[dateStr];
    if (data && data.txs.length > 0) {
      setSelectedDate(dateStr);
    }
  };

  // Resolve active category maps
  const categoryMap = new Map<number, Category>();
  categories.forEach(cat => {
    if (cat.id !== undefined) categoryMap.set(cat.id, cat);
  });

  return (
    <div className={styles.container}>
      {/* Calendar Grid Header */}
      <div className={styles.weekdayRow}>
        {weekdays.map((day, idx) => (
          <div key={idx} className={styles.weekdayLabel} style={{ color: idx === 0 ? 'var(--color-expense)' : idx === 6 ? 'var(--color-income)' : 'var(--color-text-secondary)' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Body */}
      <div className={styles.grid}>
        {/* Blank cells for alignment */}
        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
          <div key={`blank-${idx}`} className={styles.emptyCell}></div>
        ))}

        {/* Real day cells */}
        {daysInMonth.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dateNum = day.getDate();
          const data = dailyData[dateStr];
          
          const hasIncome = data && data.income > 0;
          const hasExpense = data && data.expense > 0;

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              className={`${styles.dayCell} ${data ? styles.hasData : ''}`}
              disabled={!data || data.txs.length === 0}
            >
              <span className={styles.dayNumber}>{dateNum}</span>
              
              {/* Green/Red dot indicators */}
              <div className={styles.dotsContainer}>
                {hasIncome && <span className={styles.incomeDot}></span>}
                {hasExpense && <span className={styles.expenseDot}></span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Drawer Sheet Overlay */}
      {selectedDate && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedDate(null)}>
          <div className={`${styles.drawer} animate-fade-in-up`} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>
                <Calendar size={16} className={styles.calendarIcon} />
                <span>{formatDayThai(selectedDate)}</span>
              </div>
              <button onClick={() => setSelectedDate(null)} className={styles.closeBtn} aria-label="ปิด">
                <X size={18} />
              </button>
            </div>
            
            <div className={styles.drawerSummary}>
              {dailyData[selectedDate]?.income > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>รายรับ</span>
                  <span className={`${styles.summaryVal} ${styles.incomeVal} tabular-nums`}>
                    +{formatBaht(dailyData[selectedDate].income)}
                  </span>
                </div>
              )}
              {dailyData[selectedDate]?.expense > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>รายจ่าย</span>
                  <span className={`${styles.summaryVal} ${styles.expenseVal} tabular-nums`}>
                    -{formatBaht(dailyData[selectedDate].expense)}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.drawerItemsList}>
              {dailyData[selectedDate]?.txs.map(tx => {
                const category = categoryMap.get(tx.categoryId) || {
                  name: 'อื่นๆ',
                  icon: 'MoreHorizontal',
                  color: '#6B7A99',
                  type: tx.type
                };
                return (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    category={category}
                    onDelete={(id) => {
                      onDelete(id);
                      // If empty after delete, close drawer
                      const remainingCount = (dailyData[selectedDate]?.txs || []).filter(t => t.id !== id).length;
                      if (remainingCount === 0) {
                        setSelectedDate(null);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
