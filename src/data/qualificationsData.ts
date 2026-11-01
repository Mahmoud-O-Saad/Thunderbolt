import { QualificationStatus, QualificationRecordDetail, QualificationEntry } from '../types';

export type { QualificationStatus };

export interface QualificationModule {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  manualVersion: string;
  award: string;
  awardAr: string;
  prerequisites: string;
  prerequisitesAr: string;
  prerequisiteIds: string[];
  criticalTasks: string[];
  criticalTasksAr: string[];
  traineeManualEn: string;
  traineeManualAr: string;
  instructorGuideEn: string;
  instructorGuideAr: string;
}

export const QUALIFICATION_MODULES: QualificationModule[] = [
  {
    id: '01.1',
    code: '01.1',
    title: 'Basic Combat Qualification',
    titleAr: 'التأهيل القتالي الأساسي',
    category: 'Core Operator Training | Foundation',
    categoryAr: 'تدريب المقاتل الأساسي | التأسيس',
    manualVersion: 'Manual v1.6',
    award: 'Eligible for supervised operations and advanced operator training.',
    awardAr: 'مؤهل للمشاركة في العمليات الميدانية الخاضعة للإشراف وتدريبات الصاعقة المتقدمة.',
    prerequisites: 'None',
    prerequisitesAr: 'لا يوجد',
    prerequisiteIds: [],
    criticalTasks: [
      'Radio check and contact report',
      'Six-digit grid and bearing calculation',
      'Formation movement and tactical spacing',
      'Reaction to contact lane and bound retreat',
      'Basic casualty care and TCCC application',
      'Tactical search and prisoner handling'
    ],
    criticalTasksAr: [
      'إجراء فحص الراديو وتقرير الاشتباك السريع',
      'تحديد الإحداثيات السداسية وحساب الاتجاه',
      'حركات التشكيلات العسكرية والمسافات التكتيكية',
      'رد الفعل على النيران المباشرة والانسحاب بالتبادل',
      'الإسعافات الأولية تحت النيران وتطبيق TCCC',
      'التفتيش التكتيكي والتعامل مع الأسرى'
    ],
    traineeManualEn: `SA'KA OPERATOR TRAINING DIRECTIVE 01.1:
1. SQUAD MOVEMENT: Maintain 5-10m dispersion based on terrain. Keep weapons oriented at assigned sectors.
2. CONTACT DRILL: On incoming fire, drop immediately, seek hard cover, orient to threat, and call out: DISTANCE - DIRECTION - DESCRIPTION.
3. RADIO DISCIPLINE: Transmit only on assigned platoon frequencies using NATO phonetic alphabet and brevity codes.`,
    traineeManualAr: `دليل المتدرب - توجيهات الصاعقة 01.1:
1. تحرك التشكيل: الحفاظ على تباعد 5 إلى 10 أمتار حسب طبيعة الأرض، وتوجيه السلاح نحو القطاع المحدد لكل فرد.
2. تكتيك الاشتباك: فور التعرض للنيران، انبطح فوراً خلف ساتر صلب، حدد مصدر التهديد وبلّغ: المسافة - الاتجاه - الوصف.
3. الانضباط اللاسلكي: استخدم التردد المخصص للفصيلة فقط، والتزم بالاختصارات العسكرية وأكواد النداء الرسمية.`,
    instructorGuideEn: 'Verify trainee reacts within 3 seconds of live fire ambush. Ensure proper TCCC tourniquet placement under 45 seconds.',
    instructorGuideAr: 'تأكد من استجابة المتدرب خلال 3 ثوانٍ من بدء الكمين. فحص تطبيق رباط الشريان التكتيكي في أقل من 45 ثانية.'
  },
  {
    id: '01.2',
    code: '01.2',
    title: 'Land Navigation',
    titleAr: 'الملاحة البرية وتحديد المواقع',
    category: 'Core Operator Training | Foundation',
    categoryAr: 'تدريب المقاتل الأساسي | التأسيس',
    manualVersion: 'Manual v1.4',
    award: 'Certified pointman for wilderness navigation and recon patrols.',
    awardAr: 'شهادة دليل طليعة معتمد للملاحة في المناطق الوعرة ودوريات الاستطلاع.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Topographic map contour interpretation',
      'Lensatic compass resection and triangulation',
      'Pace count calibration across varied terrain',
      'Dead reckoning navigation in zero visibility',
      'Micro-terrain route planning and dead zones'
    ],
    criticalTasksAr: [
      'قراءة خطوط الكنتور والتضاريس على الخرائط الطبوغرافية',
      'استخدام البوصلة التكتيكية والتثليث الميداني',
      'معايرة عداد الخطوات عبر مختلف التضاريس',
      'الملاحة التقديرية في ظروف الرؤية المنعدمة',
      'تخطيط مسارات التحرك عبر المناطق الميتة تكتيكياً'
    ],
    traineeManualEn: `LAND NAVIGATION STANDARDS:
- Maintain 100m pace count accuracy within ±3m.
- Cross-reference terrain relief with GPS coordinates prior to departing Rally Point.`,
    traineeManualAr: `معايير الملاحة البرية:
- الالتزام بمعدل دقة عداد الخطوات لكل 100 متر بهامش خطأ لا يتجاوز ±3 أمتار.
- مطابقة تضاريس الأرض مع إحداثيات الـ GPS قبل مغادرة نقطة التجمع.`,
    instructorGuideEn: 'Evaluate night navigation course without GPS assistance. Trainee must hit all 4 checkpoints within allotted time.',
    instructorGuideAr: 'اختبار مسار ملاحة ليلية بدون أجهزة GPS. يجب الوصول لجميع النقاط الأربع في الوقت المحدد.'
  },
  {
    id: '01.3',
    code: '01.3',
    title: 'Fieldcraft and Patrol',
    titleAr: 'فنون الميدان وتسيير الدوريات',
    category: 'Infantry & Tactical Operations',
    categoryAr: 'المشاة والعمليات التكتيكية',
    manualVersion: 'Manual v2.0',
    award: 'Certified for deep reconnaissance and stealth patrols.',
    awardAr: 'معتمد لعمليات الاستطلاع العميق والدوريات الخفية خلف خطوط العدو.',
    prerequisites: '01.2 Land Navigation',
    prerequisitesAr: '01.2 الملاحة البرية وتحديد المواقع',
    prerequisiteIds: ["01.2"],
    criticalTasks: [
      'Natural & artificial camouflage discipline',
      'Establishing Patrol Base and security halts',
      'Linear danger area crossing drills',
      'Silent hand and arm signals coordination'
    ],
    criticalTasksAr: [
      'الانضباط في التمويه الطبيعي والصناعي',
      'إنشاء قاعدة دوريات وتأمين وقفات الحراسة',
      'عبور المناطق المكشوفة والخطرة تكتيكياً',
      'التنسيق بالإشارات اليدوية الصامتة'
    ],
    traineeManualEn: 'Never silhouette against the skyline. Use terrain masking at all times.',
    traineeManualAr: 'تجنب الظهور في الأفق المكشوف، واستخدم حجب التضاريس طوال فترة التحرك.',
    instructorGuideEn: 'Assess light & noise discipline during dusk harbor establishment.',
    instructorGuideAr: 'تقييم انضباط التعتيم والصمت خلال إقامة الملاذ الميداني عند الغسق.'
  },
  {
    id: '01.4',
    code: '01.4',
    title: 'Advanced CQB',
    titleAr: 'القتال في المناطق المبنية (CQB)',
    category: 'Urban Combat Specialization',
    categoryAr: 'تخصص حرب المدن',
    manualVersion: 'Manual v2.2',
    award: 'Assault team breacher and clearing specialist.',
    awardAr: 'مقاتل اقتحام وتطهير مبانٍ معتمد في حرب المدن.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Dynamic and stealth room entries',
      'Fatal funnel clearance & corner slicing',
      'Stairwell and corridor security vectors',
      'Selective target discrimination under stress'
    ],
    criticalTasksAr: [
      'اقتحام الغرف الديناميكي والصامت',
      'تطهير مسارات الخطر وتجزئة الزوايا (Corner Slicing)',
      'تأمين السلالم والممرات المغلقة',
      'تمييز الأهداف المعادية عن المدنيين تحت الضغط'
    ],
    traineeManualEn: 'Speed, surprise, and violence of action. Secure corners before processing center room.',
    traineeManualAr: 'السرعة، المباغتة، وحسم الاشتباك. تأمين الزوايا الميتة أولاً قبل التوغل داخل الغرفة.',
    instructorGuideEn: 'Live shoot house evaluation. No friendly fire or missed targets allowed.',
    instructorGuideAr: 'اختبار ميداني في مبنى التدريب بالذخيرة الحية دون أي إصابات ودية.'
  },
  {
    id: '01.5',
    code: '01.5',
    title: 'Night Operations',
    titleAr: 'العمليات الليلية وحرب الظلام',
    category: 'Specialized Tactics',
    categoryAr: 'تكتيكات متخصصة',
    manualVersion: 'Manual v1.3',
    award: 'Night-vision goggles (NVG) and IR laser specialist.',
    awardAr: 'متخصص في تشغيل مناظير الرؤية الليلية وأشعة الليزر تحت الحمراء.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Passive vs Active IR laser engagement',
      'NVG depth perception & weapon zeroing',
      'Illumination flare and thermal coordination'
    ],
    criticalTasksAr: [
      'الاشتباك بالليزر تحت الأحمر الإيجابي والسلبي',
      'التصويب بمناظير الرؤية الليلية وضبط صفر السلاح',
      'التنسيق مع قنابل التنوير والكواشف الحرارية'
    ],
    traineeManualEn: 'Minimize active IR emitters in peer threat environments to avoid counter-detection.',
    traineeManualAr: 'تقليل البث النشط للأشعة تحت الحمراء لتفادي رصد العدو.',
    instructorGuideEn: 'Verify trainee can zero laser and engage moving targets in pitch-black conditions.',
    instructorGuideAr: 'التحقق من قدرة المتدرب على إصابة أهداف متحركة في الظلام الدامس.'
  },
  {
    id: '01.6',
    code: '01.6',
    title: 'SERE Qualification',
    titleAr: 'تأهيل البقاء والهروب والمقاومة (SERE)',
    category: 'Special Forces Elite',
    categoryAr: 'نخبة القوات الخاصة',
    manualVersion: 'Manual v2.5',
    award: 'Certified SERE Specialist (Survival, Evasion, Resistance, Escape).',
    awardAr: 'شهادة تخصص البقاء والهروب والمقاومة المعتمدة.',
    prerequisites: '01.3 Fieldcraft and Patrol',
    prerequisitesAr: '01.3 فنون الميدان وتسيير الدوريات',
    prerequisiteIds: ["01.3"],
    criticalTasks: [
      'Wilderness water sourcing and purification',
      'Evasion corridor exploitation',
      'Interrogation resistance protocols',
      'Emergency extraction signaling'
    ],
    criticalTasksAr: [
      'تنقية مصادر المياه الميدانية والبقاء في البيئات القاسية',
      'استغلال ممرات الهروب الخفية وتفادي الدوريات',
      'بروتوكولات الصمود ومقاومة الاستجواب',
      'إرسال إشارات الإخلاء والإنقاذ الطارئ'
    ],
    traineeManualEn: 'Survive with minimal equipment. Adhere to Code of Conduct under capture simulation.',
    traineeManualAr: 'البقاء بأقل المعدات الممكنة والتمسك بميثاق الشرف العسكري.',
    instructorGuideEn: '72-hour wilderness evasion exercise with active hunter-tracker teams.',
    instructorGuideAr: 'تمرين هروب ميداني لمدة 72 ساعة في بيئة جبلية تحت مطاردة مستمرة.'
  },
  {
    id: '01.7',
    code: '01.7',
    title: 'Air Mobility Familiarisation',
    titleAr: 'التدريب على التحركات الجوية والمروحيات',
    category: 'Aviation Support & Air Assault',
    categoryAr: 'الإسناد الجوي والاقتحام الجوي',
    manualVersion: 'Manual v1.2',
    award: 'Heliborne and tactical air insertion operator.',
    awardAr: 'مقاتل إنزال جوي وتدخل سريع عبر المروحيات.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Helicopter landing zone (HLZ) clearance and marking',
      'Fast-rope insertion and extraction (FRIES)',
      'Hot LZ disembarkation & 360-degree perimeter security'
    ],
    criticalTasksAr: [
      'تجهيز وتأمين مهابط المروحيات الميدانية وتحديدها',
      'الإنزال بالحبال السريعة (Fast-Rope)',
      'النزول السريع تحت النيران وتأمين محيط دائري 360 درجة'
    ],
    traineeManualEn: 'Keep head down on rotor approach. Clear cargo deck within 4 seconds of touchdown.',
    traineeManualAr: 'انحنِ دائماً عند الاقتراب من المروحية، وأخلِ المقصورة خلال 4 ثوانٍ من الهبوط.',
    instructorGuideEn: 'Assess fast-rope descent from 50ft with full tactical pack.',
    instructorGuideAr: 'تقييم النزول بالحبل السريع من ارتفاع 50 قدماً بالحمولة التكتيكية الكاملة.'
  },
  {
    id: '01.8',
    code: '01.8',
    title: 'Ground Mobility Familiarisation',
    titleAr: 'حرب المدرعات والتحركات الآلية',
    category: 'Mechanized Warfare',
    categoryAr: 'الحرب الميكانيكية والمدرعات',
    manualVersion: 'Manual v1.1',
    award: 'Mechanized combat operator and mounted patrol driver.',
    awardAr: 'مقاتل دروع ودوريات استطلاع آلية معتمد.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Convoy spacing and ambush reaction drills',
      'Vehicle bail-out and herringbone defensive posture',
      'Mounted weapon platform operation and stabilization'
    ],
    criticalTasksAr: [
      'إدارة مسافات القوافل والرد على الكمائن الموجهة',
      'الإخلاء السريع للمركبة واتخاذ تشكيل عظمة السمكة الدفاعي',
      'تشغيل وتثبيت أسلحة الرشاشات الثقيلة على الآليات'
    ],
    traineeManualEn: 'Never stop in the kill zone. Push vehicle through or establish heavy suppressive fire.',
    traineeManualAr: 'لا تتوقف أبداً في منطقة القتل؛ اخترق للأمام أو افتح نيران قمعية كثيفة.',
    instructorGuideEn: 'Simulated IED strike drill followed by tactical casualty recovery under smoke.',
    instructorGuideAr: 'تمرين محاكاة انفجار عبوة ناسفة وإخلاء المصابين تحت سواتر الدخان.'
  },
  {
    id: '01.9',
    code: '01.9',
    title: 'Special Forces Qualification',
    titleAr: 'تأهيل الصاعقة والقوات الخاصة المتقدمة',
    category: 'Special Forces Tier 1',
    categoryAr: 'مستوى الصاعقة الأول',
    manualVersion: 'Manual v3.0',
    award: 'Full Thunderbolt Tier 1 Operator Insignia and Brevet.',
    awardAr: 'شارة ونوط مقاتل الصاعقة المصرية من المستوى الأول.',
    prerequisites: '01.1 through 01.6 Complete',
    prerequisitesAr: 'إتمام المستويات من 01.1 إلى 01.6',
    prerequisiteIds: ["01.1","01.2","01.3","01.4","01.5","01.6"],
    criticalTasks: [
      'Multi-domain infiltration execution',
      'High-value target (HVT) snatch and grab',
      'Complex demolition placement under fire',
      'Autonomous long-range clandestine survival'
    ],
    criticalTasksAr: [
      'تنفيذ عمليات التسلل متعددة المحاور البرية والجوية',
      'القبض على الأهداف عالية الأهمية وتأمينها',
      'زرع النسف والتفجير التكتيكي تحت النيران',
      'البقاء الميداني المستقل لفترات طويلة خلف الخطوط'
    ],
    traineeManualEn: 'Sacrifice, honor, discipline. You represent the tip of the spear of Egyptian Armed Forces.',
    traineeManualAr: 'التضحية، الشرف، والانضباط. أنت تمثل رأس الحربة للقوات المسلحة المصرية.',
    instructorGuideEn: 'Final field comprehensive FTX test. Scored strictly on mission success criteria.',
    instructorGuideAr: 'المشروع التكتيكي النهائي الشامل واختبار الكفاءة القصوى تحت الضغط.'
  },
  {
    id: '02.1',
    code: '02.1',
    title: 'Automatic Rifleman',
    titleAr: 'رامي رشاش آلي تكتيكي',
    category: 'Weapons & Fire Support',
    categoryAr: 'الأسلحة والإسناد الناري',
    manualVersion: 'Manual v1.5',
    award: 'Certified Squad Automatic Weapon (SAW) gunner.',
    awardAr: 'شهادة رامي رشاش خفيف معتمد لدعم الفصيلة.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Sector suppression and burst discipline (3-5 rounds)',
      'Rapid barrel change and stoppage clearance under fire',
      'Final protective line (FPL) range-card preparation'
    ],
    criticalTasksAr: [
      'قمع القطاعات النارية والتحكم في الدفعات (3-5 طلقات)',
      'التبديل السريع لسبطانة السلاح وإصلاح الأعطال تحت النيران',
      'إعداد بطاقة المدى وخط الحماية النهائي (FPL)'
    ],
    traineeManualEn: 'You are the base of fire for your fireteam. Suppress enemy to allow flankers to maneuver.',
    traineeManualAr: 'أنت قاعدة النيران الأساسية لفريقك؛ اقمع العدو لتتيح لباقي الأفراد المناورة.',
    instructorGuideEn: 'Evaluate suppression efficiency against fortified bunker targets at 400m.',
    instructorGuideAr: 'تقييم كفاءة التثبيت الناري ضد دشم محصنة على مسافة 400 متر.'
  },
  {
    id: '02.2',
    code: '02.2',
    title: 'Grenadier',
    titleAr: 'قاذف قنابل تكتيكي',
    category: 'Weapons & Fire Support',
    categoryAr: 'الأسلحة والإسناد الناري',
    manualVersion: 'Manual v1.4',
    award: 'Under-barrel grenade launcher (UGL) qualified.',
    awardAr: 'معتمد قاذف قنابل ملحق على البندقية الآلية.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'High-angle indirect trajectory estimation',
      'Defilade target engagement at 150m-350m',
      'Smoke screening and illumination round deployment'
    ],
    criticalTasksAr: [
      'حساب زوايا الإطلاق المنحنية والمسارات غير المباشرة',
      'ضرب الأهداف خلف الحواجز من مسافات 150 إلى 350 متراً',
      'إطلاق قنابل الدخان وقذائف التنوير التكتيكية'
    ],
    traineeManualEn: 'Target window apertures and reverse slopes to eliminate entrenched threats.',
    traineeManualAr: 'استهدف فتحات النوافذ وخلف المرتفعات لتحييد التحصينات المعادية.',
    instructorGuideEn: 'Target precision test: 3 direct hits on window openings within 60 seconds.',
    instructorGuideAr: 'اختبار دقة الإصابة: 3 إصابات مباشرة داخل نوافذ على مسافة 200م.'
  },
  {
    id: '02.3',
    code: '02.3',
    title: 'Anti-Tank Operator',
    titleAr: 'رامي صواريخ مضادة للدروع',
    category: 'Heavy Weapons',
    categoryAr: 'الأسلحة الثقيلة ومكافحة الدروع',
    manualVersion: 'Manual v2.0',
    award: 'RPG-7, Kornet, and modern ATGM operator badge.',
    awardAr: 'شارة مشغل صواريخ مضادة للدروع وقواذف RPG وكورنيت.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Backblast zone verification and clearance safety',
      'Lead angle calculation on moving armored hulls',
      'Weak-point targeting (turret ring, engine bay, optics)'
    ],
    criticalTasksAr: [
      'تأمين منطقة اللهب الخلفي للصاروخ (Backblast Area)',
      'حساب زاوية التقاطع والسبق للآليات المدرعة المتحركة',
      'استهداف نقاط الضعف في الدبابات (حلقة البرج، المحرك، البصريات)'
    ],
    traineeManualEn: 'CLEAR BACKBLAST! Never fire from enclosed confined spaces without soft-launch munitions.',
    traineeManualAr: 'احذر اللهب الخلفي! لا تطلق من داخل غرف مغلقة دون ذخائر إطلاق ناعم.',
    instructorGuideEn: 'Score 2 kills out of 2 launches on moving T-72 tank targets at 600m.',
    instructorGuideAr: 'تحقيق إصابتين ناجحتين من أصل إطلاقين ضد أهداف متحركة على مسافة 600م.'
  },
  {
    id: '02.4',
    code: '02.4',
    title: 'MANPADS Operator',
    titleAr: 'مشغل دفاع جوي محمول على الكتف',
    category: 'Air Defense',
    categoryAr: 'الدفاع الجوي الميداني',
    manualVersion: 'Manual v1.3',
    award: 'Igla / Stinger air defense specialist.',
    awardAr: 'متخصص دفاع جوي وصواريخ إيغلا وستينغر.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Visual aircraft identification (friend or foe)',
      'IR seeker cooling and tone acquisition lock',
      'Lead pursuit and missile engagement envelopes'
    ],
    criticalTasksAr: [
      'التمييز البصري للطائرات المعادية والصديقة (IFF)',
      'تبريد رأس الصاروخ واكتساب نغمة الإغلاق الحراري',
      'حساب مظلة وزاوية الاشتباك المناسبة مع المقاتلات'
    ],
    traineeManualEn: 'Wait for solid tone lock. Avoid firing directly into the sun or heavy flare clusters.',
    traineeManualAr: 'انتظر نغمة الإغلاق التام، وتجنب الإطلاق باتجاه قرص الشمس أو المشاعل الحرارية الكثيفة.',
    instructorGuideEn: 'Engage fast low-altitude attack jet profile in simulator.',
    instructorGuideAr: 'الاشتباك مع مقاتلة نفاثة منخفضة الارتفاع في جهاز المحاكاة بنجاح.'
  },
  {
    id: '02.5',
    code: '02.5',
    title: 'Marksman',
    titleAr: 'قناص المشاة التكتيكي (DMR)',
    category: 'Precision Fire',
    categoryAr: 'الرماية الدقيقة والقنص',
    manualVersion: 'Manual v2.1',
    award: 'Designated Marksman Rifle (DMR) qualification.',
    awardAr: 'شهادة رامي دقيق معتمد لبندقية القنص التكتيكية.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Wind drift and ballistic drop calculation using Mil-Dot',
      'Spotter communication and target range estimation',
      'Cold-bore first-round impact at 600m+'
    ],
    criticalTasksAr: [
      'حساب انحراف الرياح وهبوط الرصاصة بنظام Mil-Dot',
      'التنسيق مع الراصد وتقدير المسافات بدقة',
      'إصابة الطلقة الأولى القاتلة من ماسورة باردة على 600م+'
    ],
    traineeManualEn: 'Control your breathing. Squeeze trigger between heartbeats. Respect wind call.',
    traineeManualAr: 'تحكم في تنفسك، واضغط الزناد بين نبضات القلب، والتزم بتقديرات سرعة الرياح.',
    instructorGuideEn: '5-round group within 1 MOA at 500m under crosswind conditions.',
    instructorGuideAr: 'تجميع 5 طلقات بنطاق 1 MOA على مسافة 500 متر تحت رياح جانبية.'
  },
  {
    id: '02.6',
    code: '02.6',
    title: 'Weapons Specialist',
    titleAr: 'متخصص تسليح وصيانة ميدانية',
    category: 'Weapons & Armory',
    categoryAr: 'التسليح والصيانة الميدانية',
    manualVersion: 'Manual v1.8',
    award: 'Unit Armorer and foreign weapons qualification.',
    awardAr: 'معتمد خبير تسليح وأسلحة أجنبية وغنائم حربية.',
    prerequisites: '02.1 through 02.3 Complete',
    prerequisitesAr: 'إتمام المستويات 02.1 إلى 02.3',
    prerequisiteIds: ["02.1","02.2","02.3"],
    criticalTasks: [
      'Complete field strip of 10+ modern assault rifles & LMGs',
      'Headspace & timing calibration for heavy machine guns',
      'Foreign munitions identification and safe handling'
    ],
    criticalTasksAr: [
      'الفك والتركيب الميداني الكامل لأكثر من 10 بنادق ورشاشات',
      'معايرة المسافة وتوقيت الإطلاق للرشاشات الثقيلة عيار 0.50',
      'فحص الذخائر الأجنبية المجهولة والتعامل الآمن معها'
    ],
    traineeManualEn: 'Proper lubrication and maintenance guarantees life in sandy environments.',
    traineeManualAr: 'التزييت والتنظيف المنتظم يضمن عمل السلاح بكفاءة في البيئات الصحراوية.',
    instructorGuideEn: 'Blindfolded strip and assembly of AK-47 and M4 within 90 seconds.',
    instructorGuideAr: 'فك وتركيب بندقيتي AK-47 و M4 معصوب العينين خلال 90 ثانية.'
  },
  {
    id: '03.1',
    code: '03.1',
    title: 'Combat Medic',
    titleAr: 'مسعف عمليات وميدان معتمد (TCCC)',
    category: 'Medical & Survival',
    categoryAr: 'الطب الميداني والإسعاف',
    manualVersion: 'Manual v3.2',
    award: 'Tactical Combat Casualty Care (TCCC) Badge.',
    awardAr: 'شارة الطب الميداني ورعاية المصابين تحت النيران (TCCC).',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Care Under Fire (CUF) and rapid tourniquet application',
      'Tactical Field Care (TFC): chest seals & needle decompression',
      'MASCAL triage prioritization and MEDEVAC nine-line dispatch'
    ],
    criticalTasksAr: [
      'الإسعاف تحت النيران والتثبيت الفوري لأربطة الشرايين',
      'علاج انسداد القصبة الهوائية وتفريغ استرواح الصدر بالإبرة',
      'فرز الإصابات الجماعية وإرسال بلاغ الإخلاء الطبي 9-Line'
    ],
    traineeManualEn: 'Good medicine can sometimes be bad tactics. Return fire and win firefight before rendering aid.',
    traineeManualAr: 'العلاج الجيد قد يكون تكتيكاً خاطئاً إن كان تحت الرصاص؛ اقضِ على التهديد أولاً ثم ابدأ الإسعاف.',
    instructorGuideEn: 'Perform needle chest decompression and IV fluid push on simulated casualty under siren alert.',
    instructorGuideAr: 'تطبيق تفريغ الصدر وتركيب محاليل وريدية لمصاب في بيئة ضوضاء واشتباك.'
  },
  {
    id: '03.2',
    code: '03.2',
    title: 'Military Engineer',
    titleAr: 'مهندس عسكري وتحصينات ميدانية',
    category: 'Combat Engineering',
    categoryAr: 'الهندسة العسكرية والموانع',
    manualVersion: 'Manual v2.0',
    award: 'Combat Sapper and field fortifier qualification.',
    awardAr: 'شهادة مقاتل مهندسي وسد موانع وتحصينات ميدانية.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Obstacle breaching and anti-tank ditch clearance',
      'Fortified bunker and trench line construction',
      'Bridge demolition charge calculations'
    ],
    criticalTasksAr: [
      'فتح الثغرات وتطهير خنادق الموانع المضادة للدبابات',
      'بناء الدشم والتحصينات الميدانية وسواتر الحماية',
      'حساب عبوات النسف الهندسي للجسور والمنشآت'
    ],
    traineeManualEn: 'Measure twice, detonate once. Calculate P-value for timber and steel cutting.',
    traineeManualAr: 'احسب حساباتك بدقة قبل النسف؛ احسب كمية الشحنات لقطع الحديد والخرسانة المسلحة.',
    instructorGuideEn: 'Construct defensible observation point with sandbags and razor wire in under 20 mins.',
    instructorGuideAr: 'بناء نقطة مراقبة محصنة بالسواتر الرملية والأسلاك الشائكة في 20 دقيقة.'
  },
  {
    id: '03.3',
    code: '03.3',
    title: 'EOD Specialist',
    titleAr: 'خبير إبطال مفعول المتفجرات (EOD)',
    category: 'Explosive Ordnance',
    categoryAr: 'المتفجرات والعبوات الناسفة',
    manualVersion: 'Manual v3.1',
    award: 'Master Explosive Ordnance Disposal (EOD) Badge.',
    awardAr: 'شارة خبير تفكيك وإبطال مفعول العبوات الناسفة (EOD).',
    prerequisites: '03.2 Military Engineer',
    prerequisitesAr: '03.2 مهندس عسكري وتحصينات ميدانية',
    prerequisiteIds: ["03.2"],
    criticalTasks: [
      'IED detection using metal detectors & ground radar',
      'Disarming pressure plates, tripwires, and RCIED receivers',
      'Controlled disposal and explosive shape-charge neutralization'
    ],
    criticalTasksAr: [
      'كشف العبوات الناسفة بالأجهزة الحثية والرادار الأرضي',
      'تفكيك الدواسات، والأسلاك الشركية، ودوائر التفجير اللاسلكي',
      'إجراء التفجير الخاضع للسيطرة وتحييد العبوات بالشحنات الموجهة'
    ],
    traineeManualEn: 'Initial mistake is your final mistake. Treat every wire as energized until counter-jammed.',
    traineeManualAr: 'الخطأ الأول هو الخطأ الأخير؛ تعامل مع أي سلك على أنه متصل حتى يتم التشويش عليه.',
    instructorGuideEn: 'Safely neutralize 3 complex IED booby traps within designated training lane.',
    instructorGuideAr: 'تفكيك 3 عبوات ناسفة شركية معقدة بنجاح داخل حقل التدريب.'
  },
  {
    id: '03.4',
    code: '03.4',
    title: 'Reconnaissance Operator',
    titleAr: 'مقاتل استطلاع ورصد استراتيجي',
    category: 'Recon & Intelligence',
    categoryAr: 'الاستطلاع والاستخبارات الميدانية',
    manualVersion: 'Manual v2.3',
    award: 'Special Reconnaissance and surveillance brevet.',
    awardAr: 'نوط الاستطلاع الخاص والرصد خلف خطوط العدو.',
    prerequisites: '01.3 Fieldcraft and Patrol',
    prerequisitesAr: '01.3 فنون الميدان وتسيير الدوريات',
    prerequisiteIds: ["01.3"],
    criticalTasks: [
      'Sub-surface hide site construction (Spider hole)',
      'Long-range optical observation and photographic logging',
      'SALT (Size, Activity, Location, Time) intelligence reports'
    ],
    criticalTasksAr: [
      'حفر وتجهيز مخابئ الرصد المخفية تحت الأرض (Spider Hole)',
      'الرصد البصري البعيد والتوثيق الفوتوغرافي لتحركات العدو',
      'إعداد تقارير الاستخبارات التكتيكية بصيغة SALT'
    ],
    traineeManualEn: 'See without being seen. Record enemy patrol schedules with exact timestamps.',
    traineeManualAr: 'ارصد دون أن يراك أحد؛ سجل توقيتات دوريات العدو بالثانية والدقيقة.',
    instructorGuideEn: 'Maintain undetected hide site for 48h while enemy motorized patrol passes within 20m.',
    instructorGuideAr: 'البقاء متخفياً لمدة 48 ساعة دون اكتشاف أثناء مرور دوريات معادية على بعد 20 متراً.'
  },
  {
    id: '03.5',
    code: '03.5',
    title: 'Combat Diver',
    titleAr: 'ضفدع بشري / مقاتل صاعقة بحرية',
    category: 'Maritime Operations',
    categoryAr: 'العمليات البحرية والضفادع البشرية',
    manualVersion: 'Manual v2.4',
    award: 'Navy Thunderbolt Combat Swimmer Trident.',
    awardAr: 'نوط الضفدع البشري ومقاتل الصاعقة البحرية.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Closed-circuit rebreather (LAR-V) underwater navigation',
      'Subsurface limpet mine placement on harbor targets',
      'Beach landing site (BLS) reconnaissance and hydrography'
    ],
    criticalTasksAr: [
      'الملاحة تحت الماء بأجهزة التنفس المغلقة الخالية من الفقاعات',
      'زرع الألغام اللاصقة على أهداف وموانئ معادية',
      'استطلاع شواطئ الإنزال وتحليل الأعماق والتيارات البحرية'
    ],
    traineeManualEn: 'No bubbles, no sound, no trace. Secure beachhead before dawn.',
    traineeManualAr: 'بلا فقاعات، بلا صوت، وبلا أثر. تأمين رأس الشاطئ قبل بزوغ الفجر.',
    instructorGuideEn: 'Complete 3km combat fin swim with weapon container and navigate to target dock.',
    instructorGuideAr: 'سباحة تكتيكية لمسافة 3 كم بالزعانف والحمولة والوصول للرصيف المستهدف.'
  },
  {
    id: '03.6',
    code: '03.6',
    title: 'Drone Operator',
    titleAr: 'طيار مسيرات استطلاع وهجوم (UAV)',
    category: 'Unmanned Systems',
    categoryAr: 'الأنظمة المسيرة والدرونز',
    manualVersion: 'Manual v2.0',
    award: 'Tactical UAS Remote Pilot Wings.',
    awardAr: 'شارة طيار مسيرات واستطلاع جوي بدون طيار.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Micro-drone deployment from cover under 60 seconds',
      'Target coordinates extraction and real-time laser designation',
      'FPV loitering munition strike execution'
    ],
    criticalTasksAr: [
      'إطلاق طائرة مسيرة صغيرة من الساتر في أقل من 60 ثانية',
      'استخراج إحداثيات الأهداف وإضاءتها بالليزر للطيران المقاتل',
      'توجيه مسيرات الانتحار FPV بدقة متناهية نحو الأهداف'
    ],
    traineeManualEn: 'Maintain telemetry security. Change launch locations to prevent artillery triangulations.',
    traineeManualAr: 'حافظ على أمن إشارة البث؛ غيّر مكان إطلاق الدرون فوراً لتفادي رصد مدفعية العدو.',
    instructorGuideEn: 'Direct hit on simulated radar dish using FPV suicide drone in obstacle course.',
    instructorGuideAr: 'إصابة مباشرة لهوائي رادار بمسيرة FPV عبر مسار حواجز ومناورة.'
  },
  {
    id: '04.1',
    code: '04.1',
    title: 'Artillery Operator',
    titleAr: 'مدفعية ميدانية وهاونات ثقيلة',
    category: 'Indirect Fire Support',
    categoryAr: 'الإسناد الناري غير المباشر',
    manualVersion: 'Manual v1.7',
    award: 'Master Field Gunner qualification.',
    awardAr: 'شهادة رامي مدفعية وهاون ميداني معتمد.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Sight alignment and elevation bubble calibration',
      'Charge selection and shell fuse configuration (PD, VT, Delay)',
      'Battery fire-mission execution: Fire for Effect (FFE)'
    ],
    criticalTasksAr: [
      'محاذاة الموازين وضبط زوايا الارتفاع والسمت للهاون',
      'اختيار حشوات الدفع وتجهيز صمامات القذائف (لحظي، تقاربي، تأخير)',
      'تنفيذ رمايات البطارية المركزة (Fire for Effect)'
    ],
    traineeManualEn: 'Check bore sight before every battery volley. Verify firing tables against weather baro.',
    traineeManualAr: 'افحص استقامة الماسورة قبل كل رشقة؛ وطابق جداول الرماية مع الضغط الجوي.',
    instructorGuideEn: 'Deliver 6 rounds of 81mm mortar on target grid within 90 seconds.',
    instructorGuideAr: 'إسقاط 6 قذائف هاون 81 ملم في إحداثية الهدف خلال 90 ثانية.'
  },
  {
    id: '04.2',
    code: '04.2',
    title: 'Forward Observer',
    titleAr: 'راصد نيران وموجه مدفعية أمامي (FO)',
    category: 'Target Acquisition',
    categoryAr: 'توجيه الضربات ورصد النيران',
    manualVersion: 'Manual v2.2',
    award: 'Certified Joint Fires Observer (JFO).',
    awardAr: 'شهادة راصد نيران مشتركة وتوجيه مدفعية وطيران (JFO).',
    prerequisites: '01.2 Land Navigation',
    prerequisitesAr: '01.2 الملاحة البرية وتحديد المواقع',
    prerequisiteIds: ["01.2"],
    criticalTasks: [
      'Call for Fire (CFF) format transmission in 3 transmissions',
      'Bracketing adjustments (Drop 200, Add 100, Fire for Effect)',
      'Danger-close fire clearance within 600m of friendly lines'
    ],
    criticalTasksAr: [
      'إرسال نداء طلب النيران (CFF) على 3 مراحل قياسية',
      'تصحيح مسار القذائف (Drop 200, Add 100, Fire for Effect)',
      'إدارة نيران الخطر القريب (Danger Close) قرب القوات الصديقة'
    ],
    traineeManualEn: 'Observer target line is your reference. Accuracy saves friendly lives.',
    traineeManualAr: 'خط الراصد إلى الهدف هو مرجعك؛ دقة إحداثياتك تنقذ أرواح زملائك.',
    instructorGuideEn: 'Call effective artillery strike on moving enemy armor column in under 2 minutes.',
    instructorGuideAr: 'طلب وتوجيه ضربة مدفعية فعالة على رتل مدرع متحرك خلال دقيقتين.'
  },
  {
    id: '04.3',
    code: '04.3',
    title: 'Combat Controller',
    titleAr: 'مراقب قتال جوي وتوجيه مقاتلات (JTAC)',
    category: 'Close Air Support',
    categoryAr: 'توجيه الدعم الجوي القريب (JTAC)',
    manualVersion: 'Manual v3.0',
    award: 'Joint Terminal Attack Controller (JTAC) Badge.',
    awardAr: 'شارة موجه مقاتلات وهجوم جوي أرضي نهائي (JTAC).',
    prerequisites: '04.2 Forward Observer',
    prerequisitesAr: '04.2 راصد نيران وموجه مدفعية أمامي',
    prerequisiteIds: ["04.2"],
    criticalTasks: [
      '9-Line Close Air Support (CAS) briefing transmission',
      'Laser target designation and Infrared Pointer talk-on',
      'Battle damage assessment (BDA) logging and sortie clearance'
    ],
    criticalTasksAr: [
      'إرسال إحداثيات وبيانات الـ 9-Line للدعم الجوي القريب',
      'إضاءة الأهداف بالليزر وتوجيه الطيار عبر مؤشر الأشعة تحت الحمراء',
      'تقييم الأضرار الميدانية (BDA) وإعطاء إذن الهجوم النهائي للطيار'
    ],
    traineeManualEn: 'CLEARED HOT is given only when target is confirmed and friendlies are verified outside blast radius.',
    traineeManualAr: 'أمر "CLEARED HOT" لا يُعطى للطيار إلا بعد تأكيد خلو موقع القصف من أي قوات صديقة.',
    instructorGuideEn: 'Coordinate fixed-wing airstrike with laser-guided bomb while taking active fire.',
    instructorGuideAr: 'توجيه ضربة مقاتلة بقنبلة موجهة بالليزر أثناء الاشتباك بالأسلحة الخفيفة.'
  },
  {
    id: '05.1',
    code: '05.1',
    title: 'Combat Parachutist',
    titleAr: 'قفز مظلي عسكري تكتيكي (Static Line)',
    category: 'Airborne Operations',
    categoryAr: 'الإنزال المظلي والعمليات المحمولة جواً',
    manualVersion: 'Manual v1.5',
    award: 'Basic Egyptian Airborne Parachutist Wings.',
    awardAr: 'جناح المظلات والإنزال التكتيكي للقوات المسلحة المصرية.',
    prerequisites: '01.1 Basic Combat Qualification',
    prerequisitesAr: '01.1 التأهيل القتالي الأساسي',
    prerequisiteIds: ["01.1"],
    criticalTasks: [
      'Static-line exit from C-130 / Il-76 transport aircraft',
      'Parachute canopy control and obstacle avoidance',
      'Parachute Landing Fall (PLF) execution without injury',
      'Drop Zone (DZ) weapon unpacking and assembly in 30 seconds'
    ],
    criticalTasksAr: [
      'القفز بالمظلة بأسلوب الحبل الثابت من طائرات C-130 و Il-76',
      'التحكم في قبة المظلة وتفادي الموانع والتصادم',
      'تنفيذ هبوط امتصاص الصدمات (PLF) باحترافية لتفادي الإصابات',
      'تجهيز السلاح وحزم المظلة على أرض منطقة الإسقاط في 30 ثانية'
    ],
    traineeManualEn: 'Feet and knees together, eyes on the horizon. Ready to fight upon touching ground.',
    traineeManualAr: 'ضم القدمين والركبتين، انظر للأفق، وكن جاهزاً للاشتباك فور ملامسة الأرض.',
    instructorGuideEn: 'Assess 5 successful daylight and night combat jumps with full loadout.',
    instructorGuideAr: 'تقييم 5 قفزات عسكرية ناجحة نهارية وليلية بالحمولة القتالية.'
  },
  {
    id: '05.2',
    code: '05.2',
    title: 'Military Free-Fall',
    titleAr: 'قفز حر عسكري (HALO / HAHO)',
    category: 'High Altitude Airborne',
    categoryAr: 'القفز الحر من ارتفاعات شاهقة',
    manualVersion: 'Manual v2.3',
    award: 'HALO/HAHO Master Parachutist Gold Wings.',
    awardAr: 'الجناح الذهبي للقفز الحر العسكري التسللي (HALO / HAHO).',
    prerequisites: '05.1 Combat Parachutist',
    prerequisitesAr: '05.1 قفز مظلي عسكري تكتيكي',
    prerequisiteIds: ["05.1"],
    criticalTasks: [
      'HALO (High Altitude Low Opening) exit at 25,000+ feet',
      'HAHO (High Altitude High Opening) 30km stealth cross-border glide',
      'Oxygen console management and altimeter baro calibration'
    ],
    criticalTasksAr: [
      'القفز من ارتفاع 25,000 قدم مع فتح المظلة على ارتفاع منخفض (HALO)',
      'القفز بفتح المظلة على ارتفاع شاهق للتسلل عبر الحدود لمسافة 30 كم (HAHO)',
      'إدارة أجهزة الأكسجين ومقياس الارتفاع البارومتري في درجات التجمد'
    ],
    traineeManualEn: 'Maintain body symmetry in terminal velocity free-fall. Monitor altimeter constantly.',
    traineeManualAr: 'حافظ على توازن جسدك أثناء السقوط الحر بسرعة 200 كم/س، وراقب مقياس الارتفاع باستمرار.',
    instructorGuideEn: 'Land within 15 meters of target marker after night HAHO 20km glide.',
    instructorGuideAr: 'الهبوط في دائرة قطرها 15 متراً بعد انزلاق مظلي ليلي لمسافة 20 كم.'
  },
  {
    id: '05.3',
    code: '05.3',
    title: 'Jumpmaster',
    titleAr: 'قائد قفز جوي ومسؤول إسقاط المظليين',
    category: 'Airborne Command',
    categoryAr: 'قيادة الإسقاط الجوي',
    manualVersion: 'Manual v2.8',
    award: 'Certified Military Jumpmaster qualification.',
    awardAr: 'شهادة كبير مسؤولي القفز الجوي وإدارة الطائرة.',
    prerequisites: '05.2 Military Free-Fall',
    prerequisitesAr: '05.2 قفز حر عسكري',
    prerequisiteIds: ["05.2"],
    criticalTasks: [
      'Aircraft jump door inspection and wind drift safety calculation',
      'Jumpmaster personnel inspection (JMPI) of 20+ operators',
      'Emergency static-line hang-up extraction protocols'
    ],
    criticalTasksAr: [
      'فحص أبواب الطائرة وحساب نقطة الإسقاط وتأثير الرياح (CARP)',
      'الفحص الأمني الدقيق لمظلات وتجهيزات أكثر من 20 مقاتلاً (JMPI)',
      'التعامل الفوري مع حالات تعلق المظلي خارج الطائرة في الجو'
    ],
    traineeManualEn: 'You hold their lives in your hands. Never rush a safety inspection.',
    traineeManualAr: 'أرواح المقاتلين بين يديك؛ لا تتهاون ولا تتسرع أبداً في فحص الأمان.',
    instructorGuideEn: 'Execute full aircraft briefing, JMPI inspection, and jump sequence under simulated engine fault.',
    instructorGuideAr: 'إدارة عملية قفز كاملة وفحص أمان تحت محاكاة عطل طارئ في المحرك.'
  },
  {
    id: '06.1',
    code: '06.1',
    title: 'Fireteam Leader',
    titleAr: 'قائد جماعة صاعقة (Fireteam Leader)',
    category: 'Tactical Leadership',
    categoryAr: 'القيادة التكتيكية الصغرى',
    manualVersion: 'Manual v2.0',
    award: 'Certified Fireteam Leader qualification.',
    awardAr: 'شهادة قائد جماعة صاعقة معتمد.',
    prerequisites: '01.9 Special Forces Qualification',
    prerequisitesAr: '01.9 تأهيل الصاعقة والقوات الخاصة المتقدمة',
    prerequisiteIds: ["01.9"],
    criticalTasks: [
      'Directing fire and movement of 4 operators',
      'Target designation with tracer fire and laser',
      'Ammo, casualty, and equipment (ACE) report generation'
    ],
    criticalTasksAr: [
      'إدارة النيران والحركة التكتيكية لمجموعة من 4 مقاتلين',
      'توجيه أهداف الجماعة بالطلقات الحارقة والليزر',
      'رفع تقرير الذخائر والمصابين والمعدات (ACE Report)'
    ],
    traineeManualEn: 'Lead from the front, make decisions promptly. Keep your men focused.',
    traineeManualAr: 'كن في المقدمة، اتخذ قراراتك بحسم، وحافظ على معنويات وتركيز مقاتليك.',
    instructorGuideEn: 'Lead fireteam assault through active bunker trench system under heavy smoke.',
    instructorGuideAr: 'قيادة هجوم جماعة لاقتحام خنادق ودشم محصنة تحت نيران ودخان مكثف.'
  },
  {
    id: '06.2',
    code: '06.2',
    title: 'Squad Leader',
    titleAr: 'قائد فصيلة صاعقة ميدانية (Squad Leader)',
    category: 'Combat Command',
    categoryAr: 'القيادة والسيطرة الميدانية',
    manualVersion: 'Manual v2.5',
    award: 'Squad Leader Leadership Crest.',
    awardAr: 'شارة قيادة الفصيلة القتالية للصاعقة.',
    prerequisites: '06.1 Fireteam Leader',
    prerequisitesAr: '06.1 قائد جماعة صاعقة',
    prerequisiteIds: ["06.1"],
    criticalTasks: [
      'Commanding two fireteams (8-12 operators) in dynamic combat',
      'Issuing five-paragraph Operations Order (OPORD)',
      'Integrating organic fire support (Machine guns, ATGM, Medics)'
    ],
    criticalTasksAr: [
      'قيادة مجموعتين قتاليتين (8 إلى 12 مقاتلاً) في معركة مفتوحة',
      'إصدار أمر العمليات العسكري ذي البنود الخمسة (OPORD)',
      'دمج أسلحة الدعم والإسناد (الرشاشات، الصواريخ، الإسعاف) بسلاسة'
    ],
    traineeManualEn: 'Clear communications, decisive initiative. Trust your fireteam leaders to execute.',
    traineeManualAr: 'وضوح الأوامر، والمبادأة السريعة؛ ثق في قادة مجموعاتك لتنفيذ خطتك.'
    ,
    instructorGuideEn: 'Coordinate squad-level defense against two waves of superior enemy forces.',
    instructorGuideAr: 'إدارة دفاع فصيلة كاملة ضد موجتين متتاليتين من قوات معادية متفوقة.'
  },
  {
    id: '06.3',
    code: '06.3',
    title: 'Platoon Leader',
    titleAr: 'قائد سرية / عمليات خاصة (Platoon Leader)',
    category: 'Senior Command',
    categoryAr: 'القيادة العليا للعمليات',
    manualVersion: 'Manual v3.0',
    award: 'Staff Officer Command Brevet.',
    awardAr: 'نوط قيادة العمليات الخاصة وهيئة الأركان.',
    prerequisites: '06.2 Squad Leader',
    prerequisitesAr: '06.2 قائد فصيلة صاعقة',
    prerequisiteIds: ["06.2"],
    criticalTasks: [
      'Commanding 30+ operators with multi-domain air & artillery support',
      'De-conflicting friendly fires and airspace control',
      'Strategic coordination with Thunderbolt High Command HQ'
    ],
    criticalTasksAr: [
      'قيادة أكثر من 30 مقاتلاً بالتنسيق مع الدعم الجوي والمدفعي',
      'فض تعارض النيران والسيطرة على المجال الجوي لمنطقة العمليات',
      'التنسيق الاستراتيجي المباشر مع غرفة عمليات قيادة الصاعقة'
    ],
    traineeManualEn: 'Maintain the operational picture. Keep reserve forces ready for breakthrough.',
    traineeManualAr: 'حافظ على الرؤية الشاملة للمعركة، واحتفظ دائماً بقوة احتياطية للتدخل الحاسم.',
    instructorGuideEn: 'Direct multi-squad night airfield seizure with simulated CAS and helicopter extraction.',
    instructorGuideAr: 'قيادة عملية اقتحام وتأمين مطار عسكري ليلاً مع إخلاء جوي بالمروحيات.'
  },
  {
    id: '07.1',
    code: '07.1',
    title: 'Irregular Warfare and COIN',
    titleAr: 'الحرب غير المتناظرة ومكافحة الإرهاب (COIN)',
    category: 'Counter-Terrorism & Unconventional',
    categoryAr: 'مكافحة الإرهاب والعمليات غير التقليدية',
    manualVersion: 'Manual v3.5',
    award: 'Master Counter-Terrorism & COIN Warfare Dagger.',
    awardAr: 'خنجر الصاعقة التذكاري لمكافحة الإرهاب وحرب العصابات.',
    prerequisites: '01.9 Special Forces Qualification',
    prerequisitesAr: '01.9 تأهيل الصاعقة والقوات الخاصة المتقدمة',
    prerequisiteIds: ["01.9"],
    criticalTasks: [
      'Counter-ambush and raid execution in mountainous terrain',
      'Hostage rescue tactical assault under explosive breach',
      'Intelligence cell infiltration and human source operations'
    ],
    criticalTasksAr: [
      'تنفيذ الإغارات وكسر الكمائن في التضاريس الجبلية الوعرة',
      'عمليات تحرير الرهائن بالاقتحام المتفجر فائق السرعة',
      'اختراق الخلايا المعادية وإدارة المصادر الاستخباراتية الميدانية'
    ],
    traineeManualEn: 'Adaptability is your greatest weapon. Out-think, out-maneuver, and neutralize.',
    traineeManualAr: 'القدرة على التكيف هي سلاحك الأمضى؛ فكّر أسرع من العدو، وناور، واقضِ على الخطر.',
    instructorGuideEn: 'Simulated high-threat hostage rescue scenario in underground bunker complex.',
    instructorGuideAr: 'محاكاة عملية تحرير رهائن فائقة الخطورة داخل مجمع أنفاق وملاجئ محصنة.'
  }
];

