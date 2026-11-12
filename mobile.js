/**
 * BE FIT MOBILE APP — Master Application Controller
 * High-Performance Commercial Retail UI (Clean Light Mode)
 * Modules: Reactive Branch Sync, Auth & Auth Guard, Anti-Duplicate Class Booking,
 * Interactive Membership Selection, and Unified Payment Checkout System.
 */

// ==================== STORAGE KEYS & CONSTANTS ====================

const STORAGE_KEY = 'befit_crm_state_v1';
const BRANCH_STORAGE_KEY = 'befit_selected_branch';
const USERS_STORAGE_KEY = 'befit_users';
const CURRENT_USER_KEY = 'befit_current_user';
const CLASSES_STORAGE_KEY = 'befit_mobile_classes_v3';
const TRAINERS_STORAGE_KEY = 'befit_mobile_trainers_v5';
const TRANSACTIONS_KEY = 'befit_mobile_transactions';
const TRANSACTIONS_ALT_KEY = 'befit_transactions';
const CLAIMED_VOUCHERS_KEY = 'befit_claimed_vouchers';
const CLASS_BOOKINGS_KEY = 'befit_class_bookings';
const PT_BOOKINGS_KEY = 'befit_pt_bookings';
const PT_ORDERS_KEY = 'befit_pt_orders';
const SYNC_TS_KEY = 'befit_sync_ts';
const TRIAL_CLAIMS_KEY = 'befit_trial_claims';
const ADMIN_AUTH_KEY = 'befit_admin_auth';

