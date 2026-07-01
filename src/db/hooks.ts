import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Transaction } from './database';

export function useCategories(type?: 'income' | 'expense') {
  return useLiveQuery(async () => {
    if (type) {
      return await db.categories.where('type').equals(type).toArray();
    }
    return await db.categories.toArray();
  }, [type]);
}

export function useTransactions(monthStr?: string) {
  return useLiveQuery(async () => {
    let query = db.transactions.orderBy('date');
    
    if (monthStr) {
      // monthStr is expected to be 'YYYY-MM'
      const start = `${monthStr}-01`;
      // Find end date
      const dateParts = monthStr.split('-').map(Number);
      const year = dateParts[0];
      const month = dateParts[1] - 1; // 0-indexed
      const lastDay = new Date(year, month + 1, 0).getDate();
      const end = `${monthStr}-${String(lastDay).padStart(2, '0')}`;
      
      const results = await db.transactions
        .where('date')
        .between(start, end, true, true)
        .reverse()
        .toArray();
      // Dexie between on dates does not sort by date descending if we don't sort manually
      return results.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
    }
    
    const all = await query.reverse().toArray();
    return all;
  }, [monthStr]);
}

export function useSummary(monthStr: string) {
  return useLiveQuery(async () => {
    const start = `${monthStr}-01`;
    const dateParts = monthStr.split('-').map(Number);
    const year = dateParts[0];
    const month = dateParts[1] - 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const txs = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray();

    let income = 0;
    let expense = 0;

    for (const tx of txs) {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    }

    return {
      income,
      expense,
      balance: income - expense,
      count: txs.length
    };
  }, [monthStr]) || { income: 0, expense: 0, balance: 0, count: 0 };
}

export function useCategoryStats(monthStr: string) {
  return useLiveQuery(async () => {
    const start = `${monthStr}-01`;
    const dateParts = monthStr.split('-').map(Number);
    const year = dateParts[0];
    const month = dateParts[1] - 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const txs = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray();
    
    const categories = await db.categories.toArray();
    const catMap = new Map(categories.map(c => [c.id, c]));

    const statsMap: Record<number, { categoryId: number; name: string; icon: string; color: string; amount: number; percentage: number }> = {};
    let totalExpense = 0;

    for (const tx of txs) {
      if (tx.type === 'expense') {
        totalExpense += tx.amount;
        const cat = catMap.get(tx.categoryId);
        if (cat && cat.id !== undefined) {
          if (!statsMap[cat.id]) {
            statsMap[cat.id] = {
              categoryId: cat.id,
              name: cat.name,
              icon: cat.icon,
              color: cat.color,
              amount: 0,
              percentage: 0
            };
          }
          statsMap[cat.id].amount += tx.amount;
        }
      }
    }

    const result = Object.values(statsMap);
    if (totalExpense > 0) {
      for (const item of result) {
        item.percentage = Math.round((item.amount / totalExpense) * 100);
      }
    }

    // Sort by amount descending
    return result.sort((a, b) => b.amount - a.amount);
  }, [monthStr]) || [];
}

export function useAddTransaction() {
  return async (tx: Omit<Transaction, 'createdAt'>) => {
    return await db.transactions.add({
      ...tx,
      createdAt: Date.now()
    });
  };
}

export function useDeleteTransaction() {
  return async (id: number) => {
    return await db.transactions.delete(id);
  };
}
