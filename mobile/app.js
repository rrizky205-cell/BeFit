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
const TRAINERS_STORAGE_KEY = 'befit_mobile_trainers_v3';
const TRANSACTIONS_KEY = 'befit_mobile_transactions';
const CLAIMED_VOUCHERS_KEY = 'befit_claimed_vouchers';
const CLASS_BOOKINGS_KEY = 'befit_class_bookings';
const PT_BOOKINGS_KEY = 'befit_pt_bookings';
const TRIAL_CLAIMS_KEY = 'befit_trial_claims';
const ADMIN_AUTH_KEY = 'befit_admin_auth';

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

// Helper to generate dynamic schedules for each branch and date
function getClassesForBranch(branchId, dateKey = null) {
  if (!dateKey) dateKey = getTodayDateKey();
  const dateParts = dateKey.split('-');
  const dayNum = (parseInt(dateParts[2]) || 1) + (parseInt(dateParts[1]) || 1) * 31;
  const branchOffsets = { setiabudi: 0, dago: 3, pasirkaliki: 6, buahbatu: 9 };
  const bOffset = branchOffsets[branchId] || 0;

  return CLASS_TIME_SLOTS.map((timeSlot, idx) => {
    const classIdx = (bOffset + dayNum * 3 + idx * 2) % ENTERPRISE_CLASS_CATALOG.length;
    const instIdx = (bOffset + dayNum + idx) % INSTRUCTORS_POOL.length;
    const base = ENTERPRISE_CLASS_CATALOG[classIdx];
    const instructor = INSTRUCTORS_POOL[instIdx];
    const classId = `CLS-${branchId.toUpperCase()}-S${idx + 1}-${base.typeId}`;

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
      dateBookings: {}
    };
  });
}

const DEFAULT_CLASSES = [
  ...getClassesForBranch('setiabudi'),
  ...getClassesForBranch('dago'),
  ...getClassesForBranch('pasirkaliki'),
  ...getClassesForBranch('buahbatu')
];

// ==================== 3. PERSONAL TRAINERS (BRANCH-SPECIFIC EXPANSION) ====================

