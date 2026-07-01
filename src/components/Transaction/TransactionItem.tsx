import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { type Transaction, type Category } from '../../types';
import { formatBaht } from '../../utils/format';
import CategoryIcon from '../icons/CategoryIcon';
import styles from './TransactionItem.module.css';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
  onDelete: (id: number) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  category, 
  onDelete 
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const isIncome = transaction.type === 'income';

  const handleToggleDelete = () => {
    setShowDelete(!showDelete);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transaction.id) {
      onDelete(transaction.id);
    }
  };

  // Safe category variables
  const catColor = category?.color || '#6B7A99';
  const catIconName = category?.icon || 'MoreHorizontal';
  const catName = category?.name || 'อื่นๆ';

  return (
    <div 
      className={`${styles.itemContainer} ${showDelete ? styles.swiped : ''}`}
      onClick={handleToggleDelete}
    >
      <div className={styles.itemContent}>
        <div 
          className={styles.iconWrapper} 
          style={{ backgroundColor: `${catColor}12`, border: `1px solid ${catColor}24` }}
        >
          <CategoryIcon name={catIconName} color={catColor} size={18} />
        </div>
        
        <div className={styles.details}>
          <div className={styles.categoryName}>{catName}</div>
          {transaction.note && <div className={styles.note}>{transaction.note}</div>}
        </div>
        
        <div className={`${styles.amount} ${isIncome ? styles.income : styles.expense} tabular-nums`}>
          {isIncome ? `+${formatBaht(transaction.amount)}` : `-${formatBaht(transaction.amount)}`}
        </div>
      </div>
      
      <button 
        className={styles.deleteButton}
        onClick={handleDelete}
        aria-label="ลบรายการ"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TransactionItem;