function relativeDateStr(daysOffset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function normalizeBranchName(branchStr) {
  const raw = String(branchStr || '').toLowerCase();
  if (raw.includes('dago')) return 'Dago';
  if (raw.includes('pasirkaliki')) return 'Pasirkaliki';
  if (raw.includes('buah batu') || raw.includes('buahbatu')) return 'Buah Batu';
  return 'Setiabudi';
}

function parseDateLocal(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ==================== 1. BRANCHES & CROWD STATUS ====================

const BRANCHES_DATA = [
  {
    id: 'setiabudi',
    name: 'Be Fit Setiabudi Bandung',
    address: 'Jl. Dr. Setiabudi No. 130, Bandung',
    crowd: 'Low',
    crowdPercentage: 25,
    crowdBg: '#DCFCE7',
    crowdText: '#15803D',
    crowdBorder: '#86EFAC',
    hours: '06:00 – 22:00',
    facilities: ['Gym Area', 'Locker Room', 'Shower', 'Studio A & B', 'Sauna']
  },
  {
    id: 'dago',
    name: 'Be Fit Dago Bandung',
    address: 'Jl. Ir. H. Djuanda No. 45, Dago, Bandung',
    crowd: 'Medium',
    crowdPercentage: 60,
    crowdBg: '#FEF3C7',
    crowdText: '#B45309',
    crowdBorder: '#FDE68A',
    hours: '06:00 – 22:00',
    facilities: ['Gym Area', 'Locker Room', 'Shower', 'Spinning Studio', 'Café Corner']
  },
  {
    id: 'buahbatu',
    name: 'Be Fit Buah Batu Bandung',
    address: 'Jl. Buah Batu No. 212, Bandung',
    crowd: 'High',
    crowdPercentage: 88,
    crowdBg: '#FEE2E2',
    crowdText: '#B91C1C',
    crowdBorder: '#FCA5A5',
    hours: '06:00 – 22:00',
    facilities: ['Heavy Iron Zone', 'Cardio Floor', 'Locker Room', 'Functional Area']
  },
  {
    id: 'pasirkaliki',
    name: 'Be Fit Pasirkaliki Bandung',
    address: 'Jl. Pasirkaliki No. 88, Cicendo, Bandung',
    crowd: 'Low',
    crowdPercentage: 30,
    crowdBg: '#DCFCE7',
    crowdText: '#15803D',
    crowdBorder: '#86EFAC',
    hours: '06:00 – 22:00',
    facilities: ['All Access Gym', 'Locker Room', 'Shower', 'Yoga Studio', 'Recovery Lounge']
  }
];

// ==================== 2. CLASSES DATA (12 ENTERPRISE CLASSES & 6-8 SLOTS DAILY) ====================

const ENTERPRISE_CLASS_CATALOG = [
  {
    typeId: 'bodypump',
    name: 'Les Mills Bodypump',
    category: 'Strength',
    description: 'Latihan beban berirama dengan barbell dan repetisi tinggi untuk membentuk otot kencang, kuat, dan membakar hingga 560 kalori.',
    difficulty: 'Hard',
    room: 'Studio Utama',
    duration: '55 Menit',
    calories: '560 kcal',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop&q=80',
    capacity: 20
  },
  {
    typeId: 'bodycombat',
    name: 'Les Mills Bodycombat',
    category: 'Cardio Martial Arts',
    description: 'Kardio bela diri berintensitas tinggi (boxing, karate, taekwondo, muay thai) membakar kalori tanpa kontak fisik.',
    difficulty: 'Hard',
    room: 'Studio Utama',
    duration: '55 Menit',
    calories: '700 kcal',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop&q=80',
    capacity: 22
  },
  {
    typeId: 'reformer-pilates',
    name: 'Reformer Pilates',
    category: 'Core & Posture',
    description: 'Latihan presisi menggunakan carriage Pilates Reformer untuk stabilitas core, elongasi postur tulang belakang, dan mobilitas sendi.',
    difficulty: 'Medium',
    room: 'Reformer Pilates Studio',
    duration: '50 Menit',
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop&q=80',
    capacity: 12
  },
  {
    typeId: 'vinyasa-yoga',
    name: 'Vinyasa Flow Yoga',
    category: 'Mind & Flexibility',
    description: 'Aliran gerakan dinamis yang menyelaraskan pernapasan ritmis dan postur asana untuk fleksibilitas dan ketenangan pikiran.',
    difficulty: 'Easy',
    room: 'Yoga Shala Studio',
    duration: '60 Menit',
    calories: '320 kcal',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=800&fit=crop&q=80',
    capacity: 18
  },
  {
    typeId: 'rpm-cycling',
    name: 'RPM Indoor Cycling',
    category: 'Cardio Endurance',
    description: 'Bersepeda indoor intensif dengan irama musik upbeat. Latihan daya tahan jantung-paru yang ramah persendian lutut.',
    difficulty: 'Medium',
    room: 'Cycling Arena',
    duration: '45 Menit',
    calories: '620 kcal',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=800&fit=crop&q=80',
    capacity: 20
  },
  {
    typeId: 'zumba',
    name: 'Zumba Fitness Party',
    category: 'Dance Cardio',
    description: 'Pesta kardio berirama musik Latin & pop. Bakar ratusan kalori dengan senyuman dan keceriaan bersama teman.',
    difficulty: 'Easy',
    room: 'Studio Utama',
    duration: '50 Menit',
    calories: '480 kcal',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=800&fit=crop&q=80',
    capacity: 25
  },
  {
    typeId: 'muay-thai',
    name: 'Muay Thai Conditioning',
    category: 'Combat Agility',
    description: 'Seni 8 tungkai yang memadukan pukulan, tendangan, knee, dan elbow strike untuk stamina tempur dan kelincahan.',
    difficulty: 'Hard',
    room: 'Combat Ring Area',
    duration: '60 Menit',
    calories: '750 kcal',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=800&fit=crop&q=80',
    capacity: 16
  },
  {
    typeId: 'crossfit-wod',
    name: 'CrossFit WOD',
    category: 'Functional Power',
    description: 'Workout of the Day dengan perpaduan angkat beban olimpiade, senam fungsional, dan kardio intensif terstruktur.',
    difficulty: 'Hard',
    room: 'CrossFit Box',
    duration: '50 Menit',
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=800&fit=crop&q=80',
    capacity: 15
  },
  {
    typeId: 'pound-fit',
    name: 'Pound Fit Workout',
    category: 'Drumstick Cardio',
    description: 'Kardio jam-session energik menggunakan ripstix drumstick berbobot ringan untuk membakar kalori dan meredakan stres.',
    difficulty: 'Medium',
    room: 'Studio Utama',
    duration: '45 Menit',
    calories: '520 kcal',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop&q=80',
    capacity: 22
  },
  {
    typeId: 'trx',
    name: 'TRX Suspension Training',
    category: 'Bodyweight Core',
    description: 'Latihan fungsional memanfaatkan tali suspensi dan gravitasi tubuh untuk menguatkan core dan ketahanan seluruh otot.',
    difficulty: 'Medium',
    room: 'Functional Area',
    duration: '45 Menit',
    calories: '460 kcal',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=800&fit=crop&q=80',
    capacity: 16
  },
  {
    typeId: 'mat-pilates',
    name: 'Mat Pilates & Stretch',
    category: 'Core & Mobility',
    description: 'Penguatan otot inti tubuh mendalam dan peregangan menyeluruh di atas matras untuk postur ideal dan relaksasi.',
    difficulty: 'Easy',
    room: 'Mind & Body Studio',
    duration: '50 Menit',
    calories: '300 kcal',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop&q=80',
    capacity: 18
  },
  {
    typeId: 'hiit-burn',
    name: 'HIIT Metabolic Burn',
    category: 'High-Intensity Intervals',
    description: 'Interval kardio berintensitas ekstrem yang memicu efek Afterburn (EPOC) membakar kalori bahkan setelah selesai latihan.',
    difficulty: 'Hard',
    room: 'HIIT Zone',
    duration: '45 Menit',
    calories: '650 kcal',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=800&fit=crop&q=80',
    capacity: 16
  }
];

// Standard 8 daily time slots: Morning (07:00, 08:30, 10:00), Afternoon (12:15, 16:30), Evening (18:00, 19:15, 20:15)
const CLASS_TIME_SLOTS = [
  '07:00 – 07:50',
  '08:30 – 09:20',
  '10:00 – 10:50',
  '12:15 – 13:00',
  '16:30 – 17:20',
  '18:00 – 18:50',
  '19:15 – 20:05',
  '20:15 – 21:05'
];

const INSTRUCTORS_POOL = [
  'Coach Hari',
  'Coach Maya',
  'Coach Bima',
  'Coach Alex',
  'Coach Sarah',
  'Coach Lia',
  'Coach Dina',
  'Coach Citra',
  'Coach Aby',
  'Coach Kevin',
  'Coach Nadia',
  'Coach Jessica'
];

// Helper: simple deterministic hash for seeded pseudo-random selection
function _seedHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

// Helper to generate dynamic schedules for each branch and date
// Returns 2-4 classes per branch per date (not all 8 slots)
function getClassesForBranch(branchId, dateKey = null) {
  if (!dateKey) dateKey = getTodayDateKey();
  const dateParts = dateKey.split('-');
  const dayNum = (parseInt(dateParts[2]) || 1) + (parseInt(dateParts[1]) || 1) * 31;
  const branchOffsets = { setiabudi: 0, dago: 3, pasirkaliki: 6, buahbatu: 9 };
  const bOffset = branchOffsets[branchId] || 0;

  // Determine how many classes today: 2, 3, or 4 (based on date+branch hash)
  const countSeed = _seedHash(`${branchId}-${dateKey}-count`);
  const classCount = 2 + (countSeed % 3); // 2, 3, or 4

  // Pick which time slot indices to use (shuffle 8 slots, pick first classCount)
  const slotIndices = [0, 1, 2, 3, 4, 5, 6, 7];
  const shuffleSeed = _seedHash(`${branchId}-${dateKey}-shuffle`);
  for (let i = slotIndices.length - 1; i > 0; i--) {
    const j = _seedHash(`${shuffleSeed}-${i}`) % (i + 1);
    [slotIndices[i], slotIndices[j]] = [slotIndices[j], slotIndices[i]];
  }
  const selectedSlots = slotIndices.slice(0, classCount).sort((a, b) => a - b);

  return selectedSlots.map((slotIdx) => {
    const classIdx = (bOffset + dayNum * 3 + slotIdx * 2) % ENTERPRISE_CLASS_CATALOG.length;
    const instIdx = (bOffset + dayNum + slotIdx) % INSTRUCTORS_POOL.length;
    const base = ENTERPRISE_CLASS_CATALOG[classIdx];
    const instructor = INSTRUCTORS_POOL[instIdx];
    const timeSlot = CLASS_TIME_SLOTS[slotIdx];
    const classId = `CLS-${branchId.toUpperCase()}-S${slotIdx + 1}-${base.typeId}`;

    // Vary slotsLeft / pre-booked count deterministically per class per date
    const slotSeed = _seedHash(`${classId}-${dateKey}-slots`);
    const preBooked = slotSeed % (base.capacity + 1); // 0 to capacity (some will be full)

    return {
      id: classId,
      branchIds: [branchId],
      name: base.name,
      time: timeSlot,
      difficulty: base.difficulty,
      instructor: instructor,
      capacity: base.capacity,
      description: base.description,
      image: base.image,
      room: base.room,
      calories: base.calories,
      duration: base.duration,
      dateBookings: {},
      _preBooked: preBooked // pseudo-random pre-existing bookings for visual variety
    };
  });
}

const DEFAULT_CLASSES = [
  ...getClassesForBranch('setiabudi'),
  ...getClassesForBranch('dago'),
  ...getClassesForBranch('pasirkaliki'),
  ...getClassesForBranch('buahbatu')
];

// ==================== REALISTIC CLASS SLOTS & BOOKINGS SYNC ====================

function getClassDateBookings(classId, dateKey) {
  try {
    const raw = localStorage.getItem('befit_class_date_bookings_v1');
    const map = raw ? JSON.parse(raw) : {};
    const key = classId + '_' + dateKey;
    return Array.isArray(map[key]) ? map[key] : [];
  } catch (e) {
    return [];
  }
}

function saveClassDateBooking(classId, dateKey, userId) {
  try {
    const raw = localStorage.getItem('befit_class_date_bookings_v1');
    const map = raw ? JSON.parse(raw) : {};
    const key = classId + '_' + dateKey;
    map[key] = map[key] || [];
    if (!map[key].includes(userId)) {
      map[key].push(userId);
    }
    localStorage.setItem('befit_class_date_bookings_v1', JSON.stringify(map));
  } catch (e) {}
}

function getRealisticClassSlotInfo(cls, dateKey, userId) {
  const userBookings = getClassDateBookings(cls.id, dateKey);
  const currentUser = getCurrentUser();
  const isUserBooked = Boolean(userId && (
    userBookings.includes(userId) ||
    (currentUser && Array.isArray(currentUser.bookedClasses) && currentUser.bookedClasses.some(b => b.classId === cls.id && b.dateKey === dateKey))
  ));

  // Deterministic baseline slots leftover based on class and date (giving realistic numbers: 0/Penuh, 3, 6, 11, 4, 8)
  const seed = _seedHash(cls.id + '-' + dateKey);
  const slotVariant = seed % 6;
  let baseRemaining;
  if (slotVariant === 0) {
    baseRemaining = 0; // Penuh!
  } else if (slotVariant === 1) {
    baseRemaining = 3; // 3 slot
  } else if (slotVariant === 2) {
    baseRemaining = 6; // 6 slot
  } else if (slotVariant === 3) {
    baseRemaining = 11; // 11 slot
  } else if (slotVariant === 4) {
    baseRemaining = 4; // 4 slot
  } else {
    baseRemaining = 8; // 8 slot
  }

  baseRemaining = Math.min(cls.capacity, baseRemaining);

  let currentSlots = baseRemaining;
  if (isUserBooked) {
    currentSlots = Math.max(0, baseRemaining - 1);
  } else {
    const otherBookingsCount = userBookings.filter(u => u !== userId).length;
    currentSlots = Math.max(0, baseRemaining - otherBookingsCount);
  }

  return {
    isRegistered: isUserBooked,
    currentSlots: currentSlots,
    isFull: currentSlots <= 0 && !isUserBooked,
    capacity: cls.capacity
  };
}


// ==================== 3. PERSONAL TRAINERS (BRANCH-SPECIFIC EXPANSION) ====================

// ==================== 3. PERSONAL TRAINERS (BRANCH-SPECIFIC EXPANSION) ====================

const DEFAULT_TRAINERS = [
  // --- CABANG SETIABUDI (5 Trainers) ---
  {
    id: 'TR-1',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['setiabudi'],
    name: 'Aby Pratama',
    fullName: 'Muhammad Aby Pratama, CPT',
    gender: 'Pria',
    categories: ['Shape', 'Athletic'],
    tier: 'FIT PRO',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=550&fit=crop&q=80',
    clients: 59,
    experience: '6 Tahun',
    summarySpecialization: 'Body Building, Endurance, Fat Loss, Muscle Gain',
    specialization: 'Body Building, Endurance, Fat Loss, Muscle Gain',
    specializations: [
      'BODY BUILDING TRAINER',
      'ENDURANCE TRAINER',
      'FAT LOSS',
      'KETTLEBELL TRAINER',
      'MOVEMENT & MOBILITY TRAINER',
      'MUSCLE GAIN'
    ],
    certifications: [
      'PT Foundation Be Fit Academy',
      'First Aid Training Level 1 - RosMedika Karya',
      'Kettlebell Training Level 1 - Functional Training Institute (FTI)',
      'Functional Mobility - FTI',
      'Rehab FX - FTI'
    ],
    bio: 'Head Coach di Be Fit Setiabudi dengan pengalaman 6 tahun mencetak transformasi tubuh atletis dan peningkatan performa atletik.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-2',
    shift: '13:00 – 20:00 WIB',
    branchIds: ['setiabudi'],
    name: 'Egi Angga',
    fullName: 'Egi Angga Permana',
    gender: 'Pria',
    categories: ['Athletic', 'Shape'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=550&fit=crop&q=80',
    clients: 33,
    experience: '5 Tahun',
    summarySpecialization: 'Fat Loss, HIIT & Conditioning, Functional Strength',
    specialization: 'Fat Loss, HIIT & Conditioning, Functional Strength',
    specializations: [
      'FAT LOSS',
      'HIIT & METABOLIC CONDITIONING',
      'CORE TRAINER',
      'ENDURANCE TRAINER',
      'FUNCTIONAL STRENGTH'
    ],
    certifications: [
      'APKI Certified Personal Trainer',
      'Metabolic Conditioning Specialist - FTI',
      'First Aid CPR/AED Certified',
      'TRX Suspension Training Course'
    ],
    bio: 'Spesialis program pembakaran lemak optimal, HIIT metabolisme tinggi, dan rekomposisi massa otot berbasis target terukur di Be Fit Setiabudi.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-3',
    shift: '15:00 – 21:00 WIB',
    branchIds: ['setiabudi'],
    name: 'Nadia Kusuma',
    fullName: 'Nadia Kusuma Wardhani',
    gender: 'Wanita',
    categories: ['Shape'],
    tier: 'FIT PRO',
    photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=550&fit=crop&q=80',
    clients: 41,
    experience: '6 Tahun',
    summarySpecialization: 'Reformer Pilates, Post-Injury Rehab, Posture Correction',
    specialization: 'Reformer Pilates, Post-Injury Rehab, Posture Correction',
    specializations: [
      'REFORMER & MAT PILATES',
      'POST-INJURY REHAB',
      'POSTURE CORRECTION',
      'CORE & FLEXIBILITY',
      'WOMEN TONING'
    ],
    certifications: [
      'STOTT Pilates Certified Instructor',
      'Rehab FX - Functional Training Institute (FTI)',
      'Pre & Postnatal Fitness Specialist',
      'First Aid Training Level 1'
    ],
    bio: 'Fokus pada latihan pilates reformer, rehabilitasi pasca cedera, koreksi postur tubuh, serta penguatan core dan pembentukan tubuh wanita.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-4',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['setiabudi'],
    name: 'Kevin Wijaya',
    fullName: 'Kevin Wijaya, CSCS',
    gender: 'Pria',
    categories: ['Athletic'],
    tier: 'FIT TRAINER',
    photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=550&fit=crop&q=80',
    clients: 28,
    experience: '3 Tahun',
    summarySpecialization: 'Athletic Performance, Agility & Speed, Plyometrics',
    specialization: 'Athletic Performance, Agility & Speed, Plyometrics',
    specializations: [
      'ATHLETIC PERFORMANCE',
      'AGILITY & SPEED TRAINING',
      'PLYOMETRICS',
      'ENDURANCE TRAINER',
      'SPORTS CONDITIONING'
    ],
    certifications: [
      'Certified Strength & Conditioning Specialist (CSCS Prep)',
      'PT Foundation Be Fit Academy',
      'Functional Movement Screen (FMS Level 1)'
    ],
    bio: 'Membimbing atlet dan fitness enthusiast meningkatkan daya ledak, kelincahan gerak, kecepatan, dan ketahanan kardiovaskular tinggi.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-5',
    shift: '13:00 – 20:00 WIB',
    branchIds: ['setiabudi'],
    name: 'Rina Maharani',
    fullName: 'Rina Maharani, CPT',
    gender: 'Wanita',
    categories: ['Shape'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=550&fit=crop&q=80',
    clients: 36,
    experience: '4 Tahun',
    summarySpecialization: 'Glute & Lower Body, Fat Loss, Body Shaping & Toning',
    specialization: 'Glute & Lower Body, Fat Loss, Body Shaping & Toning',
    specializations: [
      'GLUTE & LOWER BODY SHAPING',
      'FAT LOSS',
      'BODY SHAPING & TONING',
      'NUTRITION & WEIGHT MANAGEMENT'
    ],
    certifications: [
      'APKI Certified Fitness Trainer',
      "Women's Fitness & Glute Lab Specialist",
      'Precision Nutrition Level 1'
    ],
    bio: 'Spesialis pembentukan tubuh bawah (glutes & legs), penurunan persentase lemak, dan edukasi manajemen nutrisi harian yang berkelanjutan.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },

  // --- CABANG DAGO (5 Trainers) ---
  {
    id: 'TR-6',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['dago'],
    name: 'Adi Nugroho',
    fullName: 'Adi Nugroho, CSCS',
    gender: 'Pria',
    categories: ['Shape', 'Athletic'],
    tier: 'FIT PRO',
    photo: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=400&h=550&fit=crop&q=80',
    clients: 47,
    experience: '7 Tahun',
    summarySpecialization: 'Powerlifting, Strength, Muscle Gain, Biomechanics',
    specialization: 'Powerlifting, Strength, Muscle Gain, Biomechanics',
    specializations: [
      'POWERLIFTING & STRENGTH',
      'MUSCLE GAIN',
      'BARBELL BIOMECHANICS',
      'BODY BUILDING TRAINER'
    ],
    certifications: [
      'APKI Master Trainer Certification',
      'Powerlifting Club Coach Level 2',
      'Functional Hypertrophy Specialist'
    ],
    bio: 'Spesialis biomekanika angkat beban, powerlifting, peningkatan massa otot masif, dan teknik dasar barbell teraman di Be Fit Dago.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-7',
    shift: '13:00 – 20:00 WIB',
    branchIds: ['dago'],
    name: 'Sarah Wijaya',
    fullName: 'Sarah Wijaya, RYT',
    gender: 'Wanita',
    categories: ['Shape', 'Athletic'],
    tier: 'FIT PRO',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=550&fit=crop&q=80',
    clients: 52,
    experience: '5 Tahun',
    summarySpecialization: 'Movement & Mobility, Yoga Therapy, Flexibility',
    specialization: 'Movement & Mobility, Yoga Therapy, Flexibility',
    specializations: [
      'MOVEMENT & MOBILITY TRAINER',
      'YOGA THERAPY & CORE',
      'FLEXIBILITY & BALANCE',
      'FAT LOSS'
    ],
    certifications: [
      '200-Hour Registered Yoga Teacher (RYT)',
      'Functional Mobility - FTI',
      'PT Foundation Be Fit Academy'
    ],
    bio: 'Pendekatan holistik menggabungkan fleksibilitas, stabilitas core yoga, mobilitas fungsional, dan pembakaran lemak efisien.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-8',
    shift: '15:00 – 21:00 WIB',
    branchIds: ['dago'],
    name: 'Marco Santoso',
    fullName: 'Marco Santoso',
    gender: 'Pria',
    categories: ['Athletic'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=550&fit=crop&q=80',
    clients: 31,
    experience: '4 Tahun',
    summarySpecialization: 'Calisthenics, Core Trainer, Bodyweight Mastery',
    specialization: 'Calisthenics, Core Trainer, Bodyweight Mastery',
    specializations: [
      'CALISTHENICS & BODYWEIGHT',
      'CORE TRAINER',
      'GYMNASTIC STRENGTH',
      'ENDURANCE TRAINER'
    ],
    certifications: [
      'World Calisthenics Organization (WCO) Level 1',
      'Functional Training Institute (FTI) Bodyweight Mastery',
      'First Aid Training Level 1'
    ],
    bio: 'Menguasai seni penguasaan bobot tubuh (bodyweight mastery), kekuatan inti gymnastics, dan ketahanan stamina berintensitas tinggi.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-9',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['dago'],
    name: 'Dinda Putri',
    fullName: 'Dinda Putri Lestari',
    gender: 'Wanita',
    categories: ['Shape'],
    tier: 'FIT TRAINER',
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=550&fit=crop&q=80',
    clients: 39,
    experience: '3 Tahun',
    summarySpecialization: 'Fat Loss, Weight Loss Transformation, Body Toning',
    specialization: 'Fat Loss, Weight Loss Transformation, Body Toning',
    specializations: [
      'FAT LOSS',
      'WEIGHT LOSS TRANSFORMATION',
      'CARDIO CONDITIONING',
      'BODY TONING'
    ],
    certifications: [
      'PT Foundation Be Fit Academy',
      'Certified Weight Loss Specialist',
      'Les Mills Group Fitness Basic'
    ],
    bio: 'Mendampingi member baru dalam program penurunan berat badan aman, pengencangan otot tubuh, dan latihan kardio menyenangkan.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-10',
    shift: '13:00 – 20:00 WIB',
    branchIds: ['dago'],
    name: 'Reza Pahlevi',
    fullName: 'Reza Pahlevi',
    gender: 'Pria',
    categories: ['Athletic'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=550&fit=crop&q=80',
    clients: 44,
    experience: '5 Tahun',
    summarySpecialization: 'Boxing & Muay Thai Conditioning, Combat Cardio, Stamina',
    specialization: 'Boxing & Muay Thai Conditioning, Combat Cardio, Stamina',
    specializations: [
      'BOXING & MUAY THAI CONDITIONING',
      'COMBAT CARDIO',
      'AGILITY & STAMINA',
      'FAT LOSS'
    ],
    certifications: [
      'Certified Boxing Fitness Coach',
      'Padwork & Striking Conditioning Level 2',
      'First Aid Training Level 1 - RosMedika Karya'
    ],
    bio: 'Pelatih padwork tinju & muay thai conditioning berkecepatan tinggi, memacu denyut jantung, ketahanan fisik, dan fokus refleks.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },

  // --- CABANG PASIRKALIKI (4 Trainers) ---
  {
    id: 'TR-11',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['pasirkaliki'],
    name: 'Bima Sakti',
    fullName: 'Bima Sakti Perkasa',
    gender: 'Pria',
    categories: ['Shape'],
    tier: 'FIT PRO',
    photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=550&fit=crop&q=80',
    clients: 45,
    experience: '8 Tahun',
    summarySpecialization: 'Body Building Trainer, Contest Prep, Extreme Muscle Gain',
    specialization: 'Body Building Trainer, Contest Prep, Extreme Muscle Gain',
    specializations: [
      'BODY BUILDING TRAINER',
      'CONTEST PREP & PHYSIQUE',
      'EXTREME MUSCLE GAIN',
      'FAT LOSS'
    ],
    certifications: [
      'APKI Certified Personal Trainer',
      'Advanced Hypertrophy & Contest Nutrition',
      'PT Foundation Be Fit Academy'
    ],
    bio: 'Veteran binaraga dan pelatih kontes physique dengan dedikasi tinggi pada program hipertrofi lanjut dan pemotongan lemak ekstrem.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-12',
    shift: '13:00 – 20:00 WIB',
    branchIds: ['pasirkaliki'],
    name: 'Jessica Tan',
    fullName: 'Jessica Tanujaya',
    gender: 'Wanita',
    categories: ['Athletic', 'Shape'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=550&fit=crop&q=80',
    clients: 38,
    experience: '4 Tahun',
    summarySpecialization: 'Bootcamp & Circuit, Kettlebell Trainer, HIIT Training',
    specialization: 'Bootcamp & Circuit, Kettlebell Trainer, HIIT Training',
    specializations: [
      'BOOTCAMP & CIRCUIT TRAINING',
      'FAT LOSS',
      'KETTLEBELL TRAINER',
      'HIGH INTENSITY INTERVAL (HIIT)'
    ],
    certifications: [
      'Kettlebell Training Level 1 - FTI',
      'Les Mills Grit & Circuit Certified',
      'First Aid Training Level 1'
    ],
    bio: 'Enerjik dan memotivasi, ahli dalam merancang sirkuit latihan intensif kettlebell, bootcamp atletik, dan interval cardio pembakar kalori.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-13',
    shift: '15:00 – 21:00 WIB',
    branchIds: ['pasirkaliki'],
    name: 'Fajar Ramadhan',
    fullName: 'Fajar Ramadhan',
    gender: 'Pria',
    categories: ['Athletic'],
    tier: 'FIT TRAINER',
    photo: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=550&fit=crop&q=80',
    clients: 24,
    experience: '3 Tahun',
    summarySpecialization: 'Endurance Trainer, Marathon & Running, VO2 Max',
    specialization: 'Endurance Trainer, Marathon & Running, VO2 Max',
    specializations: [
      'ENDURANCE TRAINER',
      'MARATHON & RUNNING PREP',
      'VO2 MAX CONDITIONING',
      'LOWER BODY MOBILITY'
    ],
    certifications: [
      'Certified Running & Endurance Coach',
      'Functional Mobility - FTI',
      'PT Foundation Be Fit Academy'
    ],
    bio: 'Spesialis persiapan pelari maraton, penguatan stabilitas sendi tungkai, peningkatan efisiensi ritme lari, dan kapasitas VO2 Max.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-14',
    shift: '07:00 – 14:00 WIB',
    branchIds: ['pasirkaliki'],
    name: 'Maya Sari',
    fullName: 'Maya Sari Kusuma',
    gender: 'Wanita',
    categories: ['Shape'],
    tier: 'FIT MASTER',
    photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=550&fit=crop&q=80',
    clients: 30,
    experience: '5 Tahun',
    summarySpecialization: 'Postnatal Fitness, Pelvic Core Strength, Body Shaping',
    specialization: 'Postnatal Fitness, Pelvic Core Strength, Body Shaping',
    specializations: [
      'POSTNATAL FITNESS',
      'PELVIC & CORE STRENGTH',
      'LOW IMPACT FAT LOSS',
      'BODY SHAPING'
    ],
    certifications: [
      'Pre & Postnatal Exercise Specialist',
      'Rehab FX - Functional Training Institute (FTI)',
      'APKI Certified Personal Trainer'
    ],
    bio: 'Spesialis pemulihan kebugaran pasca melahirkan, penguatan otot dasar panggul & core, serta restorasi bentuk tubuh ideal secara aman.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  }
];

const MEMBERSHIP_PACKAGES = [
  {
    id: 'pkg-1m',
    name: 'Paket 1 Bulan (Basic Starter)',
    packageLabel: 'Paket 1 Bulan',
    shortName: 'Basic Starter',
    durationDays: 30,
    price: 350000,
    pricePerMonth: 350000,
    badge: 'Starter',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    popular: false,
    features: [
      'Akses gym 1 cabang pilihan',
      'Loker harian & shower room gratis',
      'Gratis 2x kelas studio pilihan',
      'Free Wi-Fi & water station',
      'Konsultasi awal kebugaran'
    ]
  },
  {
    id: 'pkg-3m',
    name: 'Paket 3 Bulan (Pro Transformation)',
    packageLabel: 'Paket 3 Bulan',
    shortName: 'Pro Transformation',
    durationDays: 90,
    price: 900000,
    pricePerMonth: 300000,
    badge: 'Best Seller 🔥',
    badgeColor: 'bg-teal-550 text-white',
    popular: true,
    features: [
      'Akses SEMUA cabang Be Fit (All Clubs)',
      'Gratis SEMUA kelas studio tanpa batas',
      'Gratis 1x Sesi PT Assessment',
      'Loker harian prioritas',
      'Akses pelacakan progres di aplikasi'
    ]
  },
  {
    id: 'pkg-6m',
    name: 'Paket 6 Bulan (VIP Committed)',
    packageLabel: 'Paket 6 Bulan',
    shortName: 'VIP Committed',
    durationDays: 180,
    price: 1500000,
    pricePerMonth: 250000,
    badge: 'VIP Choice 💎',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    popular: false,
    features: [
      'Akses seluruh cabang Be Fit',
      'Bebas booking semua kelas VIP & reguler',
      'Gratis 2x Sesi Personal Trainer eksklusif',
      'Fasilitas handuk & loker VIP harian',
      'Diskon 10% Be Fit Healthy Bar & Merchandise'
    ]
  },
  {
    id: 'pkg-12m',
    name: 'Paket 12 Bulan (1 Tahun)',
    packageLabel: 'Paket 12 Bulan (1 Tahun)',
    shortName: 'Ultimate Yearly',
    durationDays: 365,
    price: 2400000,
    pricePerMonth: 200000,
    badge: 'Hemat 40% ⚡',
    badgeColor: 'bg-gradient-to-r from-teal-500 to-blue-500 text-white',
    popular: false,
    features: [
      'Semua fasilitas VIP 1 tahun penuh',
      'Gratis 4x Sesi Personal Trainer',
      'Kuota cuti/freeze keanggotaan s/d 2 bulan',
      '2 Voucher Free Pass untuk teman/keluarga',
      'Goodie bag eksklusif Be Fit Athlete'
    ]
  }
];

// ==================== 5. PROMOS & VOUCHERS ====================

const PROMOS_DATA = [
  {
    id: 'promo-memberbaru',
    title: 'Spesial Member Baru',
    subtitle: 'Diskon 15% Semua Paket Membership',
    description: 'Dapatkan diskon 15% untuk pendaftaran pertama kali! Berlaku untuk semua pilihan durasi membership (1, 3, 6, dan 12 bulan).',
    validUntil: '31 Desember 2026',
    voucherCode: 'MEMBERBARU15',
    discountBadge: 'Diskon 15%',
    badgeColor: 'bg-brand-sunny text-slate-900',
    target: 'membership',
    ctaText: 'Klaim & Pilih Paket Membership',
    terms: [
      'Berlaku untuk semua paket membership (1, 3, 6, dan 12 bulan).',
      'Diskon 15% langsung memotong total pembayaran saat checkout.',
      'Satu kali penggunaan per akun terdaftar.',
      'Dapat dibayar melalui QRIS atau Virtual Account.'
    ]
  },
  {
    id: 'promo-komitmen',
    title: 'Promo Komitmen Jangka Panjang',
    subtitle: 'Potongan Rp 100.000 Paket 3, 6, & 12 Bulan',
    description: 'Investasi sehat jangka panjang lebih hemat! Dapatkan potongan langsung Rp 100.000 khusus saat checkout paket membership 3 bulan, 6 bulan, atau 12 bulan.',
    validUntil: '31 Desember 2026',
    voucherCode: 'GAJIAN100K',
    discountBadge: 'Potong Rp 100K',
    badgeColor: 'bg-teal-550 text-white',
    target: 'membership',
    ctaText: 'Klaim & Pilih Paket Membership',
    terms: [
      'Berlaku khusus untuk Paket Membership 3 Bulan, 6 Bulan, dan 12 Bulan.',
      'Potongan langsung Rp 100.000 dari total harga paket saat checkout.',
      'Satu kali penggunaan per akun terdaftar.',
      'Dapat dibayar melalui QRIS atau Virtual Account.'
    ]
  },
  {
    id: 'promo-pt',
    title: 'Promo Personal Trainer',
    subtitle: 'Diskon 20% Semua Paket Sesi PT',
    description: 'Raih target bentuk tubuh optimal lebih cepat dengan bimbingan Coach profesional bersertifikat! Dapatkan diskon 20% untuk semua paket sesi Personal Trainer privat.',
    validUntil: '31 Desember 2026',
    voucherCode: 'PTPROMO20',
    discountBadge: 'Diskon 20% PT',
    badgeColor: 'bg-amber-500 text-white',
    target: 'pt',
    ctaText: 'Klaim & Pilih Personal Trainer',
    terms: [
      'Berlaku untuk semua paket sesi Personal Trainer (1, 4, 8, atau 12 sesi).',
      'Diskon 20% otomatis memotong total harga saat checkout.',
      'Sesi latihan dapat dijadwalkan langsung bersama Coach pilihanmu.',
      'Satu kali penggunaan per akun terdaftar.'
    ]
  }
];

const VOUCHERS_DATA = [
  {
    code: 'RENEWLOYAL25',
    desc: 'Diskon 25% Promo Perpanjangan Loyalitas (Khusus Membership)',
    type: 'membership',
    percent: 25,
    minAmount: 0,
    expires: '31 Des 2026',
    badge: '25% OFF RENEWAL'
  },
  {
    code: 'MEMBERBARU15',
    desc: 'Diskon 15% Member Baru (Khusus Membership)',
    type: 'membership',
    percent: 15,
    minAmount: 0,
    expires: '31 Des 2026',
    badge: '15% OFF'
  },
  {
    code: 'HEMAT50K',
    desc: 'Potongan Langsung Rp 50.000 (Min. Transaksi Rp 300K)',
    type: 'all',
    amount: 50000,
    minAmount: 300000,
    expires: '31 Des 2026',
    badge: 'Potong Rp 50K'
  },
  {
    code: 'PTPROMO20',
    desc: 'Diskon 20% Khusus Personal Trainer',
    type: 'pt',
    percent: 20,
    minAmount: 0,
    expires: '31 Des 2026',
    badge: '20% OFF PT'
  },
  {
    code: 'GAJIAN100K',
    desc: 'Potongan Rp 100.000 Membership 3/6/12 Bln',
    type: 'membership',
    amount: 100000,
    minAmount: 900000,
    expires: '31 Des 2026',
    badge: 'Potong Rp 100K'
  }
];

function isUserPaidMember(user) {
  if (!user || user.role === 'admin') return false;
  if (user.isPaidMember === false) return false;
  if (user.membershipStatus === 'Belum Aktif' || user.membershipStatus === 'Akun Baru (Belum Aktif)' || user.status === 'Belum Aktif') return false;
  if (user.membershipPackage === 'Belum Berlangganan' && !user.expiryDate) return false;
  if (user.packageType === 'Belum Berlangganan' || user.packageDuration === 'Belum Berlangganan') return false;
  if (typeof user.packageDuration === 'string' && (user.packageDuration.toLowerCase().includes('trial') || user.packageDuration.toLowerCase().includes('free'))) return false;
  if (typeof user.packageType === 'string' && (user.packageType.toLowerCase().includes('trial') || user.packageType.toLowerCase().includes('free'))) return false;
  if (typeof user.voucherUsed === 'string' && user.voucherUsed.toLowerCase().includes('trial')) return false;
  if (!user.expiryDate) return false;

  if (user.membershipStatus === 'Aktif' || user.isPaidMember === true) return true;
  if (Number(user.membershipPaid || user.totalPaid) > 0) return true;

  const validPackages = [
    'Basic Starter', 'Pro Transformation', 'VIP Committed', 'Elite Athlete', 'Ultimate Yearly', 'Basic Starter Plus',
    'Paket 1 Bulan', 'Paket 3 Bulan', 'Paket 6 Bulan', 'Paket 12 Bulan'
  ];
  if (validPackages.some(pkg => (user.packageType && user.packageType.includes(pkg)) || (user.packageDuration && user.packageDuration.includes(pkg)) || (user.membershipPackage && user.membershipPackage.includes(pkg)))) {
    return true;
  }
  return false;
}

function getDaysRemaining(expiryDateStr) {
  if (!expiryDateStr) return 0;
  try {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiry = parseDateLocal(expiryDateStr);
    if (!expiry) return 0;
    return Math.round((expiry.getTime() - todayMidnight.getTime()) / 86400000);
  } catch (e) {
    return 0;
  }
}

function checkAndInjectRetentionVoucher(user) {
  if (!user || user.role === 'admin' || !isUserPaidMember(user)) {
    return { isExpiringSoon: false, daysRemaining: 0 };
  }

  const days = getDaysRemaining(user.expiryDate);
  const usedVouchers = Array.isArray(user.usedVouchers) ? user.usedVouchers : [];
  const alreadyUsed = usedVouchers.includes('RENEWLOYAL25');

  const isExpiringSoon = days >= 1 && days <= 10 && !alreadyUsed;

  if (isExpiringSoon) {
    user.injectedVouchers = Array.isArray(user.injectedVouchers) ? user.injectedVouchers : [];
    if (!user.injectedVouchers.includes('RENEWLOYAL25')) {
      user.injectedVouchers.push('RENEWLOYAL25');
    }
    setRetentionUnlocked(true);
    setActivePromoCode('RENEWLOYAL25');
  } else {
    if (user.injectedVouchers && user.injectedVouchers.includes('RENEWLOYAL25')) {
      user.injectedVouchers = user.injectedVouchers.filter(v => v !== 'RENEWLOYAL25');
    }
    if (activePromoCode === 'RENEWLOYAL25' && (days > 10 || alreadyUsed)) {
      clearRetentionUnlock();
    }
  }

  return { isExpiringSoon, daysRemaining: days };
}

function isRetentionUnlocked() {
  const user = getCurrentUser();
  if (!user || user.role === 'admin' || !isUserPaidMember(user)) return false;
  const days = getDaysRemaining(user.expiryDate);
  const usedVouchers = Array.isArray(user.usedVouchers) ? user.usedVouchers : [];
  if (usedVouchers.includes('RENEWLOYAL25')) return false;

  const hasInjected = Array.isArray(user.injectedVouchers) && user.injectedVouchers.includes('RENEWLOYAL25');
  const isWithinDays = days >= 1 && days <= 10;

  return isWithinDays || hasInjected;
}

function renderHomeRetentionBanner() {
  const container = document.getElementById('home-retention-banner-container');
  if (!container) return;

  const user = getCurrentUser();
  if (!user || user.role === 'admin' || !isUserPaidMember(user)) {
    container.innerHTML = '';
    return;
  }

  const { isExpiringSoon, daysRemaining } = checkAndInjectRetentionVoucher(user);

  if (isExpiringSoon) {
    container.innerHTML = `
      <div class="px-4 pt-3 pb-1">
        <div class="p-3.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] shadow-sm flex flex-col gap-2.5">
          <div class="flex items-start gap-2.5">
            <span class="text-2xl shrink-0">⚠️</span>
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-black text-amber-950 leading-tight">
                Masa Aktif Membership Tersisa ${daysRemaining} Hari Lagi!
              </h4>
              <p class="text-[11px] text-amber-900 mt-1 leading-snug font-medium">
                Khusus untuk Anda, sistem telah menyuntikkan Voucher Diskon Perpanjangan 25% (RENEWLOYAL25) secara otomatis ke akun Anda.
              </p>
            </div>
          </div>
          <div class="pt-2 border-t border-amber-300/70 flex justify-end">
            <button type="button" onclick="navigateToTab('pricing')"
              class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
              <span>Perpanjang Sekarang (Diskon 25%) &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}

function setRetentionUnlocked(val = true) {
  try {
    if (val) {
      sessionStorage.setItem('befit_retention_unlocked', 'true');
      localStorage.setItem('befit_retention_unlocked', 'true');
    } else {
      sessionStorage.removeItem('befit_retention_unlocked');
      localStorage.removeItem('befit_retention_unlocked');
    }
  } catch (e) {}
}

function clearRetentionUnlock() {
  setRetentionUnlocked(false);
  try {
    sessionStorage.removeItem('befit_active_promo');
    localStorage.removeItem('befit_active_voucher');
    localStorage.removeItem('befit_pending_promo');
  } catch (e) {}
}

function getUserClaimedVouchers() {
  const u = getCurrentUser();
  if (u && Array.isArray(u.claimedVouchers) && u.claimedVouchers.length > 0) {
    return u.claimedVouchers;
  }
  try {
    const raw = localStorage.getItem('befit_claimed_vouchers');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return ['MEMBERBARU15'];
}

function claimVoucher(code) {
  const v = VOUCHERS_DATA.find(x => x.code === code);
  if (!v) {
    showToast(`Voucher ${code} tidak ditemukan.`);
    return;
  }
  const list = getUserClaimedVouchers();
  if (!list.includes(code)) {
    list.push(code);
  }
  try {
    localStorage.setItem('befit_claimed_vouchers', JSON.stringify(list));
  } catch (e) {}

  const u = getCurrentUser();
  if (u) {
    u.claimedVouchers = list;
    setCurrentUser(u);
  }
  showToast(`Voucher ${code} berhasil diklaim! Gunakan saat pembayaran.`, 4000);
}

// ==================== 6. SEED USERS & AUTH STATE ====================

const DATA_VERSION_KEY = 'befit_data_version';
const CURRENT_DATA_VERSION = 'v8';

const DEFAULT_USERS = [
  // ===== CABANG SETIABUDI (~8 Member, Total Membership: Rp 7.850.000) =====
  {
    id: 'BF-1001',
    name: 'Rizky Test User',
    email: 'rizky.member@gmail.com',
    phone: '082116156884',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    membershipPackage: 'Paket 3 Bulan',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    membershipPaid: 900000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '06 Agu 2026',
    expiryDate: relativeDateStr(3), // 3 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1002',
    name: 'Andi Pratama',
    email: 'andi.pratama@gmail.com',
    phone: '081223344556',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    membershipPackage: 'Paket 3 Bulan',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    membershipPaid: 900000,
    paymentMethod: 'BCA VA',
    dateJoined: '06 Agu 2026',
    expiryDate: relativeDateStr(2), // 2 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1003',
    name: 'Fajar Nugraha',
    email: 'fajar.nugraha@gmail.com',
    phone: '081234567891',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Ultimate Yearly',
    packageDuration: 'Paket 12 Bulan (Ultimate Yearly)',
    voucherUsed: 'GAJIAN100K',
    totalPaid: 2400000,
    paymentMethod: 'MANDIRI VA',
    dateJoined: '02 Nov 2026',
    expiryDate: '2027-11-02',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1004',
    name: 'Hendra Wijaya',
    email: 'hendra.wijaya@gmail.com',
    phone: '081234567892',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Elite Athlete',
    packageDuration: 'Paket 6 Bulan (Elite Athlete)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 1500000,
    paymentMethod: 'BNI VA',
    dateJoined: '15 Okt 2026',
    expiryDate: '2027-04-15',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1005',
    name: 'Maya Safitri',
    email: 'maya.safitri@gmail.com',
    phone: '081234567893',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '20 Okt 2026',
    expiryDate: '2027-01-20',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1006',
    name: 'Rian Pratama',
    email: 'rian.pratama@gmail.com',
    phone: '081234567894',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    paymentMethod: 'BCA VA',
    dateJoined: '28 Okt 2026',
    expiryDate: '2026-11-28',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1007',
    name: 'Gita Permata',
    email: 'gita.permata@gmail.com',
    phone: '081234567895',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '30 Okt 2026',
    expiryDate: '2026-11-30',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1008',
    name: 'Dimas Arya',
    email: 'dimas.arya@gmail.com',
    phone: '081234567896',
    password: '123456',
    branch: 'Setiabudi',
    packageType: 'Basic Starter Plus',
    packageDuration: 'Paket 1 Bulan (Basic Starter Plus)',
    voucherUsed: '-',
    totalPaid: 550000,
    paymentMethod: 'BCA VA',
    dateJoined: '04 Nov 2026',
    expiryDate: '2026-12-04',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },

  // ===== CABANG DAGO (~7 Member, Total Membership: Rp 6.400.000) =====
  {
    id: 'BF-1009',
    name: 'Mimah',
    email: 'mimah.member@gmail.com',
    phone: '089513102470',
    password: '123456',
    branch: 'Dago',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    membershipPackage: 'Paket 1 Bulan',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    membershipPaid: 350000,
    paymentMethod: 'BCA VA',
    dateJoined: '04 Okt 2026',
    expiryDate: relativeDateStr(5), // 5 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1010',
    name: 'Diana Putri',
    email: 'diana.putri@gmail.com',
    phone: '081778899001',
    password: '123456',
    branch: 'Dago',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    membershipPackage: 'Paket 3 Bulan',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    membershipPaid: 900000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '13 Agu 2026',
    expiryDate: relativeDateStr(9), // 9 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1011',
    name: 'Kevin Sanjaya',
    email: 'kevin.sanjaya@gmail.com',
    phone: '081778899002',
    password: '123456',
    branch: 'Dago',
    packageType: 'Ultimate Yearly',
    packageDuration: 'Paket 12 Bulan (Ultimate Yearly)',
    voucherUsed: 'GAJIAN100K',
    totalPaid: 2400000,
    paymentMethod: 'MANDIRI VA',
    dateJoined: '18 Okt 2026',
    expiryDate: '2027-10-18',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1012',
    name: 'Nadya Utami',
    email: 'nadya.utami@gmail.com',
    phone: '081778899003',
    password: '123456',
    branch: 'Dago',
    packageType: 'Elite Athlete',
    packageDuration: 'Paket 6 Bulan (Elite Athlete)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 1500000,
    paymentMethod: 'BCA VA',
    dateJoined: '24 Sep 2026',
    expiryDate: '2027-03-24',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1013',
    name: 'Rio Febrian',
    email: 'rio.febrian@gmail.com',
    phone: '081778899004',
    password: '123456',
    branch: 'Dago',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '10 Okt 2026',
    expiryDate: '2027-01-10',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1014',
    name: 'Lisa Black',
    email: 'lisa.black@gmail.com',
    phone: '081778899005',
    password: '123456',
    branch: 'Dago',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    paymentMethod: 'BNI VA',
    dateJoined: '25 Okt 2026',
    expiryDate: '2026-11-25',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1015',
    name: 'Denny Kurnia',
    email: 'denny.kurnia@gmail.com',
    phone: '081778899006',
    password: '123456',
    branch: 'Dago',
    membershipPackage: null,
    packageType: 'Belum Berlangganan',
    packageDuration: 'Belum Berlangganan',
    membershipStatus: 'Belum Aktif',
    voucherUsed: null,
    totalPaid: 0,
    paymentMethod: null,
    dateJoined: '02 Nov 2026',
    expiryDate: null,
    status: 'Belum Aktif',
    isPaidMember: false,
    daysRemaining: 0,
    injectedVouchers: [],
    isFrozen: false,
    role: 'member'
  },

  // ===== CABANG PASIRKALIKI (~5 Member, Total Membership: Rp 4.950.000) =====
  {
    id: 'BF-1016',
    name: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '081556677889',
    password: '123456',
    branch: 'Pasirkaliki',
    packageType: 'Elite Athlete',
    packageDuration: 'Paket 6 Bulan (Elite Athlete)',
    membershipPackage: 'Paket 6 Bulan',
    voucherUsed: 'HEMAT50K',
    totalPaid: 1500000,
    membershipPaid: 1500000,
    paymentMethod: 'MANDIRI VA',
    dateJoined: '08 Mei 2026',
    expiryDate: relativeDateStr(4), // 4 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1017',
    name: 'Reza Rahadian',
    email: 'reza.rahadian@gmail.com',
    phone: '081556677890',
    password: '123456',
    branch: 'Pasirkaliki',
    packageType: 'Elite Athlete',
    packageDuration: 'Paket 6 Bulan (Elite Athlete)',
    voucherUsed: 'GAJIAN100K',
    totalPaid: 1500000,
    paymentMethod: 'BCA VA',
    dateJoined: '10 Okt 2026',
    expiryDate: '2027-04-10',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1018',
    name: 'Tiara Andini',
    email: 'tiara.andini@gmail.com',
    phone: '081556677891',
    password: '123456',
    branch: 'Pasirkaliki',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    voucherUsed: 'MEMBERBARU15',
    totalPaid: 900000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '18 Okt 2026',
    expiryDate: '2027-01-18',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1019',
    name: 'Farhan Maulana',
    email: 'farhan.m@gmail.com',
    phone: '081556677892',
    password: '123456',
    branch: 'Pasirkaliki',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation Promo)',
    voucherUsed: 'HEMAT200K',
    totalPaid: 700000,
    paymentMethod: 'BNI VA',
    dateJoined: '22 Okt 2026',
    expiryDate: '2027-01-22',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1020',
    name: 'Cindy Claudia',
    email: 'cindy.c@gmail.com',
    phone: '081556677893',
    password: '123456',
    branch: 'Pasirkaliki',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '29 Okt 2026',
    expiryDate: '2026-11-29',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },

  // ===== CABANG BUAH BATU (~4 Member, Total Membership: Rp 3.150.000, 0 PT) =====
  {
    id: 'BF-1021',
    name: 'Siti Aisyah',
    email: 'siti.aisyah@gmail.com',
    phone: '081334455667',
    password: '123456',
    branch: 'Buah Batu',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    membershipPackage: 'Paket 1 Bulan',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    membershipPaid: 350000,
    paymentMethod: 'BCA VA',
    dateJoined: '11 Okt 2026',
    expiryDate: relativeDateStr(7), // 7 Hari Lagi
    status: 'Active',
    membershipStatus: 'Aktif',
    isPaidMember: true,
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1022',
    name: 'Agus Salim',
    email: 'agus.salim@gmail.com',
    phone: '081334455668',
    password: '123456',
    branch: 'Buah Batu',
    packageType: 'Elite Athlete',
    packageDuration: 'Paket 6 Bulan (Elite Athlete)',
    voucherUsed: 'GAJIAN100K',
    totalPaid: 1500000,
    paymentMethod: 'QRIS INSTANT',
    dateJoined: '05 Okt 2026',
    expiryDate: '2027-04-05',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1023',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    phone: '081334455669',
    password: '123456',
    branch: 'Buah Batu',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    voucherUsed: '-',
    totalPaid: 950000,
    paymentMethod: 'MANDIRI VA',
    dateJoined: '14 Okt 2026',
    expiryDate: '2027-01-14',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },
  {
    id: 'BF-1024',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@gmail.com',
    phone: '081334455670',
    password: '123456',
    branch: 'Buah Batu',
    packageType: 'Basic Starter',
    packageDuration: 'Paket 1 Bulan (Basic Starter)',
    voucherUsed: 'HEMAT50K',
    totalPaid: 350000,
    paymentMethod: 'BNI VA',
    dateJoined: '01 Nov 2026',
    expiryDate: '2026-12-01',
    status: 'Active',
    isFrozen: false,
    role: 'member'
  },

  // ===== ADMINISTRATOR ACCOUNTS =====
  {
    id: 'ADM-01',
    name: 'Administrator Be Fit',
    email: 'rrizky205@gmail.com',
    phone: '082116156884',
    password: 'wudinjir1911',
    packageType: 'Ultimate Yearly',
    packageDuration: 'Paket 12 Bulan (Ultimate Yearly)',
    expiryDate: '2027-11-04',
    status: 'Active',
    ptSessions: 12,
    ptTrainer: 'Aby Pratama',
    isTrialClaimed: true,
    role: 'admin',
    branch: 'Setiabudi'
  },
  {
    id: 'ADM-02',
    name: 'Administrator Be Fit (Demo)',
    email: 'admin@befit.id',
    phone: '08111222333',
    password: 'admin123',
    packageType: 'Ultimate Yearly',
    packageDuration: 'Paket 12 Bulan (Ultimate Yearly)',
    expiryDate: '2027-11-04',
    status: 'Active',
    ptSessions: 12,
    ptTrainer: 'Aby Pratama',
    isTrialClaimed: true,
    role: 'admin',
    branch: 'Setiabudi'
  }
];

// ==================== STATE MANAGEMENT HELPERS ====================

function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

function sanitize(str) {
  if (str === null || str === undefined) return '';
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${parts[2]} ${months[d.getMonth()]} ${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

// User Storage with v7 Auto-Merge / Migration
function getUsers() {
  try {
    const ver = localStorage.getItem(DATA_VERSION_KEY);
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    let users = raw ? JSON.parse(raw) : [];

    if (ver !== CURRENT_DATA_VERSION || !Array.isArray(users) || users.length < 24) {
      const map = new Map();
      DEFAULT_USERS.forEach(u => map.set((u.email || u.id).toLowerCase(), { ...u }));
      if (Array.isArray(users)) {
        users.forEach(u => {
          const key = (u.email || u.id || '').toLowerCase();
          const def = map.get(key);
          if (def) {
            const hasPaidUpgrade = (Number(u.totalPaid) || 0) > (Number(def.totalPaid) || 0) || (u.isPaidMember && def.isPaidMember === false);
            map.set(key, {
              ...def,
              ...u,
              expiryDate: hasPaidUpgrade && u.expiryDate ? u.expiryDate : def.expiryDate,
              password: u.password || def.password,
              branch: u.branch || def.branch,
              membershipPackage: (hasPaidUpgrade && u.membershipPackage) ? u.membershipPackage : (def.membershipPackage || def.packageDuration),
              packageDuration: (hasPaidUpgrade && u.packageDuration) ? u.packageDuration : def.packageDuration,
              packageType: (hasPaidUpgrade && u.packageType) ? u.packageType : def.packageType,
              totalPaid: Math.max(Number(u.totalPaid) || 0, Number(def.totalPaid) || 0),
              isPaidMember: hasPaidUpgrade ? true : (def.isPaidMember !== undefined ? def.isPaidMember : true),
              status: (hasPaidUpgrade && u.status) ? u.status : def.status,
              membershipStatus: (hasPaidUpgrade && u.membershipStatus) ? u.membershipStatus : (def.membershipStatus || 'Aktif'),
              daysRemaining: hasPaidUpgrade && u.daysRemaining !== undefined ? u.daysRemaining : getDaysRemaining(hasPaidUpgrade && u.expiryDate ? u.expiryDate : def.expiryDate),
              injectedVouchers: u.injectedVouchers || def.injectedVouchers || []
            });
          } else if (u.role !== 'admin') {
            // Clean any legacy trial account in localStorage
            if (u.packageDuration && (u.packageDuration.includes('Trial') || u.packageDuration.includes('Free')) && !u.totalPaid) {
              u.packageType = 'Belum Berlangganan';
              u.packageDuration = 'Belum Berlangganan';
              u.membershipPackage = null;
              u.membershipStatus = 'Belum Aktif';
              u.status = 'Belum Aktif';
              u.isPaidMember = false;
              u.daysRemaining = 0;
              u.expiryDate = null;
              u.injectedVouchers = [];
            }
            map.set(key, u);
          }
        });
      }
      users = Array.from(map.values()).sort((a, b) => Number(b.createdAtTimestamp || 0) - Number(a.createdAtTimestamp || 0));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);

      // If active user is in demo accounts, update its expiry in session
      try {
        const curRaw = localStorage.getItem(CURRENT_USER_KEY);
        if (curRaw) {
          const cur = JSON.parse(curRaw);
          const matched = users.find(u => cur.email && u.email && u.email.toLowerCase() === cur.email.toLowerCase());
          if (matched) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...cur, ...matched }));
          } else if (cur.packageDuration && (cur.packageDuration.includes('Trial') || cur.packageDuration.includes('Free')) && !cur.totalPaid) {
            cur.packageType = 'Belum Berlangganan';
            cur.packageDuration = 'Belum Berlangganan';
            cur.membershipPackage = null;
            cur.membershipStatus = 'Belum Aktif';
            cur.status = 'Belum Aktif';
            cur.isPaidMember = false;
            cur.daysRemaining = 0;
            cur.expiryDate = null;
            cur.injectedVouchers = [];
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cur));
          }
        }
      } catch (e) {}

      // Seed PT Bookings if empty
      try {
        const ptRaw = localStorage.getItem(PT_BOOKINGS_KEY);
        const ptList = ptRaw ? JSON.parse(ptRaw) : [];
        if (!Array.isArray(ptList) || ptList.length < 9) {
          const seedPt = [
            { id: 'PT-SB-01', orderId: 'PT-SB-01', userName: 'Fajar Nugraha', memberName: 'Fajar Nugraha', memberEmail: 'fajar.nugraha@gmail.com', userPhone: '081234567891', trainerName: 'Aby Pratama', branch: 'Be Fit Setiabudi Bandung', package: 'Paket 8 Sesi', packageName: 'Paket 8 Sesi', sessions: 8, totalSessions: 8, remainingSessions: 6, discount: 250000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 1750000, date: '29 Okt 2026', status: 'Aktif Berjalan' },
            { id: 'PT-SB-02', orderId: 'PT-SB-02', userName: 'Hendra Wijaya', memberName: 'Hendra Wijaya', memberEmail: 'hendra.wijaya@gmail.com', userPhone: '081234567892', trainerName: 'Randy Firmansyah', branch: 'Be Fit Setiabudi Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 3, discount: 100000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 950000, date: '30 Okt 2026', status: 'Aktif Berjalan' },
            { id: 'PT-SB-03', orderId: 'PT-SB-03', userName: 'Maya Safitri', memberName: 'Maya Safitri', memberEmail: 'maya.safitri@gmail.com', userPhone: '081234567893', trainerName: 'Sarah Wijaya', branch: 'Be Fit Setiabudi Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 4, discount: 100000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 950000, date: '01 Nov 2026', status: 'Aktif Berjalan' },
            { id: 'PT-SB-04', orderId: 'PT-SB-04', userName: 'Rian Pratama', memberName: 'Rian Pratama', memberEmail: 'rian.pratama@gmail.com', userPhone: '081234567894', trainerName: 'Amanda Putri', branch: 'Be Fit Setiabudi Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 2, discount: 150000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 900000, date: '02 Nov 2026', status: 'Aktif Berjalan' },
            { id: 'PT-DG-01', orderId: 'PT-DG-01', userName: 'Kevin Sanjaya', memberName: 'Kevin Sanjaya', memberEmail: 'kevin.sanjaya@gmail.com', userPhone: '081778899002', trainerName: 'Kevin Sanjaya', branch: 'Be Fit Dago Bandung', package: 'Paket 8 Sesi', packageName: 'Paket 8 Sesi', sessions: 8, totalSessions: 8, remainingSessions: 7, discount: 250000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 1750000, date: '28 Okt 2026', status: 'Aktif Berjalan' },
            { id: 'PT-DG-02', orderId: 'PT-DG-02', userName: 'Nadya Utami', memberName: 'Nadya Utami', memberEmail: 'nadya.utami@gmail.com', userPhone: '081778899003', trainerName: 'Rika Amelia', branch: 'Be Fit Dago Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 3, discount: 100000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 950000, date: '31 Okt 2026', status: 'Aktif Berjalan' },
            { id: 'PT-DG-03', orderId: 'PT-DG-03', userName: 'Rio Febrian', memberName: 'Rio Febrian', memberEmail: 'rio.febrian@gmail.com', userPhone: '081778899004', trainerName: 'Alex Tan', branch: 'Be Fit Dago Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 2, discount: 150000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 850000, date: '02 Nov 2026', status: 'Aktif Berjalan' },
            { id: 'PT-PK-01', orderId: 'PT-PK-01', userName: 'Reza Rahadian', memberName: 'Reza Rahadian', memberEmail: 'reza.rahadian@gmail.com', userPhone: '081556677890', trainerName: 'Farhan Maulana', branch: 'Be Fit Pasirkaliki Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 3, discount: 150000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 1200000, date: '30 Okt 2026', status: 'Aktif Berjalan' },
            { id: 'PT-PK-02', orderId: 'PT-PK-02', userName: 'Tiara Andini', memberName: 'Tiara Andini', memberEmail: 'tiara.andini@gmail.com', userPhone: '081556677891', trainerName: 'Jessica Clarissa', branch: 'Be Fit Pasirkaliki Bandung', package: 'Paket 4 Sesi', packageName: 'Paket 4 Sesi', sessions: 4, totalSessions: 4, remainingSessions: 4, discount: 100000, voucherCode: 'PTPROMO20', voucherUsed: 'PTPROMO20', totalPaid: 950000, date: '01 Nov 2026', status: 'Aktif Berjalan' }
          ];
          localStorage.setItem(PT_BOOKINGS_KEY, JSON.stringify(seedPt));
          localStorage.setItem(PT_ORDERS_KEY, JSON.stringify(seedPt));
        }
      } catch (e) {}
    }
    return users;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function appendToStorageArray(key, item) {
  try {
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const arr = Array.isArray(list) ? list : [];
    arr.unshift(item);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {}
}

function renderApp() {
  updateHeaderUserDisplay();
  renderHomeRetentionBanner();
  renderHomeClasses();
  renderHomeTrainers();

  const trainerScreen = document.getElementById('full-trainer-screen');
  if (trainerScreen && !trainerScreen.classList.contains('hidden') && typeof renderFullTrainerScreen === 'function') {
    renderFullTrainerScreen();
  }

  const trainerDetailScreen = document.getElementById('full-trainer-detail-screen');
  if (trainerDetailScreen && !trainerDetailScreen.classList.contains('hidden') && typeof renderFullTrainerDetailScreen === 'function' && currentDetailTrainerId) {
    const trainers = getTrainers();
    const t = trainers.find(x => x.id === currentDetailTrainerId);
    if (t) renderFullTrainerDetailScreen(t);
  }
}

const updateUI = renderApp;

const DEFAULT_CLOUD_SYNC_URL = 'https://textdb.dev/api/data/befit_gym_crm_cloud_sync_v8';

function getCloudSyncUrl() {
  if (typeof window !== 'undefined' && window.BEFIT_CLOUD_ENDPOINT) {
    return window.BEFIT_CLOUD_ENDPOINT;
  }
  return DEFAULT_CLOUD_SYNC_URL;
}

function readJsonArrayStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function mergeCloudUsers(localUsers, remoteUsers) {
  const map = new Map();
  const ingest = (u) => {
    if (!u || typeof u !== 'object') return;
    const key = String(u.email || u.id || '').toLowerCase().trim();
    if (!key) return;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...u });
      return;
    }
    const existingTs = Number(existing.lastUpdatedAt || existing.createdAtTimestamp || 0);
    const incomingTs = Number(u.lastUpdatedAt || u.createdAtTimestamp || 0);
    const existingPaid = Number(existing.totalPaid || 0);
    const incomingPaid = Number(u.totalPaid || 0);
    const pickIncoming = incomingTs !== existingTs
      ? incomingTs > existingTs
      : (incomingPaid >= existingPaid);
    const base = pickIncoming ? { ...existing, ...u } : { ...u, ...existing };
    base.createdAtTimestamp = Math.max(Number(existing.createdAtTimestamp || 0), Number(u.createdAtTimestamp || 0));
    base.lastUpdatedAt = Math.max(existingTs, incomingTs);
    map.set(key, base);
  };
  (Array.isArray(localUsers) ? localUsers : []).forEach(ingest);
  (Array.isArray(remoteUsers) ? remoteUsers : []).forEach(ingest);
  return Array.from(map.values()).sort((a, b) => Number(b.createdAtTimestamp || 0) - Number(a.createdAtTimestamp || 0));
}

function mergeCloudTransactions(localTx, remoteTx) {
  const map = new Map();
  const ingest = (t) => {
    if (!t || typeof t !== 'object') return;
    const id = t.id || `${t.title || t.packageName || ''}_${t.date || ''}_${t.amount || 0}`;
    if (!map.has(id)) map.set(id, t);
  };
  (Array.isArray(localTx) ? localTx : []).forEach(ingest);
  (Array.isArray(remoteTx) ? remoteTx : []).forEach(ingest);
  return Array.from(map.values());
}

function mergeCloudPtOrders(localPt, remotePt) {
  const map = new Map();
  const ingest = (o) => {
    if (!o || typeof o !== 'object') return;
    const oid = String(o.orderId || o.id || '');
    if (!oid) return;
    const existing = map.get(oid);
    if (!existing) {
      map.set(oid, { ...o });
      return;
    }
    const remA = existing.remainingSessions !== undefined ? Number(existing.remainingSessions) : Number(existing.sessions || 4);
    const remB = o.remainingSessions !== undefined ? Number(o.remainingSessions) : Number(o.sessions || 4);
    const tsA = Number(existing.updatedAt || existing.createdAtTimestamp || 0);
    const tsB = Number(o.updatedAt || o.createdAtTimestamp || 0);
    if (tsB > tsA || (tsB === tsA && remB < remA)) {
      map.set(oid, { ...existing, ...o });
    }
  };
  (Array.isArray(localPt) ? localPt : []).forEach(ingest);
  (Array.isArray(remotePt) ? remotePt : []).forEach(ingest);
  return Array.from(map.values());
}

let cloudPushInFlight = false;
let cloudPushQueued = false;

async function pushCloudSync() {
  if (typeof fetch !== 'function') return;
  if (cloudPushInFlight) {
    cloudPushQueued = true;
    return;
  }
  cloudPushInFlight = true;
  try {
    const url = getCloudSyncUrl();
    const localUsers = getUsers();
    const localTx = mergeCloudTransactions(readJsonArrayStorage(TRANSACTIONS_KEY), readJsonArrayStorage(TRANSACTIONS_ALT_KEY));
    const localPt = mergeCloudPtOrders(readJsonArrayStorage(PT_BOOKINGS_KEY), readJsonArrayStorage(PT_ORDERS_KEY));

    let remoteData = {};
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3500);
      const getRes = await fetch(url, { method: 'GET', cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      if (getRes.ok) {
        const txt = await getRes.text();
        if (txt && txt.trim().startsWith('{')) {
          remoteData = JSON.parse(txt);
        }
      }
    } catch (e) {}

    const mergedUsers = mergeCloudUsers(localUsers, remoteData.users);
    const mergedTx = mergeCloudTransactions(localTx, remoteData.transactions);
    const mergedPt = mergeCloudPtOrders(localPt, remoteData.ptOrders);

    saveUsers(mergedUsers);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mergedTx));
    localStorage.setItem(TRANSACTIONS_ALT_KEY, JSON.stringify(mergedTx));
    localStorage.setItem(PT_BOOKINGS_KEY, JSON.stringify(mergedPt));
    localStorage.setItem(PT_ORDERS_KEY, JSON.stringify(mergedPt));

    const payload = JSON.stringify({
      updatedAt: Date.now(),
      version: CURRENT_DATA_VERSION,
      users: mergedUsers,
      transactions: mergedTx,
      ptOrders: mergedPt
    });

    const postCtrl = new AbortController();
    const ptTimeout = setTimeout(() => postCtrl.abort(), 4500);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
      signal: postCtrl.signal
    });
    clearTimeout(ptTimeout);
  } catch (e) {
    // Non-fatal offline fallback
  } finally {
    cloudPushInFlight = false;
    if (cloudPushQueued) {
      cloudPushQueued = false;
      void pushCloudSync();
    }
  }
}

async function pullCloudSync() {
  if (typeof fetch !== 'function') return false;
  try {
    const url = getCloudSyncUrl();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, { method: 'GET', cache: 'no-store', signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return false;
    const txt = await res.text();
    if (!txt || !txt.trim().startsWith('{')) return false;
    const remote = JSON.parse(txt);

    const localUsers = getUsers();
    const localTx = mergeCloudTransactions(readJsonArrayStorage(TRANSACTIONS_KEY), readJsonArrayStorage(TRANSACTIONS_ALT_KEY));
    const localPt = mergeCloudPtOrders(readJsonArrayStorage(PT_BOOKINGS_KEY), readJsonArrayStorage(PT_ORDERS_KEY));

    const mergedUsers = mergeCloudUsers(localUsers, remote.users);
    const mergedTx = mergeCloudTransactions(localTx, remote.transactions);
    const mergedPt = mergeCloudPtOrders(localPt, remote.ptOrders);

    saveUsers(mergedUsers);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mergedTx));
    localStorage.setItem(TRANSACTIONS_ALT_KEY, JSON.stringify(mergedTx));
    localStorage.setItem(PT_BOOKINGS_KEY, JSON.stringify(mergedPt));
    localStorage.setItem(PT_ORDERS_KEY, JSON.stringify(mergedPt));

    const cur = getCurrentUser();
    if (cur && cur.email) {
      const updatedCur = mergedUsers.find(u => u.email && u.email.toLowerCase() === cur.email.toLowerCase());
      if (updatedCur) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...cur, ...updatedCur }));
      }
    }
    localStorage.setItem(SYNC_TS_KEY, String(Date.now()));
    renderApp();
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Single authoritative state synchronizer across currentUser, befit_users,
 * Admin transactions, PT orders, class bookings, cloud sync, and immediate UI re-render.
 */
function syncMasterState({ user = undefined, transaction = null, ptOrder = null, classBooking = null, crmNote = null, skipRender = false, skipCloudSync = false } = {}) {
  try {
    const targetUser = user !== undefined ? user : getCurrentUser();
    if (targetUser) {
      const nowTs = Date.now();
      targetUser.lastUpdatedAt = nowTs;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(targetUser));
      const users = getUsers();
      const idx = users.findIndex(u =>
        (u.id && targetUser.id && u.id === targetUser.id) ||
        (u.email && targetUser.email && u.email.toLowerCase().trim() === targetUser.email.toLowerCase().trim())
      );
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          ...targetUser,
          createdAtTimestamp: users[idx].createdAtTimestamp || targetUser.createdAtTimestamp || 0,
          lastUpdatedAt: nowTs
        };
      } else {
        targetUser.createdAtTimestamp = targetUser.createdAtTimestamp || nowTs;
        users.unshift(targetUser);
      }
      saveUsers(users);
    } else if (user === null) {
      localStorage.removeItem(CURRENT_USER_KEY);
    }

    if (transaction) {
      appendToStorageArray(TRANSACTIONS_KEY, transaction);
      appendToStorageArray(TRANSACTIONS_ALT_KEY, transaction);
    }

    if (ptOrder) {
      appendToStorageArray(PT_BOOKINGS_KEY, ptOrder);
      appendToStorageArray(PT_ORDERS_KEY, ptOrder);
    }

    if (classBooking) {
      appendToStorageArray(CLASS_BOOKINGS_KEY, classBooking);
    }

    if (crmNote && targetUser) {
      syncWithCRMState(targetUser, crmNote.type, crmNote.details);
    }

    localStorage.setItem(SYNC_TS_KEY, String(Date.now()));
    window.dispatchEvent(new CustomEvent('befit:stateUpdated', { detail: { user: targetUser, transaction, ptOrder, classBooking } }));

    if (!skipCloudSync && (targetUser || transaction || ptOrder)) {
      void pushCloudSync();
    }
  } catch (e) {
    console.error('syncMasterState error:', e);
  }

  if (!skipRender) {
    renderApp();
  }
}

function setCurrentUser(user) {
  syncMasterState({ user, skipCloudSync: true });
}

// Branch Storage
function getSelectedBranch() {
  try {
    const branchId = localStorage.getItem(BRANCH_STORAGE_KEY);
    const found = BRANCHES_DATA.find(b => b.id === branchId);
    if (found) return found;
  } catch (e) {}
  return BRANCHES_DATA[0];
}

function setSelectedBranch(branchId) {
  const branch = BRANCHES_DATA.find(b => b.id === branchId) || BRANCHES_DATA[0];
  try {
    localStorage.setItem(BRANCH_STORAGE_KEY, branch.id);
  } catch (e) {}
  updateBranchUI(branch);
  return branch;
}

// Classes Storage
function getClasses() {
  try {
    const raw = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= DEFAULT_CLASSES.length && parsed[0].branchIds) {
        return parsed;
      }
    }
  } catch (e) {}
  localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(DEFAULT_CLASSES));
  return DEFAULT_CLASSES;
}

function saveClasses(classes) {
  try {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
  } catch (e) {}
}

// Trainers Storage
// Trainers Storage
function getTrainers() {
  try {
    const raw = localStorage.getItem(TRAINERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= DEFAULT_TRAINERS.length && parsed.some(t => t.id === 'TR-14')) {
        return parsed.map(t => {
          const def = DEFAULT_TRAINERS.find(d => d.id === t.id);
          return {
            ...def,
            ...t,
            photo: (def && def.photo) || t.photo,
            shift: t.shift || (def ? def.shift : '07:00 – 14:00 WIB'),
            tier: t.tier || (def ? def.tier : 'FIT PRO'),
            gender: t.gender || (def ? def.gender : 'Pria'),
            categories: (Array.isArray(t.categories) && t.categories.length) ? t.categories : (def ? def.categories : ['Shape']),
            summarySpecialization: t.summarySpecialization || (def ? def.summarySpecialization : t.specialization),
            specializations: (Array.isArray(t.specializations) && t.specializations.length) ? t.specializations : (def ? def.specializations : []),
            certifications: (Array.isArray(t.certifications) && t.certifications.length) ? t.certifications : (def ? def.certifications : [])
          };
        });
      }
    }
  } catch (e) {}
  localStorage.setItem(TRAINERS_STORAGE_KEY, JSON.stringify(DEFAULT_TRAINERS));
  return DEFAULT_TRAINERS;
}

function saveTrainers(trainers) {
  try {
    localStorage.setItem(TRAINERS_STORAGE_KEY, JSON.stringify(trainers));
  } catch (e) {}
}

// CRM Sync
function syncWithCRMState(user, transactionType, details) {
  try {
    const crmRaw = localStorage.getItem(STORAGE_KEY);
    let crm = crmRaw ? JSON.parse(crmRaw) : { members: [], leads: [], classes: [], checkInLogs: [] };
    if (!crm.members) crm.members = [];

    const existingIdx = crm.members.findIndex(m => m.id === user.id);
    const memberEntry = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      packageType: user.packageType || 'Pro',
      joinDate: user.joinDate || new Date().toISOString().split('T')[0],
      expiryDate: user.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isFrozen: false,
      notes: `${transactionType}: ${details || 'Transaksi Berhasil'}`
    };

    if (existingIdx !== -1) {
      crm.members[existingIdx] = { ...crm.members[existingIdx], ...memberEntry };
    } else {
      crm.members.unshift(memberEntry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crm));
  } catch (e) {
    console.warn('CRM sync error:', e);
  }
}

// ==================== TOAST & BOTTOM SHEET ====================

function showToast(message, duration = 3000) {
  const el = document.getElementById('mobile-toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => {
    el.classList.remove('visible');
  }, duration);
}

let sheetOpen = false;
let sheetCloseTimer = null;

function openBottomSheet(contentHtml) {
  if (sheetCloseTimer) {
    clearTimeout(sheetCloseTimer);
    sheetCloseTimer = null;
  }

  const backdrop = document.getElementById('sheet-backdrop');
  const panel = document.getElementById('sheet-panel');
  const content = document.getElementById('sheet-content');

  if (!backdrop || !panel || !content) return;

  content.innerHTML = contentHtml;
  content.scrollTop = 0;
  backdrop.classList.remove('hidden');
  document.body.classList.add('sheet-open');
  sheetOpen = true;

  requestAnimationFrame(() => {
    backdrop.classList.add('visible');
    panel.classList.add('open');
  });
}

function closeBottomSheet() {
  const backdrop = document.getElementById('sheet-backdrop');
  const panel = document.getElementById('sheet-panel');

  if (!backdrop || !panel) return;

  if (sheetCloseTimer) {
    clearTimeout(sheetCloseTimer);
    sheetCloseTimer = null;
  }

  panel.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.classList.remove('sheet-open');
  sheetOpen = false;

  sheetCloseTimer = setTimeout(() => {
    sheetCloseTimer = null;
    if (!sheetOpen) {
      backdrop.classList.add('hidden');
      const content = document.getElementById('sheet-content');
      if (content) content.innerHTML = '';
    }
  }, 300);
}

function openCenterPopup(contentHtml) {
  const overlay = document.getElementById('center-popup-overlay');
  const card = document.getElementById('center-popup-card');
  if (!overlay || !card) {
    openBottomSheet(contentHtml);
    return;
  }
  card.innerHTML = contentHtml;
  card.scrollTop = 0;
  overlay.classList.remove('hidden');
  document.body.classList.add('sheet-open');
}

function closeCenterPopup() {
  const overlay = document.getElementById('center-popup-overlay');
  const card = document.getElementById('center-popup-card');
  if (!overlay) return;
  overlay.classList.add('hidden');
  if (card) card.innerHTML = '';
  if (!sheetOpen) {
    document.body.classList.remove('sheet-open');
  }
}


// ==================== AUTH GUARD, PASSWORD TOGGLES & REAL-TIME 5-DIGIT OTP ====================

let pendingAuthAction = null;
let pendingRegistrationData = null;
let otpCountdownInterval = null;

function requireAuth(nextAction) {
  const user = getCurrentUser();
  if (user) {
    if (typeof nextAction === 'function') nextAction();
    return true;
  }

  pendingAuthAction = nextAction;
  showToast('Silakan login atau daftar akun terlebih dahulu', 3500);
  openAuthModal('login');
  return false;
}

function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';

  if (btnEl) {
    btnEl.innerHTML = isPass ? `
      <!-- Eye Off (Sembunyikan) -->
      <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
      </svg>
    ` : `
      <!-- Eye Open (Lihat) -->
      <svg class="w-4 h-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    `;
    btnEl.setAttribute('title', isPass ? 'Sembunyikan password' : 'Lihat password');
  }
}

function checkRegisterPasswordMatch() {
  const p1 = document.getElementById('reg-password')?.value || '';
  const p2 = document.getElementById('reg-password-confirm')?.value || '';
  const feedback = document.getElementById('reg-password-feedback');
  const btn = document.getElementById('btn-submit-register');

  if (!feedback) return;

  if (!p2) {
    feedback.textContent = '';
    feedback.className = 'text-[11px] mt-1 hidden';
    if (btn) btn.disabled = false;
    return;
  }

  feedback.classList.remove('hidden');
  if (p1 === p2) {
    feedback.textContent = '✓ Password dan Konfirmasi Password cocok';
    feedback.className = 'text-[11px] mt-1 text-emerald-600 font-bold block';
    if (btn) btn.disabled = false;
  } else {
    feedback.textContent = '✗ Konfirmasi Password tidak sama dengan Password';
    feedback.className = 'text-[11px] mt-1 text-red-500 font-bold block';
  }
}

function openAuthModal(defaultTab = 'login') {
  const html = `
    <div class="mb-5 text-center">
      <!-- Large 96px Real Logo Emblem from User Image -->
      <div class="w-24 h-24 rounded-3xl mx-auto mb-3 shadow-xl overflow-hidden p-0.5 bg-[#090D16] border border-amber-500/40 relative flex items-center justify-center gold-glow">
        <img src="logo-square.jpg" alt="Be Fit Logo" class="w-full h-full object-cover rounded-[22px]">
      </div>

      <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="text-[9px] font-extrabold uppercase tracking-widest text-amber-800 font-sans">Official Member Portal</span>
      </div>

      <h3 class="text-xl font-extrabold tracking-tight">
        <span class="text-gold-gradient font-black">BE FIT</span>
      </h3>
      <p class="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 mt-0.5">GYM & FITNESS CLUB</p>
      <p class="text-xs text-slate-500 mt-1.5">Akses jadwal kelas, personal trainer, & membership</p>
    </div>

    <!-- Auth Tabs -->
    <div class="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
      <button type="button" id="tab-btn-login" class="flex-1 py-2 rounded-lg transition-all ${defaultTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}" onclick="switchAuthTab('login')">
        Masuk (Login)
      </button>
      <button type="button" id="tab-btn-register" class="flex-1 py-2 rounded-lg transition-all ${defaultTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}" onclick="switchAuthTab('register')">
        Daftar Akun Baru
      </button>
    </div>

    <!-- Quick Instant Demo Login Button -->
    <div class="mb-4">
      <button type="button" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-95 active:scale-[0.98] transition-all" onclick="loginInstantDemo()">
        <span>⚡</span>
        <span>Login Instan (Demo Member: Dimas)</span>
      </button>
    </div>

    <!-- Form Container -->
    <div id="auth-forms-container">
      ${getLoginFormHtml()}
    </div>
  `;

  openBottomSheet(html);
  if (defaultTab === 'register') {
    switchAuthTab('register');
  }
}

function getLoginFormHtml() {
  const prefillEmail = sessionStorage.getItem('befit_prefill_email') || '';
  return `
    <form id="form-login" class="space-y-3.5" onsubmit="handleLoginSubmit(event)">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Email atau No. WhatsApp</label>
        <input type="text" id="login-identifier" required placeholder="Contoh: member@befit.id atau 08123456789"
          value="${sanitize(prefillEmail)}"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
        <div class="relative flex items-center">
          <input type="password" id="login-password" required placeholder="Masukkan password akun"
            class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
          <button type="button" class="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
            onclick="togglePasswordVisibility('login-password', this)" title="Lihat password">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
      </div>
      <div class="text-right">
        <span class="text-[11px] text-slate-400 hover:text-teal-600 cursor-pointer" onclick="showToast('Password demo: 123456')">Lupa Password?</span>
      </div>
      <button type="submit" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all">
        Masuk ke Akun
      </button>
      <p class="text-[11px] text-slate-400 text-center">Akun demo: <strong class="text-slate-600">member@befit.id</strong> (pw: <strong class="text-slate-600">123456</strong>)</p>
    </form>
  `;
}

function getRegisterFormHtml() {
  return `
    <form id="form-register" class="space-y-3" onsubmit="handleRegisterSubmit(event)">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
        <input type="text" id="reg-name" required placeholder="Contoh: Budi Santoso"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Email Aktif (Untuk Kirim Kode OTP) *</label>
        <input type="email" id="reg-email" required placeholder="Contoh: budi@gmail.com"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
        <input type="tel" id="reg-phone" required placeholder="Contoh: 081298765432"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white font-mono" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Password *</label>
        <div class="relative flex items-center">
          <input type="password" id="reg-password" required minlength="4" placeholder="Minimal 4 karakter" oninput="checkRegisterPasswordMatch()"
            class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
          <button type="button" class="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
            onclick="togglePasswordVisibility('reg-password', this)" title="Lihat password">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password *</label>
        <div class="relative flex items-center">
          <input type="password" id="reg-password-confirm" required minlength="4" placeholder="Ulangi password di atas" oninput="checkRegisterPasswordMatch()"
            class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
          <button type="button" class="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
            onclick="togglePasswordVisibility('reg-password-confirm', this)" title="Lihat password">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>
        <p id="reg-password-feedback" class="text-[11px] mt-1 hidden"></p>
      </div>
      <button type="submit" id="btn-submit-register" class="w-full py-3 mt-1 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all">
        Kirim Kode OTP & Daftar 🎉
      </button>
      <p class="text-[10px] text-slate-400 text-center">Kode verifikasi 5-digit akan dikirimkan otomatis ke email Anda.</p>
    </form>
  `;
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('tab-btn-login');
  const regBtn = document.getElementById('tab-btn-register');
  const container = document.getElementById('auth-forms-container');
  if (!loginBtn || !regBtn || !container) return;

  if (tab === 'login') {
    loginBtn.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm transition-all';
    regBtn.className = 'flex-1 py-2 rounded-lg text-slate-500 transition-all';
    container.innerHTML = getLoginFormHtml();
  } else {
    regBtn.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm transition-all';
    loginBtn.className = 'flex-1 py-2 rounded-lg text-slate-500 transition-all';
    container.innerHTML = getRegisterFormHtml();
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const ident = document.getElementById('login-identifier')?.value.trim().toLowerCase();
  const pass = document.getElementById('login-password')?.value;

  if (!ident || !pass) {
    showToast('Harap masukkan email/no HP dan password');
    return;
  }

  // Admin routing check
  if ((ident === 'admin@befit.id' && pass === 'admin123') || (ident === 'rrizky205@gmail.com' && pass === 'wudinjir1911')) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    showToast('🔐 Login Admin Berhasil! Membuka CRM Dashboard...');
    closeBottomSheet();
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 500);
    return;
  }

  const users = getUsers();
  const found = users.find(u => {
    const emailMatch = u.email && u.email.toLowerCase() === ident;
    const phoneMatch = u.phone && u.phone.replace(/[^0-9]/g, '') === ident.replace(/[^0-9]/g, '');
    return (emailMatch || phoneMatch) && u.password === pass;
  });

  if (!found) {
    showToast('Email/No HP atau Password salah!');
    return;
  }

  setCurrentUser(found);
  closeBottomSheet();
  showToast(`Selamat datang kembali, ${found.name}! 👋`);
  renderApp();

  if (typeof pendingAuthAction === 'function') {
    const action = pendingAuthAction;
    pendingAuthAction = null;
    action();
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
  const phone = document.getElementById('reg-phone')?.value.trim();
  const pass = document.getElementById('reg-password')?.value;
  const passConfirm = document.getElementById('reg-password-confirm')?.value;

  if (!name || !email || !phone || !pass) {
    showToast('Harap isi semua kolom pendaftaran dengan benar!');
    return;
  }

  if (pass !== passConfirm) {
    showToast('Password dan Konfirmasi Password tidak sama!');
    return;
  }

  if (pass.length < 4) {
    showToast('Password minimal 4 karakter!');
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email && u.email.toLowerCase() === email)) {
    showToast('Email ini sudah terdaftar! Silakan login.');
    switchAuthTab('login');
    return;
  }

  // Generate 5-digit real-time random OTP
  const otpCode = generateOTP();

  pendingRegistrationData = {
    name,
    email,
    phone,
    password: pass,
    otp: otpCode,
    createdAt: Date.now()
  };

  showToast(`Mengirimkan OTP ke ${email}...`, 3000);

  // Send real OTP via EmailJS
  try {
    if (window.emailjs) {
      emailjs.send('service_befit_otp', 'template_otp', {
        to_email: email,
        user_email: email,
        otp_code: otpCode,
        user_name: name,
        app_name: 'Be Fit Gym & Fitness Club'
      }).then(
        res => console.log('[BE FIT EMAILJS OTP SENT]', res),
        err => console.warn('[BE FIT EMAILJS OTP FALLBACK]', err)
      );
    }
  } catch (err) {
    console.warn('EmailJS attempt:', err);
  }

  // Fallback console log for immediate testing
  console.log(`%c[BE FIT OTP SERVICE] Kode OTP 5-Digit untuk ${email}: ${otpCode}`, 'background: #0D9488; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');

  showToast('OTP 5-digit telah dikirim! Periksa inbox/spam email Anda.', 4500);

  openOTPVerificationSheet(email, otpCode);
}

function openOTPVerificationSheet(email, otpCode) {
  let timeLeft = 60;
  if (otpCountdownInterval) clearInterval(otpCountdownInterval);

  const html = `
    <div class="mb-4 text-center">
      <div class="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto mb-3 shadow-sm">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </div>
      <h3 class="text-lg font-black text-slate-900 tracking-tight">Verifikasi Kode OTP</h3>
      <p class="text-xs text-slate-500 mt-1">Kami telah mengirimkan kode verifikasi 5-digit ke email:</p>
      <p class="text-xs font-bold text-teal-600 mt-0.5 font-mono">${sanitize(email)}</p>
    </div>

    <!-- 5-Box OTP Inputs -->
    <div class="flex justify-center items-center gap-2 mb-4">
      <input type="text" maxlength="1" inputmode="numeric" id="otp-box-1" class="w-12 h-14 text-center text-2xl font-black font-mono border-2 border-slate-200 focus:border-teal-550 focus:ring-2 focus:ring-teal-550/20 rounded-xl outline-none transition-all" />
      <input type="text" maxlength="1" inputmode="numeric" id="otp-box-2" class="w-12 h-14 text-center text-2xl font-black font-mono border-2 border-slate-200 focus:border-teal-550 focus:ring-2 focus:ring-teal-550/20 rounded-xl outline-none transition-all" />
      <input type="text" maxlength="1" inputmode="numeric" id="otp-box-3" class="w-12 h-14 text-center text-2xl font-black font-mono border-2 border-slate-200 focus:border-teal-550 focus:ring-2 focus:ring-teal-550/20 rounded-xl outline-none transition-all" />
      <input type="text" maxlength="1" inputmode="numeric" id="otp-box-4" class="w-12 h-14 text-center text-2xl font-black font-mono border-2 border-slate-200 focus:border-teal-550 focus:ring-2 focus:ring-teal-550/20 rounded-xl outline-none transition-all" />
      <input type="text" maxlength="1" inputmode="numeric" id="otp-box-5" class="w-12 h-14 text-center text-2xl font-black font-mono border-2 border-slate-200 focus:border-teal-550 focus:ring-2 focus:ring-teal-550/20 rounded-xl outline-none transition-all" />
    </div>

    <!-- Testing helper banner -->
    <div class="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 text-center mb-4 flex items-center justify-center gap-1.5">
      <span>🔑</span>
      <span>Kode OTP Anda: <strong class="font-mono text-xs font-black tracking-widest text-teal-700">${otpCode}</strong></span>
    </div>

    <button type="button" id="btn-submit-otp" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all" onclick="submitOTPVerification()">
      Verifikasi & Selesaikan Pendaftaran
    </button>

    <div class="text-center mt-3.5">
      <span id="otp-timer-label" class="text-xs text-slate-400">Kirim ulang dalam <strong id="otp-sec" class="font-mono text-slate-700 font-bold">60</strong>s</span>
      <button type="button" id="btn-resend-otp-action" class="hidden text-xs font-bold text-teal-600 hover:underline" onclick="resendRegistrationOTP()">Kirim Ulang Kode OTP</button>
    </div>
  `;

  openBottomSheet(html);

  // Setup auto-focus and auto-advance
  setTimeout(() => {
    const b1 = document.getElementById('otp-box-1');
    if (b1) b1.focus();

    for (let i = 1; i <= 5; i++) {
      const box = document.getElementById(`otp-box-${i}`);
      if (!box) continue;

      box.addEventListener('input', () => {
        if (box.value.length === 1 && i < 5) {
          const next = document.getElementById(`otp-box-${i + 1}`);
          if (next) next.focus();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 1) {
          const prev = document.getElementById(`otp-box-${i - 1}`);
          if (prev) prev.focus();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (/^\d{5}$/.test(pasted)) {
          for (let j = 0; j < 5; j++) {
            const b = document.getElementById(`otp-box-${j + 1}`);
            if (b) b.value = pasted[j];
          }
          submitOTPVerification();
        }
      });
    }
  }, 100);

  // Countdown timer
  otpCountdownInterval = setInterval(() => {
    timeLeft--;
    const secEl = document.getElementById('otp-sec');
    if (secEl) secEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(otpCountdownInterval);
      const timerLabel = document.getElementById('otp-timer-label');
      const resendBtn = document.getElementById('btn-resend-otp-action');
      if (timerLabel) timerLabel.classList.add('hidden');
      if (resendBtn) resendBtn.classList.remove('hidden');
    }
  }, 1000);
}

function submitOTPVerification() {
  if (!pendingRegistrationData) {
    showToast('Sesi pendaftaran berakhir, silakan daftar ulang.');
    openAuthModal('register');
    return;
  }

  const entered = [1, 2, 3, 4, 5].map(i => document.getElementById(`otp-box-${i}`)?.value || '').join('');

  if (entered.length < 5) {
    showToast('Harap masukkan 5 digit kode OTP lengkap!');
    return;
  }

  if (entered !== pendingRegistrationData.otp) {
    showToast('Kode OTP salah! Periksa kembali email Anda.');
    for (let i = 1; i <= 5; i++) {
      const b = document.getElementById(`otp-box-${i}`);
      if (b) {
        b.classList.add('border-red-500', 'bg-red-50');
        setTimeout(() => b.classList.remove('border-red-500', 'bg-red-50'), 1500);
      }
    }
    return;
  }

  // OTP Valid! Register User
  if (otpCountdownInterval) clearInterval(otpCountdownInterval);

  const nowTs = Date.now();
  const isoToday = new Date().toISOString().split('T')[0];
  const selectedBranchObj = getSelectedBranch();
  const newUser = {
    id: 'USR-' + nowTs,
    name: pendingRegistrationData.name,
    email: pendingRegistrationData.email.toLowerCase().trim(),
    phone: pendingRegistrationData.phone,
    password: pendingRegistrationData.password,
    branch: normalizeBranchName(selectedBranchObj.name),
    branchFullName: selectedBranchObj.name,
    membershipPackage: 'Belum Berlangganan',
    packageType: 'Belum Berlangganan',
    packageDuration: 'Belum Berlangganan',
    membershipStatus: 'Akun Baru (Belum Aktif)',
    status: 'Belum Aktif',
    isPaidMember: false,
    daysRemaining: 0,
    expiryDate: null,
    injectedVouchers: [],
    usedVouchers: [],
    totalPaid: 0,
    membershipPaid: 0,
    ptPaid: 0,
    paymentMethod: '-',
    voucherUsed: '-',
    registeredAt: new Date().toLocaleDateString('id-ID'),
    createdAtTimestamp: nowTs,
    lastUpdatedAt: nowTs,
    ptSessions: 0,
    ptRemainingSessions: 0,
    activeTrainer: null,
    trainerBranch: null,
    ptPackageName: null,
    isTrialClaimed: false,
    bookedClasses: [],
    bookedTrainers: [],
    joinDate: isoToday,
    dateJoined: formatDateIndo(isoToday),
    role: 'member'
  };

  syncMasterState({
    user: newUser,
    crmNote: {
      type: 'Pendaftaran Akun Baru',
      details: `Cabang ${newUser.branch} (${newUser.email})`
    }
  });

  closeBottomSheet();
  showToast(`🎉 Pendaftaran Berhasil! Selamat datang di Be Fit, ${newUser.name}. Silakan pilih paket membership Anda.`, 4000);
  renderCalendarDatePicker();
  renderApp();

  pendingRegistrationData = null;

  if (typeof pendingAuthAction === 'function') {
    const action = pendingAuthAction;
    pendingAuthAction = null;
    action();
  }
}

function resendRegistrationOTP() {
  if (!pendingRegistrationData) return;
  const newCode = generateOTP();
  pendingRegistrationData.otp = newCode;

  showToast(`OTP 5-digit baru telah dikirim ke ${pendingRegistrationData.email}!`);
  console.log(`%c[BE FIT RESEND OTP] Kode baru: ${newCode}`, 'background: #0D9488; color: #fff; font-size: 14px; font-weight: bold;');

  openOTPVerificationSheet(pendingRegistrationData.email, newCode);
}

function loginInstantDemo() {
  const users = getUsers();
  const dimas = users.find(u => u.id === 'BF-1001') || users[0];
  if (dimas) {
    setCurrentUser(dimas);
    closeBottomSheet();
    showToast(`Login instan berhasil! Masuk sebagai ${dimas.name}`);
    renderCalendarDatePicker();
    renderApp();

    if (typeof pendingAuthAction === 'function') {
      const action = pendingAuthAction;
      pendingAuthAction = null;
      action();
    }
  }
}

function handleLogout() {
  setCurrentUser(null);
  closeBottomSheet();
  showToast('Anda telah keluar dari akun');
  renderCalendarDatePicker();
  renderApp();
}

// ==================== 1. BRANCH SELECTION & CROWD METER ====================

function updateBranchUI(branch) {
  const nameEl = document.getElementById('current-branch-name');
  const addrEl = document.getElementById('current-branch-address');
  const crowdContainer = document.getElementById('current-crowd-container');
  const hdrBranchEl = document.getElementById('header-branch-name');

  if (nameEl) nameEl.textContent = branch.name;
  if (addrEl) addrEl.textContent = branch.address;
  if (hdrBranchEl) hdrBranchEl.textContent = branch.name;

  if (crowdContainer) {
    crowdContainer.innerHTML = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm"
        style="background-color: ${branch.crowdBg}; color: ${branch.crowdText}; border: 1px solid ${branch.crowdBorder};">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Gym Area Crowd &nbsp;|&nbsp; <span class="font-extrabold uppercase tracking-wider">${branch.crowd} (${branch.crowdPercentage}%)</span>
      </span>
    `;
  }

  // Reactive updates for classes and trainers according to branch
  renderCalendarDatePicker();
  renderHomeClasses();
  renderHomeTrainers();

  if (typeof renderFullTrainerScreen === 'function') {
    const fullScreen = document.getElementById('full-trainer-screen');
    if (fullScreen && !fullScreen.classList.contains('hidden')) {
      renderFullTrainerScreen();
    }
  }
}

function openBranchSheet() {
  const currentBranch = getSelectedBranch();

  const items = BRANCHES_DATA.map(b => {
    const isSelected = b.id === currentBranch.id;
    return `
      <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${isSelected ? 'border-teal-550 bg-teal-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}"
        onclick="handleSelectBranch('${b.id}')">
        <div class="flex items-start gap-3 text-left">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: ${b.crowdBg}; color: ${b.crowdText};">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900">${sanitize(b.name)}</h4>
              ${isSelected ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-teal-550 text-white">Dipilih</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">${sanitize(b.address)}</p>
            <div class="mt-1.5 flex items-center gap-2 text-[10px] font-bold">
              <span class="px-2 py-0.5 rounded-full" style="background-color: ${b.crowdBg}; color: ${b.crowdText};">
                Crowd: ${b.crowd} (${b.crowdPercentage}%)
              </span>
              <span class="text-slate-400">${b.hours}</span>
            </div>
          </div>
        </div>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-550 bg-teal-550' : 'border-slate-300'}">
          ${isSelected ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
        </div>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Pilih Cabang Be Fit</h3>
      <p class="text-xs text-slate-400 mt-0.5">Jadwal kelas, ketersediaan trainer, dan crowd meter akan disesuaikan</p>
    </div>
    <div class="space-y-2.5">${items}</div>
  `);
}

function handleSelectBranch(branchId) {
  const branch = setSelectedBranch(branchId);
  closeBottomSheet();
  showToast(`Lokasi gym diubah ke ${branch.name}`);
}

function openCrowdInfo() {
  const branch = getSelectedBranch();

  openBottomSheet(`
    <div class="text-center mb-4">
      <div class="inline-flex p-3 rounded-2xl mb-2" style="background-color: ${branch.crowdBg};">
        <svg class="w-8 h-8" style="color: ${branch.crowdText};" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      </div>
      <h3 class="text-base font-extrabold text-slate-900">${sanitize(branch.name)}</h3>
      <p class="text-xs text-slate-400 mt-0.5">Live Crowd Meter: <strong style="color: ${branch.crowdText}; font-size: 13px;">${branch.crowd} (~${branch.crowdPercentage}% Kapasitas)</strong></p>
    </div>

    <div class="space-y-2.5">
      <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-xs">
        <div>
          <span class="font-bold text-green-800">06:00 - 09:00 WIB</span>
          <span class="text-[10px] text-green-600 block">Sesi Pagi Tenang</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low (20%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
        <div>
          <span class="font-bold text-amber-800">09:00 - 15:00 WIB</span>
          <span class="text-[10px] text-amber-600 block">Sesi Siang Santai</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Medium (50%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
        <div>
          <span class="font-bold text-red-800">16:00 - 20:30 WIB</span>
          <span class="text-[10px] text-red-600 block">Prime Time Malam (Jam Ramai)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">High (85%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-xs">
        <div>
          <span class="font-bold text-green-800">20:30 - 22:00 WIB</span>
          <span class="text-[10px] text-green-600 block">Sesi Malam Tenang</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low (30%)</span>
      </div>
    </div>
  `);
}

// ==================== 2. REAL-TIME CALENDAR DATEPICKER & CLASS SCHEDULE ====================

let selectedClassDateKey = null;

function getTodayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCalendarDateList() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDate = now.getDate();

  // Start strictly from TODAY (no past dates at all)
  const startDate = new Date(currentYear, currentMonth, todayDate);

  // End of current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const endDate = new Date(currentYear, currentMonth, lastDayOfMonth);

  const dates = [];
  const cur = new Date(startDate);

  // Collect all days from today until the end of the month
  while (cur <= endDate) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  // Ensure minimum 14 days available so member can plan ahead into next month
  if (dates.length < 14) {
    const needed = 14 - dates.length;
    for (let i = 0; i < needed; i++) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }

  return dates;
}

function renderCalendarDatePicker() {
  const track = document.getElementById('calendar-datepicker-track');
  if (!track) return;

  if (!selectedClassDateKey || selectedClassDateKey < getTodayDateKey()) {
    selectedClassDateKey = getTodayDateKey();
  }

  const dates = getCalendarDateList();
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  track.innerHTML = dates.map(d => {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isSelected = key === selectedClassDateKey;
    const isToday = key === getTodayDateKey();
    const dayName = dayNames[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const monthName = monthNames[d.getMonth()];

    return `
      <button type="button" class="date-pill shrink-0 flex flex-col items-center justify-center py-2 px-3 rounded-2xl border transition-all ${isSelected ? 'bg-teal-550 text-white border-teal-550 shadow-md ring-2 ring-teal-550/20' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}"
        style="min-width: 58px;" onclick="selectClassDate('${key}')">
        <span class="text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-teal-100' : 'text-slate-400'}">${dayName}</span>
        <span class="text-base font-black ${isSelected ? 'text-white' : 'text-slate-900'}">${dateNum}</span>
        <span class="text-[9px] font-bold ${isSelected ? 'text-teal-100' : 'text-slate-400'}">${isToday ? 'Hari Ini' : monthName}</span>
      </button>
    `;
  }).join('');

  // Subtitle update
  const subtitle = document.getElementById('classes-date-subtitle');
  if (subtitle) {
    const parts = selectedClassDateKey.split('-');
    const selD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const dayIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][selD.getDay()];
    const monthIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][selD.getMonth()];
    subtitle.textContent = `Jadwal • ${dayIndo}, ${parts[2]} ${monthIndo} ${parts[0]}`;
  }
}

function selectClassDate(key) {
  if (key < getTodayDateKey()) {
    showToast('Tanggal yang dipilih sudah terlewat.');
    return;
  }
  selectedClassDateKey = key;
  renderCalendarDatePicker();
  renderHomeClasses();
}

function renderHomeClasses() {
  const container = document.getElementById('home-classes-container');
  if (!container) return;

  if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();

  const currentBranch = getSelectedBranch();
  const currentUser = getCurrentUser();

  // Dynamic 2-4 classes per date and branch
  const classes = getClassesForBranch(currentBranch.id, selectedClassDateKey);

  if (classes.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center w-full bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
        Belum ada kelas terjadwal untuk cabang ${currentBranch.name}.
      </div>
    `;
    return;
  }

  container.innerHTML = classes.map(cls => {
    const slotInfo = getRealisticClassSlotInfo(cls, selectedClassDateKey, currentUser ? currentUser.id : null);
    const isRegistered = slotInfo.isRegistered;
    const currentSlots = slotInfo.currentSlots;
    const isFull = slotInfo.isFull;

    let buttonHtml = '';
    let badgeHtml = '';

    if (isRegistered) {
      buttonHtml = `
        <span class="inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-emerald-500 text-slate-950 shadow-sm">
          ✓ TERDAFTAR
        </span>
      `;
      badgeHtml = `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-sm">Terdaftar</span>`;
    } else if (isFull) {
      buttonHtml = `
        <span class="inline-block mt-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          KELAS PENUH
        </span>
      `;
      badgeHtml = `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 shadow-sm">Penuh</span>`;
    } else {
      buttonHtml = `
        <span class="inline-block mt-2 text-[10px] font-extrabold text-brand-sunny uppercase tracking-wider group-hover:underline">
          DAFTAR KELAS &gt;
        </span>
      `;
      badgeHtml = `
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${currentSlots <= 3 ? 'bg-amber-500' : 'bg-green-600'} text-white shadow-sm">
          Tersisa ${currentSlots} Slot
        </span>
      `;
    }

    return `
      <button type="button" class="class-card relative shrink-0 rounded-[14px] overflow-hidden shadow-card group snap-start text-left"
        style="width:175px;height:230px;" onclick="openClassDetail('${cls.id}')">
        <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
        
        <!-- Time Pill -->
        <span class="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-slate-800 backdrop-blur-sm shadow-sm font-mono">
          🕒 ${cls.time.split('–')[0].trim()}
        </span>
        
        <!-- Quota Badge -->
        ${badgeHtml}

        <!-- Bottom Info -->
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${cls.difficulty === 'Easy' ? 'bg-white/20 text-green-300' : 'bg-white/20 text-amber-300'} backdrop-blur-sm mb-1">
            ${cls.difficulty}
          </span>
          <h3 class="text-white text-sm font-extrabold leading-tight truncate">${sanitize(cls.name)}</h3>
          <p class="text-white/70 text-[11px] font-medium mt-0.5 truncate">With ${sanitize(cls.instructor)}</p>
          ${buttonHtml}
        </div>
      </button>
    `;
  }).join('') + '<div class="shrink-0 w-1"></div>';
}

function openClassDetail(classId) {
  if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();
  const currentBranch = getSelectedBranch();
  const classes = getClassesForBranch(currentBranch.id, selectedClassDateKey);
  const cls = classes.find(c => c.id === classId) || classes[0];
  const currentUser = getCurrentUser();

  const slotInfo = getRealisticClassSlotInfo(cls, selectedClassDateKey, currentUser ? currentUser.id : null);
  const isRegistered = slotInfo.isRegistered;
  const currentSlots = slotInfo.currentSlots;
  const isFull = slotInfo.isFull;

  const parts = selectedClassDateKey.split('-');
  const selD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dateFormatted = `${parts[2]} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][selD.getMonth()]} ${parts[0]}`;

  const isPaid = isUserPaidMember(currentUser);

  let actionBtnHtml = '';
  if (isRegistered) {
    actionBtnHtml = `
      <button type="button" id="btn-book-class-detail-${cls.id}" disabled style="background-color: #16A34A; color: #FFFFFF;" class="w-full py-3.5 rounded-xl border border-emerald-600 text-sm font-black flex items-center justify-center gap-2 cursor-not-allowed shadow-sm">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>✓ Terdaftar</span>
      </button>
    `;
  } else if (isFull) {
    actionBtnHtml = `
      <button type="button" id="btn-book-class-detail-${cls.id}" disabled class="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
        <span>Kuota Kelas Penuh untuk Tanggal Ini</span>
      </button>
    `;
  } else if (currentUser && !isPaid) {
    actionBtnHtml = `
      <div class="space-y-2">
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <span class="text-base">🔒</span>
          <span class="font-medium">Kelas gym ini khusus untuk member aktif Be Fit. Silakan beli paket membership terlebih dahulu untuk mendaftar kelas.</span>
        </div>
        <button type="button" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          onclick="openMembershipRequiredModal('${sanitize(cls.name)}')">
          <span>🚀 Pilih Paket Membership &rarr;</span>
        </button>
      </div>
    `;
  } else {
    actionBtnHtml = `
      <button type="button" id="btn-book-class-detail-${cls.id}" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        onclick="handleBookClass('${cls.id}', this)">
        <span>Daftar Kelas Ini (${dateFormatted})</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>
    `;
  }

  openBottomSheet(`
    <div class="relative rounded-2xl overflow-hidden mb-4 h-48">
      <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-3 left-4 right-4">
        <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-550 text-white mb-1 shadow-sm">
          ${cls.difficulty} Level
        </span>
        <h3 class="text-white text-lg font-black tracking-tight leading-snug">${sanitize(cls.name)}</h3>
      </div>
    </div>

    <!-- Date & Location info -->
    <div class="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl mb-3 flex items-center justify-between text-xs font-bold text-teal-900">
      <span class="flex items-center gap-1.5">
        <span>📅</span>
        <span>Jadwal: ${dateFormatted}</span>
      </span>
      <span class="text-teal-700 font-mono">${getSelectedBranch().name.split(' ')[2] || 'Bandung'}</span>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-4 text-center">
      <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
        <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Jam</span>
        <span class="text-xs font-black text-slate-900 font-mono mt-0.5 block">${cls.time}</span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
        <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Instruktur</span>
        <span class="text-xs font-black text-slate-900 mt-0.5 block truncate">${sanitize(cls.instructor)}</span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
        <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Sisa Kuota</span>
        <span id="class-detail-quota-${cls.id}" class="text-xs font-black ${currentSlots <= 3 ? 'text-amber-600' : 'text-green-600'} font-mono mt-0.5 block">Tersisa ${currentSlots} Slot</span>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Kelas</h4>
      <p class="text-xs text-slate-600 leading-relaxed">${sanitize(cls.description)}</p>
    </div>

    ${actionBtnHtml}
  `);
}

function openMembershipRequiredModal(className = '') {
  const html = `
    <div class="text-center py-2 mb-3">
      <div class="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
        <span class="text-3xl">🔒</span>
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1">
        Akses Khusus Member
      </span>
      <h3 class="text-lg font-black text-slate-900 mt-1">Berlangganan Membership Dahulu</h3>
      <p class="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
        Pendaftaran kelas gym ${className ? `<strong>"${sanitize(className)}"</strong> ` : ''}hanya dapat diakses oleh member aktif Be Fit. Silakan pilih paket membership untuk menikmati seluruh akses kelas tanpa batas!
      </p>
    </div>

    <div class="p-4 bg-teal-50/80 rounded-2xl border border-teal-200/80 my-3 text-xs space-y-2">
      <div class="flex items-center gap-2 text-teal-900 font-bold">
        <span>✨ Keuntungan Member Be Fit:</span>
      </div>
      <ul class="space-y-1.5 text-slate-600 text-[11px] pl-1">
        <li class="flex items-center gap-1.5">
          <span class="text-teal-600 font-bold">✓</span> Akses unlimited seluruh kelas harian di semua cabang
        </li>
        <li class="flex items-center gap-1.5">
          <span class="text-teal-600 font-bold">✓</span> Fasilitas locker, shower, sauna & free WiFi
        </li>
        <li class="flex items-center gap-1.5">
          <span class="text-teal-600 font-bold">✓</span> Diskon 15% untuk member baru dengan kode <strong>MEMBERBARU15</strong>
        </li>
      </ul>
    </div>

    <div class="space-y-2.5">
      <button type="button" class="w-full py-3.5 rounded-xl bg-teal-550 hover:bg-teal-650 active:scale-[0.98] text-white text-xs font-black shadow-md shadow-teal-550/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        onclick="closeBottomSheet(); openPricingSheet();">
        <span>🚀 Pilih Paket Membership Sekarang</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>

      <button type="button" class="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
        onclick="closeBottomSheet()">
        Nanti Saja
      </button>
    </div>
  `;
  openBottomSheet(html);
}

function handleBookClass(classId, triggerBtn = null) {
  requireAuth(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const currentBranch = getSelectedBranch();
    if (!selectedClassDateKey || selectedClassDateKey < getTodayDateKey()) {
      selectedClassDateKey = getTodayDateKey();
    }
    const classes = getClassesForBranch(currentBranch.id, selectedClassDateKey);
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;

    if (!isUserPaidMember(currentUser)) {
      showToast('⚠️ Pendaftaran kelas khusus untuk member aktif. Silakan berlangganan paket membership terlebih dahulu!');
      openMembershipRequiredModal(cls.name);
      return;
    }

    if (selectedClassDateKey < getTodayDateKey()) {
      showToast('Tidak dapat memesan kelas untuk tanggal yang sudah lewat!');
      return;
    }

    const slotInfo = getRealisticClassSlotInfo(cls, selectedClassDateKey, currentUser.id);
    if (slotInfo.isRegistered) {
      showToast('Anda sudah terdaftar di kelas ini untuk tanggal tersebut!');
      return;
    }

    if (slotInfo.isFull || slotInfo.currentSlots <= 0) {
      showToast('Maaf, kuota kelas pada tanggal ini sudah penuh!');
      return;
    }

    const newSlots = Math.max(0, slotInfo.currentSlots - 1);

    // 1. Register booking in persistent storage
    saveClassDateBooking(cls.id, selectedClassDateKey, currentUser.id);

    // 2. Save to user bookedClasses & sync master state
    currentUser.bookedClasses = Array.isArray(currentUser.bookedClasses) ? currentUser.bookedClasses : [];
    currentUser.bookedClasses.push({
      classId: cls.id,
      className: cls.name,
      branch: currentBranch.name,
      dateKey: selectedClassDateKey,
      time: cls.time,
      instructor: cls.instructor,
      bookedAt: new Date().toISOString()
    });

    const classBookingRecord = {
      id: 'CLS-BK-' + Math.floor(1000 + Math.random() * 9000),
      memberId: currentUser.id,
      memberEmail: currentUser.email || '',
      userName: currentUser.name,
      userPhone: currentUser.phone,
      classId: cls.id,
      className: cls.name,
      instructor: cls.instructor,
      branch: currentBranch.name,
      dateKey: selectedClassDateKey,
      time: cls.time,
      remainingSlots: newSlots,
      status: 'Terkonfirmasi'
    };

    syncMasterState({ user: currentUser, classBooking: classBookingRecord });

    // 3. IMMEDIATELY update DOM buttons & quota labels right on screen
    const detailBtn = document.getElementById(`btn-book-class-detail-${cls.id}`);
    const listBtn = document.getElementById(`btn-book-class-list-${cls.id}`);
    [detailBtn, listBtn, triggerBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = true;
      btn.style.backgroundColor = '#16A34A';
      btn.style.color = '#FFFFFF';
      btn.style.borderColor = '#16A34A';
      btn.classList.remove('bg-teal-550', 'hover:bg-teal-650', 'cursor-pointer');
      btn.classList.add('cursor-not-allowed', 'font-black');
      btn.innerHTML = '<span>✓ Terdaftar</span>';
    });

    const detailQuotaEl = document.getElementById(`class-detail-quota-${cls.id}`);
    if (detailQuotaEl) {
      detailQuotaEl.textContent = `Tersisa ${newSlots} Slot`;
      detailQuotaEl.className = 'text-xs font-black text-emerald-600 font-mono mt-0.5 block';
    }

    const listQuotaEl = document.getElementById(`class-list-quota-${cls.id}`);
    if (listQuotaEl) {
      listQuotaEl.textContent = `Tersisa ${newSlots} Slot (${cls.capacity} kapasitas) • ${cls.room}`;
      listQuotaEl.className = 'text-[10px] font-bold text-emerald-600';
    }

    const listRowEl = document.getElementById(`class-list-row-${cls.id}`);
    if (listRowEl) {
      listRowEl.classList.remove('border-slate-100', 'hover:bg-slate-50');
      listRowEl.classList.add('border-emerald-300', 'bg-emerald-50/40');
    }

    // 4. Format date & open Centered Confirmation Modal (z-[9999])
    const parts = selectedClassDateKey.split('-');
    const selD = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dateFormatted = `${parts[2]} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][selD.getMonth()]} ${parts[0]}`;

    openCenterPopup(`
      <div class="text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          ✓ Terkonfirmasi
        </span>
        <h3 class="text-lg font-black text-slate-900 leading-snug">🎉 Berhasil Terdaftar di Kelas!</h3>
        <p class="text-xs text-slate-500 mt-1">Slot latihan Anda telah diamankan. Harap hadir 10 menit sebelum kelas dimulai.</p>

        <div class="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Nama Kelas:</span>
            <span class="font-bold text-slate-900 text-right">${sanitize(cls.name)}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Instruktur:</span>
            <span class="font-bold text-slate-800 text-right">${sanitize(cls.instructor)}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Cabang:</span>
            <span class="font-bold text-teal-700 text-right">${sanitize(currentBranch.name)}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Tanggal & Jam:</span>
            <span class="font-bold text-slate-800 font-mono text-right">${dateFormatted} • ${cls.time}</span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between gap-2">
            <span class="text-slate-500 font-bold">Sisa Kuota Kelas:</span>
            <span class="font-black text-emerald-600 font-mono">Tersisa ${newSlots} Slot</span>
          </div>
        </div>

        <button type="button" onclick="closeCenterPopup()"
          class="w-full mt-4 py-3 rounded-xl bg-teal-550 hover:bg-teal-650 active:scale-[0.98] text-white text-sm font-black shadow-md transition-all cursor-pointer">
          Oke, Mengerti
        </button>
      </div>
    `);
  });
}

function openAllClassesSheet(targetDateKey = null) {
  const currentBranch = getSelectedBranch();
  if (targetDateKey && targetDateKey >= getTodayDateKey()) {
    selectedClassDateKey = targetDateKey;
  } else if (!selectedClassDateKey || selectedClassDateKey < getTodayDateKey()) {
    selectedClassDateKey = getTodayDateKey();
  }

  // Sync home calendar picker
  renderCalendarDatePicker();
  renderHomeClasses();

  const classes = getClassesForBranch(currentBranch.id, selectedClassDateKey);
  const currentUser = getCurrentUser();

  const parts = selectedClassDateKey.split('-');
  const selD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dayIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][selD.getDay()];
  const monthIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][selD.getMonth()];
  const dateFormatted = `${dayIndo}, ${parts[2]} ${monthIndo} ${parts[0]}`;

  // Horizontal Date Selector (Today Onwards)
  const dates = getCalendarDateList();
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const datePillsHtml = `
    <div class="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-slate-100">
      ${dates.map(d => {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const isSelected = key === selectedClassDateKey;
        const isToday = key === getTodayDateKey();
        const dayName = dayNames[d.getDay()];
        const dateNum = String(d.getDate()).padStart(2, '0');
        return `
          <button type="button" class="shrink-0 flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border transition-all ${isSelected ? 'bg-teal-550 text-white border-teal-550 shadow-sm font-bold ring-2 ring-teal-550/20' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
            style="min-width: 52px;" onclick="openAllClassesSheet('${key}')">
            <span class="text-[9px] uppercase ${isSelected ? 'text-teal-100 font-bold' : 'text-slate-400 font-medium'}">${dayName}</span>
            <span class="text-sm font-black">${dateNum}</span>
            <span class="text-[8px] ${isSelected ? 'text-teal-100 font-bold' : 'text-slate-400'}">${isToday ? 'Hari Ini' : monthNames[d.getMonth()]}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  const cards = classes.map(cls => {
    const slotInfo = getRealisticClassSlotInfo(cls, selectedClassDateKey, currentUser ? currentUser.id : null);
    const isRegistered = slotInfo.isRegistered;
    const slots = slotInfo.currentSlots;
    const isFull = slotInfo.isFull;

    return `
      <div id="class-list-row-${cls.id}" class="w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${isRegistered ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-100 hover:bg-slate-50'} text-left">
        <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm cursor-pointer" onclick="openClassDetail('${cls.id}')">
        <div class="flex-1 min-w-0 cursor-pointer" onclick="openClassDetail('${cls.id}')">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-slate-900 truncate">${sanitize(cls.name)}</h4>
          </div>
          <p class="text-[11px] text-teal-600 font-bold mt-0.5">🕒 ${cls.time} • With ${sanitize(cls.instructor)}</p>
          <span id="class-list-quota-${cls.id}" class="text-[10px] font-bold ${isFull ? 'text-slate-400' : slots <= 3 ? 'text-amber-600' : 'text-green-600'}">
            ${isFull ? 'Kuota Penuh' : `Tersisa ${slots} Slot dari ${cls.capacity} kuota`} • ${cls.room}
          </span>
        </div>
        <div class="shrink-0">
          ${isRegistered ? `
            <button type="button" id="btn-book-class-list-${cls.id}" disabled style="background-color: #16A34A; color: #FFFFFF;" class="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-emerald-600 cursor-not-allowed">
              ✓ Terdaftar
            </button>
          ` : isFull ? `
            <button type="button" id="btn-book-class-list-${cls.id}" disabled class="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-bold border border-slate-200 cursor-not-allowed">
              Penuh
            </button>
          ` : `
            <button type="button" id="btn-book-class-list-${cls.id}" class="px-3 py-1.5 rounded-lg bg-teal-550 text-white text-[10px] font-black hover:bg-teal-650 active:scale-95 shadow-sm transition-all cursor-pointer"
              onclick="handleBookClass('${cls.id}', this)">
              Daftar Kelas
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-extrabold text-slate-900">Jadwal Kelas — ${currentBranch.name}</h3>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">Mulai Hari Ini</span>
      </div>
      <p class="text-xs text-slate-400 mt-0.5">${dateFormatted} (${classes.length} kelas aktif)</p>
    </div>
    ${datePillsHtml}
    <div class="space-y-2.5 max-h-[50vh] overflow-y-auto">${cards}</div>
  `);
}

// ==================== 3. INTERACTIVE MEMBERSHIP SELECTION & DYNAMIC CHECKOUT ====================

function openPricingSheet(selectedPackageId = 'pkg-3m') {
  let activePkgId = selectedPackageId;

  function getPackagePriceInfo(pkg) {
    const isUnlocked = isRetentionUnlocked();
    const promoCode = activePromoCode || (isUnlocked ? 'RENEWLOYAL25' : null);
    const promo = promoCode ? VOUCHERS_DATA.find(x => x.code === promoCode) : null;
    let disc = 0;
    if (promo) {
      if (promo.code === 'RENEWLOYAL25') {
        if (isUnlocked) {
          disc = Math.round(pkg.price * 0.25);
        }
      } else if (promo.code === 'MEMBERBARU15') {
        disc = Math.round(pkg.price * 0.15);
      } else if (promo.code === 'GAJIAN100K' && pkg.durationDays >= 90) {
        disc = 100000;
      }
    }
    const finalPrice = Math.max(0, pkg.price - disc);
    return { base: pkg.price, disc, finalPrice, promo: (promo && promo.code === 'RENEWLOYAL25' && !isUnlocked) ? null : promo };
  }

  function renderPackages() {
    return MEMBERSHIP_PACKAGES.map(pkg => {
      const isSelected = pkg.id === activePkgId;
      const { base, disc, finalPrice } = getPackagePriceInfo(pkg);

      return `
        <div class="membership-card p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${isSelected ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}"
          onclick="selectMembershipCard('${pkg.id}')">
          
          <!-- Top Badge -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${pkg.badgeColor} shadow-sm">
                ${pkg.badge}
              </span>
              ${disc > 0 ? `
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Potongan ${formatRupiah(disc)} (-25%)
                </span>
              ` : ''}
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}">
              ${isSelected ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
            </div>
          </div>

          <!-- Name & Pricing -->
          <h4 class="text-sm font-black text-slate-900">${sanitize(pkg.name)}</h4>
          <div class="flex items-baseline gap-1.5 mt-1">
            ${disc > 0 ? `
              <span class="text-lg font-black text-emerald-600 font-mono">${formatRupiah(finalPrice)}</span>
              <span class="text-xs text-slate-400 line-through font-mono">${formatRupiah(base)}</span>
            ` : `
              <span class="text-lg font-black text-teal-600 font-mono">${formatRupiah(base)}</span>
              <span class="text-[11px] text-slate-400 font-medium">(${formatRupiah(pkg.pricePerMonth)}/bln)</span>
            `}
          </div>

          <!-- Features list -->
          <ul class="mt-3 space-y-1.5 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
            ${pkg.features.map(f => `
              <li class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                <span>${sanitize(f)}</span>
              </li>
            `).join('')}
          </ul>

          <!-- Action Button inside card -->
          <div class="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400">${pkg.durationDays} Hari Membership</span>
            <button type="button" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-teal-550 hover:text-white'}"
              onclick="event.stopPropagation(); selectMembershipCard('${pkg.id}'); window.proceedWithActiveMembership();">
              ${isRetentionUnlocked() ? 'Perpanjang Sekarang &rarr;' : 'Pilih Paket Ini &rarr;'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.selectMembershipCard = (pkgId) => {
    activePkgId = pkgId;
    const container = document.getElementById('membership-packages-list');
    if (container) container.innerHTML = renderPackages();

    const selectedPkg = MEMBERSHIP_PACKAGES.find(p => p.id === activePkgId);
    const payBtn = document.getElementById('btn-checkout-membership');
    if (payBtn && selectedPkg) {
      const { finalPrice } = getPackagePriceInfo(selectedPkg);
      payBtn.innerHTML = `
        <span>${isRetentionUnlocked() ? 'Perpanjang Sekarang' : 'Lanjut ke Pembayaran'} (${formatRupiah(finalPrice)})</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      `;
    }
  };

  window.proceedWithActiveMembership = () => {
    handleMembershipCheckout(activePkgId);
  };

  const initialPkg = MEMBERSHIP_PACKAGES.find(p => p.id === activePkgId) || MEMBERSHIP_PACKAGES[0];
  const { finalPrice: initPrice } = getPackagePriceInfo(initialPkg);
  const activePromoObj = activePromoCode ? VOUCHERS_DATA.find(x => x.code === activePromoCode) : null;

  const html = `
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-extrabold text-slate-900">Pilih Paket Membership Be Fit</h3>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">Self-Service</span>
      </div>
      <p class="text-xs text-slate-400 mt-0.5">Pilih paket latihan yang sesuai dengan target kebugaranmu</p>
    </div>

    ${isRetentionUnlocked() ? `
      <div class="mb-3.5 p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-xs text-emerald-950 shadow-sm animate-pulse">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">🎉</span>
          <div>
            <strong class="block leading-tight font-black text-emerald-900">🎉 Voucher Perpanjangan 25% (RENEWLOYAL25) Aktif Otomatis di Akun Anda!</strong>
            <span class="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Harga di bawah ini sudah dipotong 25% secara langsung.</span>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-lg font-mono font-black bg-emerald-600 text-white text-[11px] shadow-sm shrink-0">-25%</span>
      </div>
    ` : (activePromoObj && (activePromoObj.code === 'MEMBERBARU15' || activePromoObj.code === 'GAJIAN100K') ? `
      <div class="mb-3.5 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
        <div class="flex items-center gap-2">
          <span class="text-base">🏷️</span>
          <div>
            <strong class="block leading-tight font-black">Voucher ${activePromoObj.code} Aktif!</strong>
            <span class="text-[10px] text-emerald-700 font-medium">${activePromoObj.desc}</span>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-300">${activePromoObj.badge}</span>
      </div>
    ` : '')}

    <!-- Interactive Packages Grid -->
    <div id="membership-packages-list" class="space-y-3 mb-5">
      ${renderPackages()}
    </div>

    <!-- CTA Checkout Button -->
    <button type="button" id="btn-checkout-membership" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      onclick="window.proceedWithActiveMembership()">
      <span>${isRetentionUnlocked() ? 'Perpanjang Sekarang' : 'Lanjut ke Pembayaran'} (${formatRupiah(initPrice)})</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    </button>
  `;

  openBottomSheet(html);
}

function handleMembershipCheckout(pkgId) {
  requireAuth(() => {
    const pkg = MEMBERSHIP_PACKAGES.find(p => p.id === pkgId) || MEMBERSHIP_PACKAGES[0];
    openUnifiedCheckout({
      type: 'membership',
      package: pkg
    });
  });
}

// ==================== 4. PERSONAL TRAINER SELECTION & OWNED STATUS ====================

function renderHomeTrainers() {
  const wrapper = document.getElementById('home-trainers-wrapper');
  if (!wrapper) return;

  const currentBranch = getSelectedBranch();
  const allTrainers = getTrainers();
  const currentUser = getCurrentUser();

  // If Buah Batu branch: NO TRAINERS AVAILABLE
  if (currentBranch.id === 'buahbatu') {
    wrapper.innerHTML = `
      <div class="px-4 w-full">
        <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center flex flex-col items-center justify-center">
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mb-2.5">🏋️‍♂️</div>
          <h4 class="text-sm font-extrabold tracking-tight">Belum Ada Personal Trainer Tersedia di Cabang Ini</h4>
          <p class="text-xs text-white/70 mt-1 max-w-[260px]">Belum ada Personal Trainer tersedia di cabang Be Fit Buah Batu saat ini. Silakan kunjungi cabang Setiabudi, Dago, atau Pasirkaliki untuk sesi latihan privat.</p>
        </div>
      </div>
    `;
    return;
  }

  // Filter trainers for this branch
  const trainers = allTrainers.filter(t => Array.isArray(t.branchIds) ? t.branchIds.includes(currentBranch.id) : true);

  if (trainers.length === 0) {
    wrapper.innerHTML = `
      <div class="px-4 w-full">
        <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center">
          <h4 class="text-sm font-extrabold">Belum ada trainer tersedia di cabang ini</h4>
        </div>
      </div>
    `;
    return;
  }

  const trainerCards = trainers.map(t => {
    const isBooked = currentUser && Array.isArray(currentUser.bookedTrainers) && currentUser.bookedTrainers.includes(t.id);
    return `
      <button type="button" class="trainer-card relative shrink-0 rounded-xl overflow-hidden shadow-lg group snap-start text-left cursor-pointer" style="width:145px;height:195px;" onclick="openTrainerDetail('${t.id}')">
        <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <span class="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[8.5px] font-black text-white backdrop-blur-sm shadow-sm border border-white/20">
          ${t.tier || 'FIT PRO'}
        </span>
        ${isBooked ? `
          <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950 shadow-sm">
            ✓ AKTIF
          </span>
        ` : ''}
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <h4 class="text-white text-sm font-extrabold leading-tight">${sanitize(t.name)}</h4>
          <p class="text-white/80 text-[10px] font-medium mt-0.5">${t.clients} klien aktif</p>
        </div>
      </button>
    `;
  }).join('');

  wrapper.innerHTML = `
    <!-- Left: Price Column (Fixed 125px) -->
    <div class="shrink-0 pl-4 pr-2 flex flex-col items-start justify-center" style="width:130px;">
      <span class="text-[11px] font-bold text-white/70 uppercase tracking-wider">Mulai Dari</span>
      <span class="text-2xl font-extrabold text-brand-sunny leading-tight mt-0.5">Rp 199K</span>
      <span class="text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">Per Sesi</span>
      <span class="inline-block mt-3 px-3 py-1.5 rounded-full text-[10px] font-bold bg-brand-sunny text-slate-900 text-center leading-tight">Khusus Member<br>Baru & Rejoin</span>
    </div>

    <!-- Right: Trainer Cards Horizontal Scroll -->
    <div class="hide-scrollbar flex-1 flex gap-3 overflow-x-auto pr-4 pb-1 snap-x snap-mandatory">
      ${trainerCards}
      <div class="shrink-0 w-1"></div>
    </div>
  `;
}

// ==================== PERSONAL TRAINER STATE, FULL-SCREEN VIEWS & FILTERS ====================

let activeTrainerFilters = {
  gender: null,    // 'Pria' | 'Wanita'
  category: null,  // 'Athletic' | 'Shape'
  tier: null       // 'FIT TRAINER' | 'FIT MASTER' | 'FIT PRO'
};
let activeTrainerDetailTab = 'specialization'; // 'specialization' | 'certification' | 'packages'
let currentDetailTrainerId = null;

function toggleTrainerFilter(type, value) {
  if (activeTrainerFilters[type] === value) {
    activeTrainerFilters[type] = null;
  } else {
    activeTrainerFilters[type] = value;
  }
  renderFullTrainerScreen();
}

function resetTrainerFilters() {
  activeTrainerFilters = { gender: null, category: null, tier: null };
  renderFullTrainerScreen();
}

function openAllTrainersSheet() {
  closeBottomSheet();
  closeFullTrainerDetailScreen();
  setActiveNav('trainer');
  const screen = document.getElementById('full-trainer-screen');
  if (screen) {
    screen.classList.remove('hidden');
    renderFullTrainerScreen();
    screen.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function closeFullTrainerScreen() {
  const screen = document.getElementById('full-trainer-screen');
  if (screen) {
    screen.classList.add('hidden');
  }
  setActiveNav('home');
}

function renderFullTrainerScreen() {
  const container = document.getElementById('full-trainer-screen');
  if (!container) return;

  const currentBranch = getSelectedBranch();
  const allTrainers = getTrainers();
  const branchTrainers = allTrainers.filter(t => Array.isArray(t.branchIds) ? t.branchIds.includes(currentBranch.id) : true);
  const currentUser = getCurrentUser();

  const isAnyFilterActive = Boolean(activeTrainerFilters.gender || activeTrainerFilters.category || activeTrainerFilters.tier);

  // Filter logic
  const filteredTrainers = branchTrainers.filter(t => {
    if (activeTrainerFilters.gender && t.gender !== activeTrainerFilters.gender) {
      return false;
    }
    if (activeTrainerFilters.category) {
      const cats = Array.isArray(t.categories) ? t.categories : [t.categories];
      if (!cats.includes(activeTrainerFilters.category)) return false;
    }
    if (activeTrainerFilters.tier && t.tier !== activeTrainerFilters.tier) {
      return false;
    }
    return true;
  });

  const filterBtnClass = (isActive) => isActive
    ? 'px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer bg-teal-600 text-white border-2 border-teal-600 shadow-sm shrink-0'
    : 'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:text-teal-700 shrink-0';

  let contentHtml = '';

  if (currentBranch.id === 'buahbatu') {
    contentHtml = `
      <div class="p-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-center flex flex-col items-center justify-center my-6">
        <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-3 shadow-inner">🏋️‍♂️</div>
        <h4 class="text-base font-black tracking-tight leading-snug">Belum Ada Personal Trainer Tersedia di Cabang Ini</h4>
        <p class="text-xs text-white/80 mt-1.5 leading-relaxed max-w-[280px]">
          Layanan Personal Trainer segera hadir untuk cabang <strong>${sanitize(currentBranch.name)}</strong>. Silakan kunjungi cabang Setiabudi, Dago, atau Pasirkaliki untuk sesi latihan privat.
        </p>
        <button type="button" onclick="openBranchSheet()" class="mt-4 px-4 py-2 rounded-xl bg-white text-teal-900 text-xs font-black shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
          Pilih Cabang Lain
        </button>
      </div>
    `;
  } else if (filteredTrainers.length === 0) {
    contentHtml = `
      <div class="p-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-center flex flex-col items-center justify-center my-6">
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mb-2.5 shadow-inner">🔍</div>
        <h4 class="text-sm font-black tracking-tight leading-snug">Tidak Ada Trainer Sesuai Filter</h4>
        <p class="text-xs text-white/80 mt-1 max-w-[260px] leading-relaxed">
          Tidak ditemukan pelatih dengan kombinasi filter yang dipilih di ${sanitize(currentBranch.name)}.
        </p>
        <button type="button" onclick="resetTrainerFilters()" class="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer">
          Reset Filter (${branchTrainers.length} Trainer Tersedia)
        </button>
      </div>
    `;
  } else {
    const cards = filteredTrainers.map(t => {
      const isBooked = currentUser && Array.isArray(currentUser.bookedTrainers) && currentUser.bookedTrainers.includes(t.id);
      const specSummary = t.summarySpecialization || (Array.isArray(t.specializations) ? t.specializations.slice(0, 3).join(', ') : t.specialization);

      return `
        <button type="button" class="w-full text-left group cursor-pointer flex flex-col focus:outline-none" onclick="openTrainerDetail('${t.id}')">
          <!-- Photo Box -->
          <div class="relative w-full rounded-2xl overflow-hidden aspect-[3/4] shadow-md group-hover:shadow-xl transition-all bg-slate-900">
            <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none">
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

            <!-- Tier Badge Solid Top Left -->
            <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/25">
              ${t.tier}
            </span>

            ${isBooked ? `
              <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] font-black bg-emerald-500 text-slate-950 shadow-sm">
                ✓ AKTIF
              </span>
            ` : ''}

            <!-- Bottom Content inside Photo -->
            <div class="absolute bottom-0 left-0 right-0 p-2.5 pointer-events-none">
              <h3 class="text-white text-xs font-black leading-tight group-hover:text-amber-300 transition-colors truncate">
                ${sanitize(t.name)}
              </h3>
              <p class="text-white/80 text-[10px] font-medium mt-0.5 flex items-center gap-1">
                <span>👤</span> <strong>${t.clients} klien aktif</strong>
              </p>
            </div>
          </div>

          <!-- Bottom Summary outside Photo (on top of tosca background) -->
          <div class="mt-2 px-0.5 pointer-events-none">
            <p class="text-[11px] text-white/95 font-semibold leading-snug line-clamp-2">
              ${sanitize(specSummary)}
            </p>
          </div>
        </button>
      `;
    }).join('');

    contentHtml = `
      <div class="grid grid-cols-2 gap-3.5">
        ${cards}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 flex flex-col pb-24">
      <!-- 1. Header & Club Selector (Clean White) -->
      <div class="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 pt-3 pb-3 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <button type="button" onclick="closeFullTrainerScreen()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 cursor-pointer transition-all" title="Kembali ke Beranda">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 class="text-lg font-black text-slate-900 tracking-tight">Personal Trainer</h1>
          </div>
          <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            ${branchTrainers.length} Pelatih
          </span>
        </div>

        <!-- Kartu Dropdown Lokasi (Club Selector) -->
        <button type="button" onclick="openBranchSheet()" class="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-teal-500 bg-white shadow-sm cursor-pointer group transition-all text-left">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Club dipilih</span>
              <span class="text-xs font-black text-slate-900 group-hover:text-teal-600 transition-colors mt-0.5 block">${sanitize(currentBranch.name)}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-slate-400 group-hover:text-teal-600 font-bold text-xs pr-1">
            <span>Ganti</span>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </button>

        <!-- 2. Sistem Filter Kategori ("Filter sesuai kebutuhanmu") -->
        <div class="mt-3 pt-3 border-t border-slate-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-extrabold text-slate-700 tracking-tight">Filter sesuai kebutuhanmu</span>
            ${isAnyFilterActive ? `
              <button type="button" onclick="resetTrainerFilters()" class="text-[10px] font-black text-teal-600 hover:text-teal-800 underline cursor-pointer">
                Reset Filter
              </button>
            ` : ''}
          </div>

          <!-- Baris 1: Filter Gender & Tujuan Latihan -->
          <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1.5">
            <button type="button" onclick="toggleTrainerFilter('gender', 'Pria')" class="${filterBtnClass(activeTrainerFilters.gender === 'Pria')}">
              🧍‍♂️ Pria
            </button>
            <button type="button" onclick="toggleTrainerFilter('gender', 'Wanita')" class="${filterBtnClass(activeTrainerFilters.gender === 'Wanita')}">
              🧍‍♀️ Wanita
            </button>
            <button type="button" onclick="toggleTrainerFilter('category', 'Athletic')" class="${filterBtnClass(activeTrainerFilters.category === 'Athletic')}">
              🏃 Athletic
            </button>
            <button type="button" onclick="toggleTrainerFilter('category', 'Shape')" class="${filterBtnClass(activeTrainerFilters.category === 'Shape')}">
              🏋️ Shape
            </button>
          </div>

          <!-- Baris 2: Filter Level / Tier Trainer -->
          <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pt-0.5">
            <button type="button" onclick="toggleTrainerFilter('tier', 'FIT TRAINER')" class="${filterBtnClass(activeTrainerFilters.tier === 'FIT TRAINER')}">
              ^ FIT TRAINER
            </button>
            <button type="button" onclick="toggleTrainerFilter('tier', 'FIT MASTER')" class="${filterBtnClass(activeTrainerFilters.tier === 'FIT MASTER')}">
              ^^ FIT MASTER
            </button>
            <button type="button" onclick="toggleTrainerFilter('tier', 'FIT PRO')" class="${filterBtnClass(activeTrainerFilters.tier === 'FIT PRO')}">
              ^^^ FIT PRO
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Seksi Katalog Trainer (Full-Width Teal Gradient Container) -->
      <div class="flex-1 bg-gradient-to-b from-[#0D9488] via-[#0F766E] to-[#115E59] px-4 pt-5 pb-10">
        <!-- Headline Promo -->
        <div class="mb-3.5">
          <h2 class="text-xl font-black text-white tracking-tight leading-snug">Hemat hingga 36% 🎉</h2>
          <p class="text-xs text-teal-100 font-medium mt-0.5">Khusus member baru dan rejoin</p>
        </div>

        <!-- Tombol Banner Konsultasi WhatsApp -->
        <a href="https://wa.me/6282116156884?text=Halo%20Admin%20Be%20Fit%2C%20saya%20ingin%20konsultasi%20gratis%20untuk%20memilih%20Personal%20Trainer%20yang%20paling%20sesuai%20dengan%20target%20latihan%20saya." target="_blank" rel="noopener noreferrer"
          class="w-full bg-white rounded-xl p-3.5 shadow-md flex items-center justify-between text-left group cursor-pointer hover:bg-slate-50 active:scale-[0.99] transition-all mb-4">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.697c.974.57 1.761.854 2.806.854 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm7.421 5.766c-.002 4.092-3.329 7.42-7.422 7.42-1.31 0-2.327-.333-3.328-.881l-3.693.968.986-3.597c-.608-.999-.958-2.127-.957-3.91.002-4.091 3.33-7.419 7.422-7.419 4.092 0 7.421 3.328 7.421 7.421z"/></svg>
            </div>
            <span class="text-xs font-black text-slate-800 leading-snug">Konsultasi GRATIS untuk pilih trainer terbaik</span>
          </div>
          <span class="text-teal-600 font-black text-base shrink-0 group-hover:translate-x-1 transition-transform ml-2">→</span>
        </a>

        <!-- Trainer Grid / Empty State -->
        ${contentHtml}
      </div>
    </div>
  `;
}

function openTrainerDetail(idOrIndex) {
  closeBottomSheet();
  const trainers = getTrainers();
  const t = typeof idOrIndex === 'string'
    ? (trainers.find(x => x.id === idOrIndex) || trainers[0])
    : (trainers[idOrIndex] || trainers[0]);

  currentDetailTrainerId = t.id;
  activeTrainerDetailTab = 'specialization';

  const screen = document.getElementById('full-trainer-detail-screen');
  if (!screen) return;
  screen.classList.remove('hidden');
  renderFullTrainerDetailScreen(t);
  screen.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeFullTrainerDetailScreen() {
  const screen = document.getElementById('full-trainer-detail-screen');
  if (screen) {
    screen.classList.add('hidden');
    screen.innerHTML = '';
  }
}

function setTrainerDetailTab(tabName) {
  activeTrainerDetailTab = tabName;
  renderTrainerDetailTabContent();
}

function renderFullTrainerDetailScreen(t) {
  const screen = document.getElementById('full-trainer-detail-screen');
  if (!screen || !t) return;

  const currentBranch = getSelectedBranch();
  const waBranchName = currentBranch.name;
  const waMsg = `Halo Admin Be Fit, saya ingin bertanya informasi selengkapnya mengenai Personal Trainer ${t.name} di cabang ${waBranchName}.`;
  const waUrl = `https://wa.me/6282116156884?text=${encodeURIComponent(waMsg)}`;

  screen.innerHTML = `
    <div class="min-h-screen bg-slate-50 flex flex-col pb-12 relative">
      <!-- A. Foto Header Besar (300px) & Tombol Kembali -->
      <div class="relative w-full h-[300px] overflow-hidden bg-slate-900 shrink-0">
        <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <!-- Tombol Kembali Bulat Putih (←) -->
        <button type="button" onclick="closeFullTrainerDetailScreen()" class="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 text-slate-800 shadow-xl flex items-center justify-center hover:bg-white active:scale-90 transition-all cursor-pointer z-20" title="Kembali">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <div class="absolute bottom-4 left-4 right-4">
          <span class="inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/30">
            ${t.gender} • ${Array.isArray(t.categories) ? t.categories.join(' & ') : t.categories}
          </span>
        </div>
      </div>

      <!-- B. Informasi Utama Trainer (Area Putih Bersih) -->
      <div class="bg-white -mt-6 rounded-t-3xl relative z-10 px-5 pt-5 pb-8 shadow-sm flex-1">
        <!-- 1. Tombol WhatsApp Outlined -->
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer"
          class="w-full border-2 border-[#0D9488] bg-teal-50/50 hover:bg-teal-50 active:scale-[0.99] rounded-xl p-3 flex items-center justify-between text-left group cursor-pointer mb-4 transition-all shadow-sm">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.697c.974.57 1.761.854 2.806.854 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm7.421 5.766c-.002 4.092-3.329 7.42-7.422 7.42-1.31 0-2.327-.333-3.328-.881l-3.693.968.986-3.597c-.608-.999-.958-2.127-.957-3.91.002-4.091 3.33-7.419 7.422-7.419 4.092 0 7.421 3.328 7.421 7.421z"/></svg>
            </div>
            <span class="text-xs font-black text-teal-950 leading-snug">Hubungi untuk informasi selengkapnya</span>
          </div>
          <span class="text-teal-700 font-black text-base shrink-0 group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <!-- 2. Nama & Badge Tier -->
        <div class="flex items-start justify-between gap-3 mb-3.5">
          <div class="min-w-0">
            <h1 class="text-xl font-black text-slate-900 tracking-tight leading-snug">${sanitize(t.name)}</h1>
            <p class="text-xs text-slate-500 font-bold mt-0.5">${sanitize(t.fullName)}</p>
          </div>
          <span class="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#14B8A6] shadow-sm shrink-0 whitespace-nowrap">
            ${t.tier}
          </span>
        </div>

        ${(() => {
          const curU = getCurrentUser();
          const hasTrainer = curU && ((Array.isArray(curU.bookedTrainers) && curU.bookedTrainers.includes(t.id)) || curU.activeTrainer === t.name);
          const sessCount = curU && curU.trainerSessionsMap && curU.trainerSessionsMap[t.id] !== undefined
            ? curU.trainerSessionsMap[t.id]
            : (curU ? (Number(curU.ptRemainingSessions ?? curU.ptSessions) || 0) : 0);
          if (!hasTrainer || sessCount <= 0) return '';
          return `
            <div class="mb-3.5 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center justify-between gap-2 shadow-sm">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-xs">✓</div>
                <div class="min-w-0">
                  <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Status Coaching Anda</span>
                  <h4 class="text-xs font-black text-emerald-950 truncate">Sesi Personal Trainer Aktif: ${sanitize(t.name)} (Sisa ${sessCount} Sesi)</h4>
                </div>
              </div>
            </div>
          `;
        })()}

        <!-- 3. 4 Baris Info Kredensial + Jam Operasional -->
        <div class="grid grid-cols-2 gap-2 mb-3.5">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏋️ Lokasi Club</span>
            <span class="text-xs font-black text-slate-800 mt-0.5 block truncate">Be Fit ${currentBranch.name.replace('Be Fit ', '')}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👥 Client</span>
            <span class="text-xs font-black text-slate-800 mt-0.5 block">${t.clients} Active Client</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">⭐ Pengalaman</span>
            <span class="text-xs font-black text-slate-800 mt-0.5 block">${t.experience}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🕒 Jam Operasional</span>
            <span class="text-xs font-black text-teal-700 font-mono mt-0.5 block">${t.shift || '07:00 – 14:00 WIB'}</span>
          </div>
        </div>

        <!-- Bio Trainer -->
        <p class="text-xs text-slate-600 leading-relaxed mb-4">${sanitize(t.bio)}</p>

        <!-- C. 3 Tab Navigasi Pill Interaktif (Spesialisasi | Sertifikasi | Paket Sesi) -->
        <div class="flex items-center justify-between gap-1.5 p-1 bg-slate-100/90 rounded-full mb-4 border border-slate-200/80">
          <button type="button" onclick="setTrainerDetailTab('specialization')"
            id="tab-btn-specialization"
            style="border-radius: 9999px; ${activeTrainerDetailTab === 'specialization' ? 'background: #CCFBF1; color: #0F766E; border: 1.5px solid #0D9488;' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #CBD5E1;'}"
            class="flex-1 py-2 text-xs text-center cursor-pointer transition-all ${activeTrainerDetailTab === 'specialization' ? 'font-extrabold shadow-sm' : 'font-semibold'}">
            Spesialisasi
          </button>
          <button type="button" onclick="setTrainerDetailTab('certification')"
            id="tab-btn-certification"
            style="border-radius: 9999px; ${activeTrainerDetailTab === 'certification' ? 'background: #CCFBF1; color: #0F766E; border: 1.5px solid #0D9488;' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #CBD5E1;'}"
            class="flex-1 py-2 text-xs text-center cursor-pointer transition-all ${activeTrainerDetailTab === 'certification' ? 'font-extrabold shadow-sm' : 'font-semibold'}">
            Sertifikasi
          </button>
          <button type="button" onclick="setTrainerDetailTab('packages')"
            id="tab-btn-packages"
            style="border-radius: 9999px; ${activeTrainerDetailTab === 'packages' ? 'background: #CCFBF1; color: #0F766E; border: 1.5px solid #0D9488;' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #CBD5E1;'}"
            class="flex-1 py-2 text-xs text-center cursor-pointer transition-all ${activeTrainerDetailTab === 'packages' ? 'font-extrabold shadow-sm' : 'font-semibold'}">
            Paket Sesi
          </button>
        </div>

        <!-- Tab Content Container -->
        <div id="trainer-detail-tab-content">
          <!-- Populated by renderTrainerDetailTabContent() -->
        </div>
      </div>
    </div>
  `;

  renderTrainerDetailTabContent();
}

function renderTrainerDetailTabContent() {
  const container = document.getElementById('trainer-detail-tab-content');
  if (!container) return;

  const trainers = getTrainers();
  const t = trainers.find(x => x.id === currentDetailTrainerId) || trainers[0];
  const currentUser = getCurrentUser();
  const isBooked = currentUser && Array.isArray(currentUser.bookedTrainers) && currentUser.bookedTrainers.includes(t.id);

  // Update tab buttons styles
  ['specialization', 'certification', 'packages'].forEach(tabName => {
    const btn = document.getElementById(`tab-btn-${tabName}`);
    if (btn) {
      if (activeTrainerDetailTab === tabName) {
        btn.style.cssText = 'border-radius: 9999px; background: #CCFBF1; color: #0F766E; border: 1.5px solid #0D9488;';
        btn.className = 'flex-1 py-2 text-xs text-center cursor-pointer transition-all font-extrabold shadow-sm';
      } else {
        btn.style.cssText = 'border-radius: 9999px; background: #FFFFFF; color: #64748B; border: 1.5px solid #CBD5E1;';
        btn.className = 'flex-1 py-2 text-xs text-center cursor-pointer transition-all font-semibold';
      }
    }
  });

  if (activeTrainerDetailTab === 'specialization') {
    const list = Array.isArray(t.specializations) ? t.specializations : [t.specialization];
    container.innerHTML = `
      <div class="space-y-2">
        ${list.map(spec => `
          <div class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 text-xs font-black shadow-2xs" style="background-color: #F1F5F9; color: #1E293B;">
            <span class="text-base shrink-0">🎯</span>
            <span class="uppercase tracking-wider">${sanitize(spec)}</span>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeTrainerDetailTab === 'certification') {
    const list = Array.isArray(t.certifications) ? t.certifications : [t.certifications];
    container.innerHTML = `
      <div class="space-y-2">
        ${list.map(cert => `
          <div class="border border-slate-200/80 text-xs font-bold flex items-start gap-3 shadow-2xs" style="background-color: #F1F5F9; padding: 12px 16px; border-radius: 8px; color: #334155;">
            <span class="text-base shrink-0 text-amber-500">🏆</span>
            <span class="leading-relaxed">${sanitize(cert)}</span>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeTrainerDetailTab === 'packages') {
    const isPtPromoActive = activePromoCode === 'PTPROMO20';
    const sessCount = currentUser && currentUser.trainerSessionsMap && currentUser.trainerSessionsMap[t.id] !== undefined
      ? currentUser.trainerSessionsMap[t.id]
      : (currentUser ? (Number(currentUser.ptRemainingSessions ?? currentUser.ptSessions) || 0) : 0);

    const packageRows = t.packages.map((pkg, pi) => {
      const disc = isPtPromoActive ? Math.round(pkg.price * 0.20) : 0;
      const finalPrice = Math.max(0, pkg.price - disc);

      return `
        <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 active:bg-teal-50 transition-all text-left group cursor-pointer"
          onclick="handleTrainerPackageSelect('${t.id}', ${pi})">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-900 group-hover:text-teal-700">${pkg.label}</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-extrabold ${pkg.badge && pkg.badge.includes('🔥') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                ${pkg.badge || ''}
              </span>
              ${disc > 0 ? `
                <span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  -20%
                </span>
              ` : ''}
            </div>
            <span class="text-[11px] text-slate-400 block mt-0.5">${formatRupiah(pkg.perSession)}/sesi privat</span>
          </div>
          <div class="text-right">
            ${disc > 0 ? `
              <span class="text-sm font-black text-emerald-600 font-mono">${formatRupiah(finalPrice)}</span>
              <span class="text-[10px] text-slate-400 line-through font-mono block">${formatRupiah(pkg.price)}</span>
            ` : `
              <span class="text-sm font-black text-teal-600 font-mono">${formatRupiah(pkg.price)}</span>
            `}
            <span class="text-[10px] text-teal-700 font-bold block mt-0.5 group-hover:underline">${isBooked && sessCount > 0 ? '+ Tambah Sesi & Bayar &gt;' : 'Pilih & Lanjut Bayar &gt;'}</span>
          </div>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      ${isBooked && sessCount > 0 ? `
        <div class="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl mb-3 flex items-center gap-2.5 text-xs font-bold text-emerald-900 shadow-sm">
          <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <span>Sesi Personal Trainer Aktif: ${sanitize(t.name)} (Sisa ${sessCount} Sesi)</span>
        </div>
      ` : ''}

      ${isPtPromoActive ? `
        <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl mb-3 flex items-center justify-between text-xs text-emerald-900">
          <div class="flex items-center gap-2">
            <span class="text-base">🏷️</span>
            <div>
              <strong class="block leading-tight font-black">Voucher PTPROMO20 Aktif!</strong>
              <span class="text-[10px] text-emerald-700 font-medium">Diskon 20% otomatis memotong tagihan saat checkout</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-300">-20%</span>
        </div>
      ` : ''}

      <div class="space-y-2.5">
        ${packageRows}
      </div>
    `;
  }
}

function handleTrainerPackageSelect(trainerId, packageIndex) {
  requireAuth(() => {
    const trainers = getTrainers();
    const t = trainers.find(x => x.id === trainerId) || trainers[0];
    const pkg = t.packages[packageIndex] || t.packages[0];

    openUnifiedCheckout({
      type: 'pt',
      trainer: t,
      package: pkg
    });
  });
}

function setActiveNav(tab) {
  const items = document.querySelectorAll('.bottom-nav-item');
  items.forEach(item => {
    const isThisTab = item.dataset.tab === tab;
    let pill = item.querySelector('.nav-active-pill');
    if (isThisTab) {
      item.classList.remove('text-slate-400');
      item.classList.add('text-teal-550', 'text-teal-600');
      const textSpan = item.querySelector('span:last-child');
      if (textSpan) {
        textSpan.classList.add('font-bold');
        textSpan.classList.remove('font-medium');
      }
      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'nav-active-pill absolute -top-0.5 w-8 h-0.5 rounded-full bg-teal-550';
        item.style.position = 'relative';
        item.prepend(pill);
      }
    } else {
      item.classList.remove('text-teal-550', 'text-teal-600');
      item.classList.add('text-slate-400');
      const textSpan = item.querySelector('span:last-child');
      if (textSpan) {
        textSpan.classList.remove('font-bold');
        textSpan.classList.add('font-medium');
      }
      if (pill) pill.remove();
    }
  });

  const centerPricingBtn = document.getElementById('btn-nav-pricing') || document.querySelector('button[data-tab="pricing"]');
  if (centerPricingBtn) {
    const iconDiv = centerPricingBtn.querySelector('div');
    if (tab === 'pricing' || tab === 'membership' || tab === 'cek-harga') {
      if (iconDiv) iconDiv.classList.add('ring-4', 'ring-teal-400', 'scale-105');
    } else {
      if (iconDiv) iconDiv.classList.remove('ring-4', 'ring-teal-400', 'scale-105');
    }
  }
}

function navigateToTab(tab) {
  if (tab === 'home') {
    closeFullTrainerScreen();
    closeFullTrainerDetailScreen();
    closeBottomSheet();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNav('home');
  } else if (tab === 'pricing' || tab === 'membership' || tab === 'cek-harga') {
    closeFullTrainerScreen();
    closeFullTrainerDetailScreen();
    openPricingSheet('pkg-3m');
    setActiveNav('pricing');
  } else if (tab === 'trainer') {
    openAllTrainersSheet();
  } else if (tab === 'class') {
    closeFullTrainerScreen();
    closeFullTrainerDetailScreen();
    openAllClassesSheet();
    setActiveNav('class');
  } else if (tab === 'profile') {
    closeFullTrainerScreen();
    closeFullTrainerDetailScreen();
    openProfileSheet();
    setActiveNav('profile');
  }
}

window.switchTab = navigateToTab;
window.setActiveTab = navigateToTab;

// ==================== 5. UNIFIED PAYMENT CHECKOUT SYSTEM (NO CREDIT CARD) ====================

let activePaymentMethod = 'qris';
let appliedVoucher = null;
let activePromoCode = null;
try {
  activePromoCode = sessionStorage.getItem('befit_active_promo') ||
                    localStorage.getItem('befit_active_voucher') ||
                    localStorage.getItem('befit_pending_promo') ||
                    null;
} catch (e) {}

function setActivePromoCode(code) {
  activePromoCode = code;
  try {
    if (code) {
      sessionStorage.setItem('befit_active_promo', code);
      localStorage.setItem('befit_active_voucher', code);
      localStorage.setItem('befit_pending_promo', code);
    } else {
      sessionStorage.removeItem('befit_active_promo');
      localStorage.removeItem('befit_active_voucher');
      localStorage.removeItem('befit_pending_promo');
    }
  } catch (e) {}
}

function openUnifiedCheckout(params) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    requireAuth(() => openUnifiedCheckout(params));
    return;
  }

  const { type, package: pkg, trainer } = params;
  activePaymentMethod = 'qris';
  let appliedVoucher = null;
  let voucherError = '';
  const claimedList = getUserClaimedVouchers();

  // Auto-apply active promo code if valid and not yet used
  const promoCodeToApply = activePromoCode || (isRetentionUnlocked() && type === 'membership' ? 'RENEWLOYAL25' : null);
  if (promoCodeToApply) {
    const promo = VOUCHERS_DATA.find(x => x.code === promoCodeToApply);
    const userUsed = Array.isArray(currentUser.usedVouchers) ? currentUser.usedVouchers : [];
    if (promo && !userUsed.includes(promo.code)) {
      if (type === 'membership') {
        if (promo.code === 'RENEWLOYAL25') {
          if (isRetentionUnlocked()) {
            appliedVoucher = promo;
            setActivePromoCode('RENEWLOYAL25');
          }
        } else if (promo.code === 'MEMBERBARU15') {
          appliedVoucher = promo;
        } else if (promo.code === 'GAJIAN100K' && (!pkg.durationDays || pkg.durationDays >= 90)) {
          appliedVoucher = promo;
        } else if (promo.type === 'membership' && (!promo.minAmount || pkg.price >= promo.minAmount)) {
          appliedVoucher = promo;
        }
      } else if (type === 'pt') {
        if (promo.code === 'PTPROMO20' || promo.type === 'pt') {
          appliedVoucher = promo;
        }
      }
    }
  }

  function calculateBilling() {
    let base = pkg.price;
    let disc = 0;
    if (appliedVoucher) {
      if (appliedVoucher.percent) {
        disc = Math.round(base * (appliedVoucher.percent / 100));
      } else if (appliedVoucher.amount) {
        disc = Math.min(base, appliedVoucher.amount);
      }
    }
    const total = Math.max(0, base - disc);
    return { base, disc, total, appliedVoucher };
  }

  function applyCheckoutVoucher(code) {
    voucherError = '';
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      voucherError = 'Masukkan kode voucher terlebih dahulu.';
      updateCheckoutUI();
      return;
    }

    if (cleanCode === 'RENEWLOYAL25' && !isRetentionUnlocked()) {
      voucherError = 'Voucher ini khusus member dengan masa aktif tersisa 1-10 hari!';
      showToast('Voucher ini khusus member dengan masa aktif tersisa 1-10 hari!', 4000);
      updateCheckoutUI();
      return;
    }

    const v = VOUCHERS_DATA.find(x => x.code === cleanCode);
    if (!v) {
      voucherError = `Kode voucher "${cleanCode}" tidak valid atau kadaluarsa.`;
      showToast(`Kode voucher "${cleanCode}" tidak valid atau kadaluarsa.`, 3500);
      updateCheckoutUI();
      return;
    }

    // Single-use check: every voucher can only be used ONCE per user account
    const userUsedVouchers = Array.isArray(currentUser.usedVouchers) ? currentUser.usedVouchers : [];
    if (userUsedVouchers.includes(cleanCode)) {
      voucherError = `Voucher ${cleanCode} sudah pernah digunakan oleh akun ini!`;
      showToast(`Voucher ${cleanCode} sudah pernah digunakan oleh akun ini!`, 3500);
      updateCheckoutUI();
      return;
    }

    // Strict Scope: PT voucher can only be used for Personal Trainer checkout
    if (v.type === 'pt' && type !== 'pt') {
      voucherError = `Voucher ${v.code} hanya berlaku untuk paket Personal Trainer.`;
      showToast(`Voucher ${v.code} hanya berlaku untuk paket Personal Trainer.`, 3500);
      updateCheckoutUI();
      return;
    }

    // Strict Scope: Membership voucher can only be used for Membership checkout
    if (v.type === 'membership' && type !== 'membership') {
      voucherError = `Voucher ${v.code} hanya berlaku untuk paket Membership.`;
      showToast(`Voucher ${v.code} hanya berlaku untuk paket Membership.`, 3500);
      updateCheckoutUI();
      return;
    }

    // Validate minAmount
    if (v.minAmount && pkg.price < v.minAmount) {
      voucherError = `Voucher ${v.code} berlaku untuk minimal transaksi ${formatRupiah(v.minAmount)}.`;
      showToast(`Voucher ${v.code} berlaku untuk minimal transaksi ${formatRupiah(v.minAmount)}.`, 3500);
      updateCheckoutUI();
      return;
    }

    // Special check for GAJIAN100K: 3/6/12 bulan
    if (v.code === 'GAJIAN100K' && pkg.durationDays && pkg.durationDays < 90) {
      voucherError = 'Voucher GAJIAN100K khusus untuk paket Membership 3, 6, atau 12 bulan.';
      showToast('Voucher GAJIAN100K khusus untuk paket Membership 3, 6, atau 12 bulan.', 3500);
      updateCheckoutUI();
      return;
    }

    appliedVoucher = v;
    setActivePromoCode(v.code);
    voucherError = '';
    showToast(`✓ Voucher ${v.code} berhasil digunakan! Potongan ${v.badge}.`, 3000);
    updateCheckoutUI();
  }

  function removeCheckoutVoucher() {
    appliedVoucher = null;
    setActivePromoCode(null);
    voucherError = '';
    showToast('Voucher dibatalkan.');
    updateCheckoutUI();
  }

  window.applyCheckoutVoucher = applyCheckoutVoucher;
  window.removeCheckoutVoucher = removeCheckoutVoucher;

  function renderPaymentMethodDetails(billingTotal) {
    const vaNumber = `8801 ${currentUser.phone.replace(/[^0-9]/g, '').slice(-8) || '12345678'}`;

    if (activePaymentMethod === 'qris') {
      return `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-center">
          <!-- Header Kartu QRIS -->
          <div class="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2 text-left">
              <span class="px-2 py-0.5 rounded bg-white text-slate-900 text-xs font-black tracking-wider">QRIS</span>
              <span class="text-[10px] text-slate-300 font-medium leading-tight">Quick Response Code Indonesian Standard</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider shrink-0">Instan</span>
          </div>

          <div class="p-4 bg-slate-50/70">
            <!-- Nama Merchant -->
            <div class="mb-2.5">
              <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Merchant Resmi</span>
              <h4 class="text-sm font-black tracking-wide text-slate-900 uppercase">BE FIT GYM INDONESIA</h4>
            </div>

            <!-- Area Gambar QRIS Asli (Tanpa Crop Sudut) -->
            <div class="bg-white p-3 border border-slate-200 rounded-xl shadow-sm inline-block mx-auto">
              <img 
                src="/qris.jpg" 
                alt="QRIS Pembayaran Be Fit Gym" 
                class="w-56 h-56 mx-auto object-contain rounded-lg"
                style="image-rendering: pixelated;"
              />
            </div>

            <!-- Total Tagihan di Bawah QRIS -->
            <div class="mt-3 p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs max-w-[260px] mx-auto shadow-2xs">
              <span class="font-bold text-slate-500">Total Tagihan:</span>
              <span class="text-sm font-black font-mono text-teal-600">${formatRupiah(billingTotal || 0)}</span>
            </div>

            <p class="text-[11px] text-slate-500 mt-2.5">Pindai kode QR menggunakan GoPay, OVO, DANA, ShopeePay, atau Mobile Banking.</p>
          </div>
        </div>
      `;
    }

    if (activePaymentMethod.includes('va')) {
      const bankName = activePaymentMethod === 'bca_va' ? 'BCA' : activePaymentMethod === 'mandiri_va' ? 'Mandiri' : 'BNI';
      return `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-700">Nomor Virtual Account ${bankName}:</span>
            <span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Otomatis Terverifikasi</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <span class="text-base font-black font-mono text-slate-900 tracking-wider">${vaNumber}</span>
            <button type="button" class="px-2.5 py-1 text-xs font-bold bg-teal-550 text-white rounded-lg active:scale-95 transition-all"
              onclick="copyToClipboard('${vaNumber}', 'Nomor VA berhasil disalin!')">
              Salin
            </button>
          </div>
          <p class="text-[11px] text-slate-400 mt-2">Batas waktu pembayaran 2 jam. Layanan langsung aktif seketika setelah pembayaran terkonfirmasi.</p>
        </div>
      `;
    }

    return '';
  }

  function getCheckoutHtml() {
    const { base, disc, total, appliedVoucher: curVoucher } = calculateBilling();
    const isMembership = type === 'membership';

    return `
      <div class="mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isMembership ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
            ${isMembership ? 'Membership Checkout' : 'Personal Trainer Checkout'}
          </span>
          <h3 class="text-base font-black text-slate-900 mt-1">Konfirmasi Pembayaran</h3>
        </div>
        <button type="button" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg" onclick="closeBottomSheet()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Ringkasan Pesanan -->
      <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Rincian Layanan:</span>
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="text-sm font-black text-slate-900 leading-snug">
              ${isMembership ? sanitize(pkg.name) : `${pkg.label} bersama Coach ${sanitize(trainer.name)}`}
            </h4>
            <p class="text-xs text-slate-500 mt-0.5">
              ${isMembership ? `Masa Aktif: +${pkg.durationDays} Hari` : `${pkg.sessions} Sesi Private Coaching`}
            </p>
          </div>
          <span class="text-sm font-black font-mono text-teal-600 shrink-0">${formatRupiah(base)}</span>
        </div>

        <div class="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Pemesan: <strong>${sanitize(currentUser.name)}</strong></span>
          <span>${currentUser.phone}</span>
        </div>
      </div>

      <!-- ===== INTERACTIVE VOUCHER & PROMO SYSTEM ===== -->
      <div class="mb-4 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🏷️</span>
            <span>Gunakan Kode Promo / Voucher:</span>
          </label>
          ${curVoucher ? `
            <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              ✓ Aktif
            </span>
          ` : ''}
        </div>

        ${curVoucher ? `
          <!-- Active Voucher Alert Banner -->
          <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <div>
                <span class="text-xs font-black text-emerald-900 block leading-tight">Voucher ${curVoucher.code} Aktif</span>
                <span class="text-[10px] text-emerald-700 font-medium">${curVoucher.desc}</span>
              </div>
            </div>
            <button type="button" onclick="removeCheckoutVoucher()" class="px-2.5 py-1 text-[10px] font-black text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
              Hapus
            </button>
          </div>
        ` : `
          <!-- Voucher Input Row -->
          <div class="flex items-center gap-2 mb-2">
            <input type="text" id="checkout-voucher-input" placeholder="Masukkan kode promo (misal: ${isMembership ? 'MEMBERBARU15' : 'PTPROMO20'})..."
              class="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold focus:ring-2 focus:ring-teal-550 outline-none">
            <button type="button" onclick="applyCheckoutVoucher(document.getElementById('checkout-voucher-input').value)"
              class="px-4 py-2 rounded-xl bg-teal-550 hover:bg-teal-650 active:scale-95 text-white text-xs font-bold shadow-sm transition-all">
              Pakai
            </button>
          </div>
        `}

        ${voucherError ? `
          <p class="text-[11px] text-red-600 font-bold mb-2 flex items-center gap-1">
            <span>⚠️</span>
            <span>${voucherError}</span>
          </p>
        ` : ''}

        <!-- Quick-Click Voucher Chips -->
        <div class="pt-2 border-t border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Pilihan Voucher (Klik untuk Pakai Langsung):</span>
          <div class="flex flex-wrap gap-1.5">
            ${VOUCHERS_DATA.filter(v => v.code !== 'RENEWLOYAL25').map(v => {
              const isClaimed = claimedList.includes(v.code);
              const isCurrent = curVoucher && curVoucher.code === v.code;
              const isUsed = Array.isArray(currentUser.usedVouchers) && currentUser.usedVouchers.includes(v.code);

              if (isUsed) {
                return `
                  <button type="button" disabled
                    class="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60 flex items-center gap-1 line-through" title="Voucher sudah pernah digunakan">
                    <span>🏷️</span>
                    <span class="font-mono">${v.code}</span>
                    <span class="text-[8px] bg-slate-200 text-slate-600 px-1 rounded font-bold">TERPAKAI</span>
                  </button>
                `;
              }

              return `
                <button type="button" onclick="applyCheckoutVoucher('${v.code}')"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${isCurrent ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : isClaimed ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500'}">
                  <span>🏷️</span>
                  <span class="font-mono">${v.code}</span>
                  <span class="text-[9px] opacity-80">(${v.badge})</span>
                  ${isClaimed ? '<span class="text-[8px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black">KLAIM</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Pilihan Metode Pembayaran (NO CREDIT CARD) -->
      <div class="mb-4">
        <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Pilih Metode Pembayaran:</label>
        <div class="grid grid-cols-2 gap-2 text-xs font-bold">
          
          <button type="button" class="payment-method-card p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${activePaymentMethod === 'qris' ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}"
            onclick="switchPaymentMethod('qris')">
            <span class="text-lg">📱</span>
            <div>
              <span class="text-slate-900 block leading-tight">QRIS Instant</span>
              <span class="text-[9px] text-slate-400 font-normal">GoPay, OVO, Dana</span>
            </div>
          </button>

          <button type="button" class="payment-method-card p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${activePaymentMethod === 'bca_va' ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}"
            onclick="switchPaymentMethod('bca_va')">
            <span class="text-lg">🏦</span>
            <div>
              <span class="text-slate-900 block leading-tight">BCA VA</span>
              <span class="text-[9px] text-slate-400 font-normal">Virtual Account</span>
            </div>
          </button>

          <button type="button" class="payment-method-card p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${activePaymentMethod === 'mandiri_va' ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}"
            onclick="switchPaymentMethod('mandiri_va')">
            <span class="text-lg">🏛️</span>
            <div>
              <span class="text-slate-900 block leading-tight">Mandiri VA</span>
              <span class="text-[9px] text-slate-400 font-normal">Livin Mandiri</span>
            </div>
          </button>

          <button type="button" class="payment-method-card p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${activePaymentMethod === 'bni_va' ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}"
            onclick="switchPaymentMethod('bni_va')">
            <span class="text-lg">💳</span>
            <div>
              <span class="text-slate-900 block leading-tight">BNI VA</span>
              <span class="text-[9px] text-slate-400 font-normal">Virtual Account</span>
            </div>
          </button>

        </div>
      </div>

      <!-- Payment Method Interactive Details (QR / VA) -->
      <div id="payment-details-container" class="mb-4">
        ${renderPaymentMethodDetails(total)}
      </div>

      <!-- Tagihan Akhir Dinamis Real-Time -->
      <div class="p-3.5 bg-slate-100/70 rounded-2xl mb-4 space-y-1.5 text-xs text-slate-600">
        <div class="flex justify-between">
          <span>Harga Normal:</span>
          <span class="font-mono font-medium">${formatRupiah(base)}</span>
        </div>
        ${disc > 0 ? `
          <div class="flex justify-between text-emerald-600 font-bold">
            <span>Diskon Voucher (${curVoucher.code}):</span>
            <span class="font-mono font-black">-${formatRupiah(disc)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span>Biaya Layanan & Admin:</span>
          <span class="font-bold text-emerald-600 font-mono">GRATIS</span>
        </div>
        <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
          <span>Total Pembayaran:</span>
          <span class="text-base text-teal-600 font-mono font-black">${formatRupiah(total)}</span>
        </div>
      </div>

      <!-- Pay Button with Real-Time Total (100% Synchronous Instant 0ms) -->
      <button type="button" id="btn-submit-payment" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        onclick="executePaymentProcess(event)">
        <span>Saya Sudah Bayar / Konfirmasi Pembayaran — ${formatRupiah(total)}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </button>
    `;
  }

  function updateCheckoutUI() {
    const content = document.getElementById('sheet-content');
    if (content) content.innerHTML = getCheckoutHtml();
  }

  window.switchPaymentMethod = (method) => {
    activePaymentMethod = method;
    updateCheckoutUI();
  };

  window.executePaymentProcess = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    // 100% Synchronous & Instant 0ms Execution - Zero Artificial Loading Delays
    completePaymentSuccess(params, calculateBilling());
  };

  openBottomSheet(getCheckoutHtml());
}

function completePaymentSuccess(params, billing) {
  const { type, package: pkg, trainer } = params;
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Single-use voucher persistence
  if (billing.appliedVoucher && billing.appliedVoucher.code) {
    currentUser.usedVouchers = Array.isArray(currentUser.usedVouchers) ? currentUser.usedVouchers : [];
    if (!currentUser.usedVouchers.includes(billing.appliedVoucher.code)) {
      currentUser.usedVouchers.push(billing.appliedVoucher.code);
    }
  }

  // Clear retention warning unlock once renewal or purchase succeeds
  if (currentUser.injectedVouchers) {
    currentUser.injectedVouchers = currentUser.injectedVouchers.filter(v => v !== 'RENEWLOYAL25');
  }
  setActivePromoCode(null);
  clearRetentionUnlock();

  const invoiceNo = `INV-BF-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const voucherCodeUsed = billing.appliedVoucher ? billing.appliedVoucher.code : '-';
  const selectedBranch = getSelectedBranch();
  const branchShort = normalizeBranchName(currentUser.branch || selectedBranch.name);

  let isRenewal = false;
  let packageDisplayName = '';

  if (type === 'membership') {
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let baseDate = todayMidnight;

    if (isUserPaidMember(currentUser) && currentUser.expiryDate) {
      const existingExp = parseDateLocal(currentUser.expiryDate);
      if (existingExp && existingExp > todayMidnight) {
        baseDate = existingExp;
        isRenewal = true;
      }
    }

    const addDays = Number(pkg.durationDays || 30);
    const newExpiryDateObj = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + addDays);
    const newExpiry = `${newExpiryDateObj.getFullYear()}-${String(newExpiryDateObj.getMonth() + 1).padStart(2, '0')}-${String(newExpiryDateObj.getDate()).padStart(2, '0')}`;
    const newDaysRemaining = Math.max(1, getDaysRemaining(newExpiry));
    packageDisplayName = pkg.packageLabel || pkg.name;

    currentUser.packageId = pkg.id;
    currentUser.membershipPackage = packageDisplayName;
    currentUser.packageType = pkg.shortName;
    currentUser.packageDuration = `${packageDisplayName} (${pkg.shortName})`;
    currentUser.expiryDate = newExpiry;
    currentUser.daysRemaining = newDaysRemaining;
    currentUser.status = 'Active';
    currentUser.membershipStatus = 'Aktif';
    currentUser.isPaidMember = true;
    currentUser.isFrozen = false;
    currentUser.voucherUsed = voucherCodeUsed;
    currentUser.membershipPaid = (Number(currentUser.membershipPaid) || (isRenewal ? Number(currentUser.totalPaid) || 0 : 0)) + billing.total;
    currentUser.totalPaid = (Number(currentUser.totalPaid) || 0) + billing.total;
    currentUser.paymentMethod = activePaymentMethod.toUpperCase();
    currentUser.branch = branchShort;
    currentUser.dateJoined = currentUser.dateJoined || dateStr;

    const txRecord = {
      id: invoiceNo,
      type: 'Membership',
      title: isRenewal ? `Perpanjangan ${packageDisplayName}` : `Pembelian ${packageDisplayName}`,
      memberId: currentUser.id,
      memberEmail: currentUser.email || '-',
      userName: currentUser.name,
      userPhone: currentUser.phone,
      branch: branchShort,
      baseAmount: billing.base,
      voucherCode: voucherCodeUsed,
      discount: billing.disc,
      amount: billing.total,
      method: activePaymentMethod.toUpperCase(),
      date: dateStr,
      status: 'LUNAS'
    };

    syncMasterState({
      user: currentUser,
      transaction: txRecord,
      crmNote: {
        type: isRenewal ? 'Perpanjangan Paket Membership' : 'Pembelian Paket Membership',
        details: `${packageDisplayName} (${formatRupiah(billing.total)})`
      }
    });
  } else if (type === 'pt') {
    const trainerBranchObj = (Array.isArray(trainer.branchIds) && trainer.branchIds[0])
      ? (BRANCHES_DATA.find(b => b.id === trainer.branchIds[0]) || selectedBranch)
      : selectedBranch;
    const trainerBranchFullName = trainer.branch || trainerBranchObj.name;
    const addedSessions = Number(pkg.sessions || 1);
    const prevPt = Number(currentUser.ptRemainingSessions ?? currentUser.ptSessions) || 0;
    const newPtTotal = prevPt + addedSessions;
    const ptPackageLabel = pkg.name || `Paket ${pkg.label || (addedSessions + ' Sesi')}`;
    packageDisplayName = `${ptPackageLabel} — Coach ${trainer.name}`;

    currentUser.activeTrainer = trainer.name;
    currentUser.ptTrainer = trainer.fullName || trainer.name;
    currentUser.trainerBranch = trainerBranchFullName;
    currentUser.ptPackageName = ptPackageLabel;
    currentUser.ptRemainingSessions = newPtTotal;
    currentUser.ptSessions = newPtTotal;
    currentUser.ptPaid = (Number(currentUser.ptPaid) || 0) + billing.total;
    currentUser.totalPaid = (Number(currentUser.totalPaid) || 0) + billing.total;
    currentUser.branch = currentUser.branch || branchShort;

    currentUser.bookedTrainers = Array.isArray(currentUser.bookedTrainers) ? currentUser.bookedTrainers : [];
    if (!currentUser.bookedTrainers.includes(trainer.id)) {
      currentUser.bookedTrainers.push(trainer.id);
    }
    currentUser.trainerSessionsMap = currentUser.trainerSessionsMap || {};
    currentUser.trainerSessionsMap[trainer.id] = (Number(currentUser.trainerSessionsMap[trainer.id]) || 0) + addedSessions;

    // Increment trainer clients count
    const trainers = getTrainers();
    const tIdx = trainers.findIndex(t => t.id === trainer.id);
    if (tIdx !== -1) {
      trainers[tIdx].clients = (trainers[tIdx].clients || 0) + 1;
      saveTrainers(trainers);
    }

    const orderId = 'PT-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const ptOrder = {
      id: orderId,
      orderId: orderId,
      memberId: currentUser.id,
      memberName: currentUser.name,
      userName: currentUser.name,
      memberEmail: currentUser.email || '-',
      userPhone: currentUser.phone || '-',
      trainerId: trainer.id,
      trainerName: trainer.fullName || trainer.name,
      branch: trainerBranchFullName,
      packageName: ptPackageLabel,
      package: ptPackageLabel,
      totalSessions: addedSessions,
      sessions: addedSessions,
      remainingSessions: addedSessions,
      discount: billing.disc || 0,
      voucherUsed: voucherCodeUsed,
      voucherCode: voucherCodeUsed,
      totalPaid: billing.total,
      date: dateStr,
      status: 'Aktif Berjalan'
    };

    const txRecord = {
      id: invoiceNo,
      type: 'Personal Trainer',
      title: `Personal Trainer - ${ptPackageLabel} (${trainer.name})`,
      memberId: currentUser.id,
      memberEmail: currentUser.email || '-',
      userName: currentUser.name,
      userPhone: currentUser.phone,
      branch: normalizeBranchName(trainerBranchFullName),
      baseAmount: billing.base,
      voucherCode: voucherCodeUsed,
      discount: billing.disc,
      amount: billing.total,
      method: activePaymentMethod.toUpperCase(),
      date: dateStr,
      status: 'LUNAS'
    };

    syncMasterState({
      user: currentUser,
      transaction: txRecord,
      ptOrder,
      crmNote: {
        type: 'Pembelian Sesi Personal Trainer',
        details: `${addedSessions} Sesi bersama Coach ${trainer.name} (${formatRupiah(billing.total)})`
      }
    });
  }

  // Close payment sheet immediately & pop centered invoice modal (z-[9999])
  closeBottomSheet();

  const receiptHtml = `
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1.5">
        ✓ Pembayaran Berhasil! • Status Aktif
      </span>
      <h3 class="text-lg font-black text-slate-900 mt-1 leading-tight">
        ${type === 'membership'
          ? (isRenewal ? 'Perpanjangan Membership Berhasil!' : '✓ Pembayaran Berhasil!')
          : '✓ Pemesanan Personal Trainer Berhasil!'}
      </h3>
      <p class="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
        ${type === 'membership'
          ? `Anda telah mengaktifkan <strong class="text-teal-700 font-bold">${sanitize(packageDisplayName)}</strong>. Masa aktif gym dan pendaftaran kelas Anda kini telah aktif!`
          : `Anda memiliki <strong class="text-teal-700 font-bold">${currentUser.ptRemainingSessions} Sesi aktif</strong> bersama <strong class="text-slate-900 font-bold">Coach ${sanitize(trainer.name)}</strong>.`}
      </p>

      <!-- Invoice Summary Box -->
      <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 my-4 space-y-2 text-xs text-left">
        <div class="flex justify-between pb-2 border-b border-slate-200">
          <span class="text-slate-400 font-medium">Nomor Invoice:</span>
          <span class="font-mono font-bold text-slate-800">${invoiceNo}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-slate-400 font-medium">${type === 'membership' ? 'Paket Aktif:' : 'Layanan Trainer:'}</span>
          <span class="font-bold text-slate-900 text-right">${sanitize(packageDisplayName)}</span>
        </div>
        ${type === 'membership' ? `
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Masa Aktif Baru:</span>
            <span class="font-bold text-emerald-700 font-mono text-right">${currentUser.daysRemaining} Hari — Status: AKTIF</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Berlaku Hingga:</span>
            <span class="font-bold text-slate-800 font-mono">${formatDateIndo(currentUser.expiryDate)}</span>
          </div>
        ` : `
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Total Sisa Sesi PT:</span>
            <span class="font-bold text-emerald-700 font-mono">${currentUser.ptRemainingSessions} Sesi Aktif</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-400 font-medium">Cabang Trainer:</span>
            <span class="font-bold text-slate-800 text-right">${sanitize(currentUser.trainerBranch || branchShort)}</span>
          </div>
        `}
        <div class="flex justify-between">
          <span class="text-slate-400 font-medium">Harga Normal:</span>
          <span class="font-mono text-slate-700">${formatRupiah(billing.base)}</span>
        </div>
        ${billing.appliedVoucher ? `
          <div class="flex justify-between text-emerald-600 font-bold">
            <span>Diskon (${billing.appliedVoucher.code}):</span>
            <span class="font-mono">-${formatRupiah(billing.disc)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span class="text-slate-400 font-medium">Metode Bayar:</span>
          <span class="font-mono font-bold text-slate-800 uppercase">${activePaymentMethod}</span>
        </div>
        <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
          <span>Total Dibayar:</span>
          <span class="text-teal-600 font-mono font-black">${formatRupiah(billing.total)}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2">
        ${type === 'membership' ? `
          <button type="button"
            class="w-full py-3.5 rounded-xl bg-teal-550 hover:bg-teal-650 active:scale-[0.98] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            onclick="closeCenterPopup(); closeFullTrainerDetailScreen(); closeFullTrainerScreen(); renderApp(); openProfileSheet();">
            <span>Lihat Status Membership Saya</span>
          </button>
          <button type="button"
            class="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center"
            onclick="closeCenterPopup(); closeFullTrainerDetailScreen(); closeFullTrainerScreen(); renderApp();">
            Kembali ke Beranda
          </button>
        ` : `
          <button type="button"
            class="w-full py-3.5 rounded-xl bg-teal-550 hover:bg-teal-650 active:scale-[0.98] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            onclick="closeCenterPopup(); renderApp();">
            <span>✓ Lihat Status Sesi PT Aktif</span>
          </button>
          <button type="button"
            class="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center"
            onclick="closeCenterPopup(); closeFullTrainerDetailScreen(); closeFullTrainerScreen(); renderApp(); openProfileSheet();">
            Lihat Status di Menu Profil &rarr;
          </button>
        `}
      </div>
    </div>
  `;

  openCenterPopup(receiptHtml);
}

// ==================== 6. CLEAN PROFILE SHEET (NO MEMBER ID, NO CRM LINK) ====================

function openProfileSheet() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  const isPaid = isUserPaidMember(currentUser);
  const { isExpiringSoon, daysRemaining } = isPaid
    ? checkAndInjectRetentionVoucher(currentUser)
    : { isExpiringSoon: false, daysRemaining: 0 };
  const exactDays = isPaid ? Math.max(0, getDaysRemaining(currentUser.expiryDate)) : 0;

  // Active membership package
  const activePackage = MEMBERSHIP_PACKAGES.find(p =>
    p.id === currentUser.packageId ||
    p.packageLabel === currentUser.membershipPackage ||
    p.shortName === currentUser.packageType ||
    p.name === currentUser.packageDuration
  ) || MEMBERSHIP_PACKAGES[1];

  const ptRemaining = Number(currentUser.ptRemainingSessions ?? currentUser.ptSessions) || 0;
  const ptTrainerLabel = currentUser.activeTrainer || currentUser.ptTrainer;

  const activePtCardHtml = ptRemaining > 0 && ptTrainerLabel ? `
    <div class="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 mb-4 shadow-sm">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700">✓ Personal Trainer Aktif</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white font-mono">Sisa ${ptRemaining} Sesi</span>
      </div>
      <h4 class="text-xs font-black text-emerald-950">Sesi Personal Trainer Aktif: ${sanitize(ptTrainerLabel)} (Sisa ${ptRemaining} Sesi)</h4>
      ${currentUser.ptPackageName ? `<p class="text-[11px] text-emerald-800 mt-0.5 font-medium">${sanitize(currentUser.ptPackageName)} • ${sanitize(currentUser.trainerBranch || currentUser.branch || 'Be Fit Gym')}</p>` : ''}
    </div>
  ` : '';

  const html = `
    <!-- User Profile Header: Clean, NO Member ID Clutter -->
    <div class="text-center mb-4 pb-3 border-b border-slate-100">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
        ${currentUser.name.substring(0, 2).toUpperCase()}
      </div>
      <h3 class="text-base font-black text-slate-900">${sanitize(currentUser.name)}</h3>
      <p class="text-xs text-slate-500 mt-0.5">${currentUser.phone} • ${currentUser.email || 'member@befit.id'}</p>
      <span class="inline-block mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700 border border-slate-300'}">
        Status: ${isPaid ? 'Aktif' : 'Belum Aktif (Belum Berlangganan)'}
      </span>
    </div>

    ${isPaid && isExpiringSoon ? `
      <!-- Amber Retention Warning Card in Profile (Paid Expiring Member Only) -->
      <div class="mb-4 p-3.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] shadow-sm flex flex-col gap-2.5 text-left">
        <div class="flex items-start gap-2.5">
          <span class="text-2xl shrink-0">⚠️</span>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-black text-amber-950 leading-tight">
              Masa Aktif Membership Tersisa ${daysRemaining} Hari Lagi!
            </h4>
            <p class="text-[11px] text-amber-900 mt-1 leading-snug font-medium">
              Khusus untuk Anda, sistem telah menyuntikkan Voucher Diskon Perpanjangan 25% (RENEWLOYAL25) secara otomatis ke akun Anda.
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-amber-300/70 flex justify-end">
          <button type="button" onclick="closeBottomSheet(); openPricingSheet('${activePackage.id}');"
            class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
            <span>Perpanjang Sekarang (Diskon 25%) &rarr;</span>
          </button>
        </div>
      </div>
    ` : ''}

    ${isPaid ? `
      <!-- Active Membership Status Card for Paid Member -->
      <div class="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl mb-4 shadow-md border border-emerald-400/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-400">✓ Membership Aktif</span>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950">${exactDays} HARI TERSISA</span>
        </div>
        <h4 class="text-base font-black text-white">${sanitize(currentUser.membershipPackage || currentUser.packageDuration || currentUser.packageType || 'Pro Transformation')}</h4>
        <p class="text-xs text-slate-300 mt-0.5">Berlaku s/d: <strong class="text-white">${formatDateIndo(currentUser.expiryDate) || 'Aktif'}</strong> ${isExpiringSoon ? `<span class="ml-1 text-amber-300 font-bold">(${daysRemaining} Hari Lagi)</span>` : ''}</p>
        
        <div class="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
          <span class="text-slate-300">Total Sesi PT Aktif:</span>
          <span class="font-bold text-brand-sunny font-mono">${ptRemaining} Sesi Aktif</span>
        </div>
      </div>

      ${activePtCardHtml}

      <!-- Primary Action: Perpanjang Membership -->
      <div class="space-y-2.5 mb-4">
        <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-xl bg-teal-550 text-white hover:bg-teal-650 active:scale-[0.98] text-xs font-bold shadow-md shadow-teal-550/20 transition-all text-left cursor-pointer"
          onclick="extendCurrentMembership()">
          <span class="flex items-center gap-2">
            <span class="text-base">⚡</span>
            <span>Perpanjang Membership ${isExpiringSoon ? '(Diskon 25% Aktif)' : `(${sanitize(activePackage.packageLabel || activePackage.shortName)})`}</span>
          </span>
          <svg class="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>

        <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors cursor-pointer"
          onclick="openTransactionHistorySheet()">
          <span class="flex items-center gap-2"><span>🧾</span> Riwayat Transaksi & Invoice</span>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    ` : `
      <!-- Unpaid Member Card (No Active Package) -->
      <div class="p-4 bg-slate-50 text-slate-800 rounded-2xl mb-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status Membership</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Belum Berlangganan</span>
        </div>
        <h4 class="text-base font-black text-slate-900">Belum Ada Paket Aktif</h4>
        <p class="text-xs text-slate-600 mt-1">Status Membership: <strong class="text-slate-900">Belum Aktif (Belum Berlangganan)</strong></p>
        <p class="text-[11px] text-teal-700 font-medium mt-2 bg-teal-50 p-2.5 rounded-xl border border-teal-200/80 leading-relaxed">
          🎉 Gunakan kode promo <strong>MEMBERBARU15</strong> untuk mendapatkan Diskon 15% pada pembelian paket membership pertamamu!
        </p>
      </div>

      ${activePtCardHtml}

      <!-- Action for Unpaid Member: Pilih Paket Membership -->
      <div class="space-y-2.5 mb-4">
        <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-xl bg-teal-550 text-white hover:bg-teal-650 active:scale-[0.98] text-xs font-bold shadow-md shadow-teal-550/20 transition-all text-left cursor-pointer"
          onclick="closeBottomSheet(); openPricingSheet();">
          <span class="flex items-center gap-2">
            <span class="text-base">🚀</span>
            <span>Pilih Paket Membership (Diskon 15% Member Baru)</span>
          </span>
          <svg class="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>

        <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors cursor-pointer"
          onclick="openTransactionHistorySheet()">
          <span class="flex items-center gap-2"><span>🧾</span> Riwayat Transaksi & Invoice</span>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    `}

    <!-- Logout Button -->
    <button type="button" class="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
      onclick="handleLogout()">
      Keluar (Logout)
    </button>
  `;

  openBottomSheet(html);
}

function extendCurrentMembership() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const currentPkg = MEMBERSHIP_PACKAGES.find(p => 
    p.id === currentUser.packageId ||
    p.shortName === currentUser.packageType || 
    p.name === currentUser.packageDuration ||
    p.packageLabel === currentUser.membershipPackage ||
    (currentUser.packageDuration && p.name.includes(currentUser.packageDuration))
  ) || MEMBERSHIP_PACKAGES[1];

  closeBottomSheet();
  openPricingSheet(currentPkg.id);
}

function openTransactionHistorySheet() {
  const txMap = new Map();
  [TRANSACTIONS_KEY, TRANSACTIONS_ALT_KEY].forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          arr.forEach(item => {
            if (item && item.id && !txMap.has(item.id)) {
              txMap.set(item.id, item);
            }
          });
        }
      }
    } catch (e) {}
  });
  const txList = Array.from(txMap.values());

  const listHtml = txList.length === 0 ? `
    <div class="py-8 text-center text-slate-400 text-xs">
      Belum ada riwayat transaksi.
    </div>
  ` : txList.map(tx => `
    <div class="p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
      <div class="flex justify-between items-center gap-2">
        <span class="font-bold text-slate-900">${sanitize(tx.title || tx.packageName || 'Transaksi Be Fit')}</span>
        <span class="text-teal-600 font-mono font-bold shrink-0">${formatRupiah(tx.amount || tx.totalPaid || 0)}</span>
      </div>
      <div class="flex justify-between text-[11px] text-slate-400 font-mono">
        <span>${sanitize(tx.id)} • ${sanitize(tx.method || tx.paymentMethod || '')}</span>
        <span>${sanitize(tx.date || '')}</span>
      </div>
    </div>
  `).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Riwayat Transaksi</h3>
      <p class="text-xs text-slate-400 mt-0.5">Bukti transaksi pembelian membership & sesi PT</p>
    </div>
    <div class="space-y-2 max-h-96 overflow-y-auto">${listHtml}</div>
  `);
}

function updateHeaderUserDisplay() {
  const user = getCurrentUser();
  const badgeEl = document.getElementById('header-user-badge');
  if (!badgeEl) return;

  if (user) {
    const isPaid = isUserPaidMember(user);
    badgeEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs cursor-pointer hover:bg-slate-50 transition-colors" onclick="openProfileSheet()">
        <span class="w-2 h-2 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
        <span class="font-bold text-slate-800 truncate max-w-[120px]">${sanitize(user.name.split(' ')[0])}</span>
      </div>
    `;
  } else {
    badgeEl.innerHTML = `
      <button type="button" class="px-3 py-1 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors" onclick="openAuthModal('login')">
        Masuk / Daftar
      </button>
    `;
  }
  if (typeof renderHomeRetentionBanner === 'function') {
    renderHomeRetentionBanner();
  }
}

// ==================== FREE TRIAL CLAIM ====================

function handleTrialClaim() {
  requireAuth(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (currentUser.isTrialClaimed) {
      showToast('Anda sudah mengklaim Free Trial 7 Hari!');
      return;
    }

    currentUser.isTrialClaimed = true;
    setCurrentUser(currentUser);

    // Save to befit_trial_claims for CRM Admin Panel
    try {
      const raw = localStorage.getItem('befit_trial_claims');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: 'TRL-' + Math.floor(100 + Math.random() * 900),
        userName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        branch: getSelectedBranch().name,
        dateClaimed: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Aktif (7 Hari)'
      });
      localStorage.setItem('befit_trial_claims', JSON.stringify(list));
    } catch (e) {}

    const trialBtn = document.getElementById('btn-claim-trial');
    if (trialBtn) {
      trialBtn.disabled = true;
      trialBtn.textContent = '✓ Diklaim';
      trialBtn.classList.remove('bg-teal-550', 'hover:bg-teal-650');
      trialBtn.classList.add('bg-emerald-600', 'cursor-not-allowed');
    }

    showToast('🎁 Free Trial 7 Hari berhasil diklaim! Tunjukkan ke resepsionis gym.', 4000);
  });
}

function copyToClipboard(text, successMsg = 'Teks disalin ke clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  }
  showToast(successMsg);
}

function openPromoDetail(index) {
  const p = PROMOS_DATA[index] || PROMOS_DATA[0];
  const termsList = p.terms.map(t => `<li class="text-slate-500">${sanitize(t)}</li>`).join('');

  openBottomSheet(`
    <div class="mb-4">
      <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${p.badgeColor} mb-2 shadow-sm">
        ${p.discountBadge}
      </span>
      <h3 class="text-base font-black text-slate-900 leading-snug">${sanitize(p.title)}</h3>
      <p class="text-xs text-teal-600 font-bold mt-0.5">${sanitize(p.subtitle)}</p>
      <p class="text-xs text-slate-600 leading-relaxed mt-2">${sanitize(p.description)}</p>
    </div>

    <!-- Voucher Code Box -->
    <div class="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-center mb-4 shadow-sm">
      <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Kode Voucher Resmi</span>
      <span class="text-xl font-black text-amber-950 font-mono tracking-wider">${p.voucherCode}</span>
      <span class="text-[10px] text-amber-700 block mt-0.5 font-medium">Berlaku s/d ${p.validUntil}</span>
    </div>

    <div class="sheet-divider"></div>
    <h4 class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Syarat & Ketentuan</h4>
    <ol class="text-xs space-y-1.5 list-decimal list-inside mb-5">${termsList}</ol>

    <!-- Main Action Button: Automatically Claims Voucher and Navigates -->
    <button type="button" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-xs font-black shadow-lg shadow-teal-550/25 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-2"
      onclick="handlePromoClaimAndNavigate(${index})">
      <span>${p.ctaText} &rarr;</span>
    </button>
  `);
}

function handlePromoClaimAndNavigate(index) {
  const p = PROMOS_DATA[index] || PROMOS_DATA[0];
  const currentUser = getCurrentUser();
  const userUsed = currentUser && Array.isArray(currentUser.usedVouchers) ? currentUser.usedVouchers : [];

  // Check if voucher has already been used by this user account
  if (userUsed.includes(p.voucherCode)) {
    showToast(`⚠️ Voucher ${p.voucherCode} sudah pernah digunakan oleh akun ini!`, 3500);
    if (p.target === 'pt') {
      openAllTrainersSheet();
    } else {
      openPricingSheet(p.voucherCode === 'GAJIAN100K' ? 'pkg-3m' : 'pkg-1m');
    }
    return;
  }

  // Auto-claim voucher into user claimed list
  const list = getUserClaimedVouchers();
  if (!list.includes(p.voucherCode)) {
    list.push(p.voucherCode);
    try {
      localStorage.setItem('befit_claimed_vouchers', JSON.stringify(list));
    } catch (e) {}
    if (currentUser) {
      currentUser.claimedVouchers = list;
      setCurrentUser(currentUser);
    }
  }

  // Set active promo in session
  setActivePromoCode(p.voucherCode);

  // Instant notification & 0ms navigation as specified
  if (p.voucherCode === 'MEMBERBARU15') {
    showToast('Voucher MEMBERBARU15 (Diskon 15%) aktif! Silakan pilih paket Membership.', 3500);
    openPricingSheet('pkg-1m');
  } else if (p.voucherCode === 'GAJIAN100K') {
    showToast('Voucher GAJIAN100K (Potongan Rp 100rb) aktif! Pilih paket 3, 6, atau 12 bulan.', 3500);
    openPricingSheet('pkg-3m');
  } else if (p.voucherCode === 'PTPROMO20') {
    showToast('Voucher PTPROMO20 (Diskon 20% PT) aktif! Silakan pilih Personal Trainer Anda.', 3500);
    openAllTrainersSheet();
  } else {
    openPricingSheet('pkg-1m');
  }
}

function openChatAdminSheet() {
  const waBaseUrl = 'https://wa.me/6282116156884?text=';

  const templates = [
    {
      title: 'Informasi Paket Membership & Promo',
      desc: 'Detail harga, durasi, dan diskon paket aktif',
      icon: '⚡',
      message: 'Halo Admin Be Fit, saya ingin bertanya mengenai detail paket Membership beserta promo yang sedang berlaku saat ini.'
    },
    {
      title: 'Konsultasi & Jadwal Personal Trainer (PT)',
      desc: 'Pemilihan trainer dan jadwal sesi latihan privat',
      icon: '🏋️‍♂️',
      message: 'Halo Admin Be Fit, saya ingin berkonsultasi mengenai pemilihan Personal Trainer (PT) dan ketersediaan jadwal sesi latihan.'
    },
    {
      title: 'Bantuan Pembayaran & Aktivasi Membership',
      desc: 'Bantuan transfer, verifikasi pembayaran, atau aktivasi',
      icon: '💳',
      message: 'Halo Admin Be Fit, saya membutuhkan bantuan terkait proses pembayaran / konfirmasi aktivasi paket saya di aplikasi Be Fit.'
    },
    {
      title: 'Info Jadwal Kelas Studio & Fasilitas Cabang',
      desc: 'Jadwal Les Mills, Pilates, Yoga, dan fasilitas cabang',
      icon: '📅',
      message: 'Halo Admin Be Fit, saya ingin menanyakan info jadwal kelas studio dan fasilitas di cabang Be Fit.'
    }
  ];

  window.sendCustomAdminWa = () => {
    const input = document.getElementById('chat-admin-custom-input');
    const msg = input ? input.value.trim() : '';
    if (!msg) {
      showToast('Silakan ketik pertanyaan Anda terlebih dahulu.');
      return;
    }
    const fullMsg = `Halo Admin Be Fit, saya ingin bertanya:\n\n${msg}`;
    window.open(waBaseUrl + encodeURIComponent(fullMsg), '_blank');
  };

  const templateButtons = templates.map(t => `
    <a href="${waBaseUrl + encodeURIComponent(t.message)}" target="_blank" rel="noopener noreferrer"
      class="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group shadow-sm">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
          ${t.icon}
        </div>
        <div class="min-w-0">
          <h4 class="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">${t.title}</h4>
          <p class="text-[11px] text-slate-500 truncate mt-0.5">${t.desc}</p>
        </div>
      </div>
      <svg class="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </a>
  `).join('');

  openBottomSheet(`
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-base font-bold">💬</span>
        <h3 class="text-base font-black text-slate-900 tracking-tight">Halo! Ada yang bisa dibantu Admin Be Fit?</h3>
      </div>
      <p class="text-xs text-slate-500 leading-relaxed">
        Pilih topik pertanyaan di bawah ini untuk terhubung langsung ke WhatsApp Admin (<span class="font-bold text-emerald-700 font-mono">0821-1615-6884</span>):
      </p>
    </div>

    <!-- 4 Template Opsi Siap Klik -->
    <div class="space-y-2 mb-4">
      ${templateButtons}
    </div>

    <!-- Opsi 5: Custom Pertanyaan -->
    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
      <label class="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
        <span>✏️</span>
        <span>Atau Tulis Pertanyaan Sendiri:</span>
      </label>
      <div class="flex items-center gap-2">
        <input type="text" id="chat-admin-custom-input" placeholder="Ketik pertanyaan kamu di sini..."
          class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
        <button type="button" onclick="sendCustomAdminWa()"
          class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap">
          Kirim ke WA &rarr;
        </button>
      </div>
    </div>
  `);
}

function openVoucherList() {
  const claimedList = getUserClaimedVouchers();

  const items = VOUCHERS_DATA.filter(v => v.code !== 'RENEWLOYAL25').map(v => {
    const isClaimed = claimedList.includes(v.code);
    return `
      <div class="flex items-center justify-between p-3.5 rounded-2xl border ${isClaimed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:bg-slate-50'} transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shrink-0">🏷️</div>
          <div>
            <h4 class="text-xs font-bold text-slate-900">${sanitize(v.desc)}</h4>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px] font-bold text-teal-600 font-mono">${v.code}</span>
              <span class="text-[10px] text-slate-400">• Exp: ${v.expires}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          ${isClaimed ? `
            <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">
              ✓ Diklaim
            </span>
          ` : `
            <button type="button" class="px-3 py-1.5 rounded-lg bg-teal-550 text-white text-[10px] font-bold hover:bg-teal-650 active:scale-95 transition-all shadow-sm"
              onclick="claimVoucher('${v.code}'); openVoucherList();">
              Klaim
            </button>
          `}
          <button type="button" class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-[10px] font-bold hover:bg-slate-100 active:scale-95 transition-all"
            onclick="copyToClipboard('${v.code}', 'Voucher ${v.code} berhasil disalin!')" title="Salin Kode">
            📋
          </button>
        </div>
      </div>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Voucher & Promo Aktif 🏷️</h3>
      <p class="text-xs text-slate-400 mt-0.5">Klaim voucher dan gunakan saat checkout untuk potongan harga langsung.</p>
    </div>
    <div class="space-y-2.5">${items}</div>
  `);
}

// ==================== HERO CAROUSEL ====================

let currentSlide = 0;
let carouselInterval = null;
const totalSlides = 3;

function goToSlide(index) {
  currentSlide = index;
  const track = document.getElementById('carousel-track');
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    if (i === currentSlide) {
      dot.classList.add('active');
      dot.style.width = '20px';
      dot.style.backgroundColor = '#FFFFFF';
    } else {
      dot.classList.remove('active');
      dot.style.width = '6px';
      dot.style.backgroundColor = 'rgba(255,255,255,0.5)';
    }
  });
}

function nextSlide() {
  goToSlide((currentSlide + 1) % totalSlides);
}

function startCarousel() {
  stopCarousel();
  carouselInterval = setInterval(nextSlide, 4500);
}

function stopCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
}

// ==================== APP INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Clean old admin page redirects
  if (window.location.hash && ['#dashboard', '#members', '#kanban', '#checkin', '#classes', '#analytics'].includes(window.location.hash)) {
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
  }
  try {
    localStorage.removeItem('befit_admin_page');
    localStorage.removeItem('current_page');
  } catch (e) {}

  // 1. Initialize Users & State
  getUsers();
  getClasses();
  getTrainers();

  // 2. Initialize Branch & Crowd UI
  const currentBranch = getSelectedBranch();
  updateBranchUI(currentBranch);

  // 3. Render Calendar DatePicker, Classes, and Trainers
  renderCalendarDatePicker();
  renderHomeClasses();
  renderHomeTrainers();

  // 4. Update User Profile Status
  updateHeaderUserDisplay();

  // 5. Start Carousel
  goToSlide(0);
  startCarousel();

  // Carousel dot handlers
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      stopCarousel();
      startCarousel();
    });
  });

  // Keyboard: Escape closes centered popup or bottom sheet
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const popupOverlay = document.getElementById('center-popup-overlay');
      if (popupOverlay && !popupOverlay.classList.contains('hidden')) {
        closeCenterPopup();
      } else if (sheetOpen) {
        closeBottomSheet();
      }
    }
  });

  // Cross-tab synchronization listener (syncs admin changes back into active user view)
  window.addEventListener('storage', (e) => {
    if (e.key === USERS_STORAGE_KEY || e.key === SYNC_TS_KEY) {
      const cur = getCurrentUser();
      if (cur) {
        const users = getUsers();
        const fresh = users.find(u =>
          (u.id && cur.id && u.id === cur.id) ||
          (u.email && cur.email && u.email.toLowerCase() === cur.email.toLowerCase())
        );
        if (fresh) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...cur, ...fresh }));
        }
      }
      renderApp();
    }
  });

  // 6. Initialize Auto-Inject Retention Voucher for Expiring Members (1-10 Days Remaining)
  initRetentionSystem();
});



