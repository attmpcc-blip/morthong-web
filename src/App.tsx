/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  ShieldAlert,
  Smile,
  Activity,
  Calendar,
  Home,
  PlusCircle,
  Flame,
  Baby,
  Flower2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { LochiaWoundTracker } from './components/LochiaWoundTracker';
import { DangerSignsTriage } from './components/DangerSignsTriage';
import { BreastfeedingTracker } from './components/BreastfeedingTracker';
import { MentalHealthEpds } from './components/MentalHealthEpds';
import { SelfCareKegel } from './components/SelfCareKegel';
import { AppointmentsReport } from './components/AppointmentsReport';
import { ThaiMedicineYufai } from './components/ThaiMedicineYufai';
import { PrenatalCare } from './components/PrenatalCare';
import { NearbyThaiMedicineFacilities } from './components/NearbyThaiMedicineFacilities';
import { RegistrationModal } from './components/RegistrationModal';
import { EmergencyModal } from './components/EmergencyModal';
import { NewLogModal } from './components/NewLogModal';
import { PERSONA_PRESETS, PersonaPreset } from './data/mockData';
import { THAI_MEDICINE_FACILITIES } from './data/thaiMedicineData';
import { DailyLog, FeedingSession, Appointment, MotherProfile, ThaiMedicineFacility } from './types';

