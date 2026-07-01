import React from 'react';
import { CreditCard, Wallet, Building2, Layers } from 'lucide-react';
import { type Wallet as WalletType } from '../../types';
import CountUp from '../UI/CountUp';
import styles from './WalletCarousel.module.css';

interface WalletCarouselProps {
  wallets: WalletType[];
  selectedId: number; // 0 for All
  onSelect: (id: number) => void;
}

export const WalletCarousel: React.FC<WalletCarouselProps> = ({
  wallets = [],
  selectedId,
  onSelect
}) => {
  // Calculate total combined balance
  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  const getIcon = (type: string) => {
    switch (type) {
      case 'cash': return <Wallet size={18} />;
      case 'bank': return <Building2 size={18} />;
      case 'credit': return <CreditCard size={18} />;
      default: return <Wallet size={18} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {/* All Wallets Combined Card */}
        <button
          onClick={() => onSelect(0)}
          className={`${styles.card} ${selectedId === 0 ? styles.active : ''}`}
          style={{
            borderColor: selectedId === 0 ? 'var(--color-accent-gold)' : 'var(--color-border)',
            background: selectedId === 0 ? 'linear-gradient(135deg, #161D2E 0%, #0E1420 100%)' : 'var(--color-bg-card)'
          }}
        >
          <div className={`${styles.iconWrapper} ${selectedId === 0 ? styles.activeIcon : ''}`} style={{ color: '#C9A55C', backgroundColor: 'rgba(201, 165, 92, 0.1)' }}>
            <Layers size={18} />
          </div>
          <div className={styles.details}>
            <span className={styles.name}>สินทรัพย์รวม</span>
            <span className={`${styles.balance} gold-text-gradient tabular-nums`}>
              <CountUp value={totalBalance} />
            </span>
          </div>
        </button>

        {/* Specific Wallet Cards */}
        {wallets.map(w => {
          if (w.id === undefined) return null;
          const isSelected = selectedId === w.id;
          const color = w.color || '#6B7A99';

          return (
            <button
              key={w.id}
              onClick={() => onSelect(w.id!)}
              className={`${styles.card} ${isSelected ? styles.active : ''}`}
              style={{
                borderColor: isSelected ? color : 'var(--color-border)',
                background: isSelected ? `linear-gradient(135deg, ${color}1a 0%, #0E1420 100%)` : 'var(--color-bg-card)',
                boxShadow: isSelected ? `0 6px 20px ${color}12` : 'none'
              }}
            >
              <div 
                className={styles.iconWrapper} 
                style={{ 
                  color: isSelected ? 'var(--color-bg-deep)' : color, 
                  backgroundColor: isSelected ? color : `${color}12` 
                }}
              >
                {getIcon(w.type)}
              </div>
              <div className={styles.details}>
                <span className={styles.name}>{w.name}</span>
                <span className={`${styles.balance} tabular-nums`} style={{ color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  <CountUp value={w.balance} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WalletCarousel;