// ==================== ADMIN LOGIN MODAL (TRIGGERED BY LOGO CLICK) ====================

function openAdminLoginModal() {
  const modalHtml = `
    <div class="mb-4 text-center">
      <div class="w-12 h-12 rounded-2xl bg-[#090D16] border border-amber-500/40 p-1 mx-auto mb-2 flex items-center justify-center shadow-md">
        <img src="logo-square.jpg" alt="Be Fit Logo" class="w-full h-full object-cover rounded-xl">
      </div>
      <h3 class="text-base font-black text-slate-900">Portal Admin Be Fit CRM</h3>
      <p class="text-xs text-slate-500 mt-0.5">Masukkan kredensial admin untuk mengakses panel manajemen</p>
    </div>

    <form id="admin-login-modal-form" onsubmit="event.preventDefault(); submitAdminLogin();" class="space-y-3.5">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Admin</label>
        <input type="email" id="admin-modal-email" value="" placeholder="Masukkan email admin" required
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-550 focus:border-transparent outline-none">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password Admin</label>
        <div class="relative">
          <input type="password" id="admin-modal-pass" value="" placeholder="Masukkan password admin" required
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium pr-10 focus:ring-2 focus:ring-teal-550 focus:border-transparent outline-none">
          <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            onclick="toggleAdminModalPassword()">
            <span id="admin-modal-eye">👁️</span>
          </button>
        </div>
      </div>

      <button type="submit"
        class="w-full py-3 rounded-xl bg-teal-550 text-white text-xs font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-95 transition-all mt-2">
        Masuk ke Panel Admin CRM &rarr;
      </button>
    </form>
  `;

  openBottomSheet(modalHtml);
}

