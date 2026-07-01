import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings, Plus } from 'lucide-react';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  onAddClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.bottomNav}>
      <button 
        onClick={() => navigate('/')} 
        className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
      >
        <Home size={22} />
        <span>หน้าหลัก</span>
      </button>

      <button 
        onClick={() => navigate('/stats')} 
        className={`${styles.navItem} ${isActive('/stats') ? styles.active : ''}`}
      >
        <BarChart3 size={22} />
        <span>สถิติ</span>
      </button>

      <div className={styles.fabContainer}>
        <button 
          onClick={onAddClick ? onAddClick : () => navigate('/add')} 
          className={styles.fab}
          aria-label="เพิ่มรายการ"
        >
          <Plus size={28} />
        </button>
      </div>

      <button 
        onClick={() => navigate('/settings')} 
        className={`${styles.navItem} ${isActive('/settings') ? styles.active : ''}`}
      >
        <Settings size={22} />
        <span>ตั้งค่า</span>
      </button>
    </div>
  );
};

export default BottomNav;
