import React, { useRef, useState } from 'react';
import { Download, FileDown, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useSummary, useCategoryStats } from '../../db/hooks';
import { formatBaht, formatMonthThai } from '../../utils/format';
import styles from './StatementGenerator.module.css';

interface StatementGeneratorProps {
  currentMonth: string; // 'YYYY-MM'
  onClose: () => void;
}

export const StatementGenerator: React.FC<StatementGeneratorProps> = ({
  currentMonth,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const summary = useSummary(currentMonth);
  const categoryStats = useCategoryStats(currentMonth);

  const generateStatementImage = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    setDownloadUrl(null);

    const canvas = canvasRef.current;
    if (!canvas) {
      setErrorMsg('เกิดข้อผิดพลาดในการโหลดตัวสร้างรูปภาพ');
      setIsGenerating(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMsg('ไม่สามารถเริ่มเฟรมวาดรูปได้');
      setIsGenerating(false);
      return;
    }

    try {
      // Set canvas high resolution for download (800 x 1150)
      canvas.width = 800;
      canvas.height = 1150;

      // 1. Draw solid background
      ctx.fillStyle = '#07090F';
      ctx.fillRect(0, 0, 800, 1150);

      // 2. Draw outer gold border frame
      ctx.strokeStyle = '#C9A55C';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 760, 1110);

      // Inner thin gold frame
      ctx.strokeStyle = 'rgba(201, 165, 92, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, 730, 1080);

      // 3. Draw Header Title - "กำเงิน" (Brand Logo)
      ctx.textAlign = 'center';
      
      // Draw brand title
      ctx.font = "bold 64px 'Instrument Sans', sans-serif";
      // Draw gold text gradient simulation
      const brandGrad = ctx.createLinearGradient(300, 0, 500, 0);
      brandGrad.addColorStop(0, '#E8D5A3');
      brandGrad.addColorStop(0.5, '#C9A55C');
      brandGrad.addColorStop(1, '#B89045');
      ctx.fillStyle = brandGrad;
      ctx.fillText('กำเงิน', 400, 140);

      // Subtitle
      ctx.font = "500 22px 'Noto Sans Thai', sans-serif";
      ctx.fillStyle = '#6B7A99';
      ctx.fillText('OFFLINE PERSONAL STATEMENT SLIP', 400, 185);

      // Gold line separator
      const dividerGrad = ctx.createLinearGradient(100, 0, 700, 0);
      dividerGrad.addColorStop(0, 'transparent');
      dividerGrad.addColorStop(0.3, 'rgba(201, 165, 92, 0.4)');
      dividerGrad.addColorStop(0.5, '#E8D5A3');
      dividerGrad.addColorStop(0.7, 'rgba(201, 165, 92, 0.4)');
      dividerGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = dividerGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 230);
      ctx.lineTo(700, 230);
      ctx.stroke();

      // 4. Draw Slip Details Area
      ctx.textAlign = 'left';
      ctx.fillStyle = '#6B7A99';
      ctx.font = "500 20px 'Noto Sans Thai', sans-serif";
      ctx.fillText('ประจำรอบเดือน:', 100, 290);
      
      ctx.fillStyle = '#F0F2F7';
      ctx.font = "bold 26px 'Noto Sans Thai', sans-serif";
      ctx.fillText(formatMonthThai(currentMonth), 250, 292);

      // Unique Ref transaction ID
      const refId = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#3D4B66';
      ctx.font = "500 18px 'Instrument Sans', sans-serif";
      ctx.fillText(refId, 700, 290);

      // 5. Draw Summary Box (Glow Card Simulation)
      ctx.fillStyle = '#0E1420';
      ctx.beginPath();
      ctx.roundRect(100, 340, 600, 240, 16);
      ctx.fill();
      ctx.strokeStyle = '#1E2A3F';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Balance header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6B7A99';
      ctx.font = "500 20px 'Noto Sans Thai', sans-serif";
      ctx.fillText('ยอดเงินคงเหลือสุทธิ', 400, 390);

      // Balance Value
      ctx.font = "bold 46px 'Instrument Sans', sans-serif";
      ctx.fillStyle = '#22C997'; // green
      const net = (summary?.balance || 0);
      if (net < 0) ctx.fillStyle = '#E8465A'; // red if negative
      ctx.fillText(formatBaht(net), 400, 450);

      // Grid stats row (Income vs Expense)
      ctx.strokeStyle = '#1E2A3F';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(400, 480);
      ctx.lineTo(400, 550);
      ctx.stroke();

      ctx.textAlign = 'center';
      // Income labels
      ctx.fillStyle = '#6B7A99';
      ctx.font = "500 16px 'Noto Sans Thai', sans-serif";
      ctx.fillText('รายรับรวม', 250, 498);
      ctx.fillStyle = '#22C997';
      ctx.font = "bold 22px 'Instrument Sans', sans-serif";
      ctx.fillText(formatBaht(summary?.income || 0), 250, 536);

      // Expense labels
      ctx.fillStyle = '#6B7A99';
      ctx.font = "500 16px 'Noto Sans Thai', sans-serif";
      ctx.fillText('รายจ่ายรวม', 550, 498);
      ctx.fillStyle = '#F0F2F7';
      ctx.font = "bold 22px 'Instrument Sans', sans-serif";
      ctx.fillText(formatBaht(summary?.expense || 0), 550, 536);

      // 6. Draw Category Breakdown lists
      ctx.textAlign = 'left';
      ctx.fillStyle = '#C9A55C';
      ctx.font = "bold 22px 'Noto Sans Thai', sans-serif";
      ctx.fillText('รายจ่ายสูงสุด 3 หมวดหมู่แรก', 100, 640);

      const top3 = categoryStats.slice(0, 3);
      if (top3.length === 0) {
        ctx.fillStyle = '#6B7A99';
        ctx.font = "500 20px 'Noto Sans Thai', sans-serif";
        ctx.fillText('ไม่มีข้อมูลรายจ่ายในเดือนนี้', 100, 700);
      } else {
        let currentY = 700;
        top3.forEach((item, index) => {
          // Draw colored category dot index
          ctx.fillStyle = item.color || '#6B7A99';
          ctx.beginPath();
          ctx.arc(115, currentY - 8, 10, 0, Math.PI * 2);
          ctx.fill();

          // Category name & percentage
          ctx.fillStyle = '#F0F2F7';
          ctx.font = "bold 20px 'Noto Sans Thai', sans-serif";
          ctx.fillText(`${index + 1}. ${item.name}`, 150, currentY);

          ctx.fillStyle = '#6B7A99';
          ctx.font = "500 16px 'Noto Sans Thai', sans-serif";
          ctx.fillText(`สัดส่วน ${item.percentage}%`, 330, currentY - 2);

          // Amount
          ctx.textAlign = 'right';
          ctx.fillStyle = '#F0F2F7';
          ctx.font = "bold 20px 'Instrument Sans', sans-serif";
          ctx.fillText(formatBaht(item.amount), 700, currentY);
          
          ctx.textAlign = 'left'; // reset text align

          // Progress line
          ctx.fillStyle = '#161D2E';
          ctx.fillRect(150, currentY + 12, 550, 6);
          ctx.fillStyle = item.color || '#6B7A99';
          ctx.fillRect(150, currentY + 12, (550 * item.percentage) / 100, 6);

          currentY += 76;
        });
      }

      // 7. Security / Branding Watermark Stamp
      ctx.fillStyle = 'rgba(201, 165, 92, 0.03)';
      ctx.font = "bold 120px 'Noto Sans Thai', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('กำเงิน', 400, 770);

      // Gold line separator above footer
      ctx.strokeStyle = dividerGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(150, 970);
      ctx.lineTo(650, 970);
      ctx.stroke();

      // 8. Draw Footer
      ctx.textAlign = 'center';
      ctx.fillStyle = '#3D4B66';
      ctx.font = "500 15px 'Noto Sans Thai', sans-serif";
      ctx.fillText('ใบรับรองสรุปธุรกรรมทางการเงิน ออกให้โดยแอปพลิเคชัน กำเงิน (KamNgin PWA)', 400, 1010);
      ctx.fillText('ข้อมูลบันทึกอยู่บนหน่วยความจำจำกัดของเครื่องปลอดภัย 100%', 400, 1038);

      const url = canvas.toDataURL('image/png');
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการวาดกราฟิกสลิป');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} animate-fade-in-up`} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <FileDown size={18} className={styles.titleIcon} />
            <span>ออกรายงานสลิปเงินบาท</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="ปิด">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {errorMsg && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className={styles.helpText}>
            ระบบจะแปลงข้อมูลรายรับ-รายจ่ายของเดือน <strong>{formatMonthThai(currentMonth)}</strong> 
            เป็นสลิปสรุปผลขอบทองคำสุดหรูอย่างปลอดภัยในเครื่อง เพื่อบันทึกเป็นสลิปลงเครื่องของคุณ
          </p>

          {/* Off-screen/Preview Canvas */}
          <div className={styles.canvasContainer}>
            <canvas ref={canvasRef} className={styles.canvasPreview} />
          </div>

          <div className={styles.actions}>
            {!downloadUrl ? (
              <button
                onClick={generateStatementImage}
                disabled={isGenerating}
                className={styles.generateBtn}
              >
                {isGenerating ? 'กำลังคำนวณและสร้างสลิป...' : 'คำนวณและสร้างภาพสลิปทอง'}
              </button>
            ) : (
              <div className={styles.downloadWrapper}>
                <div className={styles.successMessage}>
                  <CheckCircle2 size={16} className={styles.successIcon} />
                  <span>สร้างสลิปทองเสร็จแล้ว! กดดาวน์โหลดด้านล่าง</span>
                </div>
                <a
                  href={downloadUrl}
                  download={`kamngin-statement-${currentMonth}.png`}
                  className={styles.downloadLink}
                >
                  <Download size={18} />
                  <span>ดาวน์โหลดไฟล์ภาพ (.png)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementGenerator;