// Helper getters for qualification entries
export function getEntryStatus(entry?: QualificationEntry): QualificationStatus {
  if (!entry) return 'locked';
  if (typeof entry === 'string') return entry;
  return entry.status || 'locked';
}

export function getEntryRemarks(entry?: QualificationEntry): string {
  if (!entry || typeof entry === 'string') return '';
  return entry.remarks || '';
}

export function getEntryDevNotes(entry?: QualificationEntry): string {
  if (!entry || typeof entry === 'string') return '';
  return entry.developmentNotes || '';
}

export function getEntryCertifier(entry?: QualificationEntry): string {
  if (!entry || typeof entry === 'string') return '';
  return entry.certifiedBy || '';
}

export function getEntryDate(entry?: QualificationEntry): string {
  if (!entry || typeof entry === 'string') return '';
  return entry.certifiedDate || '';
}

export interface ResolvedModuleStatus {
  status: QualificationStatus;
  missingPrerequisites: { id: string; code: string; title: string; titleAr: string }[];
  isAvailable: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  entry?: QualificationRecordDetail;
}

export function resolveModuleStatus(
  moduleId: string,
  qualMap?: Record<string, QualificationEntry>
): ResolvedModuleStatus {
  const map = qualMap || {};
  const currentEntry = map[moduleId];
  const directStatus = getEntryStatus(currentEntry);

  const entryDetail: QualificationRecordDetail | undefined = 
    currentEntry ? (typeof currentEntry === 'string' ? { status: currentEntry } : currentEntry) : undefined;

  // If already certified / completed
  if (directStatus === 'completed') {
    return {
      status: 'completed',
      missingPrerequisites: [],
      isAvailable: false,
      isCompleted: true,
      isLocked: false,
      entry: entryDetail
    };
  }

  // If explicitly unlocked / available by instructor (Manual Unlock / شيل Lock)
  if (directStatus === 'available') {
    return {
      status: 'available',
      missingPrerequisites: [],
      isAvailable: true,
      isCompleted: false,
      isLocked: false,
      entry: entryDetail
    };
  }

  const mod = QUALIFICATION_MODULES.find(m => m.id === moduleId);
  if (!mod || !mod.prerequisiteIds || mod.prerequisiteIds.length === 0) {
    return {
      status: 'available',
      missingPrerequisites: [],
      isAvailable: true,
      isCompleted: false,
      isLocked: false,
      entry: entryDetail
    };
  }

  // Check all prerequisites
  const missing: { id: string; code: string; title: string; titleAr: string }[] = [];
  for (const prereqId of mod.prerequisiteIds) {
    const prereqStatus = getEntryStatus(map[prereqId]);
    if (prereqStatus !== 'completed') {
      const prereqMod = QUALIFICATION_MODULES.find(m => m.id === prereqId);
      missing.push({
        id: prereqId,
        code: prereqMod?.code || prereqId,
        title: prereqMod?.title || prereqId,
        titleAr: prereqMod?.titleAr || prereqId
      });
    }
  }

  if (missing.length === 0) {
    return {
      status: 'available',
      missingPrerequisites: [],
      isAvailable: true,
      isCompleted: false,
      isLocked: false,
      entry: entryDetail
    };
  }

  return {
    status: 'locked',
    missingPrerequisites: missing,
    isAvailable: false,
    isCompleted: false,
    isLocked: true,
    entry: entryDetail
  };
}

// Helper to calculate completion stats for a member
export function calculateMemberQualifications(qualifications?: Record<string, QualificationEntry>) {
  const map = qualifications || {};
  let completed = 0;
  let available = 0;
  let locked = 0;

  QUALIFICATION_MODULES.forEach(mod => {
    const resolved = resolveModuleStatus(mod.id, map);
    if (resolved.status === 'completed') completed++;
    else if (resolved.status === 'available') available++;
    else locked++;
  });

  const percent = Math.round((completed / QUALIFICATION_MODULES.length) * 100);
  return { completed, available, locked, total: QUALIFICATION_MODULES.length, percent };
}
