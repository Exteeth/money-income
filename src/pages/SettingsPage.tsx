import React from 'react';
import { db } from '../db/database';
import { DEFAULT_CATEGORIES } from '../db/seed';
import AppShell from '../components/Layout/AppShell';
import BottomNav from '../components/Layout/BottomNav';
import { Trash2, Info, Shield, Database } from 'lucide-react';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {

  const handleClearData = async () => {
    if (confirm('คำเตือน! คุณต้องการลบข้อมูลรายรับ-รายจ่ายทั้งหมดในเครื่องใช่หรือไม่? (การดำเนินการนี้ไม่สามารถยกเลิกได้)')) {
      try {
        await db.transactions.clear();
        await db.categories.clear();
        // Seed default categories again
        await db.categories.bulkPut(DEFAULT_CATEGORIES);
        alert('ล้างข้อมูลเสร็จเรียบร้อยแล้ว');
      } catch (err) {
        console.error('Failed to clear data:', err);
        alert('เกิดข้อผิดพลาดในการล้างข้อมูล');
      }
    }
  };

  return (
    <AppShell>
      <header className={styles.header}>
        <div className={styles.title}>ตั้งค่าระบบ</div>
      </header>

      <div className="scroll-container" style={{ paddingBottom: '20px' }}>
        {/* Info Card */}
        <div className="gold-card style_card__3jK8">
          <div className={styles.cardHeader}>
            <Info size={18} className={styles.cardIcon} />
            <span>ข้อมูลระบบ</span>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.infoText}>
              แอปพลิเคชัน <strong>MONEY WEB</strong> ถูกออกแบบมาให้ทำงานแบบออฟไลน์
              โดยข้อมูลการเงินทั้งหมดจะถูกบันทึกอย่างปลอดภัยในบราวเซอร์ของคุณ (IndexedDB)
              ไม่มีการส่งข้อมูลใด ๆ ออกไปยังภายนอกเพื่อความเป็นส่วนตัวสูงสุด
            </p>
          </div>
        </div>

        {/* Storage / Security details */}
        <div className={styles.sectionTitle}>ความปลอดภัย & การจัดเก็บ</div>
        <div className={styles.optionsList}>
          <div className={styles.optionRow}>
            <div className={styles.optionIconWrapper}>
              <Shield size={16} />
            </div>
            <div className={styles.optionDetails}>
              <div className={styles.optionTitle}>ระบบรักษาความปลอดภัย</div>
              <div className={styles.optionSub}>ข้อมูลทั้งหมดเก็บอยู่ใน Sandboxed Storage บนเครื่อง</div>
            </div>
          </div>
          
          <div className={styles.optionRow}>
            <div className={styles.optionIconWrapper}>
              <Database size={16} />
            </div>
            <div className={styles.optionDetails}>
              <div className={styles.optionTitle}>ฐานข้อมูลภายใน</div>
              <div className={styles.optionSub}>ใช้ IndexedDB (Dexie.js) ทำงานได้โดยไม่ต้องต่อเน็ต</div>
            </div>
          </div>
        </div>

        {/* Actions section */}
        <div className={styles.sectionTitle}>การจัดการข้อมูล</div>
        <div className={styles.optionsList}>
          <button onClick={handleClearData} className={`${styles.optionRow} ${styles.dangerRow}`}>
            <div className={styles.dangerIconWrapper}>
              <Trash2 size={16} />
            </div>
            <div className={styles.optionDetails}>
              <div className={styles.optionTitle}>ล้างข้อมูลทั้งหมด</div>
              <div className={styles.optionSubDanger}>ลบรายการธุรกรรมและคืนค่าหมวดหมู่เป็นเริ่มต้น</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footerText}>
          <p>MONEY WEB v1.0.0 (OFFLINE PWA)</p>
          <p>© 2026 Designed for Private Banking Experience</p>
        </div>
      </div>

      <BottomNav />
    </AppShell>
  );
};

export default SettingsPage;
