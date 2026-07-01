export interface Category {
  id?: number;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color string
  type: 'income' | 'expense';
  isDefault?: number; // 1 for default, 0 for custom
}

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  categoryId: number;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
  count: number;
}

export interface CategoryStats {
  categoryId: number;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}
