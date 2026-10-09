import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  BookOpen,
  Info,
  Calendar,
  Flower2,
  ShieldCheck,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { MotherProfile, ThaiElement, YufaiProcedure, RuesiDatTonExercise } from '../types';
import {
  THAI_ELEMENTS_INFO,
  YUFAI_PROCEDURES,
  RUESI_DAT_TON_EXERCISES,
  THAI_HERBAL_RECIPES
} from '../data/thaiMedicineData';

interface ThaiMedicineYufaiProps {
  profile: MotherProfile;
  currentDay: number;
  deliveryType: 'vaginal' | 'c_section';
  onLogYufaiSession?: (procedureName: string) => void;
  onOpenEmergency: () => void;
}

export const ThaiMedicineYufai: React.FC<ThaiMedicineYufaiProps> = ({
  profile,
  currentDay,
  deliveryType,
  onLogYufaiSession,
  onOpenEmergency,
}) => {
  const [selectedElement, setSelectedElement] = useState<ThaiElement>(profile.thaiElement || 'earth');
  const [selectedProcedure, setSelectedProcedure] = useState<YufaiProcedure>(YUFAI_PROCEDURES[0]);
  const [activeTab, setActiveTab] = useState<'yufai' | 'elements' | 'ruesi' | 'recipes'>('yufai');
  const [completedProcedures, setCompletedProcedures] = useState<string[]>([
    'การนวดเปิดท่อน้ำนม & ประคบเต้า (Traditional Lactation Massage)',
  ]);
  const [showLogToast, setShowLogToast] = useState(false);

  // Check safety readiness for selected procedure
  const getReadinessStatus = (proc: YufaiProcedure) => {
    if (deliveryType === 'c_section') {
      if (proc.id === 'salt_pot') {
        const isReady = currentDay >= 30;
        return {
          isReady,
          label: isReady ? 'พร้อมทำหัตถการได้' : `รอแผลชั้นในหายสนิท (แนะนำหลัง 30-45 วัน / ปัจจุบันวันที่ ${currentDay})`,
          badgeColor: isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
        };
      }
      if (proc.id === 'herbal_steam') {
        const isReady = currentDay >= 21;
        return {
          isReady,
          label: isReady ? 'พร้อมทำหัตถการได้' : `แนะนำหลังคลอด 21 วันขึ้นไป (ปัจจุบันวันที่ ${currentDay})`,
          badgeColor: isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
        };
      }
      if (proc.id === 'herbal_smoke_sitz') {
        return {
          isReady: false,
          label: 'ไม่แนะนำสำหรับคุณแม่ผ่าคลอด (ใช้เฉพาะแผลฝีเย็บ)',
          badgeColor: 'bg-stone-200 text-stone-600',
        };
      }
    } else {
      // Vaginal
      if (proc.id === 'salt_pot' || proc.id === 'herbal_steam' || proc.id === 'herbal_smoke_sitz') {
        const isReady = currentDay >= 7;
        return {
          isReady,
          label: isReady ? 'พร้อมทำหัตถการได้ (แผลฝีเย็บแห้งสนิท)' : `รอแผลฝีเย็บแห้งสนิท (หลังวันที่ 7 / ปัจจุบันวันที่ ${currentDay})`,
          badgeColor: isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
        };
      }
    }
    return {
      isReady: true,
      label: 'พร้อมทำหัตถการได้ตามปกติ',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    };
  };

  const handleRecordProcedure = (procName: string) => {
    if (!completedProcedures.includes(procName)) {
      setCompletedProcedures([...completedProcedures, procName]);
    }
    if (onLogYufaiSession) onLogYufaiSession(procName);
    setShowLogToast(true);
    setTimeout(() => setShowLogToast(false), 2500);
  };

  const elementData = THAI_ELEMENTS_INFO[selectedElement];

  return (
    <div className="space-y-6">
      {/* Signature TTM Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white p-6 shadow-md border border-amber-600/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-xs font-semibold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                <Flower2 className="w-3.5 h-3.5 text-amber-300" /> ศาสตร์การแพทย์แผนไทย (TTM)
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-stone-200">
                คัมภีร์มหาโชตรัต & คัมภีร์ปฐมจินดา
              </span>
              {profile.thaiMedicineDoctorName && (
                <span className="text-xs text-amber-300 font-medium">
                  แพทย์แผนไทย: {profile.thaiMedicineDoctorName}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>การฟื้นฟูมารดาหลังคลอด & การอยู่ไฟแบบสมบูรณ์</span>
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              ภูมิปัญญาการแพทย์แผนไทยดั้งเดิม ผสานความร้อนสมุนไพรสดและน้ำมันหอมระเหย ช่วยขับน้ำคาวปลา ให้มดลูกเข้าอู่เร็ว ฟื้นฟูธาตุไฟ และปรับสมดุลธาตุทั้งสี่ให้กลับคืนสู่ความสมบูรณ์
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5 bg-white/10 p-3.5 rounded-xl border border-white/10">
            <span className="text-xs text-amber-200 font-medium">ธาตุเจ้าเรือนกำเนิดของคุณแม่</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{THAI_ELEMENTS_INFO[profile.thaiElement]?.name || 'ธาตุดิน'}</span>
              <span className="text-xs bg-amber-500/40 text-amber-100 px-2 py-0.5 rounded font-mono">
                {profile.thaiElement === 'earth' ? 'ปถวีธาตุ' : profile.thaiElement === 'water' ? 'อาโปธาตุ' : profile.thaiElement === 'wind' ? 'วาโยธาตุ' : 'เตโชธาตุ'}
              </span>
            </div>
            <span className="text-[11px] text-stone-300">
              สถานะ: หลังคลอดวันที่ {currentDay} ({deliveryType === 'vaginal' ? 'คลอดธรรมชาติ' : 'ผ่าตัดคลอด'})
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Yufai Procedures / 4 Elements / Ruesi Dat Ton / Herbal Recipes */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'yufai', label: 'หัตถการการอยู่ไฟ (6 ขั้นตอน)', icon: Flame },
          { id: 'elements', label: 'ธาตุเจ้าเรือน & ตรีธาตุ', icon: Mountain },
          { id: 'ruesi', label: 'กายบริหารฤๅษีดัดตน', icon: Sparkles },
          { id: 'recipes', label: 'ตำรับอาหาร & ชาสมุนไพร', icon: Droplets },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-amber-50/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Yufai Procedures */}
      {activeTab === 'yufai' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {showLogToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                บันทึกการทำหัตถการการแพทย์แผนไทยเรียบร้อยแล้ว
              </span>
            </div>
          )}

          {/* Procedure Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {YUFAI_PROCEDURES.map((proc) => {
              const readiness = getReadinessStatus(proc);
              const isSelected = selectedProcedure.id === proc.id;
              const isDone = completedProcedures.includes(proc.name);

              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedProcedure(proc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-300 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${readiness.badgeColor}`}>
                        {readiness.isReady ? '✓ พร้อมทำ' : 'รอเวลา'}
                      </span>
                      {isDone && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ทำแล้ว
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{proc.name}</h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">{proc.benefit}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-800 font-medium">
                    <span>ดูขั้นตอนและสมุนไพร</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Procedure Guide */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                  คู่มือหัตถการแพทย์แผนไทย
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {selectedProcedure.name}
                </h3>
                {selectedProcedure.namePali && (
                  <span className="text-xs text-stone-500 font-serif italic">
                    {selectedProcedure.namePali}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRecordProcedure(selectedProcedure.name)}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>บันทึกว่าทำหัตถการนี้แล้ว</span>
                </button>
              </div>
            </div>

            {/* Timing Rule Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">เกณฑ์ระยะเวลาที่เหมาะสม: </span>
                <span>{selectedProcedure.timingRule}</span>
              </div>
            </div>

            {/* Description & Benefits */}
            <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>{selectedProcedure.description}</p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">สรรพคุณทางการแพทย์แผนไทย:</strong>
                <p className="text-stone-700">{selectedProcedure.benefit}</p>
              </div>
            </div>

            {/* Key Herbs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                สมุนไพรสำคัญที่ใช้ในหัตถการ (Herbal Ingredients):
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProcedure.herbs.map((herb, hIdx) => (
                  <span
                    key={hIdx}
                    className="px-3 py-1 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 text-xs rounded-lg font-medium border border-stone-200 transition-colors"
                  >
                    🌿 {herb}
                  </span>
                ))}
              </div>
            </div>

            {/* Step by step */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                ขั้นตอนการทำหัตถการ (Step-by-step Practice):
              </h4>
              <ol className="space-y-2 text-xs text-stone-700">
                {selectedProcedure.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Contraindications / Safety */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>ข้อห้ามทางการแพทย์แผนไทย (Contraindications):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-800">
                {selectedProcedure.contraindications.map((c, cIdx) => (
                  <li key={cIdx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 4 Elements (ธาตุเจ้าเรือน) */}
      {activeTab === 'elements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              การตรวจและดูแลตามธาตุเจ้าเรือนกำเนิด (4 Elemental Constitutions)
            </h3>
            <p className="text-xs text-stone-500">
              ตามคัมภีร์โรคนิทานและคัมภีร์ธาตุบรรจบ หญิงหลังคลอดจะสูญเสียธาตุไฟและธาตุน้ำ (เลือดและน้ำคาวปลา) ต้องปรับสมดุลธาตุทั้งสี่
            </p>

            {/* Element Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              {(['earth', 'water', 'wind', 'fire'] as ThaiElement[]).map((elem) => {
                const info = THAI_ELEMENTS_INFO[elem];
                const isSelected = selectedElement === elem;

                return (
                  <button
                    key={elem}
                    onClick={() => setSelectedElement(elem)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-300 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs sm:text-sm">{info.name}</span>
                      {profile.thaiElement === elem && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">
                          ธาตุของคุณแม่
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5">{info.paliName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Element Deep-dive */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                  คำแนะนำตามธาตุเจ้าเรือน
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                  {elementData.name} · {elementData.paliName}
                </h3>
                <span className="text-xs text-stone-500">
                  สำหรับผู้เกิดเดือน: {elementData.birthMonths}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 block font-semibold">ลักษณะพื้นฐานของธาตุ:</strong>
                <p className="text-stone-600 leading-relaxed">{elementData.characteristics}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <strong className="text-amber-950 block font-semibold">การดูแลมารดาหลังคลอดเฉพาะธาตุนี้:</strong>
                <p className="text-amber-900 leading-relaxed">{elementData.postpartumCare}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <strong className="text-stone-900 text-xs font-semibold block">
                รสยาและรสอาหารที่แนะนำ (Tastes of Healing):
              </strong>
              <p className="text-xs text-stone-700">{elementData.recommendedTastes}</p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-stone-600 block mb-1.5">
                  เมนูอาหารสมุนไพรประจำธาตุ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {elementData.herbalFoods.map((food, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-3 py-1 bg-white text-stone-800 text-xs rounded-lg border border-stone-200 shadow-2xs font-medium"
                    >
                      🍲 {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Ruesi Dat Ton (ฤๅษีดัดตน) */}
      {activeTab === 'ruesi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>ท่าฤๅษีดัดตนฟื้นฟูมารดา (Rue-si Dat Ton for Mothers)</span>
            </h3>
            <p className="text-xs text-stone-500">
              การบริหารร่างกายและลมหายใจตามตำรับวัดพระเชตุพนฯ (วัดโพธิ์) ช่วยปรับโครงสร้างกระดูก คลายกล้ามเนื้อ และเปิดท่อน้ำนม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RUESI_DAT_TON_EXERCISES.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl p-2 bg-amber-50 rounded-xl border border-amber-200">
                      {ex.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">{ex.name}</h4>
                      <p className="text-xs text-stone-500">{ex.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-700 leading-relaxed mb-3">
                    <strong>ประโยชน์:</strong> {ex.benefit}
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <span className="font-semibold text-stone-900 block">วิธีฝึกปฏิบัติ:</span>
                    {ex.steps.map((st, stIdx) => (
                      <div key={stIdx} className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">{stIdx + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>⚠️ ข้อควรระวัง: {ex.cautions}</span>
                  <button
                    onClick={() => handleRecordProcedure(`ฤๅษีดัดตน: ${ex.name}`)}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold shrink-0"
                  >
                    ทำสำเร็จแล้ว
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Herbal Recipes */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-600" />
              <span>ตำรับอาหาร ชา และน้ำสมุนไพรบำรุงมารดาตามคัมภีร์แผนไทย</span>
            </h3>
            <p className="text-xs text-stone-500">
              ตำรับยาต้มและอาหารสมุนไพรฤทธิ์อุ่น เพื่อกระตุ้นน้ำนม ขับน้ำคาวปลา และฟอกโลหิต
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THAI_HERBAL_RECIPES.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                      {rec.type === 'drink' ? 'เครื่องดื่มสมุนไพร' : rec.type === 'food' ? 'กับข้าวบำรุง' : 'น้ำต้มอาบ'}
                    </span>
                    <span className="text-xs text-stone-400">
                      {rec.stage === 'postpartum' ? 'ระยะหลังคลอด' : 'ตั้งครรภ์ & หลังคลอด'}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-base">{rec.title}</h4>
                  <p className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 mt-2">
                    <strong>สรรพคุณ:</strong> {rec.properties}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800 block mb-1">ส่วนประกอบสมุนไพร:</span>
                    <div className="flex flex-wrap gap-1">
                      {rec.keyHerbs.map((h, hi) => (
                        <span key={hi} className="px-2 py-0.5 bg-stone-100 rounded text-stone-700 text-[11px]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="font-semibold text-stone-800 block mb-0.5">วิธีปรุงและรับประทาน:</span>
                    <p className="text-stone-600 leading-relaxed">{rec.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
