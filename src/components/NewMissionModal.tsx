import React, { useState } from 'react';
import { Mission, SquadMember, Priority } from '../types';
import { X, Radio, Calendar, Clock, MapPin, Shield, Check, Plus, Trash2 } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface NewMissionModalProps {
  onClose: () => void;
  onDispatchMission: (newMission: Mission) => void;
  allMembers: SquadMember[];
  commanderName: string;
  lang: 'en' | 'ar';
}

export const NewMissionModal: React.FC<NewMissionModalProps> = ({
  onClose,
  onDispatchMission,
  allMembers,
  commanderName,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [codeName, setCodeName] = useState('OPERATION DESERT VIPER');
  const [title, setTitle] = useState('Rapid Reconnaissance & Sector Perimeter Containment');
  const [date, setDate] = useState('2026-10-22');
  const [dayName, setDayName] = useState('Thursday');
  const [time, setTime] = useState('06:00 UTC+2');
  const [targetSector, setTargetSector] = useState('Sector G14-H18 (Northern Ridge Outpost)');
  const [coordinates, setCoordinates] = useState("32°14'08\"N 31°22'45\"E");
  const [priority, setPriority] = useState<Priority>('CRITICAL');
  const [summary, setSummary] = useState(
    'Tactical deployment on Thursday 22/10/2026 to secure Sector G14, intercept hostile logistical convoys, and establish dominant radar surveillance.'
  );
  const [briefingOverview, setBriefingOverview] = useState(
    'All operators of Thunderbolt Unit: Under direct order of Maj. Gen. Staff Dragon, mission commences on Thursday 22/10/2026. Deployment requires full tactical readiness, radio discipline, and securing designated observation outpost Echo-4 before dawn.'
  );
  const [rulesOfEngagement, setRulesOfEngagement] = useState(
    'ROE Level 2: Fire authorized only upon positive target identification and command verification.'
  );
  const [weatherConditions, setWeatherConditions] = useState(
    'Night fog clearing by 06:30 hours. Visibility 400m. Wind NE 12 knots.'
  );
  const [assignedSquad, setAssignedSquad] = useState<string[]>(allMembers.map(m => m.id));
  const [objectives, setObjectives] = useState<string[]>([
    'Secure perimeter outpost by 06:15 hours',
    'Deploy encrypted satellite jammer',
    'Maintain continuous radio link with Dragon Command HQ',
  ]);
  const [newObjectiveText, setNewObjectiveText] = useState('');

  const toggleMemberSelection = (id: string) => {
    tacticalAudio.playRadioClick();
    if (assignedSquad.includes(id)) {
      setAssignedSquad(assignedSquad.filter(mId => mId !== id));
    } else {
      setAssignedSquad([...assignedSquad, id]);
    }
  };

  const addObjective = () => {
    if (!newObjectiveText.trim()) return;
    tacticalAudio.playRadioClick();
    setObjectives([...objectives, newObjectiveText.trim()]);
    setNewObjectiveText('');
  };

  const removeObjective = (index: number) => {
    tacticalAudio.playRadioClick();
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !codeName.trim()) return;

    const newMission: Mission = {
      id: `msn-${Date.now()}`,
      codeName: codeName.toUpperCase(),
      title,
      date,
      dayName,
      time,
      targetSector,
      coordinates,
      priority,
      status: 'ACTIVE',
      commander: commanderName,
      summary,
      briefingOverview,
      rulesOfEngagement,
      weatherConditions,
      assignedSquad,
      equipmentList: [
        'Night-Vision Goggles Gen IV',
        'Tactical Encrypted Radios',
        'Suppressed Weaponry & Body Armor',
        'Trauma Med-Kits',
      ],
      objectives: objectives.map((text, idx) => ({
        id: `obj-${Date.now()}-${idx}`,
        text,
        completed: false,
      })),
      broadcastCount: 1,
      lastBroadcastTime: 'Just now',
    };

    onDispatchMission(newMission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
              <img 
                src="/src/assets/images/thunderbolt_eagle_logo_1792663264729.jpg" 
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/thunderbolt_unit_insignia_1792663264729.jpg';
                }}
              />
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400 block font-semibold">
                COMMAND DISPATCH CONSOLE · {commanderName}
              </span>
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'إصدار مهمة تكتيكية وبث الإشعار للجميع' : 'Dispatch New Mission & Broadcast to Squad'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadioClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Row 1: Codename & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block">
                {isAr ? 'الاسم الكودي للعملية:' : 'MISSION CODENAME:'}
              </label>
              <input
                type="text"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                placeholder="e.g. OPERATION FLASH THUNDER"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block">
                {isAr ? 'مستوى الأهمية:' : 'PRIORITY LEVEL:'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (طارئ)</option>
                <option value="HIGH">HIGH (عالي)</option>
                <option value="TACTICAL">TACTICAL (تكتيكي)</option>
                <option value="ROUTINE">ROUTINE (اعتيادي)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              {isAr ? 'عنوان المهمة والهدف الرئيسي:' : 'MISSION TITLE:'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              placeholder="e.g. Sector Reconnaissance & Perimeter Securing"
              required
            />
          </div>

          {/* Row 3: Target Date (Highlighted: Thursday 22/10/2026), Time & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? 'يوم الأسبوع:' : 'DAY OF WEEK:'}</span>
              </label>
              <input
                type="text"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono"
                placeholder="e.g. Thursday"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? 'تاريخ المهمة:' : 'TARGET DATE:'}</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono font-bold tabular-nums"
                placeholder="2026-10-22"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{isAr ? 'توقيت التنفيذ:' : 'H-HOUR TIME:'}</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono"
                placeholder="06:00 UTC+2"
                required
              />
            </div>
          </div>

          {/* Row 4: Location & Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'القطاع المستهدف:' : 'TARGET SECTOR / ZONE:'}</span>
              </label>
              <input
                type="text"
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                placeholder="Sector G14-H18"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block">
                {isAr ? 'إحداثيات الإنزال والتمركز:' : 'GRID COORDINATES:'}
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                placeholder="32°14'08&quot;N 31°22'45&quot;E"
              />
            </div>
          </div>

          {/* Row 5: Detailed Briefing (Explanation of what the mission is about) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold block">
                {isAr ? 'الشرح والإيجاز التكتيكي الشامل (ما هي تفاصيل المهمة):' : 'TACTICAL BRIEFING OVERVIEW (What this mission is about):'}
              </label>
              <span className="text-[10px] font-mono text-slate-400">Read by all operators</span>
            </div>
            <textarea
              rows={4}
              value={briefingOverview}
              onChange={(e) => setBriefingOverview(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed font-sans focus:border-amber-500 focus:outline-none"
              placeholder="Explain the mission's tactical purpose, infiltration method, overwatch coordinates, and expected encounters..."
              required
            />
          </div>

          {/* Row 6: Objectives List */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              {isAr ? 'قائمة الأهداف التكتيكية الميدانية:' : 'TACTICAL OBJECTIVES:'}
            </label>
            <div className="space-y-1.5">
              {objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-amber-500 font-mono font-bold">{i + 1}.</span>
                  <span className="flex-1 text-slate-200">{obj}</span>
                  <button
                    type="button"
                    onClick={() => removeObjective(i)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newObjectiveText}
                onChange={(e) => setNewObjectiveText(e.target.value)}
                placeholder={isAr ? "أضف هدفاً تكتيكياً جديداً..." : "Add specific tactical objective..."}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addObjective();
                  }
                }}
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Row 7: Squad Member Assignment */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              {isAr ? 'المقاتلون المكلفون (سيصلهم الإشعار فوراً):' : 'ASSIGNED OPERATORS (Instant Alert Sent to All):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allMembers.map((member) => {
                const isAssigned = assignedSquad.includes(member.id);
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => toggleMemberSelection(member.id)}
                    className={`p-2 rounded-lg border text-xs text-left flex items-center justify-between cursor-pointer transition-colors ${
                      isAssigned
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#f2c14e] font-mono text-[11px]">{member.rank}</div>
                      <div className="text-xs text-slate-200">{member.name}</div>
                    </div>
                    {isAssigned && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            <span>Dispatched under authority of </span>
            <span className="text-amber-400 font-semibold">{commanderName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                tacticalAudio.playRadioClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>{isAr ? 'بث المهمة وإرسال الإشعار للكل' : 'Broadcast Mission & Notify All'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
