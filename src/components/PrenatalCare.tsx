import React, { useState } from 'react';
import {
  Baby,
  Calendar,
  Sparkles,
  AlertTriangle,
  Heart,
  Droplets,
  Activity,
  CheckCircle2,
  BookOpen,
  Apple,
  ShieldAlert,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { MotherProfile, ThaiElement } from '../types';
import { THAI_ELEMENTS_INFO, RUESI_DAT_TON_EXERCISES } from '../data/thaiMedicineData';

interface PrenatalCareProps {
  profile: MotherProfile;
  onOpenEmergency: () => void;
}

export const PrenatalCare: React.FC<PrenatalCareProps> = ({ profile, onOpenEmergency }) => {
  const currentWeek = profile.gestationalWeeks || 24;
  const currentTrimester = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;

  // Fetal kick count state
  const [fetalKicks, setFetalKicks] = useState(8);
  const [bloodPressureSys, setBloodPressureSys] = useState(115);
  const [bloodPressureDia, setBloodPressureDia] = useState(74);
  const [weight, setWeight] = useState(profile.weightCurrent || 55.5);
  const [waterGlasses, setWaterGlasses] = useState(7);
  const [tookPrenatalVitamins, setTookPrenatalVitamins] = useState(true);

  // Thai classical fetal development text
  const getFetalDevelopmentText = () => {
    if (currentTrimester === 1) {
      return {
        stage: 'ไตรมาสที่ 1 (เดือนที่ 1 - 3 · คัมภีร์ปฐมจินดา)',
        milestone: 'ระยะก่อกำเนิดปัญจสาขา (ศีรษะ แขน 2 ขา 2)',
        desc: 'ทารกก่อรูปจากกลละ น้ำอสุจิและโลหิตระดู เกิดอวัยวะสำคัญ หัวใจเริ่มเต้น ในช่วงนี้คุณแม่มักมี "ลมวิงเวียน" และอาการแพ้ท้อง',
        ttmGuidance: 'ดื่มน้ำขิงอ่อนผสมใบเตยหอม สูดดมน้ำมันผิวมะกรูดหรือส้มซ่า ห้ามสมุนไพรรสร้อนจัดหรือยาขับโลหิตเด็ดขาด',
      };
    } else if (currentTrimester === 2) {
      return {
        stage: 'ไตรมาสที่ 2 (เดือนที่ 4 - 6 · คัมภีร์ปฐมจินดา)',
        milestone: 'ระยะเจริญปถวีธาตุและมังสะ (กระดูก กล้ามเนื้อ และเริ่มดิ้นตอด)',
        desc: 'ทารกเจริญเติบโตอย่างรวดเร็ว โครงกระดูกและกล้ามเนื้อแข็งแรง เริ่มรู้สึกถึงลูกดิ้นตอด (Quickening) ท้องเริ่มขยายใหญ่ขึ้น',
        ttmGuidance: 'บำรุงธาตุดินและโลหิตด้วยงาดำ ฟักทอง และต้มจืดตำลึง นวดลูบสัมผัสหน้าท้องเบาๆ ฝึกท่าดัดตนคลายปวดหลังส่วนล่าง',
      };
    } else {
      return {
        stage: 'ไตรมาสที่ 3 (เดือนที่ 7 - 9 · คัมภีร์ปฐมจินดา)',
        milestone: 'ระยะสมบูรณ์อวัยวะ ท้องลด และเตรียมลมกัมมัชวาต (ลมเบ่งคลอด)',
        desc: 'ทารกกลับศีรษะลงสู่อุ้งเชิงกราน ทารกดิ้นแรงชัดเจน มดลูกเริ่มเตรียมพร้อมเต้านมเริ่มผลิตน้ำนมเหลือง (Colostrum)',
        ttmGuidance: 'รับประทานอาหารย่อยง่าย เริ่มดื่มน้ำต้มหัวปลีและกล้วยน้ำว้าห่ามเพื่อเตรียมสารอาหารสร้างน้ำนม ฝึกหายใจลึกคลายกังวล',
      };
    }
  };

  const devInfo = getFetalDevelopmentText();

  // Pregnancy red flags check
  const hasHighBP = bloodPressureSys >= 140 || bloodPressureDia >= 90;
  const hasLowKicks = currentWeek >= 28 && fetalKicks < 10;

  return (
    <div className="space-y-6">
      {/* Pregnancy Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-800 to-stone-900 text-white p-6 shadow-md border border-emerald-600/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
                <Baby className="w-3.5 h-3.5" /> ระยะตั้งครรภ์ (Prenatal Care)
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-stone-200">
                ไตรมาสที่ {currentTrimester} · สัปดาห์ที่ {currentWeek}
              </span>
              {profile.dueDate && (
                <span className="text-xs text-emerald-200 font-medium">
                  กำหนดคลอด: {profile.dueDate}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ดูแลสุขภาพครรภ์: {profile.name}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              ศาสตร์การบำรุงครรภ์ตาม <strong>คัมภีร์ปฐมจินดา</strong> ปรับสมดุลตรีธาตุ เสริมสร้างพัฒนาการลูกน้อยในครรภ์ {profile.babyName} พร้อมคำแนะนำทางการแพทย์ผสมผสาน
            </p>
          </div>

          <div className="shrink-0 bg-white/10 p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center">
            <span className="text-xs text-emerald-200">อายุครรภ์</span>
            <span className="text-3xl font-bold font-mono text-white my-0.5">{currentWeek}</span>
            <span className="text-[11px] text-stone-300">สัปดาห์ (ไตรมาส {currentTrimester})</span>
          </div>
        </div>
      </div>

      {/* Classical Thai Midwifery Insight Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-amber-950 text-sm sm:text-base">
              {devInfo.stage}
            </h3>
          </div>
          <span className="text-xs font-semibold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md">
            {devInfo.milestone}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {devInfo.desc}
        </p>

        <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <strong className="block text-amber-900 font-bold">
            🌿 การดูแลตามศาสตร์การแพทย์แผนไทยประจำไตรมาส:
          </strong>
          <p className="text-stone-700">{devInfo.ttmGuidance}</p>
        </div>
      </div>

      {/* Daily Prenatal Vital Checks & Fetal Kick Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fetal Kick Counter (การนับลูกดิ้น) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                <span>การนับลูกดิ้นวันนี้ (Fetal Kicks)</span>
              </h4>
              <p className="text-[11px] text-stone-500">เป้าหมาย: อย่างน้อย 10 ครั้งใน 12 ชั่วโมง</p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${fetalKicks >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {fetalKicks >= 10 ? 'ผ่านเกณฑ์' : 'กำลังนับ'}
            </span>
          </div>

          <div className="py-2 text-center bg-rose-50/50 rounded-2xl border border-rose-100">
            <span className="text-4xl font-bold font-mono text-rose-900">{fetalKicks}</span>
            <span className="text-xs text-rose-700 block mt-0.5">ครั้งที่รู้สึกได้วันนี้</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFetalKicks((k) => k + 1)}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>+ นับลูกดิ้น 1 ครั้ง</span>
            </button>
            <button
              onClick={() => setFetalKicks(0)}
              className="px-3 py-2 text-stone-400 hover:text-stone-700 text-xs border rounded-xl"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        {/* Vital Signs (BP & Weight) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>สัญญาณชีพ & น้ำหนักตัว</span>
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                ความดันโลหิต (mmHg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bloodPressureSys}
                  onChange={(e) => setBloodPressureSys(parseInt(e.target.value) || 120)}
                  className="w-1/2 text-xs p-2 rounded-lg border border-stone-200 bg-white"
                />
                <span className="text-stone-400">/</span>
                <input
                  type="number"
                  value={bloodPressureDia}
                  onChange={(e) => setBloodPressureDia(parseInt(e.target.value) || 80)}
                  className="w-1/2 text-xs p-2 rounded-lg border border-stone-200 bg-white"
                />
              </div>
              {hasHighBP && (
                <p className="text-[11px] text-red-600 mt-1">⚠️ เสี่ยงภาวะครรภ์เป็นพิษ ควรรีบตรวจ</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                น้ำหนักตัวปัจจุบัน (กก.)
              </label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 50)}
                className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                ขึ้นมาจากก่อนตั้งครรภ์: {(weight - profile.weightPrePregnancy).toFixed(1)} กก.
              </span>
            </div>
          </div>
        </div>

        {/* Daily Healthy Habits */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>กิจวัตรบำรุงครรภ์วันนี้</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div
              onClick={() => setTookPrenatalVitamins(!tookPrenatalVitamins)}
              className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/50 flex items-center justify-between cursor-pointer hover:border-teal-200"
            >
              <span>วิตามินบำรุงครรภ์ / โฟลิก / ธาตุเหล็ก</span>
              <span className={`px-2 py-0.5 rounded font-bold ${tookPrenatalVitamins ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200'}`}>
                {tookPrenatalVitamins ? '✓ ทานแล้ว' : 'ยังไม่ทาน'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <div>
                <span>ดื่มน้ำอุ่น ({waterGlasses * 250} มล.)</span>
                <span className="text-[10px] text-stone-400 block">{waterGlasses} แก้ว</span>
              </div>
              <button
                onClick={() => setWaterGlasses((g) => g + 1)}
                className="px-2 py-1 bg-teal-100 text-teal-800 rounded font-semibold text-xs"
              >
                +1 แก้ว
              </button>
            </div>

            <div className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <span>บริหารท่าฤๅษีดัดตนคนท้อง</span>
              <span className="text-teal-700 font-semibold">แนะนำวันละ 10 นาที</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contraindications in Pregnancy (ข้อห้ามสำคัญทางการแพทย์แผนไทยขณะตั้งครรภ์) */}
      <div className="bg-red-50/80 border-2 border-red-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>ข้อห้ามสำคัญสำหรับหญิงตั้งครรภ์ตามศาสตร์การแพทย์แผนไทย (Contraindications):</span>
        </div>
        <ul className="text-xs sm:text-sm text-red-950 space-y-1.5 list-disc list-inside">
          <li>
            <strong>ห้ามรับประทานยาสมุนไพรขับเลือด/ขับน้ำคาวปลาเด็ดขาด:</strong> เช่น ว่านชักมดลูก, ยาประสะไพล, ยาสตรีทุกชนิด เพราะมีฤทธิ์บีบมดลูกรุนแรง เสี่ยงต่อการแท้งบุตร
          </li>
          <li>
            <strong>ห้ามการอบสมุนไพรในกระโจมความร้อนสูง:</strong> ความร้อนที่สูงเกินไปอาจส่งผลต่อการสร้างอวัยวะและระบบประสาทของทารกในครรภ์
          </li>
          <li>
            <strong>ห้ามกดจุดและนวดรุนแรง:</strong> ห้ามกดจุดเหอกู่ (ง่ามมือ), จุดซานอินเจียว (เหนือตาตุ่มใน), จุดท้องน้อย และห้ามนวดดัดดัดหลังส่วนล่างรุนแรง
          </li>
          <li>
            <strong>ห้ามยาระบายที่มีฤทธิ์ไซ้ท้องรุนแรง:</strong> เช่น ยาระบายมะขามแขกเข้มข้น ให้เน้นการทานผักผลไม้ ดื่มน้ำ และกล้วยน้ำว้าสุกแทน
          </li>
        </ul>
      </div>

      {/* Pregnancy Red Flags (สัญญาณอันตรายขณะตั้งครรภ์) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>สัญญาณอันตรายขณะตั้งครรภ์ที่ต้องไปโรงพยาบาลทันที (Pregnancy Red Flags)</span>
          </h4>
          <button
            onClick={onOpenEmergency}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" /> โทร 1669 / ห้องคลอด
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-stone-700">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <strong className="text-red-950 block mb-1">1. เลือดออกทางช่องคลอด</strong>
            <span>ไม่ว่าจะมีปริมาณมากหรือน้อย เสี่ยงรกเกาะต่ำหรือภาวะแท้ง</span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <strong className="text-red-950 block mb-1">2. ลูกดิ้นน้อยผิดปกติ</strong>
            <span>ดิ้นน้อยกว่า 10 ครั้งใน 12 ชม. (อายุครรภ์ 28 สัปดาห์ขึ้นไป)</span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <strong className="text-red-950 block mb-1">3. น้ำเดินก่อนกำหนด</strong>
            <span>มีน้ำใสๆ ไหลออกทางช่องคลอดคล้ายปัสสาวะแต่กลั้นไม่ได้</span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <strong className="text-red-950 block mb-1">4. ปวดหัวตาพร่า จุกแน่นลิ้นปี่</strong>
            <span>สัญญาณเตือนครรภ์เป็นพิษรุนแรง ความดันโลหิตสูงเฉียบพลัน</span>
          </div>
        </div>
      </div>
    </div>
  );
};
