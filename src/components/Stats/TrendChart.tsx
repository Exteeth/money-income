import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatBaht } from '../../utils/format';
import styles from './TrendChart.module.css';

interface TrendData {
  monthLabel: string; // e.g. 'ก.ค. 69'
  income: number;
  expense: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>ไม่มีข้อมูลสถิติรายเดือน</p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.monthLabel}</p>
          <div className={styles.tooltipRow}>
            <span className={styles.incomeDot}></span>
            <span className="tabular-nums">รายรับ: {formatBaht(payload[0].value)}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.expenseDot}></span>
            <span className="tabular-nums">รายจ่าย: {formatBaht(payload[1].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <span className={styles.sectionTitle}>เปรียบเทียบ รายรับ - รายจ่าย</span>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            barGap={4}
          >
            <XAxis 
              dataKey="monthLabel" 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `฿${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className={styles.legendText}>{value === 'income' ? 'รายรับ' : 'รายจ่าย'}</span>}
            />
            <Bar 
              dataKey="income" 
              fill="var(--color-income)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={14}
            />
            <Bar 
              dataKey="expense" 
              fill="var(--color-accent-gold)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
