import React from 'react';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Droplets,
  Heart,
  Thermometer,
  Activity,
  Plus,
  Baby,
  Smile,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MotherProfile, DailyLog, FeedingSession, Appointment } from '../types';
import { POSTPARTUM_KNOWLEDGE } from '../data/mockData';

interface HomeDashboardProps {
  profile: MotherProfile;
  currentDay: number;
  latestLog: DailyLog;
  feedings: FeedingSession[];
  nextAppointment?: Appointment;
  onOpenNewLog: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenDangerTriage: () => void;
  onQuickToggleIron: () => void;
  onQuickAddWater: (amount: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  currentDay,
  latestLog,
  feedings,
  nextAppointment,
  onOpenNewLog,
  onNavigateTab,
  onOpenDangerTriage,
  onQuickToggleIron,
  onQuickAddWater,
}) => {
  // Check red flag status
  const hasFever = latestLog.temperature >= 38.0;
  const hasHighBP = latestLog.systolicBP >= 140 || latestLog.diastolicBP >= 90;
  const hasExcessiveBleeding = latestLog.lochiaAmount === 'excessive' || latestLog.lochiaClots === 'large_abnormal';
  const hasFoulLochia = latestLog.lochiaOdor === 'foul';
  const hasWoundUrgent = latestLog.woundStatus === 'urgent' || latestLog.woundStatus === 'discharge';

  const isWarningActive = hasFever || hasHighBP || hasExcessiveBleeding || hasFoulLochia || hasWoundUrgent;

  // Total pumped/fed today
  const totalPumped = feedings.reduce((sum, f) => sum + (f.volumeMl || 0), 0);
  const waterProgress = Math.min(100, Math.round((latestLog.waterIntakeMl / 3000) * 100));

  // Determine stage info
  const isPregnant = profile.stage === 'pregnant';
  const gestationalWeeks = profile.gestationalWeeks || 24;
  const trimester = gestationalWeeks <= 12 ? 1 : gestationalWeeks <= 27 ? 2 : 3;

  const stageDesc = isPregnant
    ? `ระยะตั้งครรภ์ ไตรมาสที่ ${trimester} (สัปดาห์ที่ ${gestationalWeeks})`
    : currentDay <= 7
    ? 'ระยะสัปดาห์แรก (Early Postpartum)'
    : currentDay <= 42
    ? 'ระยะฟื้นตัวกลาง (Subacute Recovery)'
    : 'ระยะฟื้นฟูสมบูรณ์ (Late Postpartum)';

  // Day specific guidance
  const getDayGuidance = () => {
    if (isPregnant) {
      return {
        title: `การดูแลครรภ์ไตรมาส ${trimester} ตามคัมภีร์ปฐมจินดา`,
        body: trimester === 1
          ? 'ระยะตั้งครรภ์แรกมักมี "ลมวิงเวียน" และอาการแพ้ท้อง แนะนำให้สูดดมน้ำมันผิวมะกรูด ส้มซ่า ดื่มน้ำขิงอ่อน ห้ามยารสร้อนจัดหรือยาขับโลหิตเด็ดขาด'
          : trimester === 2
          ? 'ระยะเจริญกระดูกและกล้ามเนื้อ บำรุงธาตุดินและโลหิตด้วยงาดำ ฟักทอง และผักใบเขียว ฝึกกายบริหารฤๅษีดัดตนคลายปวดเอวและน่อง'
          : 'ระยะเตรียมลมกัมมัชวาต (ลมเบ่งคลอด) รับประทานอาหารย่อยง่าย เริ่มดื่มน้ำต้มหัวปลีและกล้วยน้ำว้าห่ามเพื่อเตรียมต่อมน้ำนม',
      };
    } else if (currentDay <= 3) {
      return {
        title: 'ระยะน้ำนมเหลืองสู่เต้านมคัดตึง & ประคบเต้าแผนไทย',
        body: 'ร่างกายเริ่มเปลี่ยนจากน้ำนมเหลือง (Colostrum) เป็นน้ำนมแท้ เต้านมอาจรู้สึกอุ่นและตึง นวดประคบอุ่นเบาๆ ตามแนวเส้นประธานสิบ 3-5 นาทีก่อนให้นม และดื่มน้ำขิงอุ่น',
      };
    } else if (currentDay <= 7) {
      return {
        title: 'สังเกตมดลูกเข้าอู่ & เตรียมพร้อมเข้าคอร์สอยู่ไฟ',
        body: 'มดลูกจะค่อยๆ ลดระดับลงสู่อุ้งเชิงกราน น้ำคาวปลาสีแดงจะค่อยๆ จางลงเป็นสีชมพูหรือน้ำตาล หากคลอดธรรมชาติและแผลฝีเย็บแห้งสนิท สามารถเริ่มหัตถการทับหม้อเกลือและอบกระโจมหลังวันที่ 7',
      };
    } else if (currentDay <= 21) {
      return {
        title: 'ระยะอยู่ไฟทับหม้อเกลือ & ขับน้ำคาวปลา',
        body: 'ระยะทองของการอยู่ไฟแผนไทย การทับหม้อเกลือและอบกระโจมช่วยให้มดลูกเข้าอู่เร็ว สลายไขมันหน้าท้อง และขับน้ำคาวปลาที่ตกค้าง พร้อมกระตุ้นน้ำนมแม่',
      };
    } else {
      return {
        title: 'เตรียมพร้อมตรวจหลังคลอด 6 สัปดาห์ & ปรับสมดุลธาตุ',
        body: 'มดลูกควรเข้าอู่เรียบร้อย น้ำคาวปลาหมด ตรวจประเมินร่างกายพร้อมวางแผนคุมกำเนิด และรับประทานอาหารปรับสมดุลธาตุทั้งสี่ให้แข็งแรงสมบูรณ์',
      };
    }
  };

  const guidance = getDayGuidance();

  return (
    <div className="space-y-6">
      {/* Hero Mother & Baby Status Banner */}
      <div className={`relative overflow-hidden rounded-2xl text-white p-5 sm:p-6 shadow-md ${
        isPregnant
          ? 'bg-gradient-to-br from-teal-700 via-emerald-800 to-stone-900 border border-teal-600/30 shadow-teal-900/20'
          : 'bg-gradient-to-br from-amber-700 via-rose-700 to-stone-900 border border-amber-600/30 shadow-amber-900/20'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
                {stageDesc}
              </span>
              <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                {isPregnant
                  ? `ธาตุเจ้าเรือน: ${profile.thaiElement === 'earth' ? 'ปถวีธาตุ (ดิน)' : profile.thaiElement === 'water' ? 'อาโปธาตุ (น้ำ)' : profile.thaiElement === 'wind' ? 'วาโยธาตุ (ลม)' : 'เตโชธาตุ (ไฟ)'}`
                  : profile.deliveryType === 'vaginal'
                  ? 'คลอดธรรมชาติ'
                  : 'ผ่าตัดคลอด (C-Section)'}
              </span>
              <span className="text-xs text-stone-200">
                {profile.hospitalName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              สวัสดี {profile.name}
            </h2>
            <p className="text-stone-200 text-sm mt-1 flex items-center gap-2">
              <Baby className="w-4 h-4 inline text-amber-300" />
              <span>
                {profile.babyName} ({profile.babyGender === 'girl' ? 'ลูกสาว' : profile.babyGender === 'boy' ? 'ลูกชาย' : 'ทารกในครรภ์'}) ·{' '}
                {isPregnant ? (
                  <>อายุครรภ์ <strong className="text-white text-base">{gestationalWeeks} สัปดาห์</strong> (กำหนดคลอด {profile.dueDate})</>
                ) : (
                  <>หลังคลอดวันที่ <strong className="text-white text-base">{currentDay}</strong></>
                )}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPregnant ? (
              <button
                onClick={() => onNavigateTab('prenatal')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-stone-50 font-semibold text-sm shadow-sm transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>เปิดโหมดดูแลครรภ์</span>
              </button>
            ) : (
              <button
                onClick={onOpenNewLog}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-semibold text-sm shadow-sm transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 text-amber-700" />
                <span>บันทึกอาการวันนี้</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick status summary strip */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-xs text-stone-200 block">อุณหภูมิร่างกาย</span>
            <span className={`text-lg font-bold ${latestLog.temperature >= 38 ? 'text-amber-200' : 'text-white'}`}>
              {latestLog.temperature}°C
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-xs text-stone-200 block">ความดันโลหิต</span>
            <span className={`text-lg font-bold ${hasHighBP ? 'text-amber-200' : 'text-white'}`}>
              {latestLog.systolicBP}/{latestLog.diastolicBP}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-xs text-stone-200 block">
              {isPregnant ? 'ธาตุเจ้าเรือน' : 'น้ำคาวปลา'}
            </span>
            <span className="text-lg font-bold capitalize">
              {isPregnant
                ? `${profile.thaiElement === 'earth' ? 'ธาตุดิน' : profile.thaiElement === 'water' ? 'ธาตุน้ำ' : profile.thaiElement === 'wind' ? 'ธาตุลม' : 'ธาตุไฟ'}`
                : latestLog.lochiaColor === 'rubra'
                ? 'สีแดงสด'
                : latestLog.lochiaColor === 'serosa'
                ? 'สีชมพู/น้ำตาล'
                : latestLog.lochiaColor === 'alba'
                ? 'สีขาวเหลือง'
                : 'หมดแล้ว'}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5">
            <span className="text-xs text-stone-200 block">
              {isPregnant ? 'น้ำหนักปัจจุบัน' : 'ระดับความปวดแผล'}
            </span>
            <span className="text-lg font-bold">
              {isPregnant ? `${profile.weightCurrent} กก.` : `${latestLog.painScore} / 10`}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Alert or Normal Health Status */}
      {isWarningActive ? (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-base">
                แจ้งเตือน: พบสัญญาณที่ต้องเฝ้าระวังหรือพบแพทย์
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                {hasFever && '• อุณหภูมิร่างกายสูงเกิน 38°C เสี่ยงต่อภาวะติดเชื้อ '}
                {hasHighBP && '• ความดันโลหิตสูง เสี่ยงภาวะแทรกซ้อน '}
                {hasExcessiveBleeding && '• เลือดออกมากหรือมีลิ่มเลือดใหญ่ เสี่ยงตกเลือด '}
                {hasFoulLochia && '• น้ำคาวปลามีกลิ่นเหม็นผิดปกติ '}
                {hasWoundUrgent && '• แผลมีอาการบวมแดงหรือมีของเหลวซึม'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDangerTriage}
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
          >
            ประเมินอาการฉุกเฉินทันที →
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">การฟื้นฟูสุขภาพวันนี้อยู่ในเกณฑ์ปลอดภัย</p>
              <p className="text-xs text-emerald-700">
                ไม่มีสัญญาณอันตราย ไม่พบไข้สูง น้ำคาวปลาอยู่ในระยะที่เหมาะสม
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('danger')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0"
          >
            เช็คสัญญาณเตือน
          </button>
        </div>
      )}

      {/* Main Grid: Checklist + Lactation & Daily Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Daily Checklist & Quick Action Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Care Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-rose-500" />
                  <span>กิจวัตรดูแลตัวเองวันนี้ (Daily Care Checklist)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  ทำเครื่องหมายสิ่งที่ทำแล้ว เพื่อสุขอนามัยที่ดีและการฟื้นตัวที่รวดเร็ว
                </p>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                วันที่ {currentDay}
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1: Lochia check */}
              <div
                onClick={() => onNavigateTab('lochia')}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-rose-200 hover:bg-rose-50/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 text-xs sm:text-sm">
                      สังเกตสีและปริมาณน้ำคาวปลา
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      ปัจจุบัน: {latestLog.lochiaColor} · {latestLog.lochiaAmount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-medium">ดูบันทึก</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Item 2: Water tracker */}
              <div className="p-3 rounded-xl border border-stone-100 bg-stone-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-stone-800 text-xs sm:text-sm">
                        ดื่มน้ำสร้างน้ำนม ({latestLog.waterIntakeMl} / 3,000 มล.)
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        ดื่มน้ำอุ่นช่วยให้ร่างกายไม่ขาดน้ำและน้ำนมไหลเวียนดี
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onQuickAddWater(250)}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
                    >
                      +250 ml
                    </button>
                    <button
                      onClick={() => onQuickAddWater(500)}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                    >
                      +500 ml
                    </button>
                  </div>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${waterProgress}%` }}
                  />
                </div>
              </div>

              {/* Item 3: Iron Supplements */}
              <div
                onClick={onQuickToggleIron}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 text-xs sm:text-sm">
                      ทานยาบำรุงเลือด (ธาตุเหล็ก / Folic / แคลเซียม)
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      ชดเชยการสูญเสียเลือดระหว่างคลอด
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    latestLog.tookIronSupplements
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                >
                  {latestLog.tookIronSupplements ? '✓ ทานแล้ว' : 'ยังไม่ได้ทาน'}
                </button>
              </div>

              {/* Item 4: Pelvic floor Kegel */}
              <div
                onClick={() => onNavigateTab('kegel')}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-purple-200 hover:bg-purple-50/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 text-xs sm:text-sm">
                      บริหารกล้ามเนื้ออุ้งเชิงกราน (Kegel Exercise)
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      ทำแล้ว {latestLog.kegelRoundsCompleted} / 3 เซ็ต
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-700 font-medium">เข้าห้องฝึก</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Guidance Knowledge Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
              <span className="text-lg">💡</span>
              <span>คำแนะนำประจำวัน: {guidance.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2">
              {guidance.body}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">คู่มือการดูแลแม่หลังคลอด กรมอนามัย</span>
              <button
                onClick={() => onNavigateTab('kegel')}
                className="underline hover:text-amber-950 font-semibold flex items-center gap-1"
              >
                ดูเมนูอาหาร & ท่าฟื้นฟู <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Feeding Overview + Appointments + Mental Health */}
        <div className="space-y-6">
          {/* Feeding Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>การให้นม & สต็อกวันนี้</span>
              </h4>
              <button
                onClick={() => onNavigateTab('feeding')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800"
              >
                บันทึกเพิ่ม →
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-xl text-xs">
                <span className="text-stone-600">จำนวนครั้งที่เข้าเต้า</span>
                <span className="font-bold text-rose-900 text-sm">{latestLog.feedingCount} ครั้ง</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-sky-50/50 rounded-xl text-xs">
                <span className="text-stone-600">ปริมาณปั๊มเก็บสต็อก</span>
                <span className="font-bold text-sky-900 text-sm">
                  {totalPumped || latestLog.pumpingVolumeMl} มล. ({(
                    ((totalPumped || latestLog.pumpingVolumeMl) / 30).toFixed(1)
                  )} ออนซ์)
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs">
                <span className="text-stone-600">สภาพเต้านม</span>
                <span className="font-medium text-stone-800">
                  {latestLog.breastStatus === 'comfortable'
                    ? 'นิ่มสบายดี'
                    : latestLog.breastStatus === 'engorged'
                    ? 'คัดตึง'
                    : latestLog.breastStatus === 'clogged_duct'
                    ? 'ท่อนมอุดตัน'
                    : 'ต้องดูแลพิเศษ'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('feeding')}
              className="mt-4 w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>เปิดตัวจับเวลาให้นมแม่ (Breastfeeding Timer)</span>
            </button>
          </div>

          {/* Mental Health Quick Check */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-indigo-500" />
                <span>สุขภาพใจแม่หลังคลอด</span>
              </h4>
              <span className="text-[11px] text-indigo-600 font-medium">EPDS Screening</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              อารมณ์ของคุณแม่มีความสำคัญมาก หลังคลอดอาจมีภาวะเบบี้บลูส์ (Baby Blues) หรือความเหนื่อยล้าสะสม
            </p>
            <button
              onClick={() => onNavigateTab('mental')}
              className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
            >
              ทำแบบประเมินสุขภาพใจ (10 ข้อ) →
            </button>
          </div>

          {/* Nearby Thai Medicine Facility Shortcut Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <span className="text-base">🏥</span>
                <span>แพทย์แผนไทยใกล้ฉัน</span>
              </h4>
              <button
                onClick={() => onNavigateTab('facilities')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
              >
                ค้นหาทั้งหมด →
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              หน่วยบริการประจำตัว: <strong>{profile.hospitalName}</strong>
            </p>
            {profile.thaiMedicineDoctorName && (
              <p className="text-[11px] text-amber-900 font-medium">
                👩‍⚕️ ผู้ดูแล: {profile.thaiMedicineDoctorName}
              </p>
            )}
            <button
              onClick={() => onNavigateTab('facilities')}
              className="mt-2 w-full py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              ดูแผนที่ & จองคิวอยู่ไฟใกล้ฉัน
            </button>
          </div>

          {/* Next Appointment */}
          {nextAppointment && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>นัดตรวจครั้งถัดไป</span>
                </h4>
                <button
                  onClick={() => onNavigateTab('appointments')}
                  className="text-xs text-emerald-700 font-medium hover:underline"
                >
                  ทั้งหมด
                </button>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <h5 className="font-semibold text-stone-900 text-xs sm:text-sm">
                  {nextAppointment.title}
                </h5>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  📅 {nextAppointment.date} · {nextAppointment.doctor}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  📍 {nextAppointment.location}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