function toggleAdminModalPassword() {
  const p = document.getElementById('admin-modal-pass');
  const eye = document.getElementById('admin-modal-eye');
  if (p) {
    if (p.type === 'password') {
      p.type = 'text';
      if (eye) eye.textContent = '🙈';
    } else {
      p.type = 'password';
      if (eye) eye.textContent = '👁️';
    }
  }
}

function submitAdminLogin() {
  const emailInput = document.getElementById('admin-modal-email');
  const passInput = document.getElementById('admin-modal-pass');
  const email = emailInput ? emailInput.value.trim() : '';
  const pass = passInput ? passInput.value.trim() : '';

  if ((email === 'rrizky205@gmail.com' && pass === 'wudinjir1911') || (email === 'admin@befit.id' && pass === 'admin123')) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    showToast('Login Admin berhasil! Mengalihkan ke Panel Admin...', 2500);
    closeBottomSheet();
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 350);
  } else {
    showToast('Email atau password admin tidak valid!', 3500);
  }
}

window.syncMasterState = syncMasterState;
window.renderApp = renderApp;
window.updateUI = updateUI;
window.openCenterPopup = openCenterPopup;
window.closeCenterPopup = closeCenterPopup;
window.openAdminLoginModal = openAdminLoginModal;
window.toggleAdminModalPassword = toggleAdminModalPassword;
window.submitAdminLogin = submitAdminLogin;
window.handlePromoClaimAndNavigate = handlePromoClaimAndNavigate;
window.openPromoDetail = openPromoDetail;
window.openPricingSheet = openPricingSheet;
window.openAllTrainersSheet = openAllTrainersSheet;
window.closeFullTrainerScreen = closeFullTrainerScreen;
window.openTrainerDetail = openTrainerDetail;
window.closeFullTrainerDetailScreen = closeFullTrainerDetailScreen;
window.toggleTrainerFilter = toggleTrainerFilter;
window.resetTrainerFilters = resetTrainerFilters;
window.setTrainerDetailTab = setTrainerDetailTab;
window.handleTrainerPackageSelect = handleTrainerPackageSelect;
window.setActiveNav = setActiveNav;
window.navigateToTab = navigateToTab;
window.openAllClassesSheet = openAllClassesSheet;
window.openClassDetail = openClassDetail;
window.handleBookClass = handleBookClass;
window.claimVoucher = claimVoucher;
window.openVoucherList = openVoucherList;
window.openChatAdminSheet = openChatAdminSheet;

