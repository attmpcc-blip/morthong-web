import React, { useState } from 'react';
import {
  Heart,
  Baby,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Flower2,
  Activity
} from 'lucide-react';
import { MotherProfile, ThaiElement, DeliveryType, MaternalStage, ThaiMedicineFacility } from '../types';
import { calculateThaiElementFromBirthDate, THAI_ELEMENTS_INFO, THAI_MEDICINE_FACILITIES } from '../data/thaiMedicineData';
import { NearbyThaiMedicineFacilities } from './NearbyThaiMedicineFacilities';
import { PERSONA_PRESETS, PersonaPreset } from '../data/mockData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteRegistration: (profile: MotherProfile) => void;
  onSelectPreset: (preset: PersonaPreset) => void;
  initialProfile?: MotherProfile;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onCompleteRegistration,
  onSelectPreset,
  initialProfile,
}) => {
  // Wizard steps: 1 = Basic Info, 2 = Stage Details, 3 = Thai Medicine Facility Picker
  const [step, setStep] = useState<number>(1);
  const [showFacilityPicker, setShowFacilityPicker] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState(initialProfile?.name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate || '1998-05-15');
  const [bloodType, setBloodType] = useState(initialProfile?.bloodType || 'O Rh Positive');
  const [weightPrePregnancy, setWeightPrePregnancy] = useState<number>(initialProfile?.weightPrePregnancy || 50);
  const [weightCurrent, setWeightCurrent] = useState<number>(initialProfile?.weightCurrent || 56);
  const [stage, setStage] = useState<MaternalStage>(initialProfile?.stage || 'postpartum');
  
  // Pregnancy specific
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(initialProfile?.gestationalWeeks || 24);
  const [dueDate, setDueDate] = useState<string>(initialProfile?.dueDate || '2026-12-15');
  
  // Postpartum specific
  const [babyName, setBabyName] = useState(initialProfile?.babyName || 'น้องอุ่นใจ');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'unknown'>(initialProfile?.babyGender || 'girl');
  const [babyBirthDate, setBabyBirthDate] = useState(
    initialProfile?.babyBirthDate || new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
  );
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(initialProfile?.deliveryType || 'vaginal');
  const [parity, setParity] = useState<number>(initialProfile?.parity || 1);

  // Healthcare & TTM facility
  const [hospitalName, setHospitalName] = useState(initialProfile?.hospitalName || 'โรงพยาบาลศิริราช');
  const [doctorName, setDoctorName] = useState(initialProfile?.doctorName || 'พญ. พรรณวลัย (สูตินรีแพทย์)');
  const [selectedFacility, setSelectedFacility] = useState<ThaiMedicineFacility | null>(
    THAI_MEDICINE_FACILITIES.find((f) => f.id === initialProfile?.selectedFacilityId) || THAI_MEDICINE_FACILITIES[0]
  );
  const [healthScheme, setHealthScheme] = useState<any>(initialProfile?.healthScheme || 'universal_coverage');

  if (!isOpen) return null;

  // Real-time calculated Thai element
  const calculatedElement: ThaiElement = calculateThaiElementFromBirthDate(birthDate);
  const elementInfo = THAI_ELEMENTS_INFO[calculatedElement];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: MotherProfile = {
      id: initialProfile?.id || `user-${Date.now()}`,
      name: name || 'คุณแม่คนใหม่',
      phone: phone || '081-234-5678',
      birthDate,
      stage,
      gestationalWeeks: stage === 'pregnant' ? gestationalWeeks : undefined,
      dueDate: stage === 'pregnant' ? dueDate : undefined,
      babyName: babyName || 'น้องคนดี',
      babyGender,
      babyBirthDate: stage === 'postpartum' ? babyBirthDate : dueDate,
      deliveryType,
      parity,
      hospitalName: hospitalName || selectedFacility?.name || 'โรงพยาบาลศิริราช',
      doctorName: doctorName || 'แพทย์สูตินรีเวชประจำตัว',
      thaiMedicineDoctorName: selectedFacility?.doctorName || 'พท.ป. ชนิกานต์ สุวรรณเวช',
      selectedFacilityId: selectedFacility?.id,
      bloodType,
      thaiElement: calculatedElement,
      weightPrePregnancy,
      weightCurrent,
      healthScheme,
      isRegistered: true,
    };
    onCompleteRegistration(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-amber-200 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-xs">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                  ลงทะเบียนเข้าใช้งาน "แอพหมอท้อง"
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  การแพทย์แผนไทย
                </span>
              </div>
              <p className="text-xs text-stone-500">
                กรอกข้อมูลเบื้องต้นเพื่อตรวจวิเคราะห์ธาตุเจ้าเรือน และค้นหาแพทย์แผนไทยใกล้คุณ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="my-4 flex items-center justify-between gap-2 px-1">
          {[
            { num: 1, label: 'ข้อมูลคุณแม่ & ธาตุเจ้าเรือน' },
            { num: 2, label: 'ระยะตั้งครรภ์ / หลังคลอด' },
            { num: 3, label: 'แพทย์แผนไทยใกล้ฉัน' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex-1 flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                step === s.num
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200 shadow-2xs'
                  : 'text-stone-400 hover:text-stone-600 bg-stone-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {s.num}
              </span>
              <span className="text-[11px] truncate hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: Mother Info & Element Calculation */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ชื่อ-นามสกุล หรือชื่อเล่นคุณแม่ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณแม่นิดา (นิด)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    เบอร์โทรศัพท์ติดต่อ
                  </label>
                  <input
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              {/* Birth Date & Element calculation */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-amber-950">
                    วันเกิดของคุณแม่ (เพื่อคำนวณธาตุเจ้าเรือนกำเนิดตามคัมภีร์ธาตุบรรจบ) *
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-white font-medium"
                  />
                </div>

                {/* Display calculated element */}
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔮</span>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        ธาตุเจ้าเรือนกำเนิด: <strong className="text-amber-800 text-sm">{elementInfo.name} ({elementInfo.paliName})</strong>
                      </span>
                      <p className="text-[11px] text-stone-500">{elementInfo.characteristics}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold shrink-0">
                    คำนวณอัตโนมัติ
                  </span>
                </div>
              </div>

              {/* Blood type & Weights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    กรุ๊ปเลือด
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="O Rh Positive">O Rh Positive</option>
                    <option value="A Rh Positive">A Rh Positive</option>
                    <option value="B Rh Positive">B Rh Positive</option>
                    <option value="AB Rh Positive">AB Rh Positive</option>
                    <option value="Rh Negative">กลุ่มเลือดหายาก (Rh-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    น้ำหนักก่อนตั้งครรภ์ (กก.)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightPrePregnancy}
                    onChange={(e) => setWeightPrePregnancy(parseFloat(e.target.value) || 50)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    น้ำหนักปัจจุบัน (กก.)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightCurrent}
                    onChange={(e) => setWeightCurrent(parseFloat(e.target.value) || 55)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>ถัดไป: เลือกสถานะคุณแม่</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Stage Details (Pregnancy vs Postpartum) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  สถานะของคุณแม่ในปัจจุบัน *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setStage('pregnant')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                      stage === 'pregnant'
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-200 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-3xl block mb-1">🤰</span>
                    <h5 className="font-bold text-stone-900 text-xs sm:text-sm">กำลังตั้งครรภ์</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">บำรุงครรภ์ตามคัมภีร์ปฐมจินดา</p>
                  </div>

                  <div
                    onClick={() => setStage('postpartum')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                      stage === 'postpartum'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-200 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-3xl block mb-1">👶</span>
                    <h5 className="font-bold text-stone-900 text-xs sm:text-sm">คลอดแล้ว / หลังคลอด</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">ฟื้นฟูมดลูกเข้าอู่ & อยู่ไฟแผนไทย</p>
                  </div>
                </div>
              </div>

              {/* Conditional fields based on stage */}
              {stage === 'pregnant' ? (
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
                  <h5 className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-teal-700" /> ข้อมูลการตั้งครรภ์
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        อายุครรภ์ปัจจุบัน (สัปดาห์)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="42"
                        value={gestationalWeeks}
                        onChange={(e) => setGestationalWeeks(parseInt(e.target.value) || 20)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        วันครบกำหนดคลอด (EDD)
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-600" /> ข้อมูลการคลอดบุตร
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        วันที่คลอดลูก *
                      </label>
                      <input
                        type="date"
                        required
                        value={babyBirthDate}
                        onChange={(e) => setBabyBirthDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        วิธีการคลอด
                      </label>
                      <select
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium"
                      >
                        <option value="vaginal">คลอดธรรมชาติ (ทางช่องคลอด)</option>
                        <option value="c_section">ผ่าตัดคลอด (C-Section)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        ครรภ์ที่
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={parity}
                        onChange={(e) => setParity(parseInt(e.target.value) || 1)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        ชื่อลูกน้อย
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น น้องอุ่นใจ"
                        value={babyName}
                        onChange={(e) => setBabyName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        เพศของลูก
                      </label>
                      <select
                        value={babyGender}
                        onChange={(e) => setBabyGender(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="girl">เพศหญิง</option>
                        <option value="boy">เพศชาย</option>
                        <option value="unknown">ไม่ระบุ</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-medium"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>ถัดไป: เลือกแพทย์แผนไทยใกล้ฉัน</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TTM Facility Selection & Finish */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 block">
                    หน่วยบริการที่มีแพทย์แผนไทยประจำตัวของคุณแม่
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowFacilityPicker(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" /> ค้นหาหน่วยบริการใกล้ฉัน
                  </button>
                </div>

                {/* Selected Facility Card */}
                {selectedFacility ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          หน่วยบริการที่เลือก
                        </span>
                        <span className="text-xs font-bold text-amber-800">
                          {selectedFacility.distanceKm} กม. จากที่อยู่คุณแม่
                        </span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-sm">{selectedFacility.name}</h5>
                      <p className="text-xs text-stone-600">{selectedFacility.address}</p>
                      <p className="text-xs text-amber-900 mt-1">
                        👩‍⚕️ แพทย์แผนไทย: <strong>{selectedFacility.doctorName}</strong> ({selectedFacility.phone})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFacilityPicker(true)}
                      className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold shrink-0"
                    >
                      เปลี่ยนหน่วยบริการ
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowFacilityPicker(true)}
                    className="p-5 rounded-2xl border-2 border-dashed border-stone-300 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/40 transition-colors"
                  >
                    <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-stone-800 block">
                      คลิกเพื่อค้นหาและเลือกโรงพยาบาล/คลินิกแพทย์แผนไทยใกล้คุณ
                    </span>
                    <span className="text-[11px] text-stone-500">
                      มีบริการอยู่ไฟทับหม้อเกลือ นวดเปิดท่อน้ำนม และสิทธิบัตรทอง
                    </span>
                  </div>
                )}
              </div>

              {/* Health scheme selection */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  สิทธิการรักษาพยาบาล
                </label>
                <select
                  value={healthScheme}
                  onChange={(e) => setHealthScheme(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white"
                >
                  <option value="universal_coverage">สิทธิหลักประกันสุขภาพ (บัตรทอง 30 บาท) - ครอบคลุมหัตถการแผนไทย</option>
                  <option value="civil_servant">สิทธิสวัสดิการข้าราชการ / รัฐวิสาหกิจ (เบิกจ่ายตรงได้)</option>
                  <option value="social_security">สิทธิประกันสังคม</option>
                  <option value="private_insurance">ประกันสุขภาพเอกชน / ชำระเอง</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-medium"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-700 to-rose-600 hover:from-amber-800 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-900/20 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกข้อมูลและเข้าสู่แอปหมอท้อง</span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Prototype Persona Quick Switcher Bar */}
        <div className="mt-5 pt-4 border-t border-stone-200/80 bg-stone-50/70 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              หรือเลือกทดลองใช้งานด้วยเคสจำลอง (Demo Personas):
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PERSONA_PRESETS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectPreset(p);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all"
              >
                <span className="text-xs font-bold text-stone-900 block truncate">{p.label}</span>
                <span className="text-[10px] text-stone-500 block truncate">{p.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded Facility Finder Modal */}
      {showFacilityPicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowFacilityPicker(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <NearbyThaiMedicineFacilities
              selectedFacilityId={selectedFacility?.id}
              onSelectFacility={(fac) => {
                setSelectedFacility(fac);
                setShowFacilityPicker(false);
              }}
              isEmbedded={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