export default function App() {
  // Current active scenario preset (Default: Thai Medicine Yufai Postpartum Day 10)
  const [activePreset, setActivePreset] = useState<PersonaPreset>(PERSONA_PRESETS[2]); // persona_yufai_day10
  const [profile, setProfile] = useState<MotherProfile>(activePreset.profile);
  const [currentDay, setCurrentDay] = useState(activePreset.currentDay);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>(activePreset.recentLogs);
  const [feedings, setFeedings] = useState<FeedingSession[]>(activePreset.feedings);
  const [appointments, setAppointments] = useState<Appointment[]>(activePreset.appointments);
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(activePreset.waterIntakeMl);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('ttm');

  // Registration gate state: opens before entering the app if not registered yet
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('thong_doctor_registered_done');
    } catch {
      return true;
    }
  });

  // Modals & View Frame
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [isFacilityFinderModalOpen, setIsFacilityFinderModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Switch persona preset
  const handleSelectPreset = (preset: PersonaPreset) => {
    setActivePreset(preset);
    setProfile(preset.profile);
    setCurrentDay(preset.currentDay);
    setRecentLogs(preset.recentLogs);
    setFeedings(preset.feedings);
    setAppointments(preset.appointments);
    setWaterIntakeMl(preset.waterIntakeMl);
    // If pregnant, switch tab to prenatal or home
    if (preset.profile.stage === 'pregnant') {
      setActiveTab('prenatal');
    } else {
      setActiveTab('ttm');
    }
  };

  // Quick switch between Pregnancy and Postpartum
  const handleToggleStage = (targetStage: 'pregnant' | 'postpartum') => {
    if (targetStage === 'pregnant') {
      const pregnantPreset = PERSONA_PRESETS.find((p) => p.profile.stage === 'pregnant') || PERSONA_PRESETS[0];
      handleSelectPreset(pregnantPreset);
    } else {
      const postpartumPreset = PERSONA_PRESETS.find((p) => p.id === 'persona_yufai_day10') || PERSONA_PRESETS[2];
      handleSelectPreset(postpartumPreset);
    }
  };

  // Registration completion handler
  const handleCompleteRegistration = (newProfile: MotherProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('thong_doctor_registered_done', 'true');
    } catch {}

    // Calculate postpartum day if postpartum
    if (newProfile.stage === 'postpartum' && newProfile.babyBirthDate) {
      const birthTime = new Date(newProfile.babyBirthDate).getTime();
      const nowTime = new Date().getTime();
      const diffDays = Math.max(1, Math.floor((nowTime - birthTime) / (1000 * 60 * 60 * 24)));
      setCurrentDay(diffDays);
    } else {
      setCurrentDay(0);
    }

    setIsRegistrationOpen(false);

    // Route to appropriate tab
    if (newProfile.stage === 'pregnant') {
      setActiveTab('prenatal');
    } else {
      setActiveTab('ttm');
    }
  };

  // Facility selection handler
  const handleSelectFacility = (facility: ThaiMedicineFacility) => {
    setProfile({
      ...profile,
      selectedFacilityId: facility.id,
      hospitalName: facility.name,
      thaiMedicineDoctorName: facility.doctorName,
    });
    setIsFacilityFinderModalOpen(false);
  };

  // Latest log of current persona
  const latestLog = recentLogs[recentLogs.length - 1] || recentLogs[0];

  // Save new or edited daily log
  const handleSaveLog = (newLog: DailyLog) => {
    const existingIndex = recentLogs.findIndex((l) => l.postpartumDay === newLog.postpartumDay);
    if (existingIndex >= 0) {
      const updated = [...recentLogs];
      updated[existingIndex] = newLog;
      setRecentLogs(updated);
    } else {
      setRecentLogs([...recentLogs, newLog]);
    }
    setWaterIntakeMl(newLog.waterIntakeMl);
  };

  // Partial update on current log
  const handleUpdateLog = (updatedFields: Partial<DailyLog>) => {
    const updated = [...recentLogs];
    const lastIdx = updated.length - 1;
    updated[lastIdx] = {
      ...updated[lastIdx],
      ...updatedFields,
    };
    setRecentLogs(updated);
  };

  // Yufai procedure logger
  const handleLogYufaiSession = (procName: string) => {
    const currentList = latestLog.yufaiProceduresToday || [];
    if (!currentList.includes(procName)) {
      handleUpdateLog({
        yufaiProceduresToday: [...currentList, procName],
      });
    }
  };

  // Feeding sessions
  const handleAddFeeding = (session: FeedingSession) => {
    setFeedings([session, ...feedings]);
  };

  // Appointments
  const handleAddAppointment = (apt: Appointment) => {
    setAppointments([...appointments, apt]);
  };

  const handleToggleCompleteAppointment = (id: string) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  // Quick actions from dashboard
  const handleQuickToggleIron = () => {
    handleUpdateLog({
      tookIronSupplements: !latestLog.tookIronSupplements,
    });
  };

  const handleQuickAddWater = (amount: number) => {
    const nextAmount = waterIntakeMl + amount;
    setWaterIntakeMl(nextAmount);
    handleUpdateLog({ waterIntakeMl: nextAmount });
  };

  const handleIncrementKegel = () => {
    const nextRounds = (latestLog.kegelRoundsCompleted || 0) + 1;
    handleUpdateLog({ kegelRoundsCompleted: nextRounds });
  };

  // Find next upcoming appointment
  const nextAppointment = appointments.find((a) => !a.isCompleted);

  // Dynamic tab definitions based on pregnancy vs postpartum
  const isPregnant = profile.stage === 'pregnant';

  const tabs = isPregnant
    ? [
        { id: 'home', label: 'หน้าแรก', icon: Home },
        { id: 'prenatal', label: 'ตั้งครรภ์ & ปฐมจินดา', icon: Baby, isHighlight: true },
        { id: 'ttm', label: 'แพทย์แผนไทย & ธาตุเจ้าเรือน', icon: Flower2, isHighlight: true },
        { id: 'facilities', label: 'แพทย์แผนไทยใกล้ฉัน', icon: MapPin },
        { id: 'danger', label: 'สัญญาณเตือนครรภ์', icon: ShieldAlert },
        { id: 'kegel', label: 'กายภาพ & อาหารบำรุง', icon: Activity },
        { id: 'appointments', label: 'นัดหมาย & ส่งแพทย์', icon: Calendar },
      ]
    : [
        { id: 'home', label: 'หน้าแรก', icon: Home },
        { id: 'ttm', label: 'แพทย์แผนไทย & อยู่ไฟ', icon: Flame, isHighlight: true },
        { id: 'facilities', label: 'แพทย์แผนไทยใกล้ฉัน', icon: MapPin },
        { id: 'lochia', label: 'น้ำคาวปลา & แผล', icon: Droplets },
        { id: 'danger', label: 'สัญญาณอันตราย SOS', icon: ShieldAlert, badgeAlert: latestLog.temperature >= 38 },
        { id: 'feeding', label: 'การให้นมแม่ & ปั๊มนม', icon: Heart },
        { id: 'mental', label: 'สุขภาพใจ EPDS', icon: Smile },
        { id: 'kegel', label: 'กายภาพ & โภชนาการ', icon: Activity },
        { id: 'appointments', label: 'นัดหมาย & ส่งแพทย์', icon: Calendar },
      ];

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentPresetId={activePreset.id}
        onSelectPreset={handleSelectPreset}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenFacilityFinder={() => setActiveTab('facilities')}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        profile={profile}
        currentDay={currentDay}
      />

      {/* Main Container (Simulated Phone frame or Fluid Desktop) */}
      <div className={`flex-1 transition-all duration-300 ${isMobileFrame ? 'max-w-md mx-auto my-4 shadow-2xl rounded-3xl border-8 border-stone-800 bg-white overflow-hidden' : 'w-full'}`}>
        
        {/* Stage Switcher Pill & Navigation Bar */}
        <div className="bg-white border-b border-stone-200 sticky top-[57px] z-20 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            
            {/* Quick Stage Toggle (Pregnancy vs Postpartum) */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => handleToggleStage('pregnant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isPregnant
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>ระยะตั้งครรภ์</span>
              </button>
              <button
                onClick={() => handleToggleStage('postpartum')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isPregnant
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>ระยะหลังคลอด & อยู่ไฟ</span>
              </button>
            </div>

            {/* Horizontal Nav Bar */}
            <div className="overflow-x-auto scrollbar-none flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors relative ${
                      isActive
                        ? tab.isHighlight
                          ? 'bg-amber-700 text-white shadow-xs shadow-amber-200'
                          : 'bg-rose-600 text-white shadow-xs shadow-rose-200'
                        : tab.isHighlight
                        ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.isHighlight ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badgeAlert && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {activeTab === 'home' && (
            <HomeDashboard
              profile={profile}
              currentDay={currentDay}
              latestLog={latestLog}
              feedings={feedings}
              nextAppointment={nextAppointment}
              onOpenNewLog={() => setIsNewLogOpen(true)}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onOpenDangerTriage={() => setActiveTab('danger')}
              onQuickToggleIron={handleQuickToggleIron}
              onQuickAddWater={handleQuickAddWater}
            />
          )}

          {activeTab === 'ttm' && (
            <ThaiMedicineYufai
              profile={profile}
              currentDay={currentDay}
              deliveryType={profile.deliveryType}
              onLogYufaiSession={handleLogYufaiSession}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />
          )}

          {activeTab === 'facilities' && (
            <NearbyThaiMedicineFacilities
              selectedFacilityId={profile.selectedFacilityId}
              onSelectFacility={handleSelectFacility}
            />
          )}

          {activeTab === 'prenatal' && (
            <PrenatalCare
              profile={profile}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />
          )}

          {activeTab === 'lochia' && (
            <LochiaWoundTracker
              currentDay={currentDay}
              deliveryType={profile.deliveryType}
              latestLog={latestLog}
              recentLogs={recentLogs}
              onUpdateLog={handleUpdateLog}
              onOpenDangerTriage={() => setActiveTab('danger')}
            />
          )}

          {activeTab === 'danger' && (
            <DangerSignsTriage
              profile={profile}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />
          )}

          {activeTab === 'feeding' && (
            <BreastfeedingTracker
              feedings={feedings}
              onAddFeeding={handleAddFeeding}
              breastStatus={latestLog.breastStatus}
            />
          )}

          {activeTab === 'mental' && (
            <MentalHealthEpds onOpenEmergency={() => setIsEmergencyOpen(true)} />
          )}

          {activeTab === 'kegel' && (
            <SelfCareKegel
              waterIntakeMl={waterIntakeMl}
              kegelRoundsCompleted={latestLog.kegelRoundsCompleted || 0}
              onUpdateWater={(amount) => {
                setWaterIntakeMl(amount);
                handleUpdateLog({ waterIntakeMl: amount });
              }}
              onIncrementKegel={handleIncrementKegel}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsReport
              profile={profile}
              currentDay={currentDay}
              appointments={appointments}
              recentLogs={recentLogs}
              feedings={feedings}
              onAddAppointment={handleAddAppointment}
              onToggleCompleteAppointment={handleToggleCompleteAppointment}
            />
          )}
        </main>
      </div>

      {/* Floating Quick Action Button on Mobile View */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          onClick={() => (isPregnant ? setActiveTab('prenatal') : setIsNewLogOpen(true))}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-700 via-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-amber-900/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isPregnant ? 'บันทึกอาการครรภ์' : 'บันทึกอาการหลังคลอด'}</span>
        </button>
      </div>

      {/* Onboarding Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onCompleteRegistration={handleCompleteRegistration}
        onSelectPreset={handleSelectPreset}
        initialProfile={profile}
      />

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        profile={profile}
      />

      <NewLogModal
        isOpen={isNewLogOpen}
        onClose={() => setIsNewLogOpen(false)}
        onSaveLog={handleSaveLog}
        postpartumDay={currentDay}
        existingLog={latestLog}
      />

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-stone-200 py-6 text-stone-500 text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-700">
            แอพหมอท้อง (Doctor Thong) · การแพทย์แผนไทยและการผดุงครรภ์ผสมผสาน
          </p>
          <p className="text-[11px] text-stone-400">
            อ้างอิงคัมภีร์ปฐมจินดา คัมภีร์มหาโชตรัต และแนวทางเวชปฏิบัติการแพทย์แผนไทย กรมการแพทย์แผนไทยและการแพทย์ทางเลือก กระทรวงสาธารณสุข
          </p>
        </div>
      </footer>
    </div>
  );
}
