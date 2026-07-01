import Dexie, { type Table } from 'dexie';

export interface Category {
  id?: number;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color string
  type: 'income' | 'expense';
  isDefault?: number; // 1 for default, 0 for custom
}

export interface Wallet {
  id?: number;
  name: string;
  type: 'cash' | 'bank' | 'credit';
  balance: number;
  color: string;
}

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  categoryId: number;
  walletId: number; // associated wallet
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
}

export class MoneyDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  wallets!: Table<Wallet>;

  constructor() {
    super('MoneyWebDB');
    
    // Version 1 (Legacy)
    this.version(1).stores({
      transactions: '++id, type, categoryId, date, createdAt',
      categories: '++id, name, type, isDefault'
    });

    // Version 2 (Multi-Account Update)
    this.version(2).stores({
      transactions: '++id, type, categoryId, walletId, date, createdAt',
      categories: '++id, name, type, isDefault',
      wallets: '++id, name, type'
    }).upgrade(tx => {
      // Set default walletId = 1 for all legacy transactions
      return tx.table('transactions').toCollection().modify(transaction => {
        if (transaction.walletId === undefined) {
          transaction.walletId = 1;
        }
      });
    });
  }
}

export const db = new MoneyDatabase();
