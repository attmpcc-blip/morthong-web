export type DeliveryType = 'vaginal' | 'c_section';

export type MaternalStage = 'pregnant' | 'postpartum';

export type ThaiElement = 'earth' | 'water' | 'wind' | 'fire'; // ปถวี, อาโป, วาโย, เตโช

export interface ThaiMedicineFacility {
  id: string;
  name: string;
  type: 'government_hospital' | 'private_hospital' | 'ttm_center' | 'subdistrict_clinic';
  province: string;
  district: string;
  address: string;
  distanceKm: number;
  phone: string;
  doctorName: string;
  doctorLicense: string;
  operatingHours: string;
  services: ('yufai' | 'lactation' | 'steam_compress' | 'herbal_dispensary' | 'gold_card_coverage')[];
  serviceHighlights: string[];
  coverage: string; // เช่น "สิทธิบัตรทอง 30 บาท ฟรี", "เบิกจ่ายตรงได้"
  rating: number;
  reviewsCount: number;
  latitude: number;
  longitude: number;
}

export interface MotherProfile {
  id: string;
  name: string;
  phone?: string;
  birthDate?: string; // YYYY-MM-DD
  stage: MaternalStage; // ตั้งครรภ์ หรือ หลังคลอด
  gestationalWeeks?: number; // สำหรับระยะตั้งครรภ์ (สัปดาห์)
  dueDate?: string; // วันกำหนดคลอด
  babyName: string;
  babyGender: 'boy' | 'girl' | 'unknown';
  babyBirthDate: string; // YYYY-MM-DD
  deliveryType: DeliveryType;
  parity: number; // ครรภ์ที่
  hospitalName: string;
  doctorName: string;
  thaiMedicineDoctorName?: string; // แพทย์แผนไทยประจำตัว
  selectedFacilityId?: string; // หน่วยบริการแพทย์แผนไทยที่เลือก
  bloodType: string;
  thaiElement: ThaiElement; // ธาตุเจ้าเรือนกำเนิด
  weightPrePregnancy: number;
  weightCurrent: number;
  healthScheme?: 'universal_coverage' | 'social_security' | 'civil_servant' | 'private_insurance';
  isRegistered?: boolean;
}

export type LochiaColor = 'rubra' | 'serosa' | 'alba' | 'none';
export type LochiaAmount = 'light' | 'moderate' | 'heavy' | 'excessive';
export type WoundStatus = 'normal' | 'mild_pain' | 'redness' | 'swelling' | 'discharge' | 'urgent';

export interface YufaiSessionLog {
  id: string;
  date: string;
  procedureId: string;
  procedureName: string;
  durationMinutes: number;
  feeling: string;
  performedBy: 'self' | 'thai_traditional_doctor' | 'family';
}

export interface YufaiProcedure {
  id: string;
  name: string;
  namePali?: string;
  description: string;
  herbs: string[];
  benefit: string;
  timingRule: string; // คลอดธรรมชาติกี่วัน / ผ่าคลอดกี่วัน
  contraindications: string[];
  steps: string[];
}

export interface RuesiDatTonExercise {
  id: string;
  name: string;
  subtitle: string;
  suitableFor: 'pregnant' | 'postpartum' | 'both';
  trimesterAllowed?: (1 | 2 | 3)[];
  benefit: string;
  cautions: string;
  steps: string[];
  icon: string;
}

export interface ThaiHerbalRecipe {
  id: string;
  title: string;
  type: 'drink' | 'food' | 'compress' | 'steam' | 'bath';
  stage: 'pregnant' | 'postpartum' | 'both';
  keyHerbs: string[];
  properties: string;
  instructions: string;
  warnings?: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  postpartumDay: number;
  // Vitals
  temperature: number; // °C
  systolicBP: number;
  diastolicBP: number;
  painScore: number; // 0-10
  // Lochia
  lochiaColor: LochiaColor;
  lochiaAmount: LochiaAmount;
  lochiaClots: 'none' | 'small' | 'large_abnormal';
  lochiaOdor: 'normal' | 'foul';
  // Wound
  woundStatus: WoundStatus;
  woundNotes?: string;
  // Uterus
  uterusFirmness: 'firm' | 'soft_boggy';
  uterinePain: 'mild' | 'moderate' | 'severe' | 'none';
  // Breast & Feeding
  breastStatus: 'comfortable' | 'engorged' | 'clogged_duct' | 'cracked_nipple' | 'mastitis_suspect';
  feedingCount: number;
  pumpingVolumeMl: number;
  // Thai Traditional Medicine check-in
  thaiElementBalance?: 'balanced' | 'fire_high' | 'wind_high' | 'water_deranged';
  yufaiProceduresToday?: string[];
  drankHerbalInfusion?: boolean; // น้ำขิง / น้ำหัวปลี / ชาบำรุง
  ruesiDatTonDone?: boolean; // บริหารฤๅษีดัดตน
  // Nutrition & Self-care
  waterIntakeMl: number; // target 3000
  tookIronSupplements: boolean;
  kegelRoundsCompleted: number;
  moodScore: number; // 1-5 (1: very sad, 5: happy & peaceful)
  notes?: string;
}

export interface FeedingSession {
  id: string;
  timestamp: string;
  type: 'breast_left' | 'breast_right' | 'both' | 'pump' | 'bottle';
  durationMinutes: number;
  volumeMl?: number;
  notes?: string;
}

export interface EpdsAnswer {
  questionId: number;
  score: number; // 0 - 3
}

export interface EpdsResult {
  date: string;
  totalScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  q10Risk: boolean; // question 10 about self-harm
  recommendation: string;
}

export interface Appointment {
  id: string;
  date: string;
  title: string;
  doctor: string;
  location: string;
  purpose: string;
  isCompleted: boolean;
  type: 'mother_check' | 'baby_vaccine' | 'specialist';
}

export interface DangerSignCheck {
  feverHigh: boolean;
  heavyBleeding: boolean;
  foulLochia: boolean;
  severeAbdominalPain: boolean;
  woundSeparationOrPus: boolean;
  severeHeadacheOrVisionBlur: boolean;
  calfPainOrSwelling: boolean;
  breastInflamedFever: boolean;
}
