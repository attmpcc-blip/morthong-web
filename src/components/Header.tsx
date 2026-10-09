import React from 'react';
import { Heart, ShieldAlert, Smartphone, Monitor, UserCheck, ChevronDown } from 'lucide-react';
import { PERSONA_PRESETS, PersonaPreset } from '../data/mockData';
import { MotherProfile } from '../types';

interface HeaderProps {
  currentPresetId: string;
  onSelectPreset: (preset: PersonaPreset) => void;
  onOpenEmergency: () => void;
  onOpenRegistration: () => void;
  onOpenFacilityFinder: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  profile: MotherProfile;
  currentDay: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPresetId,
  onSelectPreset,
  onOpenEmergency,
  onOpenRegistration,
  onOpenFacilityFinder,
  isMobileFrame,
  onToggleMobileFrame,
  profile,
  currentDay,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-stone-900">
                แอพหมอท้อง
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                การแพทย์แผนไทย & ผดุงครรภ์
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              ดูแลตั้งแต่ตั้งครรภ์ & ฟื้นฟูมารดาหลังคลอด (Traditional Thai Medicine Prototype)
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Registration / Profile Button */}
          <button
            onClick={onOpenRegistration}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors"
            title="ลงทะเบียนและแก้ไขข้อมูลส่วนตัว"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">ลงทะเบียน/ข้อมูล</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 transition-colors"
              title="สลับเคสตัวอย่างสำหรับทดสอบ Prototype"
            >
              <span className="max-w-[130px] sm:max-w-none truncate font-medium">
                {profile.name} ({profile.stage === 'pregnant' ? `ตั้งครรภ์ ${profile.gestationalWeeks}สัปดาห์` : `วันที่ ${currentDay}`})
              </span>
              <ChevronDown className="w-3 h-3 text-amber-600" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    เลือกเคสจำลอง (Interactive Scenario)
                  </div>
                  {PERSONA_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-rose-50/80 flex flex-col ${
                        currentPresetId === preset.id
                          ? 'bg-rose-50 text-rose-900 font-semibold'
                          : 'text-stone-700'
                      }`}
                    >
                      <span className="font-medium text-stone-900">{preset.label}</span>
                      <span className="text-[11px] text-stone-500 mt-0.5">{preset.subtitle}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Device Frame View Toggle (Mobile vs Desktop) */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            title={isMobileFrame ? 'สลับเป็นมุมมองเต็มหน้าจอ' : 'สลับเป็นมุมมองจำลองสมาร์ทโฟน'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>มุมมองเต็มจอ</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>มุมมองมือถือ</span>
              </>
            )}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs shadow-rose-300 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
            <span>สายด่วน SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
