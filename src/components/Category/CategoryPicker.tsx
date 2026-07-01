import React from 'react';
import { type Category } from '../../types';
import CategoryIcon from '../icons/CategoryIcon';
import styles from './CategoryPicker.module.css';

interface CategoryPickerProps {
  categories: Category[] | undefined;
  selectedId: number | undefined;
  onSelect: (id: number) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ 
  categories = [], 
  selectedId, 
  onSelect 
}) => {
  if (!categories || categories.length === 0) {
    return (
      <div className={styles.noCategories}>
        ไม่มีหมวดหมู่ที่ใช้ได้
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <span className={styles.label}>เลือกหมวดหมู่</span>
      <div className={styles.grid}>
        {categories.map(cat => {
          const isSelected = selectedId === cat.id;
          const catColor = cat.color || '#6B7A99';
          
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => cat.id !== undefined && onSelect(cat.id)}
              className={`${styles.categoryCard} ${isSelected ? styles.selected : ''}`}
              style={{ 
                borderColor: isSelected ? catColor : 'var(--color-border)',
                background: isSelected ? `${catColor}0c` : 'var(--color-bg-card)',
                boxShadow: isSelected ? `0 6px 16px ${catColor}24` : 'none'
              }}
            >
              <div 
                className={styles.iconCircle}
                style={{ 
                  backgroundColor: isSelected ? catColor : `${catColor}12`,
                  color: isSelected ? 'var(--color-bg-deep)' : catColor
                }}
              >
                <CategoryIcon name={cat.icon} size={20} />
              </div>
              <span 
                className={styles.name}
                style={{ color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPicker;
