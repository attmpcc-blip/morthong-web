import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Phone,
  Clock,
  CheckCircle2,
  Filter,
  Navigation,
  Star,
  Hospital,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { ThaiMedicineFacility } from '../types';
import { THAI_MEDICINE_FACILITIES } from '../data/thaiMedicineData';

interface NearbyThaiMedicineFacilitiesProps {
  selectedFacilityId?: string;
  onSelectFacility: (facility: ThaiMedicineFacility) => void;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const NearbyThaiMedicineFacilities: React.FC<NearbyThaiMedicineFacilitiesProps> = ({
  selectedFacilityId,
  onSelectFacility,
  onClose,
  isEmbedded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [simulatedLocation, setSimulatedLocation] = useState<string>('กรุงเทพฯ & ปริมณฑล');

  // Filter facilities
  const filteredFacilities = THAI_MEDICINE_FACILITIES.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProvince =
      filterProvince === 'all' || fac.province === filterProvince;

    const matchesService =
      filterService === 'all' ||
      (filterService === 'yufai' && fac.services.includes('yufai')) ||
      (filterService === 'lactation' && fac.services.includes('lactation')) ||
      (filterService === 'gold_card' && fac.services.includes('gold_card_coverage'));

    return matchesSearch && matchesProvince && matchesService;
  });

  const provinces = ['all', 'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'ปราจีนบุรี', 'จันทบุรี'];

  return (
    <div className={`space-y-5 ${isEmbedded ? '' : 'bg-white rounded-2xl p-6 border border-stone-200 shadow-xs'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                ค้นหาหน่วยบริการที่มีแพทย์แผนไทยใกล้ฉัน
              </h3>
              <p className="text-xs text-stone-500">
                โรงพยาบาลรัฐ ศูนย์การแพทย์แผนไทย และ รพ.สต. ที่มีแพทย์แผนไทย (พท./พท.ป.) ดูแลแม่ตั้งครรภ์ & อยู่ไฟ
              </p>
            </div>
          </div>
        </div>

        {/* Current Location Badge */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
          <Navigation className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span>ตำแหน่งคุณแม่: <strong>{simulatedLocation}</strong></span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโรงพยาบาล, อำเภอ, จังหวัด หรือชื่อแพทย์แผนไทย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Province select */}
          <select
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 shrink-0"
          >
            <option value="all">ทุกจังหวัด</option>
            {provinces.filter((p) => p !== 'all').map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        {/* Service filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          <span className="text-stone-400 text-[11px] shrink-0 font-medium">บริการ:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'yufai', label: '🔥 คอร์สอยู่ไฟทับหม้อเกลือ' },
            { id: 'lactation', label: '🤱 นวดเปิดท่อน้ำนม' },
            { id: 'gold_card', label: '🏥 ใช้สิทธิบัตรทอง 30 บาทได้' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterService(tag.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterService === tag.id
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>พบ {filteredFacilities.length} หน่วยบริการใกล้คุณ</span>
          <span className="text-[11px]">เรียงตามระยะทางที่ใกล้ที่สุด</span>
        </div>

        {filteredFacilities.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
            ไม่พบหน่วยบริการที่ตรงกับเงื่อนไขการค้นหา ลองเปลี่ยนคำค้นหรือเลือก "ทุกจังหวัด"
          </div>
        ) : (
          filteredFacilities.map((facility) => {
            const isSelected = selectedFacilityId === facility.id;

            return (
              <div
                key={facility.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-300 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Top badging */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {facility.type === 'government_hospital'
                          ? 'โรงพยาบาลรัฐ'
                          : facility.type === 'ttm_center'
                          ? 'ศูนย์การแพทย์แผนไทย'
                          : 'รพ.สต. / ปฐมภูมิ'}
                      </span>
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-amber-600" />
                        {facility.distanceKm} กม.
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {facility.rating} ({facility.reviewsCount} รีวิว)
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> หน่วยบริการประจำตัวของคุณ
                        </span>
                      )}
                    </div>

                    {/* Facility name */}
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      {facility.name}
                    </h4>
                    <p className="text-xs text-stone-600">{facility.address}</p>

                    {/* Doctor name & hours */}
                    <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                      <span>
                        👩‍⚕️ แพทย์แผนไทย: <strong>{facility.doctorName}</strong> ({facility.doctorLicense})
                      </span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Clock className="w-3 h-3" /> {facility.operatingHours}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {facility.serviceHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                        >
                          🌿 {hl}
                        </span>
                      ))}
                    </div>

                    {/* Coverage notice */}
                    <div className="mt-2 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                      ✓ {facility.coverage}
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                    <a
                      href={`tel:${facility.phone.replace(/-/g, '')}`}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600" />
                      <span>โทร {facility.phone}</span>
                    </a>

                    <button
                      onClick={() => onSelectFacility(facility)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-900/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'เลือกแล้ว' : 'เลือกหน่วยบริการนี้'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Notice about Universal Coverage / Gold card */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-amber-900 font-bold mb-0.5">
            สิทธิประโยชน์การแพทย์แผนไทยสำหรับหญิงตั้งครรภ์และหลังคลอด:
          </strong>
          <span>
            ตามชุดสิทธิประโยชน์ของ สปสช. (บัตรทอง 30 บาท) มารดาหลังคลอดสามารถรับบริการประคบสมุนไพร อบไอน้ำสมุนไพร และฟื้นฟูมารดาหลังคลอดได้โดยไม่มีค่าใช้จ่าย ณ หน่วยบริการประจำ หรือโรงพยาบาลรัฐตามเขตพื้นที่
          </span>
        </div>
      </div>
    </div>
  );
};
