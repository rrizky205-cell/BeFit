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
const CLASSES_STORAGE_KEY = 'befit_mobile_classes';
const TRAINERS_STORAGE_KEY = 'befit_mobile_trainers';
const TRANSACTIONS_KEY = 'befit_mobile_transactions';

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

// ==================== 2. CLASSES DATA (WITH REGISTERED USERS) ====================

const DEFAULT_CLASSES = [
  {
    id: 'CLS-1',
    name: 'Zumba',
    time: '18:10 – 19:00',
    difficulty: 'Easy',
    instructor: 'Lia',
    slotsLeft: 4,
    capacity: 15,
    description: 'Kelas kardio penuh energi dengan gerakan tarian Latin. Cocok untuk semua level, bakar kalori sambil bersenang-senang! Tidak perlu pengalaman menari.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=350&h=460&fit=crop&q=80',
    registeredUserIds: []
  },
  {
    id: 'CLS-2',
    name: 'Bodypump',
    time: '19:20 – 20:10',
    difficulty: 'Hard',
    instructor: 'Hari',
    slotsLeft: 8,
    capacity: 20,
    description: 'Latihan beban berirama tinggi dengan barbell ringan dan repetisi tinggi. Membentuk otot seluruh tubuh dan meningkatkan daya tahan. Wajib pakai sepatu gym.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=350&h=460&fit=crop&q=80',
    registeredUserIds: []
  },
  {
    id: 'CLS-3',
    name: 'HIIT Core',
    time: '17:00 – 17:45',
    difficulty: 'Hard',
    instructor: 'Coach Alex',
    slotsLeft: 2,
    capacity: 12,
    description: 'High-Intensity Interval Training yang fokus pada core dan otot perut. Kombinasi plank, mountain climber, russian twist, dan burpee dalam format tabata 45 menit.',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=350&h=460&fit=crop&q=80',
    registeredUserIds: []
  },
  {
    id: 'CLS-4',
    name: 'Vinyasa Yoga',
    time: '16:30 – 17:30',
    difficulty: 'Easy',
    instructor: 'Maya',
    slotsLeft: 11,
    capacity: 15,
    description: 'Aliran gerakan yoga dinamis yang menghubungkan napas dan postur tubuh. Meningkatkan fleksibilitas, keseimbangan, dan ketenangan pikiran. Cocok untuk pemula.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=350&h=460&fit=crop&q=80',
    registeredUserIds: []
  }
];

// ==================== 3. PERSONAL TRAINERS ====================

