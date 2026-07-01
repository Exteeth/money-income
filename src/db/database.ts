import Dexie, { type Table } from 'dexie';

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

export class MoneyDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;

  constructor() {
    super('MoneyWebDB');
    this.version(1).stores({
      transactions: '++id, type, categoryId, date, createdAt',
      categories: '++id, name, type, isDefault'
    });
  }
}

export const db = new MoneyDatabase();
