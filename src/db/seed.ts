import { db, type Category } from './database';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses (IDs 1-12)
  { id: 1, name: 'อาหาร', icon: 'Utensils', color: '#FF8C42', type: 'expense', isDefault: 1 },
  { id: 2, name: 'เดินทาง', icon: 'Car', color: '#5B8DEF', type: 'expense', isDefault: 1 },
  { id: 3, name: 'ช้อปปิ้ง', icon: 'ShoppingBag', color: '#E866A0', type: 'expense', isDefault: 1 },
  { id: 4, name: 'ที่พัก', icon: 'Home', color: '#8B7EC8', type: 'expense', isDefault: 1 },
  { id: 5, name: 'ค่าน้ำค่าไฟ', icon: 'Zap', color: '#F5C542', type: 'expense', isDefault: 1 },
  { id: 6, name: 'บันเทิง', icon: 'Gamepad2', color: '#6BCBA7', type: 'expense', isDefault: 1 },
  { id: 7, name: 'สุขภาพ', icon: 'HeartPulse', color: '#E8465A', type: 'expense', isDefault: 1 },
  { id: 8, name: 'การศึกษา', icon: 'GraduationCap', color: '#4ECDC4', type: 'expense', isDefault: 1 },
  { id: 9, name: 'โทรศัพท์/เน็ต', icon: 'Smartphone', color: '#7C8CF8', type: 'expense', isDefault: 1 },
  { id: 10, name: 'ของใช้ส่วนตัว', icon: 'Sparkles', color: '#D4A5FF', type: 'expense', isDefault: 1 },
  { id: 11, name: 'เครื่องดื่ม/กาแฟ', icon: 'Coffee', color: '#A0785A', type: 'expense', isDefault: 1 },
  { id: 12, name: 'อื่นๆ', icon: 'MoreHorizontal', color: '#6B7A99', type: 'expense', isDefault: 1 },

  // Income (IDs 13-18)
  { id: 13, name: 'เงินเดือน', icon: 'Briefcase', color: '#22C997', type: 'income', isDefault: 1 },
  { id: 14, name: 'โบนัส', icon: 'Award', color: '#C9A55C', type: 'income', isDefault: 1 },
  { id: 15, name: 'ลงทุน', icon: 'TrendingUp', color: '#5B8DEF', type: 'income', isDefault: 1 },
  { id: 16, name: 'ของขวัญ', icon: 'Gift', color: '#E866A0', type: 'income', isDefault: 1 },
  { id: 17, name: 'รายได้เสริม', icon: 'Wallet', color: '#6BCBA7', type: 'income', isDefault: 1 },
  { id: 18, name: 'อื่นๆ', icon: 'MoreHorizontal', color: '#6B7A99', type: 'income', isDefault: 1 }
];

export async function seedDatabase() {
  const count = await db.categories.count();
  if (count === 0) {
    console.log('Seeding initial categories atomically using bulkPut...');
    // bulkPut is safe from duplicate keys even if run multiple times concurrently
    await db.categories.bulkPut(DEFAULT_CATEGORIES);
  }
}