// ==================== AUTO-INJECT RETENTION VOUCHER SYSTEM ====================

function initRetentionSystem() {
  try {
    // Handle Demo Mode for presentation screenshots
    const urlParams = new URLSearchParams(window.location.search);
    const demoMode = urlParams.get('demo');
    if (demoMode) {
      const expiry = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
      const demoUser = {
        id: 'USR-TEST-001',
        name: 'Rizky Muhammad Riady',
        email: 'rizky.member@gmail.com',
        phone: '082116156884',
        branch: 'Setiabudi',
        packageType: 'Pro Transformation',
        packageDuration: 'Paket 3 Bulan (Pro Transformation)',
        membershipPackage: 'Paket 3 Bulan',
        status: 'Active',
        membershipStatus: 'Aktif',
        isPaidMember: true,
        expiryDate: expiry,
        daysRemaining: 6,
        totalPaid: 900000,
        membershipPaid: 900000,
        injectedVouchers: ['RENEWLOYAL25']
      };
      setCurrentUser(demoUser);
      setRetentionUnlocked(true);
      if (demoMode === 'trainer') {
        setTimeout(() => {
          openAllTrainersSheet();
        }, 150);
      } else if (demoMode === 'checkout') {
        setTimeout(() => {
          const pkg = MEMBERSHIP_PACKAGES.find(p => p.id === 'pkg-3m') || MEMBERSHIP_PACKAGES[1];
          openUnifiedCheckout({ type: 'membership', package: pkg });
        }, 150);
      } else {
        updateHeaderUserDisplay();
        renderHomeRetentionBanner();
        renderHomeTrainers();
        renderHomeClasses();
      }
      return;
    }

    const user = getCurrentUser();
    if (user && user.role !== 'admin') {
      checkAndInjectRetentionVoucher(user);
      renderHomeRetentionBanner();
    }
    // Clean up any stray query parameters from the address bar
    if (window.location.search && window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (err) {
    console.error('Error initializing retention system:', err);
  }
}

window.renderHomeRetentionBanner = renderHomeRetentionBanner;
window.checkAndInjectRetentionVoucher = checkAndInjectRetentionVoucher;
window.initRetentionSystem = initRetentionSystem;
window.handleDeepLinkRouting = initRetentionSystem;
window.checkDeepLinkParams = initRetentionSystem;
window.pushCloudSync = pushCloudSync;
window.pullCloudSync = pullCloudSync;

// Execute immediately in case DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initRetentionSystem();
}
if (typeof window !== 'undefined' && !window.BEFIT_SKIP_INIT_PULL) {
  void pullCloudSync();
}
