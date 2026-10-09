import React from 'react';
import { Phone, AlertTriangle, X, ShieldAlert, HeartHandshake, Hospital } from 'lucide-react';
import { MotherProfile } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MotherProfile;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const hotlines = [
    {
      name: 'สายด่วนกู้ชีพฉุกเฉิน (EMS)',
      number: '1669',
      desc: 'ตกเลือดรุนแรง หมดสติ ชัก ไข้สูง หายใจลำบาก',
      color: 'bg-rose-600 text-white hover:bg-rose-700',
    },
    {
      name: `โรงพยาบาลที่คลอด: ${profile.hospitalName}`,
      number: '02-419-7000',
      desc: `แผนกสูตินรีเวช / ห้องคลอด (${profile.doctorName})`,
      color: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
    {
      name: 'สายด่วนสุขภาพจิต (กรมสุขภาพจิต)',
      number: '1323',
      desc: 'ปรึกษาภาวะซึมเศร้าหลังคลอด วิตกกังวล ร้องไห้ไม่หยุด โทรฟรี 24 ชม.',
      color: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
    {
      name: 'ศูนย์นมแม่แห่งประเทศไทย',
      number: '02-354-8404',
      desc: 'ปรึกษาปัญหาเต้านมอักเสบ น้ำนมไม่ไหล ท่อน้ำนมอุดตัน',
      color: 'bg-amber-600 text-white hover:bg-amber-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span>สายด่วนช่วยเหลือฉุกเฉินแม่หลังคลอด</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-3 text-sm text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">สัญญาณอันตรายที่ต้องไปโรงพยาบาลทันที:</p>
            <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
              เลือดออกชุ่มผ้าอนามัย 1 แผ่นภายใน 1 ชั่วโมง, ไข้สูงเกิน 38°C, ปวดท้องน้อยรุนแรง, แผลปริมีหนอง, ปวดศีรษะตาพร่ามัว หรือมีความคิดอยากทำร้ายตนเอง
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {hotlines.map((h, idx) => (
            <div
              key={idx}
              className="p-3.5 border border-stone-200 rounded-xl hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50"
            >
              <div>
                <h4 className="font-medium text-stone-900 text-sm">{h.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">{h.desc}</p>
              </div>
              <a
                href={`tel:${h.number.replace(/-/g, '')}`}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shrink-0 ${h.color}`}
              >
                <Phone className="w-4 h-4" />
                <span>โทร {h.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
