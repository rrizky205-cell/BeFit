/**
 * BE FIT MOBILE APP – Clean Commercial Retail UI
 * Full interactivity: Carousel, Bottom Sheets, Booking, Free Trial, Referral
 * Integrated with befit_crm_state_v1 localStorage
 */

// ==================== DATA CONSTANTS ====================

const STORAGE_KEY = 'befit_crm_state_v1';

const CLASSES_DATA = [
  {
    name: 'Zumba',
    time: '18:10 – 19:00',
    difficulty: 'Easy',
    instructor: 'Lia',
    slotsLeft: 4,
    capacity: 15,
    description: 'Kelas kardio penuh energi dengan gerakan tarian Latin. Cocok untuk semua level, bakar kalori sambil bersenang-senang! Tidak perlu pengalaman menari.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=350&h=460&fit=crop&q=80'
  },
  {
    name: 'Bodypump',
    time: '19:20 – 20:10',
    difficulty: 'Hard',
    instructor: 'Hari',
    slotsLeft: 8,
    capacity: 20,
    description: 'Latihan beban berirama tinggi dengan barbell ringan dan repetisi tinggi. Membentuk otot seluruh tubuh dan meningkatkan daya tahan. Wajib pakai sepatu gym.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=350&h=460&fit=crop&q=80'
  },
  {
    name: 'HIIT Core',
    time: '17:00 – 17:45',
    difficulty: 'Hard',
    instructor: 'Coach Alex',
    slotsLeft: 2,
    capacity: 12,
    description: 'High-Intensity Interval Training yang fokus pada core dan otot perut. Kombinasi plank, mountain climber, russian twist, dan burpee dalam format tabata 45 menit.',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=350&h=460&fit=crop&q=80'
  },
  {
    name: 'Vinyasa Yoga',
    time: '16:30 – 17:30',
    difficulty: 'Easy',
    instructor: 'Maya',
    slotsLeft: 11,
    capacity: 15,
    description: 'Aliran gerakan yoga dinamis yang menghubungkan napas dan postur tubuh. Meningkatkan fleksibilitas, keseimbangan, dan ketenangan pikiran. Cocok untuk pemula.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=350&h=460&fit=crop&q=80'
  }
];

const TRAINERS_DATA = [
  {
    name: 'Aby',
    fullName: 'Muhammad Aby Pratama',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=290&h=390&fit=crop&q=80',
    clients: 59,
    experience: '6 Tahun',
    specialization: 'Fat Loss, Functional Training',
    certifications: 'ACE Certified Personal Trainer, NSCA-CPT',
    bio: 'Aby adalah pelatih berpengalaman yang fokus pada program fat loss dan peningkatan mobilitas fungsional. Pendekatan latihannya menyesuaikan kemampuan individu.',
    packages: [
      { sessions: 1, price: 199000 },
      { sessions: 4, price: 749000 },
      { sessions: 8, price: 1399000 },
      { sessions: 12, price: 1999000 }
    ]
  },
  {
    name: 'Egi Angga',
    fullName: 'Egi Angga Permana',
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=290&h=390&fit=crop&q=80',
    clients: 33,
    experience: '4 Tahun',
    specialization: 'Hypertrophy, Strength Training',
    certifications: 'ISSA Certified Fitness Trainer',
    bio: 'Egi ahli dalam program pembentukan massa otot (hypertrophy) dan kekuatan. Cocok untuk kamu yang ingin mendapatkan postur tubuh atletis dan kuat.',
    packages: [
      { sessions: 1, price: 199000 },
      { sessions: 4, price: 749000 },
      { sessions: 8, price: 1399000 },
      { sessions: 12, price: 1999000 }
    ]
  },
  {
    name: 'Sarah Wijaya',
    fullName: 'Sarah Ayu Wijaya',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=290&h=390&fit=crop&q=80',
    clients: 47,
    experience: '5 Tahun',
    specialization: 'Weight Management, Post-Injury Rehab',
    certifications: 'NASM-CPT, Prehab/Rehab Specialist',
    bio: 'Sarah berspesialisasi dalam program penurunan berat badan sehat dan pemulihan pasca cedera. Pendekatannya lembut namun efektif, sangat direkomendasikan untuk pemula dan wanita.',
    packages: [
      { sessions: 1, price: 199000 },
      { sessions: 4, price: 749000 },
      { sessions: 8, price: 1399000 },
      { sessions: 12, price: 1999000 }
    ]
  },
  {
    name: 'Bima Sakti',
    fullName: 'Bima Sakti Nugroho',
    photo: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=290&h=390&fit=crop&q=80',
    clients: 28,
    experience: '3 Tahun',
    specialization: 'Athletic Performance, HIIT',
    certifications: 'CrossFit Level 1 Trainer',
    bio: 'Bima memiliki latar belakang atlet dan berfokus pada program peningkatan performa atletis, kecepatan, dan daya tahan menggunakan metode CrossFit dan HIIT.',
    packages: [
      { sessions: 1, price: 199000 },
      { sessions: 4, price: 749000 },
      { sessions: 8, price: 1399000 },
      { sessions: 12, price: 1999000 }
    ]
  }
];

