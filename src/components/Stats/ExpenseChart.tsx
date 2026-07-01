import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { type CategoryStats } from '../../types';
import { formatBaht } from '../../utils/format';
import styles from './ExpenseChart.module.css';

interface ExpenseChartProps {
  data: CategoryStats[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>ไม่มีข้อมูลการจ่ายเงินในเดือนนี้</p>
      </div>
    );
  }

  // Calculate total expense
  const totalExpense = data.reduce((acc, curr) => acc + curr.amount, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={`${styles.tooltipValue} tabular-nums`}>
            {formatBaht(payload[0].value)} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.pieWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-bg-deep)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label displaying total spend */}
        <div className={styles.centerLabel}>
          <span className={styles.centerText}>รายจ่ายรวม</span>
          <span className={`${styles.centerValue} tabular-nums`}>{formatBaht(totalExpense)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