const DEFAULT_TRAINERS = [
  {
    id: 'TR-1',
    name: 'Aby',
    fullName: 'Muhammad Aby Pratama',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=290&h=390&fit=crop&q=80',
    clients: 59,
    experience: '6 Tahun',
    specialization: 'Fat Loss, Functional Training',
    certifications: 'ACE Certified Personal Trainer, NSCA-CPT',
    bio: 'Aby adalah pelatih berpengalaman yang fokus pada program fat loss dan peningkatan mobilitas fungsional. Pendekatan latihannya menyesuaikan kemampuan individu.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-2',
    name: 'Egi Angga',
    fullName: 'Egi Angga Permana',
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=290&h=390&fit=crop&q=80',
    clients: 33,
    experience: '4 Tahun',
    specialization: 'Hypertrophy, Strength Training',
    certifications: 'ISSA Certified Fitness Trainer',
    bio: 'Egi ahli dalam program pembentukan massa otot (hypertrophy) dan kekuatan. Cocok untuk kamu yang ingin mendapatkan postur tubuh atletis dan kuat.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-3',
    name: 'Sarah Wijaya',
    fullName: 'Sarah Ayu Wijaya',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=290&h=390&fit=crop&q=80',
    clients: 47,
    experience: '5 Tahun',
    specialization: 'Weight Management, Post-Injury Rehab',
    certifications: 'NASM-CPT, Prehab/Rehab Specialist',
    bio: 'Sarah berspesialisasi dalam program penurunan berat badan sehat dan pemulihan pasca cedera. Pendekatannya lembut namun efektif, sangat direkomendasikan untuk pemula dan wanita.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  },
  {
    id: 'TR-4',
    name: 'Bima Sakti',
    fullName: 'Bima Sakti Nugroho',
    photo: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=290&h=390&fit=crop&q=80',
    clients: 28,
    experience: '3 Tahun',
    specialization: 'Athletic Performance, HIIT',
    certifications: 'CrossFit Level 1 Trainer',
    bio: 'Bima memiliki latar belakang atlet dan berfokus pada program peningkatan performa atletis, kecepatan, dan daya tahan menggunakan metode CrossFit dan HIIT.',
    packages: [
      { sessions: 1, price: 199000, label: '1 Sesi', perSession: 199000, badge: 'Trial Sesi' },
      { sessions: 4, price: 750000, label: '4 Sesi', perSession: 187500, badge: 'Starter' },
      { sessions: 8, price: 1400000, label: '8 Sesi', perSession: 175000, badge: 'Best Value 🔥' },
      { sessions: 12, price: 1950000, label: '12 Sesi', perSession: 162500, badge: 'Pro Athlete ⚡' }
    ]
  }
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
  { code: 'NEWFIT15', desc: 'Diskon 15% Member Baru', expires: '30 Nov 2026', type: 'Membership', percent: 15 },
  { code: 'COUPLE25', desc: 'Diskon 25% Paket Couple', expires: '31 Des 2026', type: 'Membership', percent: 25 },
  { code: 'PTFREE2', desc: 'Gratis 2 Sesi Personal Trainer', expires: '30 Nov 2026', type: 'PT Session', freePT: 2 },
  { code: 'BUNDLE799', desc: 'Potongan Rp 300K Bundling PT', expires: '15 Nov 2026', type: 'Bundling', amount: 300000 }
];

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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

// ==================== AUTH GUARD & AUTH MODALS ====================

let pendingAuthAction = null;

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

function openAuthModal(defaultTab = 'login') {
  const html = `
    <div class="mb-5 text-center">
      <!-- Large 96px Gold & Silver BF Monogram Emblem -->
      <div class="w-24 h-24 rounded-3xl mx-auto mb-3 shadow-xl p-1 bg-[#090D16] border border-amber-500/40 relative flex items-center justify-center gold-glow">
        <svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="auth_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D4AF37"/>
              <stop offset="25%" stop-color="#FFF2B2"/>
              <stop offset="50%" stop-color="#AA771C"/>
              <stop offset="75%" stop-color="#FDE08B"/>
              <stop offset="100%" stop-color="#8C5C0C"/>
            </linearGradient>
            <linearGradient id="auth_silver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F8FAFC"/>
              <stop offset="35%" stop-color="#E2E8F0"/>
              <stop offset="70%" stop-color="#94A3B8"/>
              <stop offset="100%" stop-color="#475569"/>
            </linearGradient>
            <radialGradient id="auth_plate" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#1E293B"/>
              <stop offset="60%" stop-color="#0F172A"/>
              <stop offset="100%" stop-color="#030712"/>
            </radialGradient>
            <filter id="auth_goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#D4AF37" flood-opacity="0.4"/>
            </filter>
          </defs>
          <rect x="5" y="5" width="110" height="110" rx="26" fill="url(#auth_plate)" stroke="url(#auth_gold)" stroke-width="2.8"/>
          <rect x="9" y="9" width="102" height="102" rx="22" fill="none" stroke="url(#auth_silver)" stroke-width="0.9" opacity="0.4"/>
          <circle cx="60" cy="60" r="48" fill="none" stroke="url(#auth_gold)" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.3"/>
          <!-- GOLD LETTER B -->
          <path d="M 28 24 L 54 24 C 67 24 76 29 76 39 C 76 45 71 50 64 52 C 73 54 80 60 80 71 C 80 82 70 88 54 88 L 28 88 Z M 41 35 L 41 49 L 53 49 C 59 49 63 46 63 42 C 63 37.5 59 35 53 35 Z M 41 59 L 41 77 L 54 77 C 61 77 66 74 66 68 C 66 62 61 59 54 59 Z" fill="url(#auth_gold)" filter="url(#auth_goldGlow)"/>
          <!-- SILVER LETTER F -->
          <path d="M 52 28 L 88 28 L 88 38 L 64 38 L 64 51 L 82 51 L 82 60 L 64 60 L 64 85 L 52 85 Z" fill="url(#auth_silver)" opacity="0.95"/>
          <!-- Overlap Knot -->
          <rect x="50" y="49" width="16" height="5" rx="1.5" fill="url(#auth_gold)"/>
        </svg>
      </div>

      <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="text-[9px] font-extrabold uppercase tracking-widest text-amber-800 font-sans">Official Member Portal</span>
      </div>

      <h3 class="text-xl font-extrabold tracking-tight">
        <span class="text-gold-gradient font-black">BE FIT</span>
      </h3>
      <p class="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 mt-0.5">GYM & FITNESS CLUB</p>
      <p class="text-xs text-slate-500 mt-1.5">Selamat datang! Akses eksklusif jadwal kelas, PT, & membership</p>
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
        <input type="password" id="login-password" required placeholder="Masukkan password akun"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
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
        <label class="block text-xs font-bold text-slate-700 mb-1">Email Aktif *</label>
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
        <input type="password" id="reg-password" required minlength="4" placeholder="Minimal 4 karakter"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 bg-white" />
      </div>
      <button type="submit" class="w-full py-3 mt-1 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all">
        Daftar Sekarang 🎉
      </button>
      <p class="text-[10px] text-slate-400 text-center">Dengan mendaftar, kamu langsung mendapatkan nomor Member ID resmi Be Fit.</p>
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

  const users = getUsers();
  const found = users.find(u => {
    const emailMatch = u.email && u.email.toLowerCase() === ident;
    const phoneMatch = u.phone && u.phone.replace(/[^0-9]/g, '') === ident.replace(/[^0-9]/g, '');
    return (emailMatch || phoneMatch) && u.password === pass;
  });

  if (!found) {
    showToast('Email/No HP atau password salah. Coba akun demo!');
    return;
  }

  setCurrentUser(found);
  closeBottomSheet();
  showToast(`Selamat datang kembali, ${found.name}! 👋`, 3000);

  if (typeof pendingAuthAction === 'function') {
    const act = pendingAuthAction;
    pendingAuthAction = null;
    setTimeout(() => act(), 350);
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
  const phone = document.getElementById('reg-phone')?.value.trim();
  const pass = document.getElementById('reg-password')?.value;

  if (!name || !email || !phone || !pass) {
    showToast('Harap lengkapi semua kolom pendaftaran');
    return;
  }

  const users = getUsers();
  // Check if exists
  const exists = users.find(u => u.email === email || u.phone === phone);
  if (exists) {
    showToast('Email atau nomor WhatsApp sudah terdaftar! Silakan login.');
    switchAuthTab('login');
    return;
  }

  const newId = `BF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser = {
    id: newId,
    name,
    email,
    phone,
    password: pass,
    packageType: 'Free Starter',
    packageDuration: 'Belum Berlangganan',
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Active',
    ptSessions: 0,
    ptTrainer: null,
    isTrialClaimed: false,
    role: 'member',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  // Sync to CRM
  syncWithCRMState(newUser, 'Pendaftaran Member Baru', 'Daftar via Mobile App');

  closeBottomSheet();
  showToast(`Akun berhasil dibuat! Selamat datang, ${newUser.name} [${newUser.id}] 🎉`, 4000);

  if (typeof pendingAuthAction === 'function') {
    const act = pendingAuthAction;
    pendingAuthAction = null;
    setTimeout(() => act(), 350);
  }
}

function loginInstantDemo() {
  const users = getUsers();
  const demoUser = users.find(u => u.email === 'member@befit.id') || users[0];
  setCurrentUser(demoUser);
  closeBottomSheet();
  showToast(`⚡ Login berhasil sebagai ${demoUser.name} [${demoUser.id}]`, 3000);

  if (typeof pendingAuthAction === 'function') {
    const act = pendingAuthAction;
    pendingAuthAction = null;
    setTimeout(() => act(), 350);
  }
}

function handleLogout() {
  setCurrentUser(null);
  closeBottomSheet();
  showToast('Anda telah logout.');
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
}

function openBranchSheet() {
  const currentBranch = getSelectedBranch();

  const items = BRANCHES_DATA.map(b => {
    const isSelected = b.id === currentBranch.id;

    return `
      <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${isSelected ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}"
        onclick="handleSelectBranch('${b.id}')">
        <div class="flex items-center gap-3 text-left">
          <div class="w-10 h-10 rounded-xl ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'} flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900">${sanitize(b.name)}</h4>
              ${isSelected ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-teal-600 text-white">Aktif</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">${sanitize(b.address)}</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0"
          style="background-color: ${b.crowdBg}; color: ${b.crowdText}; border-color: ${b.crowdBorder};">
          ${b.crowd}
        </span>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Pilih Lokasi Cabang Be Fit</h3>
      <p class="text-xs text-slate-400 mt-0.5">Tingkat keramaian & kelas terdekat disesuaikan dengan cabang yang dipilih</p>
    </div>
    <div class="space-y-2.5">${items}</div>
  `);
}

function handleSelectBranch(branchId) {
  const branch = setSelectedBranch(branchId);
  closeBottomSheet();
  showToast(`📍 Lokasi diubah ke ${branch.name}`);
  renderHomeClasses();
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
          <span class="font-bold text-green-800">06:00 – 09:00 WIB</span>
          <span class="text-[10px] text-green-600 block">Sesi Pagi Tenang</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low (20%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
        <div>
          <span class="font-bold text-amber-800">09:00 – 15:00 WIB</span>
          <span class="text-[10px] text-amber-600 block">Sesi Siang Santai</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Medium (50%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
        <div>
          <span class="font-bold text-red-800">16:00 – 20:30 WIB</span>
          <span class="text-[10px] text-red-600 block">Prime Time Malam (Jam Ramai)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">High (85%)</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-xs">
        <div>
          <span class="font-bold text-green-800">20:30 – 22:00 WIB</span>
          <span class="text-[10px] text-green-600 block">Late Workout Session</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low (30%)</span>
      </div>
    </div>

    <div class="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
      <span class="text-[11px] text-slate-500 font-medium">Tips: Datang sebelum jam 16:00 untuk latihan tanpa antre alat.</span>
    </div>
  `);
}

// ==================== 2. KELAS TERSEDIA & ANTI-DUPLICATE BOOKING ====================

function renderHomeClasses() {
  const container = document.getElementById('home-classes-container');
  if (!container) return;

  const classes = getClasses();
  const currentUser = getCurrentUser();

  container.innerHTML = classes.map(cls => {
    const isRegistered = currentUser && Array.isArray(cls.registeredUserIds) && cls.registeredUserIds.includes(currentUser.id);
    const isFull = cls.slotsLeft <= 0;

    let buttonHtml = '';
    let badgeHtml = '';

    if (isRegistered) {
      buttonHtml = `
        <span class="inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-emerald-500 text-slate-950 shadow-sm">
          ✓ SUDAH TERDAFTAR
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
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${cls.slotsLeft <= 3 ? 'bg-amber-500' : 'bg-green-600'} text-white shadow-sm">
          Tersisa ${cls.slotsLeft} Slot
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

  const isRegistered = currentUser && Array.isArray(cls.registeredUserIds) && cls.registeredUserIds.includes(currentUser.id);
  const isFull = cls.slotsLeft <= 0;

  const diffBadge = cls.difficulty === 'Easy'
    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Easy Level</span>'
    : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Hard Level</span>';

  let actionButtonHtml = '';
  if (isRegistered) {
    actionButtonHtml = `
      <button type="button" class="w-full py-3 rounded-xl bg-emerald-50 text-emerald-800 border-2 border-emerald-400 text-sm font-extrabold cursor-default flex items-center justify-center gap-2 shadow-sm" disabled>
        <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>✓ ANDA SUDAH TERDAFTAR DI KELAS INI</span>
      </button>
    `;
  } else if (isFull) {
    actionButtonHtml = `
      <button type="button" class="w-full py-3 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-sm font-bold cursor-not-allowed" disabled>
        Kuota Kelas Sudah Penuh
      </button>
    `;
  } else {
    actionButtonHtml = `
      <button type="button" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        onclick="handleBookClass('${cls.id}')">
        <span>Daftar Kelas ${sanitize(cls.name)} Sekarang</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
  }

  const html = `
    <div class="relative rounded-2xl overflow-hidden mb-4 shadow-sm" style="height:175px;">
      <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-3.5 left-4 right-4">
        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm mb-1">${cls.difficulty}</span>
        <h3 class="text-white text-xl font-black">${sanitize(cls.name)}</h3>
        <p class="text-white/80 text-xs font-medium">Instruktur: <strong>${sanitize(cls.instructor)}</strong></p>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-3.5 flex-wrap">
      ${diffBadge}
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">🕒 ${cls.time}</span>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cls.slotsLeft <= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'} border">
        Sisa ${cls.slotsLeft} dari ${cls.capacity} Kuota
      </span>
    </div>

    <p class="text-sm text-slate-600 leading-relaxed mb-4">${sanitize(cls.description)}</p>

    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-center justify-between text-xs">
      <div>
        <span class="text-slate-400 block text-[10px]">Lokasi Cabang:</span>
        <span class="font-bold text-slate-800">${getSelectedBranch().name}</span>
      </div>
      <div class="text-right">
        <span class="text-slate-400 block text-[10px]">Status Anda:</span>
        <span class="font-bold ${isRegistered ? 'text-green-600' : 'text-slate-700'}">${isRegistered ? 'Terdaftar ✓' : 'Belum Terdaftar'}</span>
      </div>
    </div>

    ${actionButtonHtml}
  `;

  openBottomSheet(html);
}

function handleBookClass(classId) {
  requireAuth(() => {
    const classes = getClasses();
    const cls = classes.find(c => c.id === classId);
    const currentUser = getCurrentUser();

    if (!cls || !currentUser) return;

    if (!cls.registeredUserIds) cls.registeredUserIds = [];

    // Duplicate check
    if (cls.registeredUserIds.includes(currentUser.id)) {
      showToast(`Anda sudah terdaftar di kelas ${cls.name} ini!`, 3500);
      openClassDetail(classId);
      return;
    }

    // Quota check
    if (cls.slotsLeft <= 0) {
      showToast(`Maaf, kuota kelas ${cls.name} sudah penuh!`, 3500);
      openClassDetail(classId);
      return;
    }

    // Deduct quota & register
    cls.slotsLeft -= 1;
    cls.registeredUserIds.push(currentUser.id);
    saveClasses(classes);

    // Sync CRM
    syncWithCRMState(currentUser, 'Pendaftaran Kelas Studio', `Kelas ${cls.name} (${cls.time})`);

    renderHomeClasses();
    openClassDetail(classId);
    showToast(`✓ Berhasil mendaftar kelas ${cls.name}!`, 3500);
  });
}

function openAllClassesSheet() {
  const classes = getClasses();
  const currentUser = getCurrentUser();

  const cards = classes.map(cls => {
    const isRegistered = currentUser && Array.isArray(cls.registeredUserIds) && cls.registeredUserIds.includes(currentUser.id);

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
          <span class="text-[10px] font-bold ${cls.slotsLeft <= 3 ? 'text-amber-600' : 'text-green-600'}">
            Sisa ${cls.slotsLeft} dari ${cls.capacity} kuota
          </span>
        </div>
        <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Jadwal Kelas Hari Ini</h3>
      <p class="text-xs text-slate-400 mt-0.5">${getSelectedBranch().name}</p>
    </div>
    <div class="space-y-2.5">${cards}</div>
  `);
}

// ==================== 3. INTERACTIVE MEMBERSHIP SELECTION ====================

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
      payBtn.textContent = `Lanjut ke Pembayaran (${formatRupiah(selectedPkg.price)})`;
    }
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
      onclick="handleMembershipCheckout('${initialPkg.id}')">
      <span>Lanjut ke Pembayaran (${formatRupiah(initialPkg.price)})</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    </button>
  `;

  openBottomSheet(html);
}

function handleMembershipCheckout(pkgId) {
  requireAuth(() => {
    const pkg = MEMBERSHIP_PACKAGES.find(p => p.id === pkgId) || MEMBERSHIP_PACKAGES[1];
    closeBottomSheet();
    setTimeout(() => {
      openUnifiedCheckout({
        type: 'membership',
        package: pkg
      });
    }, 350);
  });
}

// ==================== 4. PERSONAL TRAINER SELECTION ====================

function openTrainerDetail(index) {
  const trainers = getTrainers();
  const t = trainers[index] || trainers[0];

  const packageRows = t.packages.map((pkg, pi) => `
    <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 active:bg-teal-50 transition-all text-left group"
      onclick="handleTrainerPackageSelect(${index}, ${pi})">
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
  `).join('');

  openBottomSheet(`
    <div class="flex items-start gap-4 mb-4">
      <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shrink-0 shadow-sm">
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-black text-slate-900 leading-snug truncate">${sanitize(t.fullName)}</h3>
        <p class="text-xs text-teal-600 font-bold mt-0.5">${sanitize(t.specialization)}</p>
        <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
          <span>📋 ${t.experience}</span>
          <span>👤 <strong id="trainer-clients-${index}">${t.clients} klien aktif</strong></span>
        </div>
      </div>
    </div>

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

function handleTrainerPackageSelect(trainerIndex, packageIndex) {
  requireAuth(() => {
    const trainers = getTrainers();
    const t = trainers[trainerIndex];
    const pkg = t.packages[packageIndex];

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
  const trainers = getTrainers();

  const cards = trainers.map((t, i) => `
    <button type="button" class="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
      onclick="closeBottomSheet(); setTimeout(() => openTrainerDetail(${i}), 350);">
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
      <p class="text-xs text-slate-400 mt-0.5">Pilih pelatih bersertifikasi untuk mendampingi targetmu</p>
    </div>
    <div class="space-y-2.5">${cards}</div>
  `);
}

// ==================== 5. UNIFIED PAYMENT CHECKOUT SYSTEM ====================

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
  appliedVoucher = null;

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
    return { base, disc, total };
  }

  function renderPaymentMethodDetails() {
    const vaNumber = `8801 ${currentUser.phone.replace(/[^0-9]/g, '').slice(-8) || '12345678'}`;

    if (activePaymentMethod === 'qris') {
      return `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <span class="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">Verifikasi Otomatis</span>
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
              <rect x="55" y="20" width="8" height="8" fill="#0F172A"/>
              <rect x="40" y="70" width="12" height="12" fill="#0F172A"/>
              <rect x="70" y="45" width="10" height="10" fill="#0F172A"/>
              <rect x="60" y="75" width="15" height="8" fill="#0F172A"/>
            </svg>
            <span class="text-[9px] font-black tracking-wider text-slate-800 mt-1 uppercase font-mono">QRIS • BE FIT GYM</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2.5">Pindai kode QR menggunakan GoPay, OVO, Dana, ShopeePay, atau BCA Mobile.</p>
        </div>
      `;
    }

    if (activePaymentMethod.includes('va')) {
      const bankName = activePaymentMethod === 'bca_va' ? 'BCA' : activePaymentMethod === 'mandiri_va' ? 'Mandiri' : 'BNI / BRI';
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
          <p class="text-[11px] text-slate-400 mt-2">Batas waktu pembayaran 2 jam. Sesi langsung aktif seketika setelah transfer.</p>
        </div>
      `;
    }

    return `
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Nomor Kartu Kredit / Debit</label>
          <input type="text" placeholder="4000 1234 5678 9010" class="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-xs outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" placeholder="MM/YY" class="bg-white border border-slate-200 rounded-xl p-2 font-mono text-xs outline-none" />
          <input type="password" placeholder="CVV" maxlength="3" class="bg-white border border-slate-200 rounded-xl p-2 font-mono text-xs outline-none" />
        </div>
      </div>
    `;
  }

  function getCheckoutHtml() {
    const { base, disc, total } = calculateBilling();
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
          <span>Pemesan: <strong>${sanitize(currentUser.name)}</strong> (${currentUser.id})</span>
          <span>${currentUser.phone}</span>
        </div>
      </div>

      <!-- Pilihan Metode Pembayaran -->
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
              <span class="text-slate-900 block leading-tight">BCA Virtual Account</span>
              <span class="text-[9px] text-slate-400 font-normal">Transfer Bank</span>
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

          <button type="button" class="payment-method-card p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${activePaymentMethod === 'cc' ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}"
            onclick="switchPaymentMethod('cc')">
            <span class="text-lg">💳</span>
            <div>
              <span class="text-slate-900 block leading-tight">Kartu Kredit</span>
              <span class="text-[9px] text-slate-400 font-normal">Visa, Mastercard</span>
            </div>
          </button>

        </div>
      </div>

      <!-- Payment Method Interactive Details (QR / VA) -->
      <div id="payment-details-container" class="mb-4">
        ${renderPaymentMethodDetails()}
      </div>

      <!-- Tagihan Akhir -->
      <div class="p-3.5 bg-slate-100/70 rounded-2xl mb-4 space-y-1.5 text-xs text-slate-600">
        <div class="flex justify-between">
          <span>Subtotal Layanan:</span>
          <span class="font-mono font-medium">${formatRupiah(base)}</span>
        </div>
        ${disc > 0 ? `
          <div class="flex justify-between text-teal-600 font-bold">
            <span>Diskon Promo:</span>
            <span class="font-mono">-${formatRupiah(disc)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span>Biaya Layanan & Admin:</span>
          <span class="font-bold text-emerald-600 font-mono">GRATIS</span>
        </div>
        <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
          <span>Total Tagihan:</span>
          <span class="text-base text-teal-600 font-mono font-black">${formatRupiah(total)}</span>
        </div>
      </div>

      <!-- Pay Button -->
      <button type="button" id="btn-submit-payment" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-lg shadow-teal-550/30 hover:bg-teal-650 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        onclick="executePaymentProcess()">
        <span>Bayar Sekarang — ${formatRupiah(total)}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </button>
    `;
  }

  window.switchPaymentMethod = (method) => {
    activePaymentMethod = method;
    const content = document.getElementById('sheet-content');
    if (content) content.innerHTML = getCheckoutHtml();
  };

  window.executePaymentProcess = () => {
    const payBtn = document.getElementById('btn-submit-payment');
    if (!payBtn) return;

    // Loading state
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
    setCurrentUser(currentUser);

    syncWithCRMState(currentUser, 'Pembelian Paket Membership', `${pkg.name} (${formatRupiah(billing.total)})`);
  } else if (type === 'pt') {
    currentUser.ptSessions = (currentUser.ptSessions || 0) + (pkg.sessions || 1);
    currentUser.ptTrainer = trainer.name;
    setCurrentUser(currentUser);

    // Increment trainer client count
    const trainers = getTrainers();
    const tIdx = trainers.findIndex(t => t.id === trainer.id);
    if (tIdx !== -1) {
      trainers[tIdx].clients += 1;
      saveTrainers(trainers);
    }

    syncWithCRMState(currentUser, 'Pembelian Sesi Personal Trainer', `${pkg.sessions} Sesi bersama Coach ${trainer.name} (${formatRupiah(billing.total)})`);
  }

  // Record Transaction History
  try {
    const rawTx = localStorage.getItem(TRANSACTIONS_KEY);
    const txList = rawTx ? JSON.parse(rawTx) : [];
    txList.unshift({
      id: invoiceNo,
      type: type === 'membership' ? 'Membership' : 'Personal Trainer',
      title: type === 'membership' ? pkg.name : `${pkg.label} bersama ${trainer.name}`,
      amount: billing.total,
      method: activePaymentMethod.toUpperCase(),
      date: dateStr,
      status: 'LUNAS'
    });
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txList));
  } catch (e) {}

  // 2. Render Payment Receipt
  const receiptHtml = `
    <div class="text-center py-2 mb-4">
      <div class="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm animate-bounce-slow">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>
      <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
        LUNAS / AKTIF
      </span>
      <h3 class="text-lg font-black text-slate-900 tracking-tight">Pembayaran Berhasil!</h3>
      <p class="text-xs text-slate-500 mt-0.5">Layanan kebugaranmu kini sudah aktif</p>
    </div>

    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5 space-y-2 text-xs">
      <div class="flex justify-between pb-2 border-b border-slate-200 text-slate-400 font-mono text-[11px]">
        <span>No. Invoice:</span>
        <strong class="text-slate-800">${invoiceNo}</strong>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>Waktu Transaksi:</span>
        <span class="font-medium text-slate-900">${dateStr}</span>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>Paket Layanan:</span>
        <strong class="text-slate-900">${type === 'membership' ? sanitize(pkg.name) : `${pkg.label} bersama Coach ${sanitize(trainer.name)}`}</strong>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>Member ID:</span>
        <span class="font-mono font-bold text-teal-600">${currentUser.id} (${sanitize(currentUser.name)})</span>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>Metode Pembayaran:</span>
        <span class="font-medium text-slate-900 uppercase">${activePaymentMethod}</span>
      </div>
      <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
        <span>Total Dibayar:</span>
        <span class="text-base text-teal-600 font-mono">${formatRupiah(billing.total)}</span>
      </div>
    </div>

    <button type="button" class="w-full py-3.5 rounded-xl bg-teal-550 text-white text-sm font-black shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all"
      onclick="closeBottomSheet(); showToast('Selamat menikmati fasilitas Be Fit Gym! 🎉', 3500);">
      Selesai & Kembali ke Beranda
    </button>
  `;

  openBottomSheet(receiptHtml);
}

// ==================== 6. PROFILE SHEET & USER STATUS ====================

function openProfileSheet() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  const html = `
    <div class="text-center mb-5 pb-4 border-b border-slate-100">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black text-xl flex items-center justify-center mx-auto mb-2.5 shadow-md">
        ${currentUser.name.substring(0, 2).toUpperCase()}
      </div>
      <h3 class="text-base font-black text-slate-900">${sanitize(currentUser.name)}</h3>
      <p class="text-xs text-slate-500 font-mono mt-0.5">${currentUser.id} • ${currentUser.phone}</p>
      <span class="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
        Status: ${currentUser.status || 'Active'}
      </span>
    </div>

    <!-- Active Membership Status Card -->
    <div class="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl mb-4 shadow-md">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] uppercase font-bold tracking-wider text-teal-400">Membership Be Fit</span>
        <span class="text-[10px] font-mono font-bold text-slate-300">ID: ${currentUser.id}</span>
      </div>
      <h4 class="text-base font-black">${sanitize(currentUser.packageType || 'Pro Member')}</h4>
      <p class="text-xs text-slate-300 mt-0.5">Berlaku s/d: <strong class="text-white">${currentUser.expiryDate || 'Aktif'}</strong></p>
      
      <div class="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
        <span class="text-slate-300">Sisa Sesi PT:</span>
        <span class="font-bold text-brand-sunny font-mono">${currentUser.ptSessions || 0} Sesi Aktif</span>
      </div>
    </div>

    <!-- Quick Navigation Links -->
    <div class="space-y-2 mb-4">
      <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors"
        onclick="closeBottomSheet(); openPricingSheet();">
        <span class="flex items-center gap-2"><span>⚡</span> Ganti / Perpanjang Membership</span>
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>

      <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors"
        onclick="openTransactionHistorySheet()">
        <span class="flex items-center gap-2"><span>🧾</span> Riwayat Transaksi & Invoice</span>
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>

      <a href="admin.html" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 text-left transition-colors block">
        <span class="flex items-center gap-2"><span>🔐</span> Buka Dashboard Admin CRM</span>
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>

    <button type="button" class="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
      onclick="handleLogout()">
      Keluar (Logout)
    </button>
  `;

  openBottomSheet(html);
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
    const user = getCurrentUser();
    if (!user) return;

    if (user.isTrialClaimed) {
      showToast('Anda sudah mengklaim Free Trial 7 Hari sebelumnya.');
      updateTrialButton();
      return;
    }

    user.isTrialClaimed = true;
    user.status = 'Trial Active';
    user.expiryDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    setCurrentUser(user);

    syncWithCRMState(user, 'Klaim Free Trial 7 Hari', 'Free Pass Mobile');
    updateTrialButton();
    showToast(`🎉 Free Trial 7 Hari aktif untuk ${user.name}!`, 3500);
  });
}

function updateTrialButton() {
  const btn = document.getElementById('btn-claim-trial');
  if (!btn) return;
  const user = getCurrentUser();

  if (user && user.isTrialClaimed) {
    btn.textContent = 'Terklaim ✓';
    btn.className = 'px-4 py-2 rounded-lg bg-slate-200 text-slate-500 text-xs font-bold shrink-0 cursor-default shadow-none';
    btn.disabled = true;
  } else {
    btn.textContent = 'Klaim';
    btn.className = 'px-4 py-2 rounded-lg bg-teal-550 text-white text-xs font-bold shrink-0 shadow-sm hover:bg-teal-650 active:scale-95 transition-all';
    btn.disabled = false;
  }
}

// ==================== REFERRAL & PROMO MODALS ====================

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
  const items = VOUCHERS_DATA.map(v => `
    <div class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors">
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
      <button type="button" class="px-3 py-1.5 rounded-lg bg-teal-550 text-white text-[10px] font-bold shrink-0 hover:bg-teal-650 active:scale-95 transition-all"
        onclick="copyToClipboard('${v.code}', 'Voucher ${v.code} disalin!')">
        Salin
      </button>
    </div>
  `).join('');

  openBottomSheet(`
    <div class="mb-4">
      <h3 class="text-base font-extrabold text-slate-900">Voucher & Promo Aktif 🏷️</h3>
      <p class="text-xs text-slate-400 mt-0.5">Gunakan kode voucher saat checkout untuk potongan harga</p>
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

  // 3. Render Dynamic Classes
  renderHomeClasses();

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
