import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Plus,
  Hospital,
  User,
  Heart,
  Droplets,
  Activity,
  Smile,
  AlertTriangle
} from 'lucide-react';
import { MotherProfile, Appointment, DailyLog, FeedingSession } from '../types';

interface AppointmentsReportProps {
  profile: MotherProfile;
  currentDay: number;
  appointments: Appointment[];
  recentLogs: DailyLog[];
  feedings: FeedingSession[];
  onAddAppointment: (apt: Appointment) => void;
  onToggleCompleteAppointment: (id: string) => void;
}

export const AppointmentsReport: React.FC<AppointmentsReportProps> = ({
  profile,
  currentDay,
  appointments,
  recentLogs,
  feedings,
  onAddAppointment,
  onToggleCompleteAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'report'>('appointments');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Appointment Form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDoctor, setNewDoctor] = useState(profile.doctorName);
  const [newLocation, setNewLocation] = useState(profile.hospitalName);
  const [newPurpose, setNewPurpose] = useState('');
  const [newType, setNewType] = useState<'mother_check' | 'baby_vaccine' | 'specialist'>('mother_check');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    const apt: Appointment = {
      id: `apt-${Date.now()}`,
      date: newDate,
      title: newTitle,
      doctor: newDoctor,
      location: newLocation,
      purpose: newPurpose,
      isCompleted: false,
      type: newType,
    };
    onAddAppointment(apt);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
    setNewPurpose('');
  };

  const handlePrint = () => {
    window.print();
  };

  // Clinical metrics for summary report
  const latestLog = recentLogs[recentLogs.length - 1] || recentLogs[0];
  const totalVolumePumpedToday = feedings.reduce((sum, f) => sum + (f.volumeMl || 0), 0);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/80 shadow-xs flex items-center gap-1">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'appointments'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>ตารางนัดหมาย & วัคซีนลูกน้อย ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'report'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>สรุปรายงานสุขภาพเพื่อพบแพทย์ (Doctor Report)</span>
        </button>
      </div>

      {activeTab === 'appointments' ? (
        /* Appointments Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                ตารางนัดตรวจหลังคลอดและวัคซีน
              </h3>
              <p className="text-xs text-stone-500">
                สำคัญ: นัดตรวจหลังคลอด 7 วัน (เช็คแผล) และ 6 สัปดาห์ (ตรวจภายในและวางแผนคุมกำเนิด)
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มนัดหมายใหม่</span>
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 rounded-2xl border transition-all ${
                  apt.isCompleted
                    ? 'bg-stone-50/60 border-stone-200 opacity-75'
                    : 'bg-white border-stone-200/90 shadow-xs hover:border-rose-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                          apt.type === 'mother_check'
                            ? 'bg-rose-100 text-rose-800'
                            : apt.type === 'baby_vaccine'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {apt.type === 'mother_check'
                          ? 'ตรวจคุณแม่'
                          : apt.type === 'baby_vaccine'
                          ? 'วัคซีนลูกน้อย'
                          : 'ตรวจเฉพาะทาง'}
                      </span>
                      <span className="text-xs font-semibold text-stone-900">
                        📅 {apt.date}
                      </span>
                      {apt.isCompleted && (
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ ตรวจเรียบร้อย
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900">
                      {apt.title}
                    </h4>
                    <p className="text-xs text-stone-600">{apt.purpose}</p>

                    <div className="pt-1 text-[11px] text-stone-500 flex items-center gap-3">
                      <span>👨‍⚕️ {apt.doctor}</span>
                      <span>📍 {apt.location}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onToggleCompleteAppointment(apt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        apt.isCompleted
                          ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {apt.isCompleted ? 'ยกเลิกสถานะตรวจแล้ว' : 'ทำเครื่องหมายว่าตรวจแล้ว'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Appointment Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100">
                <h4 className="font-bold text-stone-900 text-base mb-3">
                  เพิ่มนัดหมายใหม่
                </h4>
                <form onSubmit={handleCreateAppointment} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      หัวข้อนัดหมาย
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น นัดตรวจหลังคลอด 6 สัปดาห์"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      วันที่นัด
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        ประเภท
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
                      >
                        <option value="mother_check">ตรวจคุณแม่</option>
                        <option value="baby_vaccine">วัคซีนทารก</option>
                        <option value="specialist">ตรวจเฉพาะทาง</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        แพทย์ผู้ตรวจ
                      </label>
                      <input
                        type="text"
                        value={newDoctor}
                        onChange={(e) => setNewDoctor(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      สถานที่ / แผนก
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      วัตถุประสงค์
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ตรวจภายใน, ฉีดวัคซีน 2 เดือน"
                      value={newPurpose}
                      onChange={(e) => setNewPurpose(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
                    >
                      บันทึกนัดหมาย
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Doctor Report Card (Printable) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                ใบสรุปข้อมูลสุขภาพแม่หลังคลอด (Postpartum Clinical Summary)
              </h3>
              <p className="text-xs text-stone-500">
                สามารถพิมพ์หรือเปิดหน้าจอนี้ยื่นให้คุณหมอและพยาบาลดูได้ทันทีในวันนัดตรวจ
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร / บันทึก PDF</span>
            </button>
          </div>

          {/* Printable Sheet */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-6 text-stone-900 print:border-none print:shadow-none print:p-0">
            {/* Report Header */}
            <div className="border-b-2 border-stone-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                    หมอ
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      แอพหมอท้อง · รายงานติดตามสุขภาพแม่หลังคลอด
                    </h2>
                    <p className="text-xs text-stone-500">
                      Postpartum Recovery & Clinical Monitoring Report
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-stone-600">
                <p>วันที่พิมพ์รายงาน: {new Date().toLocaleDateString('th-TH')}</p>
                <p className="font-semibold text-rose-700">
                  หลังคลอด: วันที่ {currentDay} ({Math.ceil(currentDay / 7)} สัปดาห์)
                </p>
              </div>
            </div>

            {/* Mother & Baby Demographic Box */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block">ชื่อคุณแม่</span>
                <span className="font-bold text-stone-900">{profile.name}</span>
              </div>
              <div>
                <span className="text-stone-500 block">ชื่อลูกน้อย</span>
                <span className="font-bold text-stone-900">
                  {profile.babyName} ({profile.babyGender === 'girl' ? 'เพศหญิง' : 'เพศชาย'})
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">วิธีคลอด</span>
                <span className="font-bold text-stone-900">
                  {profile.deliveryType === 'vaginal' ? 'คลอดธรรมชาติ' : 'ผ่าตัดคลอด (C-Section)'} (ครรภ์ที่ {profile.parity})
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">โรงพยาบาล</span>
                <span className="font-bold text-stone-900">{profile.hospitalName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">แพทย์เจ้าของไข้</span>
                <span className="font-medium text-stone-900">{profile.doctorName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">แพทย์แผนไทย</span>
                <span className="font-medium text-amber-900">{profile.thaiMedicineDoctorName || 'พท.ป. ประจำคลินิก'}</span>
              </div>
              <div>
                <span className="text-stone-500 block">กรุ๊ปเลือด & ธาตุเจ้าเรือน</span>
                <span className="font-medium text-stone-900">
                  {profile.bloodType} · {profile.thaiElement === 'earth' ? 'ธาตุดิน' : profile.thaiElement === 'water' ? 'ธาตุน้ำ' : profile.thaiElement === 'wind' ? 'ธาตุลม' : 'ธาตุไฟ'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">น้ำหนักก่อนคลอด / ปัจจุบัน</span>
                <span className="font-medium text-stone-900">
                  {profile.weightPrePregnancy} กก. → {profile.weightCurrent} กก.
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">วันเดือนปีเกิดลูก</span>
                <span className="font-medium text-stone-900">{profile.babyBirthDate}</span>
              </div>
            </div>

            {/* Section 1: Vital Signs & Recovery Index */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                1. สัญญาณชีพล่าสุด & ระดับความปวดแผล (Vital Signs & Pain Score)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">อุณหภูมิร่างกาย</span>
                  <span className={`text-base font-bold ${latestLog.temperature >= 38 ? 'text-red-600' : 'text-stone-900'}`}>
                    {latestLog.temperature} °C {latestLog.temperature >= 38 ? '(มีไข้)' : '(ปกติ)'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">ความดันโลหิต</span>
                  <span className="text-base font-bold text-stone-900">
                    {latestLog.systolicBP}/{latestLog.diastolicBP} mmHg
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">ระดับความปวดแผล (0-10)</span>
                  <span className="text-base font-bold text-stone-900">
                    {latestLog.painScore} / 10
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">สภาพแผล</span>
                  <span className="text-base font-bold text-stone-900 capitalize">
                    {latestLog.woundStatus === 'normal'
                      ? 'แผลแห้งดี'
                      : latestLog.woundStatus === 'mild_pain'
                      ? 'ตึงเล็กน้อย'
                      : latestLog.woundStatus === 'discharge'
                      ? 'มีสิ่งคัดหลั่งซึม'
                      : 'บวมแดง'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Lochia & Uterine Status */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                2. การติดตามน้ำคาวปลาและการเข้าอู่ของมดลูก (Lochia & Involution)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">สีของน้ำคาวปลา</span>
                  <span className="font-bold text-stone-900 capitalize">
                    {latestLog.lochiaColor === 'rubra'
                      ? 'สีแดงสด (Lochia Rubra)'
                      : latestLog.lochiaColor === 'serosa'
                      ? 'สีชมพู/น้ำตาล (Lochia Serosa)'
                      : latestLog.lochiaColor === 'alba'
                      ? 'สีขาวเหลือง (Lochia Alba)'
                      : 'หมดแล้ว (เข้าสู่ภาวะปกติ)'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">ปริมาณ & ลิ่มเลือด</span>
                  <span className="font-bold text-stone-900">
                    {latestLog.lochiaAmount === 'light' ? 'น้อย' : latestLog.lochiaAmount === 'moderate' ? 'ปานกลาง' : 'มาก'} · {latestLog.lochiaClots === 'none' ? 'ไม่มีลิ่มเลือด' : 'มีลิ่มเลือดเล็ก'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">กลิ่นน้ำคาวปลา</span>
                  <span className="font-bold text-stone-900">
                    {latestLog.lochiaOdor === 'normal' ? 'กลิ่นคาวปกติ (ไม่เหม็นเน่า)' : 'มีกลิ่นเหม็นผิดปกติ ⚠️'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Lactation & Feeding */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                3. สถิติการให้นมแม่ & อาการเต้านม (Lactation & Breast Health)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">จำนวนมื้อเข้าเต้าเฉลี่ย</span>
                  <span className="font-bold text-stone-900">
                    {latestLog.feedingCount} ครั้ง / วัน
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">ปริมาณปั๊มสต็อกวันนี้</span>
                  <span className="font-bold text-stone-900">
                    {totalVolumePumpedToday || latestLog.pumpingVolumeMl} มล.
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block">อาการเต้านม</span>
                  <span className="font-bold text-stone-900">
                    {latestLog.breastStatus === 'comfortable'
                      ? 'นิ่มสบายดี น้ำนมไหลสะดวก'
                      : latestLog.breastStatus === 'engorged'
                      ? 'มีอาการคัดตึง'
                      : 'ต้องเฝ้าระวังท่อนมอุดตัน'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Recent Notes */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                4. ข้อสังเกตเพิ่มเติมของคุณแม่ (Patient Log Notes)
              </h4>
              <p className="p-3 bg-stone-50 rounded-lg text-stone-700 italic">
                "{latestLog.notes || 'ร่างกายกำลังฟื้นตัวได้ดี ทานยาบำรุงธาตุเหล็กครบถ้วนตามแพทย์สั่ง'}"
              </p>
            </div>

            {/* Section 5: Traditional Thai Medicine & Yufai */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-amber-800 border-b pb-1 flex items-center justify-between">
                <span>5. บันทึกการฟื้นฟูด้วยศาสตร์การแพทย์แผนไทย & การอยู่ไฟ (Traditional Thai Medicine & Yufai)</span>
                <span className="text-[11px] font-normal text-stone-500">คัมภีร์มหาโชตรัต & คัมภีร์ปฐมจินดา</span>
              </h4>
              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-stone-500 block">ธาตุเจ้าเรือนกำเนิด</span>
                  <span className="font-bold text-stone-900">
                    {profile.thaiElement === 'earth' ? 'ปถวีธาตุ (ธาตุดิน)' : profile.thaiElement === 'water' ? 'อาโปธาตุ (ธาตุน้ำ)' : profile.thaiElement === 'wind' ? 'วาโยธาตุ (ธาตุลม)' : 'เตโชธาตุ (ธาตุไฟ)'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">หัตถการอยู่ไฟที่ได้รับ</span>
                  <span className="font-medium text-stone-900">
                    {latestLog.yufaiProceduresToday && latestLog.yufaiProceduresToday.length > 0
                      ? latestLog.yufaiProceduresToday.join(', ')
                      : 'ประคบสมุนไพรสด, นวดเปิดท่อน้ำนม'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">เครื่องดื่มสมุนไพร & กายบริหาร</span>
                  <span className="font-medium text-stone-900">
                    น้ำขิงแก่ต้มใบเตย / น้ำหัวปลี · บริหารฤๅษีดัดตน
                  </span>
                </div>
              </div>
            </div>

            {/* Doctor Signature Block: 3 Signatures (Patient, OB-GYN, Thai Traditional Doctor) */}
            <div className="pt-6 border-t border-dashed border-stone-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <p className="text-stone-500 mb-8">ลงชื่อผู้ป่วย / คุณแม่:</p>
                <div className="border-b border-stone-400 w-full sm:w-44"></div>
                <p className="mt-1 text-stone-600">({profile.name})</p>
              </div>
              <div>
                <p className="text-stone-500 mb-8">ลงชื่อแพทย์สูตินรีเวชผู้ตรวจ:</p>
                <div className="border-b border-stone-400 w-full sm:w-44"></div>
                <p className="mt-1 text-stone-600">({profile.doctorName})</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-stone-500 mb-8">ลงชื่อแพทย์แผนไทยผู้ดูแล:</p>
                <div className="border-b border-stone-400 w-full sm:w-44 ml-0 sm:ml-auto"></div>
                <p className="mt-1 text-amber-900 font-medium">({profile.thaiMedicineDoctorName || 'พท.ป. ผู้ดูแลหัตถการ'})</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
