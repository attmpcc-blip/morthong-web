import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Activity,
  HeartHandshake,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { POSTPARTUM_KNOWLEDGE } from '../data/mockData';
import { MotherProfile } from '../types';

interface DangerSignsTriageProps {
  profile: MotherProfile;
  onOpenEmergency: () => void;
}

export const DangerSignsTriage: React.FC<DangerSignsTriageProps> = ({
  profile,
  onOpenEmergency,
}) => {
  const [selectedSigns, setSelectedSigns] = useState<Record<string, boolean>>({});

  const toggleSign = (id: string) => {
    setSelectedSigns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetAll = () => {
    setSelectedSigns({});
  };

  const dangerCount = Object.values(selectedSigns).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Triage Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white rounded-2xl p-6 shadow-md shadow-rose-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <h2 className="text-xl font-bold tracking-tight">
                ระบบคัดกรอง 7 สัญญาณอันตรายแม่หลังคลอด (Red Flag Triage)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              ในระยะ 6 สัปดาห์แรกหลังคลอด ร่างกายกำลังฟื้นตัวอย่างรวดเร็ว หากมีอาการผิดปกติดังต่อไปนี้ ห้ามรอดูอาการโดยเด็ดขาด
            </p>
          </div>

          <button
            onClick={onOpenEmergency}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-transform active:scale-95 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>ติดต่อห้องคลอด / 1669</span>
          </button>
        </div>
      </div>

      {/* Real-time Triage Status Indicator */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          dangerCount > 0
            ? 'bg-red-50 border-red-300 ring-2 ring-red-200'
            : 'bg-emerald-50/70 border-emerald-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {dangerCount > 0 ? (
              <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h3
                className={`font-bold text-base sm:text-lg ${
                  dangerCount > 0 ? 'text-red-900' : 'text-emerald-950'
                }`}
              >
                {dangerCount > 0
                  ? `ระดับสีแดง (ฉุกเฉิน): พบสัญญาณอันตราย ${dangerCount} รายการ!`
                  : 'ระดับสีเขียว (ปกติ): ไม่พบสัญญาณอันตรายในขณะนี้'}
              </h3>
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                  dangerCount > 0 ? 'text-red-800' : 'text-emerald-800'
                }`}
              >
                {dangerCount > 0
                  ? 'แนะนำให้รีบเดินทางไปพบแพทย์ที่ห้องคลอด/ห้องฉุกเฉินโรงพยาบาล หรือโทร 1669 ทันที อย่าปล่อยทิ้งไว้ข้ามคืน'
                  : 'คุณแม่ไม่มีอาการวิกฤต สามารถสังเกตอาการต่อเนื่องและปฏิบัติตามคำแนะนำประจำวัน'}
              </p>
            </div>
          </div>

          {dangerCount > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={resetAll}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl"
              >
                รีเซ็ตการเลือก
              </button>
              <button
                onClick={onOpenEmergency}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" /> โทรหาโรงพยาบาลทันที
              </button>
            </div>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
              ปลอดภัยดี
            </span>
          )}
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              คลิกเพื่อตรวจสอบอาการที่คุณแม่กำลังประสบอยู่
            </h3>
            <p className="text-xs text-stone-500">
              ติ๊กเลือกช่องด้านล่างหากมีอาการเกิดขึ้นจริง
            </p>
          </div>
          <button
            onClick={resetAll}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ล้างทั้งหมด
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {POSTPARTUM_KNOWLEDGE.dangerSignsList.map((sign) => {
            const isChecked = !!selectedSigns[sign.id];

            return (
              <div
                key={sign.id}
                onClick={() => toggleSign(sign.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isChecked
                    ? 'border-red-500 bg-red-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent onClick
                    className="w-5 h-5 mt-0.5 rounded border-stone-300 text-red-600 focus:ring-red-500 shrink-0"
                  />
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isChecked ? 'text-red-950' : 'text-stone-900'
                      }`}
                    >
                      {sign.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      <strong>สาเหตุที่ต้องระวัง:</strong> {sign.reason}
                    </p>
                    <div
                      className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isChecked
                          ? 'bg-red-200 text-red-900'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {sign.action}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hospital Referral & Preparedness Info */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-600" />
          <span>สิ่งที่ต้องเตรียมไปโรงพยาบาลเมื่อเกิดเหตุฉุกเฉิน</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
          <div className="bg-white p-3 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">1. สมุดสีชมพู / บันทึกคลอด</span>
            <span>ประวัติการคลอด ชนิดการคลอด ยาที่ได้รับระหว่างอยู่โรงพยาบาล</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">2. ตัวอย่างผ้าอนามัย (ถ้ามี)</span>
            <span>หากมีเลือดออกมาก ให้นำผ้าอนามัยผืนที่ชุ่มไปให้แพทย์ประเมินปริมาณเลือด</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">3. บัตรประชาชน & สิทธิรักษา</span>
            <span>บัตรประจำตัวประชาชน สิทธิประกันสังคม หรือสิทธิหลักประกันสุขภาพ (บัตรทอง)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
