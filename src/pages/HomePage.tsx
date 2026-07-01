import React, { useState } from 'react';
import { useSummary, useTransactions, useCategories, useDeleteTransaction, useWallets } from '../db/hooks';
import AppShell from '../components/Layout/AppShell';
import Header from '../components/Layout/Header';
import SummaryCard from '../components/Summary/SummaryCard';
import TransactionList from '../components/Transaction/TransactionList';
import BottomNav from '../components/Layout/BottomNav';
import TransactionForm from '../components/Transaction/TransactionForm';
import WalletCarousel from '../components/Wallet/WalletCarousel';
import CalendarView from '../components/Summary/CalendarView';
import { List, Calendar } from 'lucide-react';

export const HomePage: React.FC = () => {
  // Get current YYYY-MM
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(0); // 0 = All
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const summary = useSummary(currentMonth, selectedWalletId);
  const transactions = useTransactions(currentMonth, selectedWalletId);
  const categories = useCategories();
  const wallets = useWallets();
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
      
      <WalletCarousel 
        wallets={wallets} 
        selectedId={selectedWalletId} 
        onSelect={setSelectedWalletId} 
      />

      <div className="scroll-container" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
        <SummaryCard 
          income={summary?.income || 0} 
          expense={summary?.expense || 0} 
          balance={summary?.balance || 0} 
        />

        {/* View Switcher Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 4px 12px 4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {viewMode === 'list' ? 'รายการธุรกรรม' : 'ปฏิทินรายวัน'}
          </span>
          <div style={{ display: 'flex', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '2px' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--color-bg-elevated)' : 'none',
                border: 'none',
                color: viewMode === 'list' ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              <List size={14} />
              <span>รายการ</span>
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' ? 'var(--color-bg-elevated)' : 'none',
                border: 'none',
                color: viewMode === 'calendar' ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              <Calendar size={14} />
              <span>ปฏิทิน</span>
            </button>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <TransactionList 
            transactions={transactions} 
            categories={categories} 
            onDelete={handleDeleteTransaction}
          />
        ) : (
          <CalendarView 
            currentMonth={currentMonth}
            transactions={transactions}
            categories={categories}
            onDelete={handleDeleteTransaction}
          />
        )}
      </div>

      <BottomNav onAddClick={() => setShowAddForm(true)} />

      {/* Bottom Sheet sliding form drawer */}
      <div className={`bottom-sheet ${showAddForm ? 'open' : ''}`}>
        <TransactionForm 
          onClose={() => setShowAddForm(false)} 
          defaultWalletId={selectedWalletId > 0 ? selectedWalletId : 1}
        />
      </div>
    </AppShell>
  );
};

export default HomePage;