const PROMOS_DATA = [
  {
    title: 'Promo Spesial Member Baru',
    subtitle: 'Jadi Member Sekarang Bisa Lebih Hemat!',
    description: 'Dapatkan diskon hingga 15% untuk pendaftaran membership baru dan GRATIS 2x sesi Personal Trainer. Berlaku untuk semua paket membership Basic, Pro, VIP, dan PT Pack.',
    validUntil: '30 November 2026',
    voucherCode: 'NEWFIT15',
    terms: [
      'Berlaku untuk member baru yang mendaftar pada periode promo.',
      'Tidak dapat digabung dengan promo lainnya.',
      'Gratis 2 sesi PT berlaku untuk paket 1 bulan ke atas.',
      'Kuota terbatas, segera daftar!'
    ]
  },
  {
    title: 'Paket Couple & Student Discount',
    subtitle: 'Hemat hingga 25% untuk 2 Orang atau Pelajar/Mahasiswa',
    description: 'Ajak pasangan atau temanmu untuk mendaftar bersama dan nikmati potongan harga hingga 25%. Berlaku juga untuk pelajar dan mahasiswa aktif dengan menunjukkan kartu identitas.',
    validUntil: '31 Desember 2026',
    voucherCode: 'COUPLE25',
    terms: [
      'Paket Couple: Minimal 2 orang mendaftar bersamaan.',
      'Student: Tunjukkan KTM atau KTP usia maks. 24 tahun.',
      'Berlaku untuk paket 3 bulan ke atas.',
      'Tidak berlaku untuk paket PT Pack satuan.'
    ]
  },
  {
    title: 'Bundling Membership + 4 Sesi PT',
    subtitle: 'Mulai dari Rp 799K/bulan – Paket Paling Hemat!',
    description: 'Paket bundling eksklusif yang menggabungkan membership 1 bulan dengan 4 sesi Personal Trainer pilihan. Hemat hingga Rp 400.000 dibanding beli terpisah.',
    validUntil: '15 November 2026',
    voucherCode: 'BUNDLE799',
    terms: [
      'Berlaku untuk member baru dan rejoin.',
      'Pilih trainer berdasarkan ketersediaan jadwal.',
      'Sesi PT harus digunakan dalam 30 hari.',
      'Tidak dapat di-refund setelah aktivasi.'
    ]
  }
];

const BRANCHES_DATA = [
  { name: 'Be Fit Setiabudi Bandung', address: 'Jl. Dr. Setiabudi No. 130, Bandung', crowd: 'Low' },
  { name: 'Be Fit Dago', address: 'Jl. Ir. H. Djuanda No. 45, Bandung', crowd: 'Medium' },
  { name: 'Be Fit Pasteur', address: 'Jl. Dr. Djunjunan No. 77, Bandung', crowd: 'High' },
  { name: 'Be Fit Buah Batu', address: 'Jl. Buah Batu No. 212, Bandung', crowd: 'Low' }
];

const VOUCHERS_DATA = [
  { code: 'NEWFIT15', desc: 'Diskon 15% Member Baru', expires: '30 Nov 2026', type: 'Membership' },
  { code: 'COUPLE25', desc: 'Diskon 25% Paket Couple', expires: '31 Des 2026', type: 'Membership' },
  { code: 'PTFREE2', desc: 'Gratis 2 Sesi Personal Trainer', expires: '30 Nov 2026', type: 'PT Session' },
  { code: 'BUNDLE799', desc: 'Bundling Membership + 4 Sesi PT', expires: '15 Nov 2026', type: 'Bundling' }
];

