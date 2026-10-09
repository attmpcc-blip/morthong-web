import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Thermometer
} from 'lucide-react';
import { DailyLog, LochiaColor, LochiaAmount, WoundStatus } from '../types';
import { POSTPARTUM_KNOWLEDGE } from '../data/mockData';

interface LochiaWoundTrackerProps {
  currentDay: number;
  deliveryType: 'vaginal' | 'c_section';
  latestLog: DailyLog;
  recentLogs: DailyLog[];
  onUpdateLog: (updated: Partial<DailyLog>) => void;
  onOpenDangerTriage: () => void;
}

export const LochiaWoundTracker: React.FC<LochiaWoundTrackerProps> = ({
  currentDay,
  deliveryType,
  latestLog,
  recentLogs,
  onUpdateLog,
  onOpenDangerTriage,
}) => {
  const [selectedColor, setSelectedColor] = useState<LochiaColor>(latestLog.lochiaColor);
  const [selectedAmount, setSelectedAmount] = useState<LochiaAmount>(latestLog.lochiaAmount);
  const [selectedClots, setSelectedClots] = useState<'none' | 'small' | 'large_abnormal'>(latestLog.lochiaClots);
  const [selectedOdor, setSelectedOdor] = useState<'normal' | 'foul'>(latestLog.lochiaOdor);
  const [woundStatus, setWoundStatus] = useState<WoundStatus>(latestLog.woundStatus);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save current selections
  const handleSave = () => {
    onUpdateLog({
      lochiaColor: selectedColor,
      lochiaAmount: selectedAmount,
      lochiaClots: selectedClots,
      lochiaOdor: selectedOdor,
      woundStatus: woundStatus,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Warning checks
  const isLochiaAbnormal =
    selectedAmount === 'excessive' ||
    selectedClots === 'large_abnormal' ||
    selectedOdor === 'foul' ||
    (currentDay > 14 && selectedColor === 'rubra');

  const isWoundAbnormal = woundStatus === 'discharge' || woundStatus === 'urgent';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Droplets className="w-6 h-6 text-rose-500" />
              <span>การติดตามน้ำคาวปลา & การฟื้นฟูแผล</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              น้ำคาวปลา (Lochia) และแผล{deliveryType === 'vaginal' ? 'ฝีเย็บ' : 'ผ่าคลอด'} เป็นดัชนีสำคัญที่สุดในการบอกการสมานตัวของโพรงมดลูก
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 bg-rose-50 text-rose-700 font-semibold rounded-lg">
              หลังคลอดวันที่ {currentDay}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Stages of Lochia */}
      <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/80">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-500" />
          <span>ลำดับขั้นตามธรรมชาติของน้ำคาวปลา (Stages of Lochia)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {POSTPARTUM_KNOWLEDGE.lochiaStages.map((stage, idx) => {
            const isCurrentExpected =
              (idx === 0 && currentDay <= 4) ||
              (idx === 1 && currentDay > 4 && currentDay <= 10) ||
              (idx === 2 && currentDay > 10);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrentExpected
                    ? 'bg-white border-rose-400 ring-2 ring-rose-200 shadow-xs'
                    : 'bg-white/60 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h4 className="text-xs font-bold text-stone-900">{stage.stage}</h4>
                  </div>
                  {isCurrentExpected && (
                    <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-md">
                      ระยะปัจจุบัน
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-rose-700 block mb-1">
                  📅 {stage.days}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed mb-2">{stage.desc}</p>
                <div className="text-[11px] bg-rose-50/70 p-2 rounded-lg text-rose-900 border border-rose-100">
                  <strong className="font-semibold text-rose-800">ข้อควรระวัง:</strong> {stage.warning}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Daily Lochia Evaluator */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              ประเมินและบันทึกน้ำคาวปลาประจำวัน
            </h3>
            <p className="text-xs text-stone-500">
              สังเกตเมื่อเปลี่ยนแผ่นอนามัยแต่ละรอบ
            </p>
          </div>
          {saveSuccess && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg font-medium flex items-center gap-1 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" /> บันทึกสำเร็จ
            </span>
          )}
        </div>

        {/* 1. Color Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            1. สีของน้ำคาวปลาในปัจจุบัน
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'rubra', name: 'แดงสด (Rubra)', desc: 'วันที่ 1-4', color: 'bg-rose-600' },
              { id: 'serosa', name: 'ชมพู/น้ำตาล (Serosa)', desc: 'วันที่ 5-10', color: 'bg-rose-400' },
              { id: 'alba', name: 'ขาวเหลือง/ใส (Alba)', desc: 'วันที่ 10+', color: 'bg-amber-200' },
              { id: 'none', name: 'หมดแล้ว (แห้งสนิท)', desc: 'เข้าสู่ภาวะปกติ', color: 'bg-stone-300' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(c.id as LochiaColor)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedColor === c.id
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                  <span className="text-xs font-semibold text-stone-900">{c.name}</span>
                </div>
                <span className="text-[11px] text-stone-500 block mt-1">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Amount & Clots & Odor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Amount */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              2. ปริมาณบนผ้าอนามัย
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'light', label: 'น้อย (แผ่นแคร์ฟรี / เปื้อนเล็กน้อย)' },
                { id: 'moderate', label: 'ปานกลาง (เปื้อนครึ่งแผ่นอนามัย)' },
                { id: 'heavy', label: 'มาก (เต็มแผ่นอนามัยใน 3-4 ชม.)' },
                { id: 'excessive', label: 'มากผิดปกติ (ชุ่ม 1 แผ่นใน 1 ชม. ⚠️)' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedAmount === opt.id
                      ? 'bg-rose-100/70 text-rose-950 font-semibold'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="amount"
                    value={opt.id}
                    checked={selectedAmount === opt.id}
                    onChange={() => setSelectedAmount(opt.id as LochiaAmount)}
                    className="accent-rose-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clots */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              3. ลิ่มเลือด (Blood Clots)
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'none', label: 'ไม่มีลิ่มเลือด (เป็นน้ำปกติ)' },
                { id: 'small', label: 'มีลิ่มเลือดเล็กๆ (เล็กกว่าเหรียญสิบบาท)' },
                { id: 'large_abnormal', label: 'มีก้อนลิ่มเลือดใหญ่ผิดปกติ ⚠️' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedClots === opt.id
                      ? 'bg-rose-100/70 text-rose-950 font-semibold'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="clots"
                    value={opt.id}
                    checked={selectedClots === opt.id}
                    onChange={() => setSelectedClots(opt.id as any)}
                    className="accent-rose-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Odor */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              4. กลิ่นของน้ำคาวปลา
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'normal', label: 'กลิ่นคาวเลือดจางๆ ตามปกติ' },
                { id: 'foul', label: 'มีกลิ่นเหม็นเน่าผิดปกติ ⚠️' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedOdor === opt.id
                      ? 'bg-rose-100/70 text-rose-950 font-semibold'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="odor"
                    value={opt.id}
                    checked={selectedOdor === opt.id}
                    onChange={() => setSelectedOdor(opt.id as any)}
                    className="accent-rose-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Warning notification if abnormal */}
        {isLochiaAbnormal && (
          <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">ข้อสังเกต: ตรวจพบลักษณะน้ำคาวปลาผิดปกติ</p>
                <p className="text-xs text-rose-800 mt-0.5">
                  {selectedAmount === 'excessive' && '• เลือดออกชุ่มผ้าอนามัย 1 แผ่น/ชม. เสี่ยงภาวะตกเลือดหลังคลอด '}
                  {selectedClots === 'large_abnormal' && '• มีลิ่มเลือดขนาดใหญ่ผิดปกติ '}
                  {selectedOdor === 'foul' && '• กลิ่นเหม็นเน่าเสี่ยงต่อการติดเชื้อในโพรงมดลูก'}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenDangerTriage}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              ประเมินด่วน →
            </button>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>อัปเดตข้อมูลน้ำคาวปลา</span>
          </button>
        </div>
      </div>

      {/* Wound Assessment & Care Guidelines */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              การประเมินและการดูแลแผล (Wound Healing)
            </h3>
            <p className="text-xs text-stone-500">
              ประเภท: {deliveryType === 'vaginal' ? 'แผลฝีเย็บ (Episiotomy)' : 'แผลผ่าตัดหน้าท้อง (C-Section)'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
            เกณฑ์ REEDA
          </span>
        </div>

        {/* Wound Status Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'normal', label: 'แผลแห้งดี ไม่บวมแดง', badge: 'ปกติ' },
            { id: 'mild_pain', label: 'ตึงเจ็บเล็กน้อย', badge: 'ปกติ' },
            { id: 'redness', label: 'มีรอยแดงรอบแผล', badge: 'เฝ้าระวัง' },
            { id: 'swelling', label: 'บวมตึงชัดเจน', badge: 'เฝ้าระวัง' },
            { id: 'discharge', label: 'มีน้ำเหลืองหรือหนองซึม', badge: 'พบแพทย์ ⚠️' },
            { id: 'urgent', label: 'แผลปริแยก ปวดรุนแรง', badge: 'ด่วน ⚠️' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setWoundStatus(item.id as WoundStatus);
                onUpdateLog({ woundStatus: item.id as WoundStatus });
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                woundStatus === item.id
                  ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 font-semibold'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-900">{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    item.badge.includes('⚠️')
                      ? 'bg-rose-100 text-rose-700'
                      : item.badge === 'เฝ้าระวัง'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Care Guidance by Delivery Type */}
        <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>คำแนะนำการดูแลแผล{deliveryType === 'vaginal' ? 'ฝีเย็บ' : 'ผ่าคลอด'}ที่ถูกต้อง:</span>
          </h4>

          {deliveryType === 'vaginal' ? (
            <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>ล้างทำความสะอาด:</strong> ใช้ขวดน้ำอุ่นฉีดชำระ (Peribottle) จากด้านหน้าไปด้านหลังหลังการขับถ่ายทุกครั้ง ห้ามสวนล้างช่องคลอด
              </li>
              <li>
                <strong>ซับให้แห้ง:</strong> ใช้กระดาษทิชชูสะอาดซับเบาๆ ให้แห้งสนิทก่อนใส่ผ้าอนามัยผืนใหม่ เปลี่ยนผ้าอนามัยทุก 2-3 ชั่วโมง
              </li>
              <li>
                <strong>ลดอาการปวดตึง:</strong> สามารถประคบเย็นในช่วง 24 ชั่วโมงแรก และแช่น้ำอุ่น (Sitz bath) วันละ 10-15 นาทีหลังวันที่ 2 เป็นต้นไป
              </li>
              <li>
                <strong>การนั่ง:</strong> ใช้เบาะรองนั่งรูปห่วงยาง หรือเกร็งก้นเบาๆ ก่อนหย่อนตัวลงนั่ง เพื่อลดแรงดึงรั้งที่แผล
              </li>
            </ul>
          ) : (
            <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>การดูแลแผ่นปิดแผล:</strong> หากเป็นแผ่นกันน้ำ สามารถอาบน้ำได้ตามปกติ ห้ามแกะแผ่นแปะออกเองจนกว่าจะถึงวันตัดไหม/แพทย์นัด
              </li>
              <li>
                <strong>ระวังแรงดันหน้าท้อง:</strong> ใช้มือหรือหมอนนุ่มๆ กดประคองแผลเวลาไอ จาม หรือหัวเราะ และเวลาลุกจากเตียงให้ตะแคงตัวก่อน
              </li>
              <li>
                <strong>การสวมใส่:</strong> สวมกางเกงในเอวสูงที่ขอบยางไม่กดทับรอยแผลผ่าตัด และใส่ผ้ารัดหน้าท้องช่วยพยุงกล้ามเนื้อ
              </li>
              <li>
                <strong>งดการยกของหนัก:</strong> ห้ามยกของหนักเกินกว่าน้ำหนักตัวของทารกในช่วง 4-6 สัปดาห์แรก
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-500" />
          <span>ประวัติการเปลี่ยนแปลงน้ำคาวปลาและแผลย้อนหลัง</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">วันหลังคลอด</th>
                <th className="py-2.5 px-3">สีน้ำคาวปลา</th>
                <th className="py-2.5 px-3">ปริมาณ</th>
                <th className="py-2.5 px-3">ลิ่มเลือด / กลิ่น</th>
                <th className="py-2.5 px-3">สภาพแผล</th>
                <th className="py-2.5 px-3">ปวดแผล (0-10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/50">
                  <td className="py-2.5 px-3 font-semibold text-stone-900">
                    วันที่ {log.postpartumDay} <span className="text-[10px] text-stone-400">({log.date})</span>
                  </td>
                  <td className="py-2.5 px-3 capitalize font-medium">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.lochiaColor === 'rubra'
                            ? 'bg-rose-600'
                            : log.lochiaColor === 'serosa'
                            ? 'bg-rose-400'
                            : log.lochiaColor === 'alba'
                            ? 'bg-amber-300'
                            : 'bg-stone-300'
                        }`}
                      />
                      {log.lochiaColor === 'rubra'
                        ? 'แดงสด'
                        : log.lochiaColor === 'serosa'
                        ? 'ชมพู/น้ำตาล'
                        : log.lochiaColor === 'alba'
                        ? 'ขาวเหลือง'
                        : 'หมดแล้ว'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {log.lochiaAmount === 'light'
                      ? 'น้อย'
                      : log.lochiaAmount === 'moderate'
                      ? 'ปานกลาง'
                      : log.lochiaAmount === 'heavy'
                      ? 'มาก'
                      : 'มากผิดปกติ ⚠️'}
                  </td>
                  <td className="py-2.5 px-3">
                    {log.lochiaClots === 'none' ? 'ไม่มีลิ่ม' : log.lochiaClots === 'small' ? 'ลิ่มเล็ก' : 'ลิ่มใหญ่ ⚠️'} /{' '}
                    {log.lochiaOdor === 'normal' ? 'ปกติ' : 'เหม็น ⚠️'}
                  </td>
                  <td className="py-2.5 px-3">
                    {log.woundStatus === 'normal'
                      ? 'แห้งดี'
                      : log.woundStatus === 'mild_pain'
                      ? 'ตึงเล็กน้อย'
                      : log.woundStatus === 'discharge'
                      ? 'มีหนองซึม ⚠️'
                      : 'บวมแดง'}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-stone-700">
                    {log.painScore} / 10
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
