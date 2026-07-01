import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import styles from './SummaryCard.module.css';

import CountUp from '../UI/CountUp';

interface SummaryCardProps {
  income: number;
  expense: number;
  balance: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ income, expense, balance }) => {
  return (
    <div className={`gold-card ${styles.card}`}>
      <div className={styles.balanceHeader}>
        <div className={styles.balanceLabel}>
          <Wallet size={14} className={styles.walletIcon} />
          <span>ยอดเงินคงเหลือ</span>
        </div>
        <div className={`${styles.balanceValue} gold-text-gradient tabular-nums`}>
          <CountUp value={balance} />
        </div>
      </div>

      <hr className="gold-line" />

      <div className={styles.statsRow}>
        <div className={styles.statCol}>
          <div className={`${styles.iconContainer} ${styles.incomeIcon}`}>
            <ArrowDownLeft size={16} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>รายรับ</span>
            <span className={`${styles.statValue} ${styles.incomeValue} tabular-nums`}>
              <CountUp value={income} />
            </span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.statCol}>
          <div className={`${styles.iconContainer} ${styles.expenseIcon}`}>
            <ArrowUpRight size={16} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>รายจ่าย</span>
            <span className={`${styles.statValue} ${styles.expenseValue} tabular-nums`}>
              <CountUp value={expense} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
