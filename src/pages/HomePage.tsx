import React, { useState } from 'react';
import { useSummary, useTransactions, useCategories, useDeleteTransaction } from '../db/hooks';
import AppShell from '../components/Layout/AppShell';
import Header from '../components/Layout/Header';
import SummaryCard from '../components/Summary/SummaryCard';
import TransactionList from '../components/Transaction/TransactionList';
import BottomNav from '../components/Layout/BottomNav';
import TransactionForm from '../components/Transaction/TransactionForm';

export const HomePage: React.FC = () => {
  // Get current YYYY-MM
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const summary = useSummary(currentMonth);
  const transactions = useTransactions(currentMonth);
  const categories = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const handleDeleteTransaction = async (id: number) => {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Failed to delete transaction:', err);
      }
    }
  };

  return (
    <AppShell>
      <Header currentMonth={currentMonth} onChangeMonth={setCurrentMonth} />
      
      <div className="scroll-container" style={{ paddingBottom: '20px' }}>
        <SummaryCard 
          income={summary?.income || 0} 
          expense={summary?.expense || 0} 
          balance={summary?.balance || 0} 
        />
        
        <TransactionList 
          transactions={transactions} 
          categories={categories} 
          onDelete={handleDeleteTransaction}
        />
      </div>

      <BottomNav onAddClick={() => setShowAddForm(true)} />

      {/* Bottom Sheet sliding form drawer */}
      <div className={`bottom-sheet ${showAddForm ? 'open' : ''}`}>
        <TransactionForm onClose={() => setShowAddForm(false)} />
      </div>
    </AppShell>
  );
};

export default HomePage;