// ==================== UTILITY HELPERS ====================

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function sanitize(str) {
  if (!str) return '';
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

function getState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

function saveToState(key, value) {
  try {
    let state = getState() || { members: [], leads: [], classes: [], checkInLogs: [] };
    state[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function addLeadToState(leadData) {
  let state = getState() || { members: [], leads: [], classes: [], checkInLogs: [] };
  if (!state.leads) state.leads = [];

  let highest = 1000;
  state.leads.forEach(l => {
    if (l.id && l.id.startsWith('LD-')) {
      const num = parseInt(l.id.replace('LD-', ''), 10);
      if (!isNaN(num) && num > highest) highest = num;
    }
  });

  const newLead = {
    id: 'LD-' + (highest + 1),
    name: leadData.name,
    phone: leadData.phone,
    stage: leadData.stage || 'new',
    source: leadData.source || 'Mobile App',
    packageInterest: leadData.packageInterest || 'Pro',
    notes: leadData.notes || ''
  };

  state.leads.unshift(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return newLead;
}

function isTrialClaimed() {
  return localStorage.getItem('befit_trial_claimed') === 'true';
}

function setTrialClaimed() {
  localStorage.setItem('befit_trial_claimed', 'true');
}

// ==================== TOAST NOTIFICATION ====================

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

// ==================== BOTTOM SHEET ====================

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

// ==================== CAROUSEL ====================

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
  carouselInterval = setInterval(nextSlide, 4000);
}

function stopCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
}

// Touch swipe for carousel
function initCarouselTouch() {
  const el = document.getElementById('hero-carousel');
  if (!el) return;

  let startX = 0;
  let diffX = 0;

  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopCarousel();
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    diffX = e.touches[0].clientX - startX;
  }, { passive: true });

  el.addEventListener('touchend', () => {
    if (Math.abs(diffX) > 50) {
      if (diffX < 0 && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (diffX > 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
    diffX = 0;
    startCarousel();
  }, { passive: true });
}

// ==================== BRANCH SELECTOR ====================

function openBranchSheet() {
  const items = BRANCHES_DATA.map((b, i) => {
    const crowdColor = b.crowd === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
                       b.crowd === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                       'bg-red-50 text-red-700 border-red-200';

    return `
      <button type="button" class="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors ${i === 0 ? 'border-teal-200 bg-teal-50/40' : ''}" onclick="selectBranch(${i})">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${i === 0 ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'} flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold text-slate-900">${sanitize(b.name)}</h4>
            <p class="text-[11px] text-slate-400">${sanitize(b.address)}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${crowdColor}">${b.crowd}</span>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Pilih Lokasi Cabang Gym</h3>
    <p class="text-xs text-slate-400 mb-4">Jadwal kelas & keramaian berdasarkan cabang</p>
    <div class="space-y-2.5">${items}</div>
  `);
}

function selectBranch(index) {
  closeBottomSheet();
  showToast('📍 Cabang diubah ke ' + BRANCHES_DATA[index].name);
}

// ==================== CROWD INFORMATION ====================

function openCrowdInfo() {
  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Tingkat Keramaian Gym</h3>
    <p class="text-xs text-slate-400 mb-4">Be Fit Setiabudi Bandung — Senin, 2 November 2026</p>

    <div class="space-y-2">
      <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
        <div>
          <span class="text-xs font-bold text-green-700">06:00 – 09:00</span>
          <span class="text-[10px] text-green-600 ml-1.5 font-medium">(Pagi Awal)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
        <div>
          <span class="text-xs font-bold text-amber-700">09:00 – 12:00</span>
          <span class="text-[10px] text-amber-600 ml-1.5 font-medium">(Pagi)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Medium</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
        <div>
          <span class="text-xs font-bold text-green-700">12:00 – 16:00</span>
          <span class="text-[10px] text-green-600 ml-1.5 font-medium">(Siang)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Low</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
        <div>
          <span class="text-xs font-bold text-red-700">16:00 – 20:00</span>
          <span class="text-[10px] text-red-600 ml-1.5 font-medium">(Sore – Malam)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">High ⚠️</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
        <div>
          <span class="text-xs font-bold text-amber-700">20:00 – 22:00</span>
          <span class="text-[10px] text-amber-600 ml-1.5 font-medium">(Malam)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Medium</span>
      </div>
    </div>

    <p class="text-[10px] text-slate-400 text-center mt-4">Data berdasarkan rata-rata kunjungan 30 hari terakhir</p>
  `);
}

// ==================== FREE TRIAL CLAIM ====================

function handleTrialClaim() {
  if (isTrialClaimed()) {
    showToast('✅ Kamu sudah mengklaim Free Trial sebelumnya.');
    return;
  }

  openBottomSheet(`
    <div class="text-center mb-4">
      <span class="text-4xl block mb-2">🎁</span>
      <h3 class="text-lg font-extrabold text-slate-900">Free Trial 7 Hari</h3>
      <p class="text-xs text-slate-500 mt-1">Nikmati akses gym & semua kelas gratis selama 7 hari!</p>
    </div>

    <form id="trial-form" class="space-y-3.5" onsubmit="submitTrialClaim(event)">
      <div>
        <label class="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
        <input type="text" id="trial-name" required placeholder="Contoh: Andi Wijaya"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-300" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-600 mb-1">Nomor WhatsApp</label>
        <input type="tel" id="trial-phone" required placeholder="Contoh: 0812-3456-7890"
          class="w-full border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-300" />
      </div>
      <button type="submit" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all">
        Klaim Free Trial Sekarang 🎉
      </button>
      <p class="text-[10px] text-slate-400 text-center">Dengan mengklaim, kamu menyetujui syarat & ketentuan Be Fit.</p>
    </form>
  `);
}

function submitTrialClaim(e) {
  e.preventDefault();
  const name = document.getElementById('trial-name')?.value?.trim();
  const phone = document.getElementById('trial-phone')?.value?.trim();

  if (!name || !phone) return;

  addLeadToState({
    name: name,
    phone: phone,
    stage: 'trial',
    source: 'Mobile App',
    packageInterest: 'Basic',
    notes: 'Free Trial 7 Hari — Klaim melalui Beranda Mobile App.'
  });

  setTrialClaimed();
  closeBottomSheet();
  updateTrialButton();
  showToast('🎉 Free Trial berhasil diklaim! Selamat datang di Be Fit!');
}

function updateTrialButton() {
  const btn = document.getElementById('btn-claim-trial');
  if (btn && isTrialClaimed()) {
    btn.textContent = 'Terklaim ✓';
    btn.classList.remove('bg-teal-550', 'hover:bg-teal-650');
    btn.classList.add('bg-slate-200', 'text-slate-500', 'cursor-default');
    btn.disabled = true;
  }
}

// ==================== CLASS DETAIL & BOOKING ====================

function openClassDetail(index) {
  const cls = CLASSES_DATA[index];
  if (!cls) return;

  const diffBadge = cls.difficulty === 'Easy'
    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Easy</span>'
    : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Hard</span>';

  const slotColor = cls.slotsLeft <= 3 ? 'text-red-500' : 'text-green-600';

  openBottomSheet(`
    <div class="relative rounded-xl overflow-hidden mb-4" style="height:160px;">
      <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-3 left-3">
        <h3 class="text-white text-lg font-extrabold">${sanitize(cls.name)}</h3>
        <p class="text-white/80 text-xs font-medium">With ${sanitize(cls.instructor)}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-3 flex-wrap">
      ${diffBadge}
      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">🕒 ${cls.time}</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${cls.slotsLeft <= 3 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'} border">Tersisa ${cls.slotsLeft} dari ${cls.capacity} slot</span>
    </div>

    <p class="text-sm text-slate-600 leading-relaxed mb-4">${sanitize(cls.description)}</p>

    <div class="sheet-divider"></div>

    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-bold text-slate-500">Sisa Kuota</span>
      <span class="text-sm font-extrabold ${slotColor}">${cls.slotsLeft} / ${cls.capacity}</span>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
      <div class="h-full rounded-full transition-all ${cls.slotsLeft <= 3 ? 'bg-red-400' : 'bg-teal-500'}" style="width:${Math.round(((cls.capacity - cls.slotsLeft) / cls.capacity) * 100)}%"></div>
    </div>

    <button type="button" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all" onclick="bookClass(${index})">
      Daftar Kelas ${sanitize(cls.name)} Sekarang
    </button>
  `);
}

function bookClass(index) {
  const cls = CLASSES_DATA[index];
  if (!cls) return;

  if (cls.slotsLeft <= 0) {
    showToast('⚠️ Maaf, kelas ini sudah penuh.');
    return;
  }

  cls.slotsLeft--;

  addLeadToState({
    name: 'App User',
    phone: '-',
    stage: 'trial',
    source: 'Mobile App',
    packageInterest: 'Pro',
    notes: `Booking Kelas ${cls.name} (${cls.time}) via Mobile App Beranda.`
  });

  closeBottomSheet();
  showToast(`✅ Berhasil mendaftar kelas ${cls.name}!`);
}

function openAllClassesSheet() {
  const cards = CLASSES_DATA.map((cls, i) => {
    const diffColor = cls.difficulty === 'Easy' ? 'text-green-600' : 'text-red-500';
    return `
      <button type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left" onclick="closeBottomSheet(); setTimeout(() => openClassDetail(${i}), 350);">
        <img src="${cls.image}" alt="${sanitize(cls.name)}" class="w-14 h-14 rounded-lg object-cover shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-slate-900">${sanitize(cls.name)}</h4>
            <span class="text-[10px] font-bold ${diffColor}">${cls.difficulty}</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">🕒 ${cls.time} • With ${sanitize(cls.instructor)}</p>
          <p class="text-[11px] font-bold ${cls.slotsLeft <= 3 ? 'text-red-500' : 'text-green-600'} mt-0.5">Tersisa ${cls.slotsLeft} slot</p>
        </div>
        <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
  }).join('');

  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Semua Kelas Hari Ini</h3>
    <p class="text-xs text-slate-400 mb-4">Be Fit Setiabudi Bandung</p>
    <div class="space-y-2">${cards}</div>
  `);
}

// ==================== TRAINER DETAIL & BOOKING ====================

function openTrainerDetail(index) {
  const t = TRAINERS_DATA[index];
  if (!t) return;

  const packageRows = t.packages.map((pkg, pi) => `
    <button type="button" class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 active:bg-teal-50 transition-all text-left" onclick="bookTrainer(${index}, ${pi})">
      <div>
        <span class="text-sm font-bold text-slate-900">${pkg.sessions} Sesi</span>
        ${pkg.sessions >= 8 ? '<span class="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-sunny text-slate-900">BEST VALUE</span>' : ''}
      </div>
      <div class="text-right">
        <span class="text-sm font-extrabold text-teal-600">${formatRupiah(pkg.price)}</span>
        <span class="text-[10px] text-slate-400 block">${formatRupiah(Math.round(pkg.price / pkg.sessions))}/sesi</span>
      </div>
    </button>
  `).join('');

  openBottomSheet(`
    <div class="flex items-start gap-4 mb-4">
      <img src="${t.photo}" alt="${sanitize(t.fullName)}" class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shrink-0">
      <div class="flex-1">
        <h3 class="text-base font-extrabold text-slate-900">${sanitize(t.fullName)}</h3>
        <p class="text-xs text-teal-600 font-bold mt-0.5">${sanitize(t.specialization)}</p>
        <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
          <span class="font-bold">📋 ${t.experience}</span>
          <span class="font-bold">👤 ${t.clients} klien</span>
        </div>
      </div>
    </div>

    <p class="text-sm text-slate-600 leading-relaxed mb-3">${sanitize(t.bio)}</p>

    <div class="flex items-center gap-2 flex-wrap mb-4">
      <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">🏆 ${sanitize(t.certifications)}</span>
    </div>

    <div class="sheet-divider"></div>

    <h4 class="text-sm font-extrabold text-slate-900 mb-3">Pilih Paket Sesi PT</h4>
    <div class="space-y-2">${packageRows}</div>
  `);
}

function bookTrainer(trainerIndex, packageIndex) {
  const t = TRAINERS_DATA[trainerIndex];
  const pkg = t.packages[packageIndex];

  addLeadToState({
    name: 'App User',
    phone: '-',
    stage: 'new',
    source: 'Mobile App',
    packageInterest: 'PT Pack',
    notes: `Booking PT: ${t.fullName} — ${pkg.sessions} Sesi (${formatRupiah(pkg.price)}) via Mobile App.`
  });

  closeBottomSheet();
  showToast(`✅ Booking ${pkg.sessions} sesi PT dengan ${t.name} berhasil!`);
}

function openAllTrainersSheet() {
  const cards = TRAINERS_DATA.map((t, i) => `
    <button type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left" onclick="closeBottomSheet(); setTimeout(() => openTrainerDetail(${i}), 350);">
      <img src="${t.photo}" alt="${sanitize(t.name)}" class="w-14 h-14 rounded-xl object-cover shrink-0">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold text-slate-900">${sanitize(t.fullName)}</h4>
        <p class="text-[11px] text-teal-600 font-bold mt-0.5">${sanitize(t.specialization)}</p>
        <p class="text-[10px] text-slate-400 mt-0.5">📋 ${t.experience} • 👤 ${t.clients} klien aktif</p>
      </div>
      <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  `).join('');

  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Semua Personal Trainer</h3>
    <p class="text-xs text-slate-400 mb-4">Pilih trainer terbaik untuk goal fitness kamu</p>
    <div class="space-y-2">${cards}</div>
  `);
}

// ==================== REFERRAL ====================

function openReferralSheet() {
  const code = 'BEFIT-REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  openBottomSheet(`
    <div class="text-center mb-5">
      <span class="text-5xl block mb-2">🎁</span>
      <h3 class="text-lg font-extrabold text-slate-900">Ajak Teman, Dapat Reward!</h3>
      <p class="text-xs text-slate-500 mt-1">Bagikan kode referral unikmu. Setiap teman yang mendaftar, kamu mendapatkan perpanjangan membership gratis hingga 12 bulan!</p>
    </div>

    <div class="p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl text-center mb-4">
      <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Kode Referral Kamu</span>
      <span id="referral-code" class="text-xl font-extrabold text-blue-700 tracking-wider">${code}</span>
    </div>

    <button type="button" class="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all mb-2" onclick="copyReferral('${code}')">
      📋 Salin Kode Referral
    </button>

    <button type="button" class="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold shadow-md hover:bg-green-700 active:scale-[0.98] transition-all" onclick="shareReferral('${code}')">
      📤 Bagikan via WhatsApp
    </button>

    <p class="text-[10px] text-slate-400 text-center mt-3">Syarat & ketentuan berlaku. Reward diberikan setelah teman menyelesaikan pendaftaran membership.</p>
  `);
}

function copyReferral(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code);
  }
  showToast('📋 Kode referral berhasil disalin: ' + code);
}

function shareReferral(code) {
  const msg = encodeURIComponent(`Hai! Yuk gabung di Be Fit Gym! Pakai kode referral ku *${code}* untuk dapat diskon spesial. Daftar di sini 👉 https://befit.id/ref/${code}`);
  window.open('https://wa.me/?text=' + msg, '_blank');
}

// ==================== PROMO DETAIL ====================

function openPromoDetail(index) {
  const p = PROMOS_DATA[index];
  if (!p) return;

  const termsList = p.terms.map(t => `<li class="text-slate-500">${sanitize(t)}</li>`).join('');

  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">${sanitize(p.title)}</h3>
    <p class="text-xs text-teal-600 font-bold mb-3">${sanitize(p.subtitle)}</p>

    <p class="text-sm text-slate-600 leading-relaxed mb-4">${sanitize(p.description)}</p>

    <div class="p-3.5 bg-brand-sunny/10 border border-brand-sunny/40 rounded-xl text-center mb-4">
      <span class="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Kode Voucher</span>
      <span class="text-lg font-extrabold text-amber-800 tracking-wider">${p.voucherCode}</span>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Berlaku hingga: ${p.validUntil}</span>
    </div>

    <div class="sheet-divider"></div>

    <h4 class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Syarat & Ketentuan</h4>
    <ol class="text-xs space-y-1.5 list-decimal list-inside mb-5">${termsList}</ol>

    <button type="button" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all" onclick="copyPromoCode('${p.voucherCode}')">
      Salin Kode Voucher 📋
    </button>
  `);
}

function copyPromoCode(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code);
  }
  showToast('📋 Kode voucher disalin: ' + code);
}

// ==================== VOUCHER LIST ====================

function openVoucherList() {
  const items = VOUCHERS_DATA.map(v => `
    <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand-sunny/20 flex items-center justify-center text-lg shrink-0">🏷️</div>
        <div>
          <h4 class="text-sm font-bold text-slate-900">${sanitize(v.desc)}</h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[10px] font-bold text-teal-600 font-mono">${v.code}</span>
            <span class="text-[10px] text-slate-400">• ${v.expires}</span>
          </div>
        </div>
      </div>
      <button type="button" class="px-2.5 py-1.5 rounded-lg bg-teal-550 text-white text-[10px] font-bold shrink-0 hover:bg-teal-650 active:scale-95 transition-all" onclick="copyPromoCode('${v.code}')">Salin</button>
    </div>
  `).join('');

  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Voucher Aktif Kamu 🏷️</h3>
    <p class="text-xs text-slate-400 mb-4">Gunakan kode voucher saat checkout untuk mendapatkan diskon</p>
    <div class="space-y-2.5">${items}</div>
  `);
}

// ==================== PRICING SHEET ====================

function openPricingSheet() {
  openBottomSheet(`
    <h3 class="text-base font-extrabold text-slate-900 mb-1">Paket Membership Be Fit</h3>
    <p class="text-xs text-slate-400 mb-4">Pilih paket terbaik sesuai kebutuhanmu</p>

    <div class="space-y-3">
      <div class="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900">Basic</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">Akses gym area & locker</p>
          </div>
          <span class="text-base font-extrabold text-teal-600">Rp 350K<span class="text-[10px] text-slate-400 font-medium">/bln</span></span>
        </div>
      </div>

      <div class="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/40 relative">
        <span class="absolute -top-2.5 right-3 px-2 py-0.5 rounded text-[9px] font-bold bg-teal-550 text-white uppercase tracking-wider">Populer</span>
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900">Pro</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">Gym + Semua Kelas Grup</p>
          </div>
          <span class="text-base font-extrabold text-teal-600">Rp 550K<span class="text-[10px] text-slate-400 font-medium">/bln</span></span>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-brand-sunny bg-amber-50/40 relative">
        <span class="absolute -top-2.5 right-3 px-2 py-0.5 rounded text-[9px] font-bold bg-brand-sunny text-slate-900 uppercase tracking-wider">Best Value</span>
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900">VIP</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">All Access + Sauna + Towel</p>
          </div>
          <span class="text-base font-extrabold text-teal-600">Rp 850K<span class="text-[10px] text-slate-400 font-medium">/bln</span></span>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900">PT Pack</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">All Access + Personal Trainer</p>
          </div>
          <span class="text-base font-extrabold text-teal-600">Rp 1.5JT<span class="text-[10px] text-slate-400 font-medium">/bln</span></span>
        </div>
      </div>
    </div>

    <button type="button" class="w-full py-3 mt-5 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all" onclick="closeBottomSheet(); showToast('📞 Tim sales Be Fit akan menghubungi kamu segera!');">
      Hubungi Sales Kami ☎️
    </button>
  `);
}

// ==================== PROFILE SHEET ====================

function openProfileSheet() {
  openBottomSheet(`
    <div class="text-center mb-5">
      <div class="w-20 h-20 rounded-full bg-teal-100 border-2 border-teal-200 flex items-center justify-center mx-auto mb-3">
        <svg class="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      </div>
      <h3 class="text-lg font-extrabold text-slate-900">Selamat Datang!</h3>
      <p class="text-xs text-slate-500 mt-1">Masuk atau daftar untuk pengalaman yang lebih personal.</p>
    </div>

    <button type="button" class="w-full py-3 rounded-xl bg-teal-550 text-white text-sm font-bold shadow-md hover:bg-teal-650 active:scale-[0.98] transition-all mb-2.5">
      Masuk ke Akun
    </button>
    <button type="button" class="w-full py-3 rounded-xl bg-white text-teal-600 text-sm font-bold border-2 border-teal-500 hover:bg-teal-50 active:scale-[0.98] transition-all" onclick="closeBottomSheet(); handleTrialClaim();">
      Daftar Baru — Free Trial 7 Hari
    </button>
  `);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Start hero carousel
  goToSlide(0);
  startCarousel();
  initCarouselTouch();

  // Dot click handlers
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      stopCarousel();
      startCarousel();
    });
  });

  // Update Free Trial button if already claimed
  updateTrialButton();

  // Keyboard: Escape closes bottom sheet
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheetOpen) closeBottomSheet();
  });
});
