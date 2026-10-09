import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Droplets,
  CheckCircle,
  Sparkles,
  Utensils,
  Plus,
  Minus,
  Award
} from 'lucide-react';
import { POSTPARTUM_KNOWLEDGE } from '../data/mockData';

interface SelfCareKegelProps {
  waterIntakeMl: number;
  kegelRoundsCompleted: number;
  onUpdateWater: (newAmount: number) => void;
  onIncrementKegel: () => void;
}

export const SelfCareKegel: React.FC<SelfCareKegelProps> = ({
  waterIntakeMl,
  kegelRoundsCompleted,
  onUpdateWater,
  onIncrementKegel,
}) => {
  // Kegel Coach State
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'contract' | 'relax'>('contract'); // 5s contract, 5s relax
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [currentRep, setCurrentRep] = useState(1);
  const [targetReps] = useState(10);
  const [completedSessions, setCompletedSessions] = useState(kegelRoundsCompleted);

  // Kegel timer engine
  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Switch phase
            if (phase === 'contract') {
              setPhase('relax');
              return 5;
            } else {
              // Relax finished, increment rep
              if (currentRep < targetReps) {
                setCurrentRep((r) => r + 1);
                setPhase('contract');
                return 5;
              } else {
                // Completed set of 10!
                setIsRunning(false);
                setCurrentRep(1);
                setPhase('contract');
                setCompletedSessions((c) => c + 1);
                onIncrementKegel();
                return 5;
              }
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, phase, currentRep, targetReps, onIncrementKegel]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleResetCoach = () => {
    setIsRunning(false);
    setPhase('contract');
    setSecondsLeft(5);
    setCurrentRep(1);
  };

  const waterTarget = 3000;
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / waterTarget) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            <span>กายภาพฟื้นฟู & โภชนาการแม่หลังคลอด (Self-Care & Nutrition)</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            ฝึกกล้ามเนื้ออุ้งเชิงกราน (Kegel) ป้องกันปัสสาวะเล็ด และดื่มน้ำกระตุ้นน้ำนม
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg border border-purple-100">
            สำเร็จ {completedSessions} เซ็ตวันนี้
          </span>
        </div>
      </div>

      {/* Grid: Kegel Coach + Water Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Kegel Coach */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-pink-50/50 rounded-2xl p-6 border border-purple-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>โค้ชฝึกขมิบกล้ามเนื้ออุ้งเชิงกราน (Kegel Coach)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  รอบที่ {currentRep} / {targetReps} ครั้งต่อเซ็ต
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg">
                เซ็ตละ 10 ครั้ง
              </span>
            </div>

            {/* Circular Pulse Visualizer */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-inner ${
                  phase === 'contract'
                    ? 'bg-purple-600 text-white scale-105 shadow-purple-400 ring-8 ring-purple-200'
                    : 'bg-purple-100 text-purple-900 scale-95 ring-4 ring-purple-50'
                }`}
              >
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  {phase === 'contract' ? 'ขมิบเกร็งค้างไว้' : 'ผ่อนคลายกล้ามเนื้อ'}
                </span>
                <span className="text-4xl font-bold font-mono my-1">{secondsLeft}</span>
                <span className="text-[11px] opacity-80">วินาที</span>
              </div>

              <p className="text-xs text-stone-600 mt-4 text-center max-w-xs leading-relaxed">
                {phase === 'contract'
                  ? '🎯 จินตนาการว่ากำลังกลั้นปัสสาวะ ขมิบกล้ามเนื้อช่องคลอดขึ้นด้านบน อย่าเกร็งหน้าท้อง'
                  : '🍃 หายใจเข้าลึกๆ ผ่อนคลายกล้ามเนื้ออุ้งเชิงกรานให้สบาย ไม่ต้องเกร็ง'}
              </p>
            </div>
          </div>

          {/* Coach Controls */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
            <button
              onClick={handleResetCoach}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> เริ่มใหม่
            </button>

            <button
              onClick={handleStartStop}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> หยุดชั่วคราว
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> เริ่มฝึกเซ็ตนี้
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Water Hydration Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-sky-500" />
                  <span>บันทึกการดื่มน้ำ (Lactation Hydration)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  เป้าหมายคุณแม่ให้นม: 3,000 มล. ต่อวัน (น้ำเป็นส่วนประกอบหลัก 88% ของน้ำนม)
                </p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                {waterPercent}%
              </span>
            </div>

            {/* Visual Glass / Gauge */}
            <div className="my-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold font-mono text-stone-900">
                  {waterIntakeMl} <span className="text-sm font-normal text-stone-500">/ 3,000 มล.</span>
                </span>
                <span className="text-xs text-stone-500">
                  ขาดอีก {Math.max(0, waterTarget - waterIntakeMl)} มล.
                </span>
              </div>

              <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-500 pt-1">
                💡 เคล็ดลับ: ดื่มน้ำอุ่น 1 แก้ว (250 มล.) ก่อนและหลังให้นมลูกทุกรอบ จะช่วยให้ถึงเป้าหมายได้ง่ายขึ้น
              </p>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                onClick={() => onUpdateWater(waterIntakeMl + 200)}
                className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-sky-900 text-xs font-semibold text-center transition-colors"
              >
                +200 มล. (แก้วเล็ก)
              </button>
              <button
                onClick={() => onUpdateWater(waterIntakeMl + 350)}
                className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-sky-900 text-xs font-semibold text-center transition-colors"
              >
                +350 มล. (แก้วปกติ)
              </button>
              <button
                onClick={() => onUpdateWater(waterIntakeMl + 500)}
                className="p-2.5 rounded-xl border border-sky-500 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold text-center transition-colors shadow-xs"
              >
                +500 มล. (ขวดน้ำ)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
            <button
              onClick={() => onUpdateWater(Math.max(0, waterIntakeMl - 250))}
              className="text-stone-400 hover:text-stone-700 flex items-center gap-1"
            >
              <Minus className="w-3.5 h-3.5" /> ลบ 250 มล.
            </button>
            <button
              onClick={() => onUpdateWater(3000)}
              className="text-sky-600 font-semibold hover:underline"
            >
              ตั้งครบ 3,000 มล.
            </button>
          </div>
        </div>
      </div>

      {/* Lactation Food & Postpartum Nutrition */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <span>เมนูอาหารไทยบำรุงน้ำนม & ฟื้นฟูร่างกายหลังคลอด</span>
            </h3>
            <p className="text-xs text-stone-500">
              โภชนาการที่อุดมด้วยฟอสฟอรัส ธาตุเหล็ก แคลเซียม และสมุนไพรฤทธิ์อุ่น
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold rounded-lg">
            อาหารเพิ่มน้ำนม
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {POSTPARTUM_KNOWLEDGE.postpartumFoods.map((food, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl mb-1.5 block">{food.icon}</span>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{food.name}</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{food.benefit}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 space-y-1">
          <span className="font-bold block">⚠️ อาหารที่แม่หลังคลอดและให้นมควรหลีกเลี่ยง:</span>
          <p>
            • เครื่องดื่มแอลกอฮอล์ทุกชนิด, อาหารหมักดอง, อาหารสุกๆ ดิบๆ, ยาดองเหล้าหรือสมุนไพรขับน้ำคาวปลาที่ไม่ได้สั่งโดยแพทย์สูตินรีเวช (เสี่ยงตกเลือด), และควรจำกัดกาเฟอีนไม่เกิน 1 แก้วต่อวัน
          </p>
        </div>
      </div>
    </div>
  );
};
