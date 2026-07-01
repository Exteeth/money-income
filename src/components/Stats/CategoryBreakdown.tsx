import React from 'react';
import { type CategoryStats } from '../../types';
import { formatBaht } from '../../utils/format';
import CategoryIcon from '../icons/CategoryIcon';
import styles from './CategoryBreakdown.module.css';

interface CategoryBreakdownProps {
  data: CategoryStats[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null; // Return nothing if no data, empty state shown by parent
  }

  return (
    <div className={styles.container}>
      <span className={styles.sectionTitle}>สัดส่วนรายจ่ายรายหมวดหมู่</span>
      
      <div className={styles.list}>
        {data.map(item => {
          const color = item.color || '#6B7A99';
          
          return (
            <div key={item.categoryId} className={styles.row}>
              {/* Icon Circle */}
              <div 
                className={styles.iconCircle}
                style={{ backgroundColor: `${color}12`, border: `1px solid ${color}24` }}
              >
                <CategoryIcon name={item.icon} color={color} size={16} />
              </div>
              
              {/* Stats/Bars block */}
              <div className={styles.contentBlock}>
                <div className={styles.labelRow}>
                  <span className={styles.catName}>
                    {item.name} <span className={styles.percentage}>({item.percentage}%)</span>
                  </span>
                  <span className={`${styles.amount} tabular-nums`}>{formatBaht(item.amount)}</span>
                </div>
                
                {/* Progress bar line */}
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill}
                    style={{ 
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
