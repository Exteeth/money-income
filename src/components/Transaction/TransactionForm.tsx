import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Check, X } from 'lucide-react';
import { useCategories, useAddTransaction, useWallets } from '../../db/hooks';
import AmountKeypad from './AmountKeypad';
import CategoryPicker from '../Category/CategoryPicker';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
  onClose?: () => void;
  defaultWalletId?: number;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, defaultWalletId }) => {
  const navigate = useNavigate();
  const addTransaction = useAddTransaction();
  const wallets = useWallets();
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('0');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [walletId, setWalletId] = useState(defaultWalletId || 1);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch categories based on active type
  const categories = useCategories(type);

  // Sync walletId with defaultWalletId prop
  useEffect(() => {
    if (defaultWalletId) {
      setWalletId(defaultWalletId);
    }
  }, [defaultWalletId]);

  // Reset selected category when switching type
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryId(categories[0].id);
    } else {
      setCategoryId(undefined);
    }
  }, [type, categories]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amountStr);
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMsg('กรุณากรอกจำนวนเงินมากกว่า 0');
      return;
    }
    
    if (categoryId === undefined) {
      setErrorMsg('กรุณาเลือกหมวดหมู่');
      return;
    }

    try {
      await addTransaction({
        type,
        amount: parsedAmount,
        categoryId,
        walletId, // save associated wallet
        note: note.trim(),
        date
      });
      
      // Trigger gold burst at the top-right save button location
      if (window.triggerGoldBurst) {
        window.triggerGoldBurst(window.innerWidth - 30, 30);
      }
      
      // Delay closing slightly so particles can be seen bursting out
      setTimeout(() => {
        handleClose();
      }, 150);
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Top Bar / Header */}
      <div className={styles.topBar}>
        <button 
          type="button" 
          onClick={handleClose} 
          className={styles.closeBtn}
          aria-label="ยกเลิก"
        >
          <X size={22} />
        </button>
        <span className={styles.title}>เพิ่มรายการ</span>
        <button 
          type="submit" 
          className={styles.saveBtn}
          aria-label="บันทึก"
        >
          <Check size={22} />
        </button>
      </div>

      <div className={styles.scrollableContent}>
        {/* Type Toggle Slider */}
        <div className={styles.typeSelectorContainer}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
              onClick={() => setType('expense')}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'income' ? styles.activeIncome : ''}`}
              onClick={() => setType('income')}
            >
              รายรับ
            </button>
          </div>
        </div>

        {/* Dynamic Keypad Section */}
        <AmountKeypad 
          value={amountStr} 
          onChange={setAmountStr} 
          type={type} 
        />

        {/* Error notification */}
        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        {/* Category Selector Grid */}
        <CategoryPicker
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        {/* Additional details input cards */}
        <div className={styles.inputSection}>
          {/* Wallet Selector Row */}
          <div className={styles.inputRow} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              หัก/เข้า บัญชี
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {wallets.map(w => {
                if (w.id === undefined) return null;
                const isSelected = walletId === w.id;
                const color = w.color || '#6B7A99';
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWalletId(w.id!)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isSelected ? color : 'var(--color-border)',
                      background: isSelected ? `${color}12` : 'none',
                      color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    {w.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          <div className={styles.inputRow}>
            <FileText size={18} className={styles.inputIcon} />
            <input
              type="text"
              placeholder="บันทึกช่วยจำ (ไม่บังคับ)..."
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className={styles.textInput}
            />
          </div>

          {/* Date Input */}
          <div className={styles.inputRow}>
            <Calendar size={18} className={styles.inputIcon} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TransactionForm;
