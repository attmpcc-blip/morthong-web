import React, { useState } from 'react';
import { X, Check, Activity, Droplets, Thermometer, Heart, FileText } from 'lucide-react';
import { DailyLog, LochiaAmount, LochiaColor, WoundStatus } from '../types';

interface NewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (log: DailyLog) => void;
  postpartumDay: number;
  existingLog?: DailyLog;
}

export const NewLogModal: React.FC<NewLogModalProps> = ({
  isOpen,
  onClose,
  onSaveLog,
  postpartumDay,
  existingLog,
}) => {
  const [temperature, setTemperature] = useState<number>(existingLog?.temperature || 36.8);
  const [systolicBP, setSystolicBP] = useState<number>(existingLog?.systolicBP || 118);
  const [diastolicBP, setDiastolicBP] = useState<number>(existingLog?.diastolicBP || 76);
  const [painScore, setPainScore] = useState<number>(existingLog?.painScore || 2);
  const [lochiaColor, setLochiaColor] = useState<LochiaColor>(existingLog?.lochiaColor || 'rubra');
  const [lochiaAmount, setLochiaAmount] = useState<LochiaAmount>(existingLog?.lochiaAmount || 'moderate');
  const [lochiaClots, setLochiaClots] = useState<'none' | 'small' | 'large_abnormal'>(existingLog?.lochiaClots || 'none');
  const [lochiaOdor, setLochiaOdor] = useState<'normal' | 'foul'>(existingLog?.lochiaOdor || 'normal');
  const [woundStatus, setWoundStatus] = useState<WoundStatus>(existingLog?.woundStatus || 'normal');
  const [woundNotes, setWoundNotes] = useState<string>(existingLog?.woundNotes || '');
  const [breastStatus, setBreastStatus] = useState<'comfortable' | 'engorged' | 'clogged_duct' | 'cracked_nipple' | 'mastitis_suspect'>(
    existingLog?.breastStatus || 'comfortable'
  );
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(existingLog?.waterIntakeMl || 2500);
  const [tookIronSupplements, setTookIronSupplements] = useState<boolean>(existingLog?.tookIronSupplements ?? true);
  const [kegelRounds, setKegelRounds] = useState<number>(existingLog?.kegelRoundsCompleted || 2);
  const [moodScore, setMoodScore] = useState<number>(existingLog?.moodScore || 4);
  const [notes, setNotes] = useState<string>(existingLog?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      id: existingLog?.id || `log-${Date.now()}`,
      date: existingLog?.date || new Date().toISOString().split('T')[0],
      postpartumDay,
      temperature,
      systolicBP,
      diastolicBP,
      painScore,
      lochiaColor,
      lochiaAmount,
      lochiaClots,
      lochiaOdor,
      woundStatus,
      woundNotes,
      uterusFirmness: 'firm',
      uterinePain: painScore > 5 ? 'moderate' : 'mild',
      breastStatus,
      feedingCount: existingLog?.feedingCount || 8,
      pumpingVolumeMl: existingLog?.pumpingVolumeMl || 150,
      waterIntakeMl,
      tookIronSupplements,
      kegelRoundsCompleted: kegelRounds,
      moodScore,
      notes,
    };
    onSaveLog(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">บันทึกสุขภาพประจำวัน</h3>
              <p className="text-xs text-stone-500">หลังคลอด วันที่ {postpartumDay} · บันทึกเพื่อติดตามการฟื้นฟู</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Vitals */}
          <div className="bg-stone-50 p-4 rounded-xl space-y-3 border border-stone-200/70">
            <h4 className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" /> สัญญาณชีพ & อาการเจ็บปวด
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  อุณหภูมิร่างกาย (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 37.0)}
                  className={`w-full text-sm px-3 py-2 rounded-lg border bg-white focus:outline-hidden focus:ring-2 ${
                    temperature >= 38 ? 'border-red-500 text-red-600 focus:ring-red-400' : 'border-stone-200 focus:ring-rose-400'
                  }`}
                />
                {temperature >= 38 && (
                  <p className="text-[11px] text-red-500 mt-0.5">⚠️ มีไข้สูง เสี่ยงติดเชื้อ</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  ความดันโลหิต (mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(parseInt(e.target.value) || 120)}
                    placeholder="บน"
                    className="w-1/2 text-sm px-2.5 py-2 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  />
                  <span className="text-stone-400 text-xs">/</span>
                  <input
                    type="number"
                    value={diastolicBP}
                    onChange={(e) => setDiastolicBP(parseInt(e.target.value) || 80)}
                    placeholder="ล่าง"
                    className="w-1/2 text-sm px-2.5 py-2 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  ระดับความปวดแผล (0-10): {painScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painScore}
                  onChange={(e) => setPainScore(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0 ไม่ปวด</span>
                  <span>5 ปานกลาง</span>
                  <span>10 ปวดมากที่สุด</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lochia (น้ำคาวปลา) */}
          <div className="bg-rose-50/40 p-4 rounded-xl space-y-3 border border-rose-100">
            <h4 className="text-xs font-semibold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5 text-rose-500" /> ลักษณะน้ำคาวปลา (Lochia)
            </h4>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                สีของน้ำคาวปลา
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rubra', label: 'สีแดงสด (Rubra)', desc: '1-4 วันแรก', bg: 'bg-rose-600 text-white' },
                  { id: 'serosa', label: 'สีชมพู/น้ำตาล (Serosa)', desc: 'วันที่ 5-10', bg: 'bg-rose-400 text-white' },
                  { id: 'alba', label: 'สีขาวเหลือง (Alba)', desc: 'วันที่ 10-28', bg: 'bg-amber-200 text-amber-900' },
                  { id: 'none', label: 'ไม่มีแล้ว (หมดแล้ว)', desc: 'มดลูกเข้าอู่', bg: 'bg-stone-200 text-stone-700' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLochiaColor(item.id as LochiaColor)}
                    className={`p-2 rounded-lg text-left text-xs transition-all border ${
                      lochiaColor === item.id
                        ? 'border-rose-500 ring-2 ring-rose-300 font-semibold shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full ${item.bg}`} />
                      <span className="font-medium text-stone-900">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ปริมาณผ้าอนามัย
                </label>
                <select
                  value={lochiaAmount}
                  onChange={(e) => setLochiaAmount(e.target.value as LochiaAmount)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
                >
                  <option value="light">น้อย (เปื้อนเล็กน้อย / แผ่นแคร์ฟรี)</option>
                  <option value="moderate">ปานกลาง (เปื้อนครึ่งแผ่นอนามัย)</option>
                  <option value="heavy">มาก (ชุ่ม 1 แผ่นใน 3-4 ชม.)</option>
                  <option value="excessive">มากผิดปกติ (ชุ่ม 1 แผ่นใน 1 ชม. ⚠️)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ลิ่มเลือด
                </label>
                <select
                  value={lochiaClots}
                  onChange={(e) => setLochiaClots(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
                >
                  <option value="none">ไม่มีลิ่มเลือด</option>
                  <option value="small">มีลิ่มเลือดเล็กๆ (เล็กกว่าเหรียญ 10)</option>
                  <option value="large_abnormal">มีลิ่มเลือดก้อนใหญ่ผิดปกติ ⚠️</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  กลิ่น
                </label>
                <select
                  value={lochiaOdor}
                  onChange={(e) => setLochiaOdor(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
                >
                  <option value="normal">กลิ่นคาวเลือดตามปกติ</option>
                  <option value="foul">มีกลิ่นเหม็นเน่าผิดปกติ ⚠️</option>
                </select>
              </div>
            </div>
          </div>

          {/* Wound & Breasts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                การฟื้นตัวของแผล (ฝีเย็บ/ผ่าคลอด)
              </label>
              <select
                value={woundStatus}
                onChange={(e) => setWoundStatus(e.target.value as WoundStatus)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="normal">แผลแห้งดี ไม่บวม ไม่แดง</option>
                <option value="mild_pain">ตึงเจ็บเล็กน้อย แต่ไม่มีอาการบวม</option>
                <option value="redness">มีรอยแดงรอบแผล</option>
                <option value="swelling">มีอาการบวมตึงชัดเจน</option>
                <option value="discharge">มีน้ำเหลืองหรือหนองซึม ⚠️</option>
                <option value="urgent">แผลปริแยก ปวดรุนแรง ⚠️</option>
              </select>
              <input
                type="text"
                placeholder="บันทึกเพิ่มเติมเกี่ยวกับแผล (เช่น ซับแห้ง, สบายขึ้น)"
                value={woundNotes}
                onChange={(e) => setWoundNotes(e.target.value)}
                className="w-full mt-2 text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white placeholder-stone-400"
              />
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                อาการเต้านม & การให้นม
              </label>
              <select
                value={breastStatus}
                onChange={(e) => setBreastStatus(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="comfortable">นิ่มสบายดี น้ำนมไหลสะดวก</option>
                <option value="engorged">คัดตึง แน่นเต้า</option>
                <option value="clogged_duct">คลำเจอก้อนไต / ท่อน้ำนมอุดตัน</option>
                <option value="cracked_nipple">หัวนมเจ็บ หรือแตกเป็นแผล</option>
                <option value="mastitis_suspect">ปวดร้อนจัด แดงเป็นปื้น เสี่ยงเต้านมอักเสบ ⚠️</option>
              </select>
            </div>
          </div>

          {/* Self-care: Water, Iron, Kegel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                ดื่มน้ำวันนี้ (มล.)
              </label>
              <input
                type="number"
                step="100"
                value={waterIntakeMl}
                onChange={(e) => setWaterIntakeMl(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">เป้าหมาย 3,000 มล.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                ขมิบช่องคลอด (Kegel)
              </label>
              <select
                value={kegelRounds}
                onChange={(e) => setKegelRounds(parseInt(e.target.value))}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value={0}>ยังไม่ได้ทำ</option>
                <option value={1}>1 เซ็ต (10 ครั้ง)</option>
                <option value={2}>2 เซ็ต (20 ครั้ง)</option>
                <option value={3}>3 เซ็ต (30 ครั้ง - ยอดเยี่ยม)</option>
                <option value={4}>4 เซ็ตขึ้นไป</option>
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <label className="text-xs font-medium text-stone-700 mb-1">
                ยาบำรุงธาตุเหล็ก/แคลเซียม
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={tookIronSupplements}
                  onChange={(e) => setTookIronSupplements(e.target.checked)}
                  className="rounded border-stone-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs text-stone-700 font-medium">ทานยาครบแล้ว</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              บันทึกความรู้สึก หรือข้อสังเกตเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น วันนี้น้องดูดเต้าเก่งขึ้น แผลไม่ตึง อารมณ์สดชื่น..."
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>บันทึกข้อมูลวันนี้</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
