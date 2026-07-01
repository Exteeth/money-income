import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { useCategoryStats } from '../db/hooks';
import AppShell from '../components/Layout/AppShell';
import Header from '../components/Layout/Header';
import ExpenseChart from '../components/Stats/ExpenseChart';
import CategoryBreakdown from '../components/Stats/CategoryBreakdown';
import TrendChart from '../components/Stats/TrendChart';
import BottomNav from '../components/Layout/BottomNav';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export const StatsPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const categoryStats = useCategoryStats(currentMonth);

  // Calculate past 6 months based on current month
  const past6Months = React.useMemo(() => {
    const list = [];
    const [year, month] = currentMonth.split('-').map(Number);
    
    // We want 6 months ending in currentMonth
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      
      // Thai short month label + short BE year, e.g. 'ก.ค. 69'
      const monthLabel = format(d, 'MMM ', { locale: th });
      const shortYearBE = String(d.getFullYear() + 543).slice(-2);
      
      list.push({
        key: `${yStr}-${mStr}`,
        label: `${monthLabel}${shortYearBE}`
      });
    }
    return list;
  }, [currentMonth]);

  // Query database for all transactions in these 6 months
  const trendData = useLiveQuery(async () => {
    const results = [];
    
    for (const m of past6Months) {
      const start = `${m.key}-01`;
      const [y, mon] = m.key.split('-').map(Number);
      const lastDay = new Date(y, mon, 0).getDate();
      const end = `${m.key}-${String(lastDay).padStart(2, '0')}`;
      
      const txs = await db.transactions
        .where('date')
        .between(start, end, true, true)
        .toArray();
        
      let income = 0;
      let expense = 0;
      
      for (const tx of txs) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      }
      
      results.push({
        monthLabel: m.label,
        income,
        expense
      });
    }
    
    return results;
  }, [past6Months]) || [];

  return (
    <AppShell>
      <Header currentMonth={currentMonth} onChangeMonth={setCurrentMonth} title="สถิติ" />
      
      <div className="scroll-container" style={{ paddingBottom: '20px' }}>
        <ExpenseChart data={categoryStats} />
        
        {categoryStats.length > 0 && <CategoryBreakdown data={categoryStats} />}
        
        <TrendChart data={trendData} />
      </div>

      <BottomNav />
    </AppShell>
  );
};

export default StatsPage;
