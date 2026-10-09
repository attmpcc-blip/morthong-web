import React, { useState, useEffect } from 'react';
import {
  Heart,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  Plus,
  HelpCircle,
  Thermometer,
  Sparkles,
  Droplets,
  Calendar
} from 'lucide-react';
import { FeedingSession } from '../types';

interface BreastfeedingTrackerProps {
  feedings: FeedingSession[];
  onAddFeeding: (session: FeedingSession) => void;
  breastStatus: string;
}

export const BreastfeedingTracker: React.FC<BreastfeedingTrackerProps> = ({
  feedings,
  onAddFeeding,
  breastStatus,
}) => {
  // Timer states
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(0);
  const [rightSeconds, setRightSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Manual pumping form
  const [pumpVolume, setPumpVolume] = useState<number>(100);
  const [pumpDuration, setPumpDuration] = useState<number>(20);
  const [pumpNotes, setPumpNotes] = useState<string>('ปั๊มเก็บสต็อกน้ำนม');

  // Interactive troubleshooting tab
  const [selectedIssue, setSelectedIssue] = useState<string>('engorgement');

  // Interval effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && activeSide) {
      interval = setInterval(() => {
        if (activeSide === 'left') {
          setLeftSeconds((prev) => prev + 1);
        } else if (activeSide === 'right') {
          setRightSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, activeSide]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = (side: 'left' | 'right') => {
    setActiveSide(side);
    setTimerRunning(true);
  };

  const handlePause = () => {
    setTimerRunning(false);
  };

  const handleResume = () => {
    if (activeSide) setTimerRunning(true);
    else handleStart('left');
  };

  const handleSwitchSide = () => {
    if (activeSide === 'left') setActiveSide('right');
    else setActiveSide('left');
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setActiveSide(null);
    setLeftSeconds(0);
    setRightSeconds(0);
  };

  const handleSaveTimerSession = () => {
    const totalMinutes = Math.max(1, Math.round((leftSeconds + rightSeconds) / 60));
    const sideType =
      leftSeconds > 0 && rightSeconds > 0
        ? 'both'
        : leftSeconds > 0
        ? 'breast_left'
        : 'breast_right';

    const newSession: FeedingSession = {
      id: `feed-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      type: sideType,
      durationMinutes: totalMinutes,
      volumeMl: Math.round(totalMinutes * 3.5), // estimated volume
      notes: sessionNotes || `ซ้าย ${Math.round(leftSeconds / 60)} นาที / ขวา ${Math.round(rightSeconds / 60)} นาที`,
    };

    onAddFeeding(newSession);
    handleResetTimer();
    setSessionNotes('');
  };

  const handleSavePumpSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: FeedingSession = {
      id: `pump-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      type: 'pump',
      durationMinutes: pumpDuration,
      volumeMl: pumpVolume,
      notes: pumpNotes,
    };
    onAddFeeding(newSession);
    setPumpNotes('');
  };

  const totalVolumeToday = feedings.reduce((acc, f) => acc + (f.volumeMl || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-100" />
            <span>การให้นมแม่ & บันทึกปั๊มนม (Lactation Tracker)</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            บันทึกเวลาดูดเต้าซ้าย-ขวา ปริมาณน้ำนม และดูแลสุขภาพเต้านม
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-sky-50 text-sky-700 font-semibold rounded-lg border border-sky-100">
            ยอดน้ำนมวันนี้: {totalVolumeToday} มล. ({(totalVolumeToday / 30).toFixed(1)} ออนซ์)
          </span>
        </div>
      </div>

      {/* Interactive Feeding Stopwatch */}
      <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 rounded-2xl p-6 border border-rose-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-stone-900 text-base">
              ตัวจับเวลาเข้าเต้า (Breastfeeding Stopwatch)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            รวม: {formatTime(leftSeconds + rightSeconds)}
          </span>
        </div>

        {/* Dual Breast Timers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          {/* Left Breast */}
          <div
            className={`p-5 rounded-2xl border-2 text-center transition-all ${
              activeSide === 'left' && timerRunning
                ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                : 'border-stone-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              เต้าข้างซ้าย (Left Breast)
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-stone-900 my-2">
              {formatTime(leftSeconds)}
            </div>
            <button
              onClick={() => {
                if (activeSide === 'left' && timerRunning) handlePause();
                else handleStart('left');
              }}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 ${
                activeSide === 'left' && timerRunning
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
            >
              {activeSide === 'left' && timerRunning ? (
                <>
                  <Pause className="w-4 h-4" /> พักข้างซ้าย
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> เริ่มเข้าเต้าซ้าย
                </>
              )}
            </button>
          </div>

          {/* Right Breast */}
          <div
            className={`p-5 rounded-2xl border-2 text-center transition-all ${
              activeSide === 'right' && timerRunning
                ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                : 'border-stone-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              เต้าข้างขวา (Right Breast)
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-stone-900 my-2">
              {formatTime(rightSeconds)}
            </div>
            <button
              onClick={() => {
                if (activeSide === 'right' && timerRunning) handlePause();
                else handleStart('right');
              }}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 ${
                activeSide === 'right' && timerRunning
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
            >
              {activeSide === 'right' && timerRunning ? (
                <>
                  <Pause className="w-4 h-4" /> พักข้างขวา
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> เริ่มเข้าเต้าขวา
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timer Control Bar & Save */}
        {(leftSeconds > 0 || rightSeconds > 0) && (
          <div className="mt-4 pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwitchSide}
                className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-medium"
              >
                สลับข้าง (Switch Side)
              </button>
              <button
                onClick={handleResetTimer}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ต
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="บันทึกย่อ (เช่น ดูดดี หลับสบาย)"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-white grow sm:w-56"
              />
              <button
                onClick={handleSaveTimerSession}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <CheckCircle className="w-4 h-4" /> บันทึกรอบนี้
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pumping Log & Today Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pumping Log Form */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>บันทึกการปั๊มนมสต็อก (Pumping Log)</span>
            </h3>
            <span className="text-[11px] text-stone-400">เก็บในฟรีซได้ 3-6 เดือน</span>
          </div>

          <form onSubmit={handleSavePumpSession} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ปริมาณน้ำนม (มล.)
                </label>
                <input
                  type="number"
                  step="10"
                  min="10"
                  value={pumpVolume}
                  onChange={(e) => setPumpVolume(parseInt(e.target.value) || 0)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white"
                />
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  ≈ {(pumpVolume / 30).toFixed(1)} ออนซ์ (oz)
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ระยะเวลาปั๊ม (นาที)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={pumpDuration}
                  onChange={(e) => setPumpDuration(parseInt(e.target.value) || 15)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                รายละเอียดรอบปั๊ม
              </label>
              <input
                type="text"
                value={pumpNotes}
                onChange={(e) => setPumpNotes(e.target.value)}
                placeholder="เช่น ถุงเก็บสต็อกเบอร์ 12 ใส่ช่องฟรีซ"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> บันทึกรอบปั๊มนม
            </button>
          </form>
        </div>

        {/* Sessions list */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>ประวัติการให้นม & ปั๊มวันนี้ ({feedings.length} ครั้ง)</span>
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {feedings.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">ยังไม่มีประวัติในวันนี้</p>
            ) : (
              feedings.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs hover:border-stone-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        session.type === 'pump' ? 'bg-sky-500' : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-stone-900">
                        {session.type === 'pump'
                          ? 'ปั๊มนมสต็อก'
                          : session.type === 'breast_left'
                          ? 'เข้าเต้าข้างซ้าย'
                          : session.type === 'breast_right'
                          ? 'เข้าเต้าข้างขวา'
                          : 'เข้าเต้าทั้งสองข้าง'}
                      </span>
                      <p className="text-[11px] text-stone-500">{session.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-800">
                      {session.volumeMl ? `${session.volumeMl} มล.` : `${session.durationMinutes} นาที`}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{session.timestamp} น.</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Breast Care Diagnostic & Troubleshooting */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>คู่มือแก้ปัญหาเต้านมแม่หลังคลอด (Breast Care Guide)</span>
          </h3>
          <p className="text-xs text-stone-500">
            เลือกปัญหาที่คุณแม่พบ เพื่อดูวิธีแก้ไขที่ถูกต้องตามหลักสากล
          </p>
        </div>

        {/* Issue selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'engorgement', label: 'เต้านมคัดตึง (Engorgement)' },
            { id: 'clogged', label: 'ท่อน้ำนมอุดตัน / ก้อนไต' },
            { id: 'cracked', label: 'หัวนมแตก / แสบเจ็บ' },
            { id: 'mastitis', label: 'เต้านมอักเสบ (มีไข้)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedIssue(tab.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedIssue === tab.id
                  ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-200'
                  : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Solution content */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
          {selectedIssue === 'engorgement' && (
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-sm text-rose-900">
                วิธีรับมือกับเต้านมคัดตึง (มักเกิดในวันที่ 3-5 หลังคลอด):
              </h4>
              <p>1. <strong>ประคบอุ่นเบาๆ 3-5 นาที</strong> ก่อนให้นมหรือปั๊ม เพื่อช่วยให้หลอดเลือดขยายตัวและน้ำนมไหลสะดวก</p>
              <p>2. <strong>บีบน้ำนมออกเล็กน้อย</strong> ด้วยมือก่อน เพื่อให้ลานนมรอบหัวนมนิ่มลง ช่วยให้ลูกอมได้ลึกและไม่ลื่นหลุด</p>
              <p>3. <strong>ให้ลูกดูดบ่อยๆ</strong> ทุก 2-2.5 ชั่วโมง หรือปั๊มระบายออกให้เกลี้ยงเต้า</p>
              <p>4. <strong>ประคบเย็นหลังให้นมเสร็จ</strong> 10-15 นาที (เช่น ใช้ผ้าชุบน้ำเย็น หรือกะหล่ำปลีแช่เย็น) เพื่อลดอาการบวมและลดการอักเสบ</p>
            </div>
          )}

          {selectedIssue === 'clogged' && (
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-sm text-rose-900">
                วิธีสลายท่อน้ำนมอุดตัน (ก้อนไต / จุดขาว White Dot):
              </h4>
              <p>1. <strong>จัดให้คางของลูกน้อยชี้ไปทางก้อนไต</strong> ขณะดูด แรงดูดจากขากรรไกรล่างจะช่วยรีดก้อนอุดตันได้ดีที่สุด</p>
              <p>2. <strong>นวดคลึงเบาๆ เป็นวงกลม</strong> บริเวณหลังก้อนไตไปทางหัวนมในขณะที่ลูกกำลังดูดหรือขณะเปิดเครื่องปั๊มนม</p>
              <p>3. <strong>เปลี่ยนท่าให้นม</strong> เช่น ท่าฟุตบอล หรือท่าก้มให้นม (Dangle feeding) อาศัยแรงโน้มถ่วงช่วย</p>
              <p>4. สามารถทานอาหารเสริม <em>เลซิติน (Lecithin)</em> 1,200 มก. เพื่อช่วยลดความหนืดของน้ำนม</p>
            </div>
          )}

          {selectedIssue === 'cracked' && (
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-sm text-rose-900">
                วิธีรักษาหัวนมแตกและลดอาการเจ็บ:
              </h4>
              <p>1. <strong>ปรับวิธีอมลึก (Deep Latch):</strong> สาเหตุอันดับ 1 คือลูกอมตื้นแค่หัวนม ต้องให้ลูกอ้าปากกว้าง อมคลุมลานนมด้านล่างให้มิดชิด คางแนบเต้า</p>
              <p>2. <strong>ใช้น้ำนมแม่ทาเคลือบ:</strong> บีบน้ำนมแม่หยดลงบนหัวนมแล้วทาเกลี่ยให้ทั่วหลังดูดเสร็จ น้ำนมแม่มีสารช่วยสมานแผลและต้านแบคทีเรียธรรมชาติ</p>
              <p>3. <strong>ทาครีมลาโนลินบริสุทธิ์ (Pure Lanolin)</strong> ช่วยรักษาความชุ่มชื้นโดยไม่ต้องเช็ดออกก่อนให้นมครั้งต่อไป</p>
              <p>4. ให้เริ่มดูดข้างที่เจ็บน้อยกว่าก่อน เมื่อน้ำนมเริ่มพุ่งจึงสลับมาข้างที่เจ็บ</p>
            </div>
          )}

          {selectedIssue === 'mastitis' && (
            <div className="space-y-2 bg-red-50/80 p-3 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 text-sm">
                ⚠️ ข้อควรระวังเต้านมอักเสบ (Mastitis):
              </h4>
              <p className="text-red-800">
                หากเต้านมมีรอยแดงเป็นปื้น ปวดแสบร้อนจัด และมีไข้สูงเกิน 38.5°C หนาวสั่น คล้ายเป็นไข้หวัดใหญ่
              </p>
              <p className="text-red-900 font-semibold">
                • <strong>อย่าหยุดให้นม!</strong> ยังคงต้องให้ลูกดูดหรือปั๊มระบายน้ำนมออกอย่างสม่ำเสมอ เพื่อไม่ให้นมคั่งจนเกิดฝีหนอง
              </p>
              <p className="text-red-900 font-semibold">
                • <strong>ต้องรีบพบแพทย์สูตินรีเวช</strong> เพื่อตรวจและรับยาปฏิชีวนะที่ปลอดภัยสำหรับแม่ให้นมบุตร
              </p>
            </div>
          )}
        </div>

        {/* 4 Breastfeeding Latch Positions */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-stone-900 mb-2">
            4 ท่าอุ้มให้นมแม่ที่ถูกต้อง:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs text-stone-600">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">1. ท่าอุ้มขวาง (Cradle)</span>
              <span>ท่ามาตรฐาน ลูกนอนตะแคงท้องแนบท้องแม่</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">2. ท่าอุ้มขวางประยุกต์</span>
              <span>ใช้มือข้างตรงข้ามประคองศีรษะลูก เหมาะกับทารกแรกเกิด</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
              <span className="font-bold text-rose-950 block mb-0.5">3. ท่าฟุตบอล (Football)</span>
              <span>ลูกอยู่ข้างลำตัว <strong>เหมาะมากกับแม่ผ่าคลอด</strong> ไม่กดทับแผล</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-0.5">4. ท่านอนตะแคง</span>
              <span>แม่นอนตะแคงให้นม สบาย ไม่เจ็บแผลฝีเย็บ เหมาะกับมื้อดึก</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