const DEFAULT_TRAINERS = [
  // --- CABANG SETIABUDI (5 Trainers) ---
  {
    id: 'TR-1',
    branchIds: ['setiabudi'],
    name: 'Aby Pratama',
    fullName: 'Muhammad Aby Pratama, CPT',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=550&fit=crop&q=80',
    clients: 59,
    experience: '6 Tahun',
    specialization: 'Strength & Conditioning, Functional Mobility',
    certifications: 'Head Coach • ACE Certified Personal Trainer, NSCA-CPT',
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
    branchIds: ['setiabudi'],
    name: 'Egi Angga',
    fullName: 'Egi Angga Permana',
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=550&fit=crop&q=80',
    clients: 33,
    experience: '4 Tahun',
    specialization: 'Fat Loss & Body Recomposition',
    certifications: 'ISSA Certified Fitness Trainer',
    bio: 'Spesialis program pembakaran lemak optimal dan rekomposisi massa otot berbasis target kalori terukur di Be Fit Setiabudi.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-3',
    branchIds: ['setiabudi'],
    name: 'Nadia Kusuma',
    fullName: 'Nadia Kusuma Wardhani',
    photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=550&fit=crop&q=80',
    clients: 41,
    experience: '5 Tahun',
    specialization: 'Posture & Mobility Specialist',
    certifications: 'NASM-CPT, FMS Level 2 Certified',
    bio: 'Membantu member memperbaiki postur tubuh, menghilangkan nyeri punggung/bahu akibat duduk lama, dan meningkatkan fleksibilitas sendi.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-4',
    branchIds: ['setiabudi'],
    name: 'Kevin Wijaya',
    fullName: 'Kevin Wijaya, CSCS',
    photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=550&fit=crop&q=80',
    clients: 38,
    experience: '4 Tahun',
    specialization: 'Hypertrophy & Muscle Building',
    certifications: 'CSCS • Certified Strength & Conditioning Specialist',
    bio: 'Fokus pada hipertrofi dan pembentukan massa otot bersih dengan teknik angkat beban berprogresi beban terstruktur.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-5',
    branchIds: ['setiabudi'],
    name: 'Rina Maharani',
    fullName: 'Rina Maharani, CPT',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=550&fit=crop&q=80',
    clients: 45,
    experience: '5 Tahun',
    specialization: 'Functional Fitness & Core Training',
    certifications: 'ACE-CPT, EXOS Performance Specialist',
    bio: 'Pelatih kebugaran fungsional yang menggabungkan latihan beban tubuh, kettlebell, dan stabilitas core untuk stamina prima.',
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
    branchIds: ['dago'],
    name: 'Adi Nugroho',
    fullName: 'Adi Nugroho, CSCS',
    photo: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=550&fit=crop&q=80',
    clients: 52,
    experience: '7 Tahun',
    specialization: 'Elite Performance Coach',
    certifications: 'Head Coach Dago • NSCA Certified Strength Coach',
    bio: 'Mengarahkan atlet dan member profesional di Be Fit Dago untuk mencapai kekuatan puncak, kecepatan, dan ketahanan kardiovaskular.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-7',
    branchIds: ['dago'],
    name: 'Sarah Wijaya',
    fullName: 'Sarah Ayu Wijaya',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=550&fit=crop&q=80',
    clients: 47,
    experience: '5 Tahun',
    specialization: 'Pilates & Rehab Conditioning',
    certifications: 'NASM-CPT, Polestar Pilates Certified',
    bio: 'Berpengalaman dalam pemulihan pasca cedera sendi, pilates core alignment, dan penguatan otot punggung di Be Fit Dago.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-8',
    branchIds: ['dago'],
    name: 'Marco Santoso',
    fullName: 'Marco Santoso, CF-L2',
    photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=550&fit=crop&q=80',
    clients: 39,
    experience: '6 Tahun',
    specialization: 'CrossFit & Powerlifting',
    certifications: 'CrossFit Level 2 Trainer, USAPL Coach',
    bio: 'Ahli dalam teknik squat, bench press, deadlift, dan sirkuit ketahanan intensif untuk membangun kekuatan maksimal.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-9',
    branchIds: ['dago'],
    name: 'Dinda Putri',
    fullName: 'Dinda Putri Lestari',
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=550&fit=crop&q=80',
    clients: 36,
    experience: '4 Tahun',
    specialization: "Women's Weight Training & Tone",
    certifications: 'ACE Certified Personal Trainer, Women Fitness Specialist',
    bio: 'Spesialis program latihan beban wanita untuk membentuk pinggul, mengecilkan lingkar pinggang, dan mengencangkan tubuh.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-10',
    branchIds: ['dago'],
    name: 'Reza Pahlevi',
    fullName: 'Reza Pahlevi Pratama',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=550&fit=crop&q=80',
    clients: 44,
    experience: '5 Tahun',
    specialization: 'HIIT & Calisthenics',
    certifications: 'WSWCF Calisthenics Coach, ACE-CPT',
    bio: 'Menguasai senam kalistenik tingkat lanjut, muscle-up, handstand, dan sirkuit HIIT pembakar lemak intensif.',
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
    branchIds: ['pasirkaliki'],
    name: 'Bima Sakti',
    fullName: 'Bima Sakti Nugraha',
    photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=550&fit=crop&q=80',
    clients: 48,
    experience: '6 Tahun',
    specialization: 'Strength & Boxing Coach',
    certifications: 'Head Coach Pasirkaliki • WBC Conditioning, AIBA Coach',
    bio: 'Kombinasi padat antara latihan kekuatan fisik dan teknik tinju kardio eksplosif di Be Fit Pasirkaliki.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-12',
    branchIds: ['pasirkaliki'],
    name: 'Jessica Tan',
    fullName: 'Jessica Tanuwijaya',
    photo: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=550&fit=crop&q=80',
    clients: 42,
    experience: '4 Tahun',
    specialization: 'Body Shaping & Toning',
    certifications: 'ISSA Certified Fitness Coach',
    bio: 'Membimbing pembentukan proporsi tubuh ideal wanita dengan teknik glute & core sculpting terarah.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-13',
    branchIds: ['pasirkaliki'],
    name: 'Fajar Ramadhan',
    fullName: 'Fajar Ramadhan, ACSM',
    photo: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=550&fit=crop&q=80',
    clients: 35,
    experience: '5 Tahun',
    specialization: 'Cardiovascular & Endurance',
    certifications: 'ACSM Certified Exercise Physiologist',
    bio: 'Fokus pada peningkatan kapasitas VO2 Max, lari jarak jauh, dan ketahanan fungsional jantung-paru.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-14',
    branchIds: ['pasirkaliki'],
    name: 'Maya Sari',
    fullName: 'Maya Sari Kusuma, RYT',
    photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=550&fit=crop&q=80',
    clients: 50,
    experience: '6 Tahun',
    specialization: 'Yoga & Flexibility Specialist',
    certifications: 'RYT-500 Yoga Alliance Registered Teacher',
    bio: 'Pakar peregangan asana, latihan pernapasan pranayama, dan mobilitas tubuh untuk keseimbangan fisik dan mental.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  }
  // CATATAN WAJIB: Cabang Buah Batu TIDAK memiliki Personal Trainer (0 Trainer)
];

// ==================== 4. MEMBERSHIP PACKAGES ====================

const MEMBERSHIP_PACKAGES = [
  {
    id: 'pkg-1m',
    name: 'Paket 1 Bulan (Basic Starter)',
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
    name: 'Paket 12 Bulan (Ultimate Yearly)',
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
    title: 'Promo Spesial Member Baru',
    subtitle: 'Jadi Member Sekarang Bisa Lebih Hemat!',
    description: 'Dapatkan diskon hingga 15% untuk pendaftaran membership baru dan GRATIS 2x sesi Personal Trainer. Berlaku untuk semua paket membership.',
    validUntil: '30 November 2026',
    voucherCode: 'NEWFIT15',
    discountPercent: 15,
    terms: [
      'Berlaku untuk member baru yang mendaftar pada periode promo.',
      'Diskon 15% langsung dipotong saat checkout.',
      'Gratis 2 sesi PT otomatis ditambahkan ke akun.',
      'Kuota terbatas, segera gunakan!'
    ]
  },
  {
    title: 'Paket Couple & Student Discount',
    subtitle: 'Hemat hingga 25% untuk 2 Orang atau Pelajar/Mahasiswa',
    description: 'Ajak pasangan atau temanmu untuk mendaftar bersama dan nikmati potongan harga hingga 25%. Berlaku juga untuk pelajar/mahasiswa aktif.',
    validUntil: '31 Desember 2026',
    voucherCode: 'COUPLE25',
    discountPercent: 25,
    terms: [
      'Paket Couple: Minimal 2 orang mendaftar bersamaan.',
      'Student: Tunjukkan kartu pelajar/mahasiswa aktif saat check-in.',
      'Berlaku untuk paket 3 bulan ke atas.',
      'Diskon 25% saat checkout.'
    ]
  },
  {
    title: 'Bundling Membership + 4 Sesi PT',
    subtitle: 'Mulai dari Rp 799K/bulan – Paket Paling Hemat!',
    description: 'Paket bundling eksklusif yang menggabungkan membership 1 bulan dengan 4 sesi Personal Trainer pilihan. Hemat hingga Rp 400.000 dibanding beli terpisah.',
    validUntil: '15 November 2026',
    voucherCode: 'BUNDLE799',
    discountAmount: 300000,
    terms: [
      'Berlaku untuk member baru dan rejoin.',
      'Pilih trainer berdasarkan ketersediaan jadwal.',
      'Sesi PT harus digunakan dalam masa aktif membership.',
      'Dapat langsung dicicil atau dibayar via QRIS/VA.'
    ]
  }
];

const VOUCHERS_DATA = [
  {
    code: 'MEMBERBARU15',
    desc: 'Diskon 15% Member Baru (Semua Paket)',
    type: 'all',
    percent: 15,
    minAmount: 0,
    expires: '31 Des 2026',
    badge: '15% OFF'
  },
  {
    code: 'HEMAT50K',
    desc: 'Potongan Langsung Rp 50.000',
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

const DEFAULT_USERS = [
  {
    id: 'BF-1001',
    name: 'Dimas Arya Pratama',
    email: 'member@befit.id',
    phone: '08123456789',
    password: '123456',
    packageType: 'Pro Transformation',
    packageDuration: 'Paket 3 Bulan (Pro Transformation)',
    expiryDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    status: 'Active',
    ptSessions: 4,
    ptTrainer: 'Aby',
    isTrialClaimed: true,
    role: 'member'
  },
  {
    id: 'ADM-01',
    name: 'Administrator Be Fit',
    email: 'admin@befit.id',
    phone: '08111222333',
    password: 'admin123',
    packageType: 'Ultimate Yearly',
    packageDuration: 'Paket 12 Bulan (Ultimate Yearly)',
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'Active',
    ptSessions: 12,
    ptTrainer: 'Egi Angga',
    isTrialClaimed: true,
    role: 'admin'
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

// User Storage
function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
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

function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // Also update in users list
      const users = getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...user };
        saveUsers(users);
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {}
  updateHeaderUserDisplay();
  renderHomeClasses();
  updateTrialButton();
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
function getTrainers() {
  try {
    const raw = localStorage.getItem(TRAINERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= DEFAULT_TRAINERS.length && parsed.some(t => t.id === 'TR-5')) {
        return parsed;
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

function openBottomSheet(contentHtml) {
  const backdrop = document.getElementById('sheet-backdrop');
  const panel = document.getElementById('sheet-panel');
  const content = document.getElementById('sheet-content');

  if (!backdrop || !panel || !content) return;

  content.innerHTML = contentHtml;
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

  panel.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.classList.remove('sheet-open');
  sheetOpen = false;

  setTimeout(() => {
    backdrop.classList.add('hidden');
    const content = document.getElementById('sheet-content');
    if (content) content.innerHTML = '';
  }, 300);
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
  return `
    <form id="form-login" class="space-y-3.5" onsubmit="handleLoginSubmit(event)">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Email atau No. WhatsApp</label>
        <input type="text" id="login-identifier" required placeholder="Contoh: member@befit.id atau 08123456789"
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
  if (ident === 'admin@befit.id' && pass === 'admin123') {
    showToast('🔐 Login Admin Berhasil! Membuka CRM Dashboard...');
    closeBottomSheet();
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 700);
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

  updateHeaderUserDisplay();
  updateTrialButton();
  renderHomeClasses();
  renderHomeTrainers();

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

  const users = getUsers();
  const newId = `BF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser = {
    id: newId,
    name: pendingRegistrationData.name,
    email: pendingRegistrationData.email,
    phone: pendingRegistrationData.phone,
    password: pendingRegistrationData.password,
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    packageType: 'Starter Member',
    packageDuration: 'Free Member (7 Hari Trial)',
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    ptSessions: 0,
    isTrialClaimed: false,
    bookedClasses: [],
    bookedTrainers: []
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  closeBottomSheet();
  showToast(`🎉 Verifikasi Berhasil! Selamat datang di Be Fit, ${newUser.name}.`, 4000);

  updateHeaderUserDisplay();
  updateTrialButton();
  renderCalendarDatePicker();
  renderHomeClasses();
  renderHomeTrainers();

  pendingRegistrationData = null;
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

    updateHeaderUserDisplay();
    updateTrialButton();
    renderCalendarDatePicker();
    renderHomeClasses();
    renderHomeTrainers();

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
  updateHeaderUserDisplay();
  updateTrialButton();
  renderCalendarDatePicker();
  renderHomeClasses();
  renderHomeTrainers();
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

  // Find Saturday of the current week (or Saturday before today)
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const daysBack = (dayOfWeek + 1) % 7;
  const startDate = new Date(currentYear, currentMonth, now.getDate() - daysBack);

  // End of current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const endDate = new Date(currentYear, currentMonth, lastDayOfMonth);

  const dates = [];
  const cur = new Date(startDate);

  while (cur <= endDate || (cur.getMonth() === currentMonth && cur.getFullYear() === currentYear)) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
    if (cur.getMonth() !== currentMonth && cur > endDate) break;
  }

  // Ensure minimum 8 days if near end of month
  if (dates.length < 8) {
    const needed = 8 - dates.length;
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

  if (!selectedClassDateKey) {
    selectedClassDateKey = getTodayDateKey();
  }

  const dates = getCalendarDateList();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
  selectedClassDateKey = key;
  renderCalendarDatePicker();
  renderHomeClasses();
}

function renderHomeClasses() {
  const container = document.getElementById('home-classes-container');
  if (!container) return;

  if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();

  const currentBranch = getSelectedBranch();
  const allClasses = getClasses();
  const currentUser = getCurrentUser();

  // Filter classes by branch
  const classes = allClasses.filter(cls => Array.isArray(cls.branchIds) ? cls.branchIds.includes(currentBranch.id) : true);

  if (classes.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center w-full bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
        Belum ada kelas terjadwal untuk cabang ${currentBranch.name}.
      </div>
    `;
    return;
  }

  container.innerHTML = classes.map(cls => {
    // Check booking for the selected date
    const dateBookings = (cls.dateBookings && Array.isArray(cls.dateBookings[selectedClassDateKey])) ? cls.dateBookings[selectedClassDateKey] : [];
    const isRegistered = currentUser && (
      dateBookings.includes(currentUser.id) ||
      (Array.isArray(cls.registeredUserIds) && cls.registeredUserIds.includes(currentUser.id) && selectedClassDateKey === getTodayDateKey())
    );

    const bookedCount = dateBookings.length;
    const currentSlots = Math.max(0, cls.capacity - bookedCount);
    const isFull = currentSlots <= 0;

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
  const classes = getClasses();
  const cls = classes.find(c => c.id === classId) || classes[0];
  const currentUser = getCurrentUser();

  if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();

  const dateBookings = (cls.dateBookings && Array.isArray(cls.dateBookings[selectedClassDateKey])) ? cls.dateBookings[selectedClassDateKey] : [];
  const isRegistered = currentUser && (
    dateBookings.includes(currentUser.id) ||
    (Array.isArray(cls.registeredUserIds) && cls.registeredUserIds.includes(currentUser.id) && selectedClassDateKey === getTodayDateKey())
  );

  const bookedCount = dateBookings.length;
  const currentSlots = Math.max(0, cls.capacity - bookedCount);
  const isFull = currentSlots <= 0;

  const parts = selectedClassDateKey.split('-');
  const selD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dateFormatted = `${parts[2]} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][selD.getMonth()]} ${parts[0]}`;

  let actionBtnHtml = '';
  if (isRegistered) {
    actionBtnHtml = `
      <button type="button" disabled class="w-full py-3.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
        <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>✓ Anda Sudah Terdaftar di Kelas Ini (${dateFormatted})</span>
      </button>
    `;
  } else if (isFull) {
    actionBtnHtml = `
      <button type="button" disabled class="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
        <span>Kuota Kelas Penuh untuk Tanggal Ini</span>
      </button>
    `;
  } else {
    actionBtnHtml = `
      <button type="button" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        onclick="handleBookClass('${cls.id}')">
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
        <span class="text-xs font-black ${currentSlots <= 3 ? 'text-amber-600' : 'text-green-600'} font-mono mt-0.5 block">${currentSlots} / ${cls.capacity}</span>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Kelas</h4>
      <p class="text-xs text-slate-600 leading-relaxed">${sanitize(cls.description)}</p>
    </div>

    ${actionBtnHtml}
  `);
}

function handleBookClass(classId) {
  requireAuth(() => {
    const classes = getClasses();
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();

    cls.dateBookings = cls.dateBookings || {};
    cls.dateBookings[selectedClassDateKey] = cls.dateBookings[selectedClassDateKey] || [];

    if (cls.dateBookings[selectedClassDateKey].includes(currentUser.id)) {
      showToast('Anda sudah terdaftar di kelas ini untuk tanggal tersebut!');
      return;
    }

    if (cls.dateBookings[selectedClassDateKey].length >= cls.capacity) {
      showToast('Maaf, kuota kelas pada tanggal ini sudah penuh!');
      return;
    }

    // Register booking
    cls.dateBookings[selectedClassDateKey].push(currentUser.id);
    cls.registeredUserIds = cls.registeredUserIds || [];
    if (!cls.registeredUserIds.includes(currentUser.id)) {
      cls.registeredUserIds.push(currentUser.id);
    }
    saveClasses(classes);

    // Save to user history
    currentUser.bookedClasses = currentUser.bookedClasses || [];
    currentUser.bookedClasses.push({
      classId: cls.id,
      className: cls.name,
      dateKey: selectedClassDateKey,
      time: cls.time,
      instructor: cls.instructor,
      bookedAt: new Date().toISOString()
    });
    setCurrentUser(currentUser);

    // Save to befit_class_bookings for Admin CRM Panel
    try {
      const rawBk = localStorage.getItem('befit_class_bookings');
      const bkList = rawBk ? JSON.parse(rawBk) : [];
      bkList.unshift({
        id: 'CLS-BK-' + Math.floor(1000 + Math.random() * 9000),
        userName: currentUser.name,
        userPhone: currentUser.phone,
        className: cls.name,
        instructor: cls.instructor,
        branch: getSelectedBranch().name,
        dateKey: selectedClassDateKey,
        time: cls.time,
        status: 'Terkonfirmasi'
      });
      localStorage.setItem('befit_class_bookings', JSON.stringify(bkList));
    } catch (e) {}

    renderHomeClasses();
    openClassDetail(classId);
    showToast(`✓ Berhasil mendaftar kelas ${cls.name}!`, 3500);
  });
}

function openAllClassesSheet() {
  const currentBranch = getSelectedBranch();
  const classes = getClasses().filter(cls => Array.isArray(cls.branchIds) ? cls.branchIds.includes(currentBranch.id) : true);
  const currentUser = getCurrentUser();

  if (!selectedClassDateKey) selectedClassDateKey = getTodayDateKey();

  const cards = classes.map(cls => {
    const dateBookings = (cls.dateBookings && Array.isArray(cls.dateBookings[selectedClassDateKey])) ? cls.dateBookings[selectedClassDateKey] : [];
    const isRegistered = currentUser && dateBookings.includes(currentUser.id);
    const slots = Math.max(0, cls.capacity - dateBookings.length);

    return `
      <button type="button" class="w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${isRegistered ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-100 hover:bg-slate-50'} text-left"
        onclick="closeBottomSheet(); setTimeout(() => openClassDetail('${cls.id}'), 350);">
        <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-16 h-16 rounded-xl object-cover shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-slate-900 truncate">${sanitize(cls.name)}</h4>
            ${isRegistered ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white shrink-0">Terdaftar</span>' : ''}
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5">🕒 ${cls.time} • With ${sanitize(cls.instructor)}</p>
          <span class="text-[10px] font-bold ${slots <= 3 ? 'text-amber-600' : 'text-green-600'}">
            Sisa ${slots} dari ${cls.capacity} kuota
          </span>
        </div>
        <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Jadwal Kelas ${currentBranch.name}</h3>
      <p class="text-xs text-slate-400 mt-0.5">Pilih kelas untuk melihat detail & memesan tempat</p>
    </div>
    <div class="space-y-2.5">${cards}</div>
  `);
}

// ==================== 3. INTERACTIVE MEMBERSHIP SELECTION & DYNAMIC CHECKOUT ====================

function openPricingSheet(selectedPackageId = 'pkg-3m') {
  let activePkgId = selectedPackageId;

  function renderPackages() {
    return MEMBERSHIP_PACKAGES.map(pkg => {
      const isSelected = pkg.id === activePkgId;

      return `
        <div class="membership-card p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${isSelected ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}"
          onclick="selectMembershipCard('${pkg.id}')">
          
          <!-- Top Badge -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${pkg.badgeColor} shadow-sm">
              ${pkg.badge}
            </span>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}">
              ${isSelected ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
            </div>
          </div>

          <!-- Name & Pricing -->
          <h4 class="text-sm font-black text-slate-900">${sanitize(pkg.name)}</h4>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="text-lg font-black text-teal-600 font-mono">${formatRupiah(pkg.price)}</span>
            <span class="text-[11px] text-slate-400 font-medium">(${formatRupiah(pkg.pricePerMonth)}/bln)</span>
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
      payBtn.innerHTML = `
        <span>Lanjut ke Pembayaran (${formatRupiah(selectedPkg.price)})</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      `;
    }
  };

  window.proceedWithActiveMembership = () => {
    handleMembershipCheckout(activePkgId);
  };

  const initialPkg = MEMBERSHIP_PACKAGES.find(p => p.id === activePkgId) || MEMBERSHIP_PACKAGES[0];

  const html = `
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-extrabold text-slate-900">Pilih Paket Membership Be Fit</h3>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">Self-Service</span>
      </div>
      <p class="text-xs text-slate-400 mt-0.5">Pilih paket latihan yang sesuai dengan target kebugaranmu</p>
    </div>

    <!-- Interactive Packages Grid -->
    <div id="membership-packages-list" class="space-y-3 mb-5">
      ${renderPackages()}
    </div>

    <!-- CTA Checkout Button -->
    <button type="button" id="btn-checkout-membership" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      onclick="window.proceedWithActiveMembership()">
      <span>Lanjut ke Pembayaran (${formatRupiah(initialPkg.price)})</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    </button>
  `;

  openBottomSheet(html);
}

function handleMembershipCheckout(pkgId) {
  requireAuth(() => {
    const pkg = MEMBERSHIP_PACKAGES.find(p => p.id === pkgId) || MEMBERSHIP_PACKAGES[0];
    closeBottomSheet();
    setTimeout(() => {
      openUnifiedCheckout({
        type: 'membership',
        package: pkg
      });
    }, 350);
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
      <button type="button" class="trainer-card relative shrink-0 rounded-xl overflow-hidden shadow-lg group snap-start text-left" style="width:145px;height:195px;" onclick="openTrainerDetail('${t.id}')">
        <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        ${isBooked ? `
          <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950 shadow-sm">
            ✓ AKTIF
          </span>
        ` : ''}
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <h4 class="text-white text-sm font-extrabold leading-tight">${sanitize(t.name)}</h4>
          <p class="text-white/70 text-[10px] font-medium mt-0.5">${t.clients} klien aktif</p>
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

function openTrainerDetail(idOrIndex) {
  const trainers = getTrainers();
  const t = typeof idOrIndex === 'string'
    ? (trainers.find(x => x.id === idOrIndex) || trainers[0])
    : (trainers[idOrIndex] || trainers[0]);
  const currentUser = getCurrentUser();
  const isBooked = currentUser && Array.isArray(currentUser.bookedTrainers) && currentUser.bookedTrainers.includes(t.id);

  const packageRows = t.packages.map((pkg, pi) => {
    if (isBooked) {
      return `
        <div class="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 text-left opacity-95">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-900">${pkg.label}</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">Aktif</span>
            </div>
            <span class="text-[11px] text-slate-500 block mt-0.5">${formatRupiah(pkg.perSession)}/sesi privat</span>
          </div>
          <div class="text-right">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
              ✓ PAKET AKTIF / SUDAH DIBELI
            </span>
          </div>
        </div>
      `;
    }

    return `
      <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 active:bg-teal-50 transition-all text-left group"
        onclick="handleTrainerPackageSelect('${t.id}', ${pi})">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-900 group-hover:text-teal-700">${pkg.label}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-extrabold ${pkg.badge.includes('🔥') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
              ${pkg.badge}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 block mt-0.5">${formatRupiah(pkg.perSession)}/sesi privat</span>
        </div>
        <div class="text-right">
          <span class="text-sm font-black text-teal-600 font-mono">${formatRupiah(pkg.price)}</span>
          <span class="text-[10px] text-teal-700 font-bold block mt-0.5 group-hover:underline">Pilih Paket &gt;</span>
        </div>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <div class="flex items-start gap-4 mb-4">
      <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shrink-0 shadow-sm">
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-black text-slate-900 leading-snug truncate">${sanitize(t.fullName)}</h3>
        <p class="text-xs text-teal-600 font-bold mt-0.5">${sanitize(t.specialization)}</p>
        <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
          <span>📋 ${t.experience}</span>
          <span>👤 <strong>${t.clients} klien aktif</strong></span>
        </div>
      </div>
    </div>

    ${isBooked ? `
      <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl mb-3 flex items-center gap-2 text-xs font-bold text-emerald-800">
        <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>✓ Anda sudah memiliki paket aktif bersama Coach ${sanitize(t.name)}. Hubungi coach untuk sesi latihan!</span>
      </div>
    ` : ''}

    <p class="text-xs text-slate-600 leading-relaxed mb-3.5">${sanitize(t.bio)}</p>

    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-[11px] text-slate-600 flex items-center gap-2">
      <span class="text-sm">🏆</span>
      <span class="font-medium">${sanitize(t.certifications)}</span>
    </div>

    <div class="sheet-divider"></div>

    <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">Pilih Paket Sesi Latihan Privat</h4>
    <div class="space-y-2.5">${packageRows}</div>
  `);
}

function handleTrainerPackageSelect(trainerId, packageIndex) {
  requireAuth(() => {
    const trainers = getTrainers();
    const t = trainers.find(x => x.id === trainerId) || trainers[0];
    const pkg = t.packages[packageIndex];

    const currentUser = getCurrentUser();
    if (currentUser && Array.isArray(currentUser.bookedTrainers) && currentUser.bookedTrainers.includes(t.id)) {
      showToast(`Anda sudah memiliki paket aktif bersama Coach ${t.name}!`);
      return;
    }

    closeBottomSheet();
    setTimeout(() => {
      openUnifiedCheckout({
        type: 'pt',
        trainer: t,
        package: pkg
      });
    }, 350);
  });
}

function openAllTrainersSheet() {
  const currentBranch = getSelectedBranch();
  const allTrainers = getTrainers();
  const trainers = allTrainers.filter(t => Array.isArray(t.branchIds) ? t.branchIds.includes(currentBranch.id) : true);

  if (currentBranch.id === 'buahbatu' || trainers.length === 0) {
    openBottomSheet(`
      <div class="mb-4">
        <h3 class="text-base font-extrabold text-slate-900">Personal Trainer</h3>
        <p class="text-xs text-slate-400 mt-0.5">${currentBranch.name}</p>
      </div>
      <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        <div class="text-3xl mb-2">🏋️‍♂️</div>
        <h4 class="text-sm font-bold text-slate-800">Belum ada trainer tersedia di cabang ini</h4>
        <p class="text-xs text-slate-500 mt-1">Layanan Personal Trainer segera hadir untuk cabang ${currentBranch.name}.</p>
      </div>
    `);
    return;
  }

  const cards = trainers.map(t => `
    <button type="button" class="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
      onclick="closeBottomSheet(); setTimeout(() => openTrainerDetail('${t.id}'), 350);">
      <img src="${t.photo}" alt="${sanitize(t.name)}" class="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold text-slate-900 truncate">${sanitize(t.fullName)}</h4>
        <p class="text-[11px] text-teal-600 font-bold mt-0.5 truncate">${sanitize(t.specialization)}</p>
        <p class="text-[10px] text-slate-400 mt-0.5">📋 ${t.experience} • 👤 ${t.clients} klien aktif</p>
      </div>
      <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  `).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Personal Trainer Be Fit</h3>
      <p class="text-xs text-slate-400 mt-0.5">${currentBranch.name}</p>
    </div>
    <div class="space-y-2.5">${cards}</div>
  `);
}

// ==================== 5. UNIFIED PAYMENT CHECKOUT SYSTEM (NO CREDIT CARD) ====================

let activePaymentMethod = 'qris';
let appliedVoucher = null;

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

    const v = VOUCHERS_DATA.find(x => x.code === cleanCode);
    if (!v) {
      voucherError = `Kode voucher "${cleanCode}" tidak valid atau kadaluarsa.`;
      updateCheckoutUI();
      return;
    }

    // Validate type compatibility
    if (v.type === 'pt' && type !== 'pt') {
      voucherError = `Voucher ${v.code} hanya berlaku untuk paket Personal Trainer.`;
      updateCheckoutUI();
      return;
    }
    if (v.type === 'membership' && type !== 'membership') {
      voucherError = `Voucher ${v.code} hanya berlaku untuk paket Membership.`;
      updateCheckoutUI();
      return;
    }

    // Validate minAmount
    if (v.minAmount && pkg.price < v.minAmount) {
      voucherError = `Voucher ${v.code} berlaku untuk minimal transaksi ${formatRupiah(v.minAmount)}.`;
      updateCheckoutUI();
      return;
    }

    // Special check for GAJIAN100K: 3/6/12 bulan
    if (v.code === 'GAJIAN100K' && pkg.durationDays && pkg.durationDays < 90) {
      voucherError = 'Voucher GAJIAN100K khusus untuk paket Membership 3, 6, atau 12 bulan.';
      updateCheckoutUI();
      return;
    }

    appliedVoucher = v;
    voucherError = '';
    showToast(`✓ Voucher ${v.code} berhasil digunakan! Potongan ${v.badge}.`, 3000);
    updateCheckoutUI();
  }

  function removeCheckoutVoucher() {
    appliedVoucher = null;
    voucherError = '';
    showToast('Voucher dibatalkan.');
    updateCheckoutUI();
  }

  window.applyCheckoutVoucher = applyCheckoutVoucher;
  window.removeCheckoutVoucher = removeCheckoutVoucher;

  function renderPaymentMethodDetails() {
    const vaNumber = `8801 ${currentUser.phone.replace(/[^0-9]/g, '').slice(-8) || '12345678'}`;

    if (activePaymentMethod === 'qris') {
      return `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">Verifikasi Instan Otomatis</span>
          <!-- Realistic Simulated QRIS Code -->
          <div class="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-slate-900 mx-auto flex flex-col items-center justify-center shadow-md">
            <svg class="w-32 h-32" viewBox="0 0 100 100" fill="#0F172A">
              <!-- QR Patterns -->
              <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="#0F172A" stroke-width="6"/>
              <rect x="12" y="12" width="14" height="14" fill="#0F172A"/>
              <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="#0F172A" stroke-width="6"/>
              <rect x="74" y="12" width="14" height="14" fill="#0F172A"/>
              <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="#0F172A" stroke-width="6"/>
              <rect x="12" y="74" width="14" height="14" fill="#0F172A"/>
              <circle cx="50" cy="50" r="10" fill="#0D9488"/>
              <rect x="42" y="10" width="8" height="8" fill="#0F172A"/>
              <rect x="40" y="70" width="12" height="12" fill="#0F172A"/>
              <rect x="70" y="45" width="10" height="10" fill="#0F172A"/>
              <rect x="60" y="75" width="15" height="8" fill="#0F172A"/>
            </svg>
            <span class="text-[9px] font-black tracking-wider text-slate-800 mt-1 uppercase font-mono">QRIS • BE FIT GYM</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2.5">Pindai kode QR menggunakan GoPay, OVO, Dana, ShopeePay, atau Mobile Banking.</p>
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
            ${VOUCHERS_DATA.map(v => {
              const isClaimed = claimedList.includes(v.code);
              const isCurrent = curVoucher && curVoucher.code === v.code;
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
        ${renderPaymentMethodDetails()}
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

      <!-- Pay Button with Real-Time Total -->
      <button type="button" id="btn-submit-payment" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        onclick="executePaymentProcess()">
        <span>Bayar Sekarang — ${formatRupiah(total)}</span>
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

  window.executePaymentProcess = () => {
    const payBtn = document.getElementById('btn-submit-payment');
    if (!payBtn) return;

    payBtn.disabled = true;
    payBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Memverifikasi Pembayaran...</span>
    `;

    setTimeout(() => {
      completePaymentSuccess(params, calculateBilling());
    }, 1000);
  };

  openBottomSheet(getCheckoutHtml());
}

function completePaymentSuccess(params, billing) {
  const { type, package: pkg, trainer } = params;
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const invoiceNo = `INV-BF-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const voucherCodeUsed = billing.appliedVoucher ? billing.appliedVoucher.code : '-';

  // 1. Sync User State
  if (type === 'membership') {
    const addDays = pkg.durationDays || 30;
    const baseDate = (currentUser.expiryDate && new Date(currentUser.expiryDate) > now)
      ? new Date(currentUser.expiryDate)
      : now;
    const newExpiry = new Date(baseDate.getTime() + addDays * 86400000).toISOString().split('T')[0];

    currentUser.packageType = pkg.shortName;
    currentUser.packageDuration = pkg.name;
    currentUser.expiryDate = newExpiry;
    currentUser.status = 'Active';
    currentUser.voucherUsed = voucherCodeUsed;
    currentUser.totalPaid = billing.total;
    currentUser.paymentMethod = activePaymentMethod.toUpperCase();
    currentUser.branch = getSelectedBranch().name.split(' ')[2] || 'Setiabudi';
    currentUser.dateJoined = dateStr;
    setCurrentUser(currentUser);

    syncWithCRMState(currentUser, 'Pembelian Paket Membership', `${pkg.name} (${formatRupiah(billing.total)})`);
    showToast(`Paket ${pkg.name} berhasil diaktifkan!`, 4000);
  } else if (type === 'pt') {
    currentUser.ptSessions = (currentUser.ptSessions || 0) + (pkg.sessions || 1);
    currentUser.ptTrainer = trainer.name;

    // Save trainer ID in bookedTrainers
    currentUser.bookedTrainers = currentUser.bookedTrainers || [];
    if (!currentUser.bookedTrainers.includes(trainer.id)) {
      currentUser.bookedTrainers.push(trainer.id);
    }
    setCurrentUser(currentUser);

    // Increment trainer clients count
    const trainers = getTrainers();
    const tIdx = trainers.findIndex(t => t.id === trainer.id);
    if (tIdx !== -1) {
      trainers[tIdx].clients += 1;
      saveTrainers(trainers);
    }

    // Save to befit_pt_bookings for CRM Admin Panel
    try {
      const rawPt = localStorage.getItem('befit_pt_bookings');
      const ptList = rawPt ? JSON.parse(rawPt) : [];
      ptList.unshift({
        id: 'PT-ORD-' + Math.floor(100 + Math.random() * 900),
        userName: currentUser.name,
        userPhone: currentUser.phone,
        trainerName: trainer.fullName || trainer.name,
        branch: getSelectedBranch().name,
        package: pkg.label,
        sessions: pkg.sessions,
        discount: billing.disc || 0,
        voucherCode: voucherCodeUsed,
        totalPaid: billing.total,
        date: dateStr,
        status: 'Aktif / Berjalan'
      });
      localStorage.setItem('befit_pt_bookings', JSON.stringify(ptList));
    } catch (e) {}

    syncWithCRMState(currentUser, 'Pembelian Sesi Personal Trainer', `${pkg.sessions} Sesi bersama Coach ${trainer.name} (${formatRupiah(billing.total)})`);
    showToast(`Paket PT bersama Coach ${trainer.name} berhasil dibeli!`, 4500);
    renderHomeTrainers();
  }

  // Record Transaction
  try {
    const rawTx = localStorage.getItem(TRANSACTIONS_KEY);
    const txList = rawTx ? JSON.parse(rawTx) : [];
    txList.unshift({
      id: invoiceNo,
      type: type === 'membership' ? 'Membership' : 'Personal Trainer',
      title: type === 'membership' ? pkg.name : `${pkg.label} bersama ${trainer.name}`,
      baseAmount: billing.base,
      voucherCode: voucherCodeUsed,
      discount: billing.disc,
      amount: billing.total,
      method: activePaymentMethod.toUpperCase(),
      date: dateStr,
      status: 'LUNAS'
    });
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txList));
  } catch (e) {}

  // Render Payment Receipt with Voucher Details
  const receiptHtml = `
    <div class="text-center py-2 mb-4">
      <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm animate-bounce-slow">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
        LUNAS / AKTIF
      </span>
      <h3 class="text-lg font-black text-slate-900 mt-1">Pembayaran Berhasil!</h3>
      <p class="text-xs text-slate-400 mt-0.5">${type === 'membership' ? 'Paket Membership kamu telah aktif seketika.' : `Paket PT bersama Coach ${trainer.name} siap digunakan!`}</p>
    </div>

    <!-- Invoice Details Box -->
    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-2 text-xs">
      <div class="flex justify-between pb-2 border-b border-slate-200">
        <span class="text-slate-400">Nomor Invoice:</span>
        <span class="font-mono font-bold text-slate-800">${invoiceNo}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Layanan:</span>
        <span class="font-bold text-slate-800 text-right">${type === 'membership' ? pkg.name : `${pkg.label} (${trainer.name})`}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Harga Normal:</span>
        <span class="font-mono text-slate-700">${formatRupiah(billing.base)}</span>
      </div>
      ${billing.appliedVoucher ? `
        <div class="flex justify-between text-emerald-600 font-bold">
          <span>Diskon Voucher (${billing.appliedVoucher.code}):</span>
          <span class="font-mono">-${formatRupiah(billing.disc)}</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span class="text-slate-400">Metode Pembayaran:</span>
        <span class="font-mono font-bold text-slate-800 uppercase">${activePaymentMethod}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Waktu Transaksi:</span>
        <span class="text-slate-700 font-mono">${dateStr}</span>
      </div>
      <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
        <span>Total Dibayar:</span>
        <span class="text-teal-600 font-mono font-black">${formatRupiah(billing.total)}</span>
      </div>
    </div>

    <button type="button" class="w-full py-3.5 rounded-xl bg-slate-900 text-white text-xs font-black shadow-md hover:bg-slate-800 active:scale-[0.98] transition-all"
      onclick="closeBottomSheet(); updateHeaderUserDisplay();">
      Tutup & Kembali ke Beranda
    </button>
  `;

  openBottomSheet(receiptHtml);
  updateHeaderUserDisplay();
  renderHomeTrainers();
}

// ==================== 6. CLEAN PROFILE SHEET (NO MEMBER ID, NO CRM LINK) ====================

function openProfileSheet() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  // Active membership package
  const activePackage = MEMBERSHIP_PACKAGES.find(p => p.shortName === currentUser.packageType || p.name === currentUser.packageDuration) || MEMBERSHIP_PACKAGES[1];

  const html = `
    <!-- User Profile Header: Clean, NO Member ID Clutter -->
    <div class="text-center mb-5 pb-4 border-b border-slate-100">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black text-xl flex items-center justify-center mx-auto mb-2.5 shadow-md">
        ${currentUser.name.substring(0, 2).toUpperCase()}
      </div>
      <h3 class="text-base font-black text-slate-900">${sanitize(currentUser.name)}</h3>
      <p class="text-xs text-slate-500 mt-0.5">${currentUser.phone} • ${currentUser.email || 'member@befit.id'}</p>
      <span class="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
        Status: ${currentUser.status || 'Active'}
      </span>
    </div>

    <!-- Active Membership Status Card: Clean, NO Member ID -->
    <div class="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl mb-4 shadow-md border border-amber-500/20">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] uppercase font-bold tracking-wider text-teal-400">Membership Be Fit</span>
        <span class="text-[10px] font-bold text-amber-300">✦ MEMBER RESMI ✦</span>
      </div>
      <h4 class="text-base font-black">${sanitize(currentUser.packageType || 'Pro Transformation')}</h4>
      <p class="text-xs text-slate-300 mt-0.5">Berlaku s/d: <strong class="text-white">${currentUser.expiryDate || 'Aktif'}</strong></p>
      
      <div class="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
        <span class="text-slate-300">Sisa Sesi PT:</span>
        <span class="font-bold text-brand-sunny font-mono">${currentUser.ptSessions || 0} Sesi Aktif</span>
      </div>
    </div>

    <!-- Primary Action: Perpanjang Membership (Aman & Membuka Checkout Paket Aktif) -->
    <div class="space-y-2.5 mb-4">
      <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-xl bg-teal-550 text-white hover:bg-teal-650 active:scale-[0.98] text-xs font-bold shadow-md shadow-teal-550/20 transition-all text-left"
        onclick="extendCurrentMembership()">
        <span class="flex items-center gap-2">
          <span class="text-base">⚡</span>
          <span>Perpanjang Membership (${sanitize(activePackage.shortName)})</span>
        </span>
        <svg class="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
      </button>

      <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors"
        onclick="openTransactionHistorySheet()">
        <span class="flex items-center gap-2"><span>🧾</span> Riwayat Transaksi & Invoice</span>
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <!-- Logout Button -->
    <button type="button" class="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
      onclick="handleLogout()">
      Keluar (Logout)
    </button>
  `;

  openBottomSheet(html);
}

function extendCurrentMembership() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const activePackage = MEMBERSHIP_PACKAGES.find(p => p.shortName === currentUser.packageType || p.name === currentUser.packageDuration) || MEMBERSHIP_PACKAGES[1];

  closeBottomSheet();
  setTimeout(() => {
    openUnifiedCheckout({
      type: 'membership',
      package: activePackage
    });
  }, 350);
}

function openTransactionHistorySheet() {
  let txList = [];
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (raw) txList = JSON.parse(raw);
  } catch (e) {}

  const listHtml = txList.length === 0 ? `
    <div class="py-8 text-center text-slate-400 text-xs">
      Belum ada riwayat transaksi.
    </div>
  ` : txList.map(tx => `
    <div class="p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
      <div class="flex justify-between items-center">
        <span class="font-bold text-slate-900">${sanitize(tx.title)}</span>
        <span class="text-teal-600 font-mono font-bold">${formatRupiah(tx.amount)}</span>
      </div>
      <div class="flex justify-between text-[11px] text-slate-400 font-mono">
        <span>${tx.id}</span>
        <span>${tx.date}</span>
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
    badgeEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs cursor-pointer hover:bg-slate-50 transition-colors" onclick="openProfileSheet()">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="font-bold text-slate-800 truncate max-w-[110px]">${sanitize(user.name.split(' ')[0])}</span>
        <span class="text-[10px] text-teal-600 font-bold font-mono">[${user.id}]</span>
      </div>
    `;
  } else {
    badgeEl.innerHTML = `
      <button type="button" class="px-3 py-1 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors" onclick="openAuthModal('login')">
        Masuk / Daftar
      </button>
    `;
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

function openReferralSheet() {
  const user = getCurrentUser();
  const code = user ? `BEFIT-${user.id.replace('BF-', '')}` : 'BEFIT-GIFT2026';

  openBottomSheet(`
    <div class="text-center mb-5">
      <span class="text-5xl block mb-2">🎁</span>
      <h3 class="text-lg font-extrabold text-slate-900">Ajak Teman, Dapat Reward!</h3>
      <p class="text-xs text-slate-500 mt-1">Bagikan kode referral unikmu. Setiap teman yang mendaftar, kamu mendapatkan perpanjangan membership gratis hingga 12 bulan!</p>
    </div>

    <div class="p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl text-center mb-4">
      <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Kode Referral Kamu</span>
      <span class="text-xl font-black text-blue-700 tracking-wider font-mono">${code}</span>
    </div>

    <button type="button" class="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all mb-2"
      onclick="copyToClipboard('${code}', 'Kode referral disalin!')">
      📋 Salin Kode Referral
    </button>

    <button type="button" class="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold shadow-md hover:bg-green-700 active:scale-[0.98] transition-all"
      onclick="shareReferral('${code}')">
      📤 Bagikan via WhatsApp
    </button>
  `);
}

function shareReferral(code) {
  const msg = encodeURIComponent(`Hai! Yuk gabung di Be Fit Gym! Gunakan kode referral saya *${code}* untuk dapatkan promo spesial saat pendaftaran: https://befit.vercel.app/`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
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
    <h3 class="text-base font-black text-slate-900 mb-1">${sanitize(p.title)}</h3>
    <p class="text-xs text-teal-600 font-bold mb-3">${sanitize(p.subtitle)}</p>
    <p class="text-xs text-slate-600 leading-relaxed mb-4">${sanitize(p.description)}</p>

    <div class="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-center mb-4">
      <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Kode Voucher Promo</span>
      <span class="text-lg font-black text-amber-900 font-mono tracking-wider">${p.voucherCode}</span>
    </div>

    <div class="sheet-divider"></div>
    <h4 class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Syarat & Ketentuan</h4>
    <ol class="text-xs space-y-1.5 list-decimal list-inside mb-5">${termsList}</ol>

    <button type="button" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all mb-2"
      onclick="copyToClipboard('${p.voucherCode}', 'Kode voucher ${p.voucherCode} berhasil disalin!')">
      Salin Kode Voucher 📋
    </button>
    <button type="button" class="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
      onclick="closeBottomSheet(); openPricingSheet();">
      Gunakan Saat Pilih Paket &rarr;
    </button>
  `);
}

function openVoucherList() {
  const claimedList = getUserClaimedVouchers();

  const items = VOUCHERS_DATA.map(v => {
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
  updateTrialButton();

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

  // Keyboard: Escape closes bottom sheet
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheetOpen) closeBottomSheet();
  });
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

    <!-- Credentials Hint Box -->
    <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4 text-xs text-amber-900 flex items-start gap-2">
      <span class="text-base">🔐</span>
      <div>
        <p class="font-bold text-amber-950">Kredensial Akses Admin:</p>
        <p class="font-mono text-[11px] mt-0.5 text-amber-800">Email: <strong>rrizky205@gmail.com</strong></p>
        <p class="font-mono text-[11px] text-amber-800">Password: <strong>wudinjir1911</strong></p>
      </div>
    </div>

    <form id="admin-login-modal-form" onsubmit="event.preventDefault(); submitAdminLogin();" class="space-y-3.5">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Admin</label>
        <input type="email" id="admin-modal-email" value="rrizky205@gmail.com" required
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-550 focus:border-transparent outline-none">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password Admin</label>
        <div class="relative">
          <input type="password" id="admin-modal-pass" value="wudinjir1911" required
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

  if (email === 'rrizky205@gmail.com' && pass === 'wudinjir1911') {
    localStorage.setItem('befit_admin_auth', 'true');
    showToast('Login Admin berhasil! Mengalihkan ke Panel Admin...', 2500);
    closeBottomSheet();
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 400);
  } else {
    showToast('Email atau password admin tidak valid!', 3500);
  }
}

window.openAdminLoginModal = openAdminLoginModal;
window.toggleAdminModalPassword = toggleAdminModalPassword;
window.submitAdminLogin = submitAdminLogin;
