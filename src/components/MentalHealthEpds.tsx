import React, { useState } from 'react';
import {
  Smile,
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  PhoneCall,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { EPDS_QUESTIONS } from '../data/mockData';

interface MentalHealthEpdsProps {
  onOpenEmergency: () => void;
}

export const MentalHealthEpds: React.FC<MentalHealthEpdsProps> = ({ onOpenEmergency }) => {
  // Store user's selected scores: { [questionId]: score }
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 0,
    2: 1,
    3: 0,
    4: 1,
    5: 0,
    6: 1,
    7: 1,
    8: 0,
    9: 0,
    10: 0,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const q10Risk = (answers[10] || 0) > 0;

  const getRiskDetails = () => {
    if (q10Risk) {
      return {
        level: 'high',
        title: 'พบสัญญาณที่ต้องได้รับการช่วยเหลือเร่งด่วน (ข้อ 10 มีความคิดทำร้ายตัวเอง)',
        color: 'text-red-700 bg-red-50 border-red-300',
        badge: 'ต้องการความช่วยเหลือทันที',
        desc: 'กรุณาอย่าเก็บความรู้สึกไว้คนเดียว คุณแม่ไม่ได้อยู่ลำพังและนี่ไม่ใช่ความผิดของคุณแม่ โปรดติดต่อสายด่วนสุขภาพจิต 1323 หรือบอกบุคคลใกล้ชิดทันที',
      };
    } else if (totalScore >= 13) {
      return {
        level: 'high',
        title: 'มีความเสี่ยงต่อภาวะซึมเศร้าหลังคลอด (Postpartum Depression - PPD)',
        color: 'text-red-700 bg-red-50 border-red-300',
        badge: 'ควรปรึกษาบุคลากรทางการแพทย์',
        desc: 'คะแนนบ่งชี้ถึงความเครียดและภาวะหม่นหมองในระดับที่ควรได้รับการดูแลจากแพทย์หรือนักจิตวิทยา สามารถปรึกษาแพทย์ในวันนัดตรวจหลังคลอด หรือโทร 1323 ได้ตลอด 24 ชั่วโมง',
      };
    } else if (totalScore >= 10) {
      return {
        level: 'moderate',
        title: 'มีภาวะอารมณ์ดิ่งชั่วคราว หรือความเครียดสะสม (Baby Blues)',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        badge: 'ควรเฝ้าระวังและผ่อนคลาย',
        desc: 'มักเกิดจากการเปลี่ยนแปลงฮอร์โมนอย่างรวดเร็วหลังคลอดและความอดนอน แนะนำให้ขอความช่วยเหลือจากคู่สมรสหรือคนในครอบครัวเพื่อแบ่งเบาการดูแลลูก และให้คุณแม่ได้นอนหลับพักผ่อนอย่างเต็มที่',
      };
    } else {
      return {
        level: 'low',
        title: 'สภาวะอารมณ์อยู่ในเกณฑ์ปกติ มีความสุขและปรับตัวได้ดี',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        badge: 'สุขภาพใจแข็งแรง',
        desc: 'คุณแม่สามารถปรับตัวกับการเปลี่ยนแปลงหลังคลอดได้เป็นอย่างดี ขอให้รักษาสุขภาพกายและสุขภาพใจให้แจ่มใสต่อไป',
      };
    }
  };

  const risk = getRiskDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Smile className="w-6 h-6 text-indigo-500" />
            <span>แบบประเมินสุขภาพใจแม่หลังคลอด (EPDS Thai Version)</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Edinburgh Postnatal Depression Scale เครื่องมือคัดกรองมาตรฐานสากล 10 ข้อ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:1323"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>สายด่วนสุขภาพจิต 1323</span>
          </a>
        </div>
      </div>

      {/* Real-time Score Results Card */}
      <div className={`p-5 rounded-2xl border transition-all ${risk.color}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 shadow-xs uppercase">
                {risk.badge}
              </span>
              <span className="text-xs font-medium">คะแนนรวม: {totalScore} / 30 คะแนน</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">{risk.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed max-w-2xl mt-1">{risk.desc}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {risk.level === 'high' && (
              <button
                onClick={onOpenEmergency}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" /> ขอความช่วยเหลือด่วน
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 10 EPDS Questions List */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900">
            โปรดเลือกคำตอบที่ตรงกับความรู้สึกของคุณแม่มากที่สุดในรอบ 7 วันที่ผ่านมา:
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            ตอบตามความรู้สึกจริง ไม่ต้องกังวล ไม่มีคำตอบที่ผิดหรือถูก
          </p>
        </div>

        <div className="space-y-5">
          {EPDS_QUESTIONS.map((q) => {
            const currentScore = answers[q.id];

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  q.id === 10 && currentScore > 0
                    ? 'border-red-300 bg-red-50/50'
                    : 'border-stone-200/80 bg-stone-50/30'
                }`}
              >
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 mb-2.5">
                  {q.text}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.score)}
                      className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                        currentScore === opt.score
                          ? 'border-indigo-500 bg-indigo-50 font-semibold text-indigo-950 ring-1 ring-indigo-300'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {currentScore === opt.score && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => {
              setAnswers({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
            }}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตคะแนนทั้งหมด
          </button>

          <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg">
            คะแนนปัจจุบัน: {totalScore} / 30 คะแนน
          </span>
        </div>
      </div>

      {/* Family & Partner Guidance */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-indigo-600" />
          <span>คำแนะนำสำหรับคุณพ่อและคนในครอบครัว (Family Support Guide)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">1. ช่วยแบ่งเบางานบ้าน</span>
            <span>ช่วยซักผ้าอ้อม ล้างขวดนม และเปลี่ยนผ้าอ้อม ให้คุณแม่ได้งีบหลับอย่างน้อย 2-3 ชั่วโมงต่อเนื่อง</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">2. รับฟังโดยไม่ตัดสิน</span>
            <span>อย่าพูดว่า "แค่เลี้ยงลูกทำไมเครียด" แต่ให้ถามว่า "มีอะไรให้พี่ช่วยไหม" หรือชื่นชมความพยายามของคุณแม่</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">3. สังเกตการเปลี่ยนแปลง</span>
            <span>หากคุณแม่ร้องไห้บ่อย ไม่ยอมอุ้มลูก หรือไม่ยอมทานอาหารเกิน 2 สัปดาห์ ควรพาไปพบแพทย์</span>
          </div>
        </div>
      </div>
    </div>
  );
};
