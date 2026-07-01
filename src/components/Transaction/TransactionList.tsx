import React from 'react';
import { type Transaction, type Category } from '../../types';
import { formatDayThai, formatBaht } from '../../utils/format';
import TransactionItem from './TransactionItem';
import styles from './TransactionList.module.css';

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  categories: Category[] | undefined;
  onDelete: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions = [], 
  categories = [], 
  onDelete 
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💵</div>
        <p className={styles.emptyText}>ไม่มีรายการสำหรับเดือนนี้</p>
        <p className={styles.emptySubtext}>กดปุ่ม + ด้านล่างเพื่อเพิ่มรายการใหม่</p>
      </div>
    );
  }

  // Create a map of categories for quick lookup
  const categoryMap = new Map<number, Category>();
  categories.forEach(cat => {
    if (cat.id !== undefined) {
      categoryMap.set(cat.id, cat);
    }
  });

  // Group transactions by date
  const groupedTransactions: Record<string, { txs: Transaction[]; dailyExpense: number; dailyIncome: number }> = {};
  
  transactions.forEach(tx => {
    if (!groupedTransactions[tx.date]) {
      groupedTransactions[tx.date] = { txs: [], dailyExpense: 0, dailyIncome: 0 };
    }
    groupedTransactions[tx.date].txs.push(tx);
    if (tx.type === 'income') {
      groupedTransactions[tx.date].dailyIncome += tx.amount;
    } else {
      groupedTransactions[tx.date].dailyExpense += tx.amount;
    }
  });

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <div className={styles.listContainer}>
      {sortedDates.map(dateStr => {
        const group = groupedTransactions[dateStr];
        const dayLabel = formatDayThai(dateStr);
        
        // Show daily sum summary
        let dailySummaryText = '';
        if (group.dailyIncome > 0 && group.dailyExpense > 0) {
          dailySummaryText = `รับ ${formatBaht(group.dailyIncome)} • จ่าย ${formatBaht(group.dailyExpense)}`;
        } else if (group.dailyIncome > 0) {
          dailySummaryText = `รับ ${formatBaht(group.dailyIncome)}`;
        } else if (group.dailyExpense > 0) {
          dailySummaryText = `จ่าย ${formatBaht(group.dailyExpense)}`;
        }

        return (
          <div key={dateStr} className={styles.groupSection}>
            <div className={styles.groupHeader}>
              <span className={styles.groupDate}>{dayLabel}</span>
              <span className={`${styles.groupSummary} tabular-nums`}>{dailySummaryText}</span>
            </div>
            
            <div className={styles.groupItems}>
              {group.txs.map(tx => {
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
                    onDelete={onDelete}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
