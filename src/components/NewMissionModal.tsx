import React, { useState, useRef } from 'react';
import { Mission, SquadMember, Priority } from '../types';
import { 
  X, 
  Radio, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Play, 
  Square, 
  Volume2, 
  FileAudio, 
  Link as LinkIcon 
} from 'lucide-react';
import { tacticalAudio, playAudioUrl, stopAllAudio } from '../utils/audio';

interface NewMissionModalProps {
  onClose: () => void;
  onDispatchMission: (newMission: Mission) => void;
  allMembers: SquadMember[];
  commanderName: string;
  lang: 'en' | 'ar';
}

const TACTICAL_IMAGE_PRESETS = [
  {
    name: 'Satellite Recon Map',
    url: '/src/assets/images/tactical_operations_map_1792663265618.jpg',
    filename: 'sat_recon_map.jpg',
  },
  {
    name: 'Tactical Cover Ops',
    url: '/src/assets/images/thunderbolt_tactical_cover_1792663525424.jpg',
    filename: 'tactical_cover.jpg',
  },
  {
    name: 'Thunderbolt Insignia',
    url: '/src/assets/images/thunderbolt_unit_insignia_1792663264729.jpg',
    filename: 'unit_insignia.jpg',
  },
];

export const NewMissionModal: React.FC<NewMissionModalProps> = ({
  onClose,
  onDispatchMission,
  allMembers,
  commanderName,
}) => {
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
  const [discordUrl, setDiscordUrl] = useState('https://discord.gg/thunderbolt-ops');
  
  // Media states: Image & Audio
  const [imageUrl, setImageUrl] = useState<string>('/src/assets/images/tactical_operations_map_1792663265618.jpg');
  const [imageFileName, setImageFileName] = useState<string>('tactical_recon_satellite.jpg');
  const [imageFileSize, setImageFileSize] = useState<string>('Standard Preset');
  const [imageUploadError, setImageUploadError] = useState<string>('');

  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioFileSize, setAudioFileSize] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioUploadError, setAudioUploadError] = useState<string>('');
  
  const stopAudioRef = useRef<(() => void) | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const [assignedSquad, setAssignedSquad] = useState<string[]>(allMembers.map(m => m.id));
  const [objectives, setObjectives] = useState<string[]>([
    'Secure perimeter outpost by 06:15 hours',
    'Deploy encrypted satellite jammer',
    'Maintain continuous radio link with Dragon Command HQ',
  ]);
  const [newObjectiveText, setNewObjectiveText] = useState('');

  // Handle Image File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Check size (warn if > 4MB to prevent localStorage overflow)
    if (file.size > 4 * 1024 * 1024) {
      setImageUploadError('Image size exceeds 4MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        setImageFileName(file.name);
        setImageFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        tacticalAudio.playSuccessBeep();
      }
    };
    reader.onerror = () => {
      setImageUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Audio File Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      setAudioUploadError('Please select a valid audio file (MP3, WAV, OGG, M4A).');
      return;
    }

    // Limit to 7MB to prevent localStorage exhaustion
    if (file.size > 7 * 1024 * 1024) {
      setAudioUploadError('Audio file is too large (max 7MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAudioUrl(dataUrl);
        setAudioFileName(file.name);
        setAudioFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        tacticalAudio.playSuccessBeep();
      }
    };
    reader.onerror = () => {
      setAudioUploadError('Failed to read audio file.');
    };
    reader.readAsDataURL(file);
  };

  // Toggle Audio Preview Playback
  const toggleAudioPreview = () => {
    if (!audioUrl) return;

    if (isPlayingAudio) {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
      stopAllAudio();
      setIsPlayingAudio(false);
    } else {
      tacticalAudio.playRadioClick();
      setIsPlayingAudio(true);
      const stopFn = playAudioUrl(audioUrl, () => {
        setIsPlayingAudio(false);
        stopAudioRef.current = null;
      });
      stopAudioRef.current = stopFn;
    }
  };

  const removeAudio = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    stopAllAudio();
    setIsPlayingAudio(false);
    setAudioUrl('');
    setAudioFileName('');
    setAudioFileSize('');
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    tacticalAudio.playRadioClick();
  };

  const removeImage = () => {
    setImageUrl('');
    setImageFileName('');
    setImageFileSize('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    tacticalAudio.playRadioClick();
  };

  const selectImagePreset = (preset: typeof TACTICAL_IMAGE_PRESETS[0]) => {
    tacticalAudio.playRadioClick();
    setImageUrl(preset.url);
    setImageFileName(preset.filename);
    setImageFileSize('Tactical Preset');
    setImageUploadError('');
  };

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

  const handleModalClose = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
    }
    stopAllAudio();
    tacticalAudio.playRadioClick();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !codeName.trim()) return;

    if (stopAudioRef.current) {
      stopAudioRef.current();
    }
    stopAllAudio();

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
      imageUrl: imageUrl || undefined,
      imageFileName: imageFileName || undefined,
      audioUrl: audioUrl || undefined,
      audioFileName: audioFileName || undefined,
      discordUrl: discordUrl || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 max-h-[92vh] flex flex-col">
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
                Dispatch New Mission & Broadcast to Squad
              </h2>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Row 1: Codename & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold block">
                MISSION CODENAME:
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
                PRIORITY LEVEL:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="TACTICAL">TACTICAL</option>
                <option value="ROUTINE">ROUTINE</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              MISSION TITLE:
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

          {/* Row 3: Target Date, Time & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>DAY OF WEEK:</span>
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
                <span>TARGET DATE:</span>
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
                <span>H-HOUR TIME:</span>
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
                <span>TARGET SECTOR / ZONE:</span>
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
                GRID COORDINATES:
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

          {/* ======================================================== */}
          {/* NEW SECTION 1: MISSION IMAGE UPLOAD (PHOTO / TACTICAL MAP) */}
          {/* ======================================================== */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>MISSION COVER IMAGE / RECON SATELLITE MAP:</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Uploaded by Instructor · Displayed to All
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image Preview & Upload Controls */}
            {imageUrl ? (
              <div className="relative rounded-xl border border-slate-700 overflow-hidden bg-slate-950 flex flex-col sm:flex-row items-center gap-4 p-3">
                <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                  <img
                    src={imageUrl}
                    alt="Mission Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-amber-400 border border-amber-500/30">
                    PREVIEW
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-white truncate max-w-xs">
                        {imageFileName || 'Uploaded Image'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Status: <span className="text-emerald-400">Attached</span> · {imageFileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Change Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-950/40"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2.5 rounded-full bg-slate-800 text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Click to upload custom operation image or tactical map
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Supports JPG, PNG, WEBP (Max 4MB)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {imageUploadError && (
              <p className="text-xs text-rose-400 font-mono">{imageUploadError}</p>
            )}

            {/* Tactical Presets Quick Selection */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Or select tactical preset imagery:
              </span>
              <div className="flex flex-wrap gap-2">
                {TACTICAL_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => selectImagePreset(preset)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                      imageUrl === preset.url
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* NEW SECTION 2: AUDIO BRIEFING FILE UPLOAD */}
          {/* ======================================================== */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold block flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-amber-400" />
                <span>SPOKEN AUDIO BRIEFING / VOICE TRANSMISSION FILE:</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Playable by all operators on mission
              </span>
            </div>

            {/* Hidden audio input */}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />

            {audioUrl ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-white truncate max-w-sm">
                        {audioFileName || 'Uploaded Tactical Audio'}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        File attached · {audioFileSize}
                      </p>
                    </div>
                  </div>

                  {/* Play preview and Remove buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={toggleAudioPreview}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Preview</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Test Play Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={removeAudio}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                      title="Remove audio file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Animated waveform visualizer when previewing */}
                <div className="flex items-center justify-between gap-1 h-6 px-2 bg-slate-900 rounded border border-slate-800">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayingAudio ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlayingAudio
                          ? `${Math.sin(i * 0.4 + Date.now() / 300) * 35 + 50}%`
                          : '20%',
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() => audioInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-950/40"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2.5 rounded-full bg-slate-800 text-amber-400">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Click to upload custom voice briefing audio file
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Supports MP3, WAV, OGG, M4A (Max 7MB)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {audioUploadError && (
              <p className="text-xs text-rose-400 font-mono">{audioUploadError}</p>
            )}

            <div className="text-[11px] font-mono text-slate-500">
              * Note: If no custom audio file is uploaded, our tactical HUD voice will read the written briefing script automatically.
            </div>
          </div>

          {/* Row 5: Detailed Briefing (Explanation of what the mission is about) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold block">
                TACTICAL BRIEFING OVERVIEW (What this mission is about):
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

          {/* Discord Registration Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold block flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>DISCORD MISSION REGISTRATION URL:</span>
            </label>
            <input
              type="url"
              value={discordUrl}
              onChange={(e) => setDiscordUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              placeholder="https://discord.gg/your-unit-event"
            />
          </div>

          {/* Row 6: Objectives List */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              TACTICAL OBJECTIVES:
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
                placeholder="Add specific tactical objective..."
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
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Row 7: Squad Member Assignment */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              ASSIGNED OPERATORS (Instant Alert Sent to All):
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
              onClick={handleModalClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast Mission & Notify All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
