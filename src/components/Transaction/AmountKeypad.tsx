import React from 'react';
import { Delete } from 'lucide-react';
import { formatBaht } from '../../utils/format';
import styles from './AmountKeypad.module.css';

interface AmountKeypadProps {
  value: string; // string representing current entered numeric value, e.g. "120"
  onChange: (value: string) => void;
  type: 'income' | 'expense';
}

export const AmountKeypad: React.FC<AmountKeypadProps> = ({ 
  value, 
  onChange, 
  type 
}) => {
  const handleKeyPress = (key: string) => {
    if (key === '.') {
      // Don't allow multiple decimals
      if (value.includes('.')) return;
      // If empty, prepend '0.'
      if (value === '' || value === '0') {
        onChange('0.');
        return;
      }
      onChange(value + '.');
    } else if (key === 'del') {
      if (value.length <= 1) {
        onChange('0');
      } else {
        onChange(value.slice(0, -1));
      }
    } else {
      // Number press
      // Prevent entering extremely large numbers (limit to 9 digits before decimal)
      const parts = value.split('.');
      if (parts[0].length >= 9 && !value.includes('.')) return;
      // Don't allow multiple decimals digits beyond 2 places
      if (parts[1] && parts[1].length >= 2) return;

      if (value === '0') {
        onChange(key);
      } else {
        onChange(value + key);
      }
    }
  };

  const parsedAmount = parseFloat(value) || 0;
  const isIncome = type === 'income';

  return (
    <div className={styles.container}>
      {/* Premium display area */}
      <div className={styles.displayArea}>
        <span className={styles.label}>ระบุจำนวนเงิน</span>
        <div className={`${styles.value} ${isIncome ? styles.income : styles.expense} tabular-nums`}>
          {formatBaht(parsedAmount)}
          {value.endsWith('.') && <span className={styles.decimalDot}>.</span>}
        </div>
      </div>

      {/* Grid of keys */}
      <div className={styles.keypadGrid}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button 
            key={num} 
            type="button" 
            onClick={() => handleKeyPress(num)} 
            className={`${styles.keyButton} ripple-btn`}
          >
            {num}
          </button>
        ))}
        
        <button 
          type="button" 
          onClick={() => handleKeyPress('.')} 
          className={`${styles.keyButton} ${styles.decimalKey} ripple-btn`}
        >
          .
        </button>
        
        <button 
          type="button" 
          onClick={() => handleKeyPress('0')} 
          className={`${styles.keyButton} ripple-btn`}
        >
          0
        </button>
        
        <button 
          type="button" 
          onClick={() => handleKeyPress('del')} 
          className={`${styles.keyButton} ${styles.deleteKey} ripple-btn`}
          aria-label="ลบตัวเลข"
        >
          <Delete size={20} />
        </button>
      </div>
    </div>
  );
};

export default AmountKeypad;
