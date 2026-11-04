const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: 'WIDE169', width: 13.333, height: 7.5 });
  pres.layout = 'WIDE169';

  const SHAPES = {
    rect: pres.shapes.RECTANGLE,
    roundRect: pres.shapes.ROUNDED_RECTANGLE,
    oval: pres.shapes.OVAL
  };

  const assetsDir = path.join(__dirname, 'ppt_assets');

  // Palette Constants
  const C = {
    bg: 'F8FAFC',
    navy: '0F172A',
    teal: '0D9488',
    tealDark: '0F766E',
    tealLight: 'CCFBF1',
    tealSoft: 'F0FDFA',
    slate: '334155',
    slateLight: '64748B',
    slateMuted: '94A3B8',
    cardBg: 'FFFFFF',
    border: 'E2E8F0',
    amber: 'D97706',
    amberLight: 'FEF3C7',
    red: 'DC2626',
    redLight: 'FEE2E2',
    emerald: '059669',
    emeraldLight: 'D1FAE5'
  };

  const FONT_TITLE = 'Arial';
  const FONT_BODY = 'Calibri';

  // Helper: Top Header for Slides 2-8
  function addHeader(slide, category, title, subtitle) {
    // Top subtle brand accent bar
    slide.addShape(SHAPES.rect, {
      x: 0.8, y: 0.45, w: 1.5, h: 0.05,
      fill: { color: C.teal },
      line: { color: C.teal, width: 0 }
    });

    // Category Pill Badge
    slide.addShape(SHAPES.roundRect, {
      x: 0.8, y: 0.65, w: 3.2, h: 0.32,
      rectRadius: 0.15,
      fill: { color: C.tealLight },
      line: { color: '99F6E4', width: 1 }
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.65, w: 3.2, h: 0.32,
      fontSize: 8.5,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      align: 'center',
      valign: 'middle'
    });

    // Main Slide Title
    slide.addText(title, {
      x: 0.8, y: 1.05, w: 11.5, h: 0.45,
      fontSize: 21,
      bold: true,
      color: C.navy,
      fontFace: FONT_TITLE,
      margin: 0
    });

    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8, y: 1.52, w: 11.5, h: 0.3,
        fontSize: 11,
        color: C.slateLight,
        fontFace: FONT_BODY,
        margin: 0
      });
    }

    // Slide bottom subtle footer
    slide.addText('BE FIT — Gym CRM & Member Retention Platform', {
      x: 0.8, y: 7.05, w: 6.0, h: 0.3,
      fontSize: 8.5,
      color: C.slateMuted,
      fontFace: FONT_BODY,
      margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: COVER / JUDUL PROYEK
  // ==========================================
  console.log('Building Slide 1: Cover...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };

    // Decorative top-left accent bar
    s.addShape(SHAPES.rect, {
      x: 0.8, y: 0.8, w: 2.2, h: 0.08,
      fill: { color: C.teal },
      line: { color: C.teal, width: 0 }
    });

    // Category Badge
    s.addShape(SHAPES.roundRect, {
      x: 0.8, y: 1.05, w: 4.0, h: 0.36,
      rectRadius: 0.18,
      fill: { color: C.tealLight },
      line: { color: '99F6E4', width: 1 }
    });
    s.addText('PORTAL MEMBER & CRM RETENTION ENGINE', {
      x: 0.8, y: 1.05, w: 4.0, h: 0.36,
      fontSize: 9,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      align: 'center',
      valign: 'middle'
    });

    // Main Title
    s.addText('BE FIT — GYM CRM &\nMEMBER PORTAL', {
      x: 0.8, y: 1.6, w: 6.0, h: 1.5,
      fontSize: 32,
      bold: true,
      color: C.navy,
      fontFace: FONT_TITLE,
      lineSpacingMultiple: 1.1,
      margin: 0
    });

    // Subtitle
    s.addText('Sistem Manajemen Pelanggan, Analitik Pendapatan Cabang,\ndan Otomatisasi Retensi Member Berbasis Cloud', {
      x: 0.8, y: 3.3, w: 5.6, h: 0.8,
      fontSize: 12.5,
      color: C.slate,
      fontFace: FONT_BODY,
      lineSpacingMultiple: 1.25,
      margin: 0
    });

    // Presenter Info Card (Clean White Card)
    s.addShape(SHAPES.roundRect, {
      x: 0.8, y: 4.35, w: 5.3, h: 2.2,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    // Card Header Bar
    s.addShape(SHAPES.rect, {
      x: 0.8, y: 4.35, w: 5.3, h: 0.38,
      fill: { color: C.tealSoft },
      line: { color: C.border, width: 1 }
    });
    s.addText('IDENTITAS PENYUSUN PROYEK', {
      x: 1.0, y: 4.35, w: 5.0, h: 0.38,
      fontSize: 9,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      valign: 'middle'
    });

    // Identity details
    const identText = [
      { text: 'Nama Lengkap : ', options: { bold: true, color: C.navy, fontSize: 11 } },
      { text: 'Rizky Muhammad Riady\n', options: { color: C.slate, fontSize: 11 } },
      { text: 'NPM                  : ', options: { bold: true, color: C.navy, fontSize: 11 } },
      { text: '24025123020\n', options: { color: C.slate, fontSize: 11 } },
      { text: 'Institusi             : ', options: { bold: true, color: C.navy, fontSize: 11 } },
      { text: 'Universitas Garut (Uniga)\n', options: { color: C.slate, fontSize: 11 } },
      { text: 'Status Proyek   : ', options: { bold: true, color: C.navy, fontSize: 11 } },
      { text: 'Live & Terintegrasi (GitHub / Vercel)', options: { color: C.tealDark, bold: true, fontSize: 11 } }
    ];
    s.addText(identText, {
      x: 1.0, y: 4.85, w: 4.9, h: 1.5,
      fontFace: FONT_BODY,
      lineSpacingMultiple: 1.25,
      margin: 0
    });

    // Visual Right Side: Desktop + Mobile Overlapping Showcase
    // 1. Desktop Admin Frame
    s.addShape(SHAPES.roundRect, {
      x: 6.4, y: 1.1, w: 6.2, h: 3.9,
      rectRadius: 0.12,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });
    // Mini macOS style title bar
    s.addShape(SHAPES.rect, {
      x: 6.4, y: 1.1, w: 6.2, h: 0.28,
      fill: { color: 'F1F5F9' },
      line: { color: C.border, width: 1 }
    });
    s.addShape(SHAPES.oval, { x: 6.55, y: 1.19, w: 0.1, h: 0.1, fill: { color: 'EF4444' }, line: { color: 'EF4444', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.72, y: 1.19, w: 0.1, h: 0.1, fill: { color: 'F59E0B' }, line: { color: 'F59E0B', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.89, y: 1.19, w: 0.1, h: 0.1, fill: { color: '10B981' }, line: { color: '10B981', width: 0 } });
    s.addText('Admin CRM Dashboard • Tab 1 Overview', {
      x: 7.1, y: 1.1, w: 4.0, h: 0.28,
      fontSize: 8,
      color: C.slateLight,
      fontFace: FONT_BODY,
      valign: 'middle'
    });
    s.addImage({
      path: path.join(assetsDir, 'ss_admin_overview.png'),
      x: 6.42, y: 1.39, w: 6.16, h: 3.58
    });

    // 2. Mobile App Mock Frame (Overlapping at bottom right)
    s.addShape(SHAPES.roundRect, {
      x: 10.3, y: 2.8, w: 2.3, h: 4.2,
      rectRadius: 0.2,
      fill: { color: C.navy },
      line: { color: '1E293B', width: 2 }
    });
    s.addImage({
      path: path.join(assetsDir, 'ss_user_home.png'),
      x: 10.36, y: 2.9, w: 2.18, h: 4.02
    });
  }

  // ==========================================
  // SLIDE 2: MASALAH BISNIS & PERAN SISTEM CRM
  // ==========================================
  console.log('Building Slide 2: Masalah Bisnis...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Tantangan Bisnis & Solusi', 'Mengapa Gym Membutuhkan Sistem CRM?', 'Mengatasi masalah churn pelanggan dan fragmentasi data operasional gym secara otomatis.');

    // Left Column: 3 Cards
    const cards = [
      {
        icon: '⚠️',
        tag: 'MASALAH UTAMA',
        tagBg: C.redLight,
        tagColor: C.red,
        title: 'Risiko Churn Tinggi & Member Pasif',
        desc: 'Member sering berhenti berlangganan tanpa disadari karena tidak ada sistem pengingat saat masa aktif hampir habis (1–10 hari).'
      },
      {
        icon: '📊',
        tag: 'FRAGMENTASI DATA',
        tagBg: C.amberLight,
        tagColor: C.amber,
        title: 'Pencatatan Data Terpisah & Manual',
        desc: 'Paket langganan, kuota sesi Personal Trainer, dan komparasi omzet antar cabang sulit dipantau secara terintegrasi dan real-time.'
      },
      {
        icon: '🚀',
        tag: 'SOLUSI BE FIT CRM',
        tagBg: C.tealLight,
        tagColor: C.tealDark,
        title: 'Ekosistem Retensi Terpadu & Proaktif',
        desc: 'Menghubungkan self-service portal member dengan pusat retensi admin melalui deteksi dini dan suntik voucher otomatis.'
      }
    ];

    cards.forEach((c, idx) => {
      const cy = 2.0 + idx * 1.6;
      // White Card
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: cy, w: 5.4, h: 1.45,
        rectRadius: 0.12,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Tag Pill
      s.addShape(SHAPES.roundRect, {
        x: 1.0, y: cy + 0.15, w: 2.0, h: 0.25,
        rectRadius: 0.1,
        fill: { color: c.tagBg },
        line: { color: c.tagBg, width: 0 }
      });
      s.addText(c.tag, {
        x: 1.0, y: cy + 0.15, w: 2.0, h: 0.25,
        fontSize: 7.5,
        bold: true,
        color: c.tagColor,
        fontFace: FONT_TITLE,
        align: 'center',
        valign: 'middle'
      });

      // Card Title
      s.addText(`${c.icon}  ${c.title}`, {
        x: 1.0, y: cy + 0.45, w: 5.0, h: 0.32,
        fontSize: 12,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        valign: 'middle',
        margin: 0
      });

      // Card Description (Max 12-15 words)
      s.addText(c.desc, {
        x: 1.0, y: cy + 0.8, w: 5.0, h: 0.55,
        fontSize: 10,
        color: C.slate,
        fontFace: FONT_BODY,
        lineSpacingMultiple: 1.2,
        margin: 0
      });
    });

    // Right Column: Mobile Screenshot with Highlight Box
    s.addShape(SHAPES.roundRect, {
      x: 6.7, y: 1.85, w: 5.8, h: 4.95,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    // Caption header
    s.addText('TAMPILAN BERANDA MEMBER DENGAN RETENTION BANNER', {
      x: 7.0, y: 1.95, w: 5.2, h: 0.3,
      fontSize: 9,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE
    });

    // Phone Frame Container
    s.addImage({
      path: path.join(assetsDir, 'ss_user_home.png'),
      x: 8.3, y: 2.35, w: 2.2, h: 4.35
    });

    // Side callout notes
    const callout = [
      { title: 'Cabang Dipilih', desc: 'Terhubung ke gym Setiabudi', color: C.teal },
      { title: 'Banner Alert Retensi', desc: 'Masa aktif sisa 6 hari terdeteksi', color: C.amber },
      { title: 'Akses Cepat Barbel', desc: 'Navigasi langsung ke menu Trainer', color: C.navy }
    ];
    callout.forEach((co, idx) => {
      const coy = 2.8 + idx * 1.1;
      s.addShape(SHAPES.roundRect, {
        x: 10.7, y: coy, w: 1.6, h: 0.85,
        rectRadius: 0.1,
        fill: { color: C.bg },
        line: { color: C.border, width: 1 }
      });
      s.addText(co.title, {
        x: 10.78, y: coy + 0.1, w: 1.45, h: 0.25,
        fontSize: 8.5,
        bold: true,
        color: co.color,
        fontFace: FONT_TITLE,
        margin: 0
      });
      s.addText(co.desc, {
        x: 10.78, y: coy + 0.35, w: 1.45, h: 0.45,
        fontSize: 8,
        color: C.slateLight,
        fontFace: FONT_BODY,
        margin: 0
      });
    });
  }

  // ==========================================
  // SLIDE 3: PORTAL MEMBER & KATALOG LAYANAN
  // ==========================================
  console.log('Building Slide 3: Portal Member...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Frontend Portal Pelanggan', 'Portal Member: Pengalaman Mandiri Tanpa Hambatan', 'Kemudahan akses jadwal kelas, profil trainer berlisensi, dan checkout instan tanpa jeda loading.');

    // Left Column Cards
    const memberFeatures = [
      {
        num: '01',
        title: 'Multi-Branch Dynamic Sync',
        desc: 'Jadwal kelas gym dan ketersediaan kuota presensi berubah seketika sesuai cabang pilihan member.'
      },
      {
        num: '02',
        title: 'Direktori Trainer Full-Screen',
        desc: 'Filter lengkap (Pria, Wanita, Athletic, Shape) serta tab spesialisasi & sertifikasi instruktur.'
      },
      {
        num: '03',
        title: 'Zero-Lag Instant Checkout (0ms)',
        desc: 'Pembayaran paket membership & Personal Trainer instan tanpa simulasi loading artifisial.'
      }
    ];

    memberFeatures.forEach((f, idx) => {
      const fy = 2.0 + idx * 1.6;
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: fy, w: 5.2, h: 1.45,
        rectRadius: 0.12,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Number Badge
      s.addShape(SHAPES.oval, {
        x: 1.0, y: fy + 0.2, w: 0.38, h: 0.38,
        fill: { color: C.tealLight },
        line: { color: '99F6E4', width: 1 }
      });
      s.addText(f.num, {
        x: 1.0, y: fy + 0.2, w: 0.38, h: 0.38,
        fontSize: 9,
        bold: true,
        color: C.tealDark,
        fontFace: FONT_TITLE,
        align: 'center',
        valign: 'middle'
      });

      // Title
      s.addText(f.title, {
        x: 1.5, y: fy + 0.2, w: 4.3, h: 0.35,
        fontSize: 12,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        valign: 'middle',
        margin: 0
      });

      // Desc
      s.addText(f.desc, {
        x: 1.5, y: fy + 0.62, w: 4.3, h: 0.65,
        fontSize: 10,
        color: C.slate,
        fontFace: FONT_BODY,
        lineSpacingMultiple: 1.2,
        margin: 0
      });
    });

    // Right Column: Dual Mobile Showcase (ss_user_home & ss_trainer_class)
    s.addShape(SHAPES.roundRect, {
      x: 6.5, y: 1.85, w: 6.0, h: 4.95,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    // Screen 1: Home View
    s.addText('1. BERANDA MEMBER', {
      x: 6.7, y: 1.95, w: 2.6, h: 0.3,
      fontSize: 8.5,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      align: 'center'
    });
    s.addImage({
      path: path.join(assetsDir, 'ss_user_home.png'),
      x: 6.85, y: 2.35, w: 2.3, h: 4.35
    });

    // Screen 2: Trainer Screen View
    s.addText('2. DIREKTORI TRAINER', {
      x: 9.6, y: 1.95, w: 2.6, h: 0.3,
      fontSize: 8.5,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      align: 'center'
    });
    s.addImage({
      path: path.join(assetsDir, 'ss_trainer_class.png'),
      x: 9.75, y: 2.35, w: 2.3, h: 4.35
    });
  }

  // ==========================================
  // SLIDE 4: DASHBOARD ADMIN CRM & ANALITIK
  // ==========================================
  console.log('Building Slide 4: Dashboard Admin...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Control Center & Business Intelligence', 'Dashboard Admin CRM: Pusat Kendali Bisnis', 'Visibilitas menyeluruh terhadap performa omzet cabang, transaksi paket, dan retensi pelanggan.');

    // Left Column (3 Cards)
    const adminCards = [
      {
        tag: 'SECURITY & UI',
        title: 'Akses Terproteksi & Clean UI',
        desc: 'Panel admin terpisah dengan Clean White UI dan autentikasi khusus pengelola gym.'
      },
      {
        tag: 'OMZET KONSOLIDASI',
        title: 'Grafik Pendapatan per Cabang',
        desc: 'Visualisasi komparasi omzet bulanan gabungan dari paket membership dan sesi PT.'
      },
      {
        tag: 'REAL-TIME DATA',
        title: 'Monitoring Metrik & Feed Transaksi',
        desc: 'Pelacakan instan member aktif, transaksi trainer, dan member yang butuh tindak lanjut.'
      }
    ];

    adminCards.forEach((c, idx) => {
      const cy = 2.0 + idx * 1.6;
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: cy, w: 4.8, h: 1.45,
        rectRadius: 0.12,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Tag
      s.addText(c.tag, {
        x: 1.0, y: cy + 0.15, w: 3.5, h: 0.25,
        fontSize: 8,
        bold: true,
        color: C.teal,
        fontFace: FONT_TITLE
      });

      // Title
      s.addText(c.title, {
        x: 1.0, y: cy + 0.42, w: 4.4, h: 0.35,
        fontSize: 12,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        margin: 0
      });

      // Desc
      s.addText(c.desc, {
        x: 1.0, y: cy + 0.8, w: 4.4, h: 0.55,
        fontSize: 10,
        color: C.slate,
        fontFace: FONT_BODY,
        lineSpacingMultiple: 1.2,
        margin: 0
      });
    });

    // Right Column: Full Desktop Overview Screenshot
    s.addShape(SHAPES.roundRect, {
      x: 5.9, y: 1.85, w: 6.6, h: 4.95,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    // Browser Mock Header
    s.addShape(SHAPES.rect, {
      x: 5.9, y: 1.85, w: 6.6, h: 0.35,
      fill: { color: 'F1F5F9' },
      line: { color: C.border, width: 1 }
    });
    s.addShape(SHAPES.oval, { x: 6.05, y: 1.97, w: 0.11, h: 0.11, fill: { color: 'EF4444' }, line: { color: 'EF4444', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.22, y: 1.97, w: 0.11, h: 0.11, fill: { color: 'F59E0B' }, line: { color: 'F59E0B', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.39, y: 1.97, w: 0.11, h: 0.11, fill: { color: '10B981' }, line: { color: '10B981', width: 0 } });
    s.addText('Be Fit CRM Admin — Tab 1: Ringkasan Bisnis & Retention Center', {
      x: 6.6, y: 1.85, w: 5.5, h: 0.35,
      fontSize: 8.5,
      bold: true,
      color: C.slateLight,
      fontFace: FONT_BODY,
      valign: 'middle'
    });

    // High-Res Image
    s.addImage({
      path: path.join(assetsDir, 'ss_admin_overview.png'),
      x: 5.92, y: 2.22, w: 6.56, h: 4.54
    });
  }

  // ==========================================
  // SLIDE 5: CARA KERJA CRM — DETEKSI DINI & VOUCHER
  // ==========================================
  console.log('Building Slide 5: Deteksi Dini & Voucher...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Automated Retention Engine', 'Strategi Retensi CRM: Auto-Injected Voucher', 'Mekanisme cerdas pencegah churn dengan insentif diskon perpanjangan 25% terotomasi.');

    // Left Column: 3 Cards
    const retentionSteps = [
      {
        badge: 'EARLY WARNING',
        title: 'Deteksi Sisa Aktif 1–10 Hari',
        desc: 'Sistem CRM otomatis menyaring member aktif yang masa berlakunya tersisa 1 hingga 10 hari.'
      },
      {
        badge: 'AUTO-INJECT 25%',
        title: 'Suntik Voucher RENEWLOYAL25',
        desc: 'Kode promo resmi diskon 25% langsung terpasang di akun member tanpa perlu klaim manual.'
      },
      {
        badge: 'ANTI-LEAK LOGIC',
        title: 'Proteksi Ketat Anti-Bocor',
        desc: 'Akun baru dan member dengan masa aktif >10 hari otomatis diblokir dari voucher perpanjangan.'
      }
    ];

    retentionSteps.forEach((st, idx) => {
      const sy = 2.0 + idx * 1.6;
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: sy, w: 5.4, h: 1.45,
        rectRadius: 0.12,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Badge
      s.addShape(SHAPES.roundRect, {
        x: 1.0, y: sy + 0.15, w: 2.0, h: 0.25,
        rectRadius: 0.1,
        fill: { color: idx === 1 ? C.emeraldLight : C.tealLight },
        line: { color: idx === 1 ? 'A7F3D0' : '99F6E4', width: 1 }
      });
      s.addText(st.badge, {
        x: 1.0, y: sy + 0.15, w: 2.0, h: 0.25,
        fontSize: 7.5,
        bold: true,
        color: idx === 1 ? C.emerald : C.tealDark,
        fontFace: FONT_TITLE,
        align: 'center',
        valign: 'middle'
      });

      // Title
      s.addText(st.title, {
        x: 1.0, y: sy + 0.45, w: 5.0, h: 0.32,
        fontSize: 12,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        margin: 0
      });

      // Desc
      s.addText(st.desc, {
        x: 1.0, y: sy + 0.8, w: 5.0, h: 0.55,
        fontSize: 10,
        color: C.slate,
        fontFace: FONT_BODY,
        lineSpacingMultiple: 1.2,
        margin: 0
      });
    });

    // Right Column: Checkout Modal Screenshot Showing 25% Discount
    s.addShape(SHAPES.roundRect, {
      x: 6.7, y: 1.85, w: 5.8, h: 4.95,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    s.addText('BUKTI AUTO-APPLIED DISKON 25% DI CHECKOUT', {
      x: 7.0, y: 1.95, w: 5.2, h: 0.3,
      fontSize: 9,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE
    });

    s.addImage({
      path: path.join(assetsDir, 'ss_checkout_voucher.png'),
      x: 8.3, y: 2.35, w: 2.2, h: 4.35
    });

    // Right Side Explanation Box
    s.addShape(SHAPES.roundRect, {
      x: 10.7, y: 2.5, w: 1.6, h: 3.8,
      rectRadius: 0.1,
      fill: { color: C.tealSoft },
      line: { color: '99F6E4', width: 1 }
    });
    s.addText('Rincian Diskon:\n\n• Paket 3 Bulan:\n  Rp 900.000\n\n• Voucher 25%:\n  -Rp 225.000\n\n• Total Bayar:\n  Rp 675.000\n\n• Metode:\n  QRIS Instant (0ms)', {
      x: 10.78, y: 2.65, w: 1.45, h: 3.5,
      fontSize: 8.5,
      color: C.slate,
      fontFace: FONT_BODY,
      lineSpacingMultiple: 1.15
    });
  }

  // ==========================================
  // SLIDE 6: TINDAK LANJUT WA & KONTROL SESI PT
  // ==========================================
  console.log('Building Slide 6: WhatsApp Follow-Up...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Operational CRM & Trainer Management', 'Tindak Lanjut Admin via WhatsApp & Kontrol Sesi PT', 'Eksekusi retensi member secara personal dan pengelolaan kuota latihan trainer yang akurat.');

    // Left Column (3 Cards)
    const waFeatures = [
      {
        tag: 'WHATSAPP RETENTION',
        title: '1-Click WhatsApp Follow-Up',
        desc: 'Admin mengirimkan pesan follow-up perpanjangan personal ke WA member langsung dari tabel CRM.'
      },
      {
        tag: 'TRAINER SESSIONS',
        title: 'Manajemen Kuota Sesi Personal Trainer',
        desc: 'Pelacakan sisa kuota sesi latihan bersama coach dengan fitur potong kuota presensi (-1 Sesi).'
      },
      {
        tag: 'MEMBERSHIP CONTROL',
        title: 'Kontrol Status Akun & Cuti Member',
        desc: 'Fitur Freeze untuk membekukan keanggotaan sementara dan opsi perpanjang manual +30 hari.'
      }
    ];

    waFeatures.forEach((wf, idx) => {
      const wy = 2.0 + idx * 1.6;
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: wy, w: 4.8, h: 1.45,
        rectRadius: 0.12,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Tag
      s.addText(wf.tag, {
        x: 1.0, y: wy + 0.15, w: 3.5, h: 0.25,
        fontSize: 8,
        bold: true,
        color: C.teal,
        fontFace: FONT_TITLE
      });

      // Title
      s.addText(wf.title, {
        x: 1.0, y: wy + 0.42, w: 4.4, h: 0.35,
        fontSize: 12,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        margin: 0
      });

      // Desc
      s.addText(wf.desc, {
        x: 1.0, y: wy + 0.8, w: 4.4, h: 0.55,
        fontSize: 10,
        color: C.slate,
        fontFace: FONT_BODY,
        lineSpacingMultiple: 1.2,
        margin: 0
      });
    });

    // Right Column: Full Desktop Table Screenshot (ss_admin_crm_retention.png)
    s.addShape(SHAPES.roundRect, {
      x: 5.9, y: 1.85, w: 6.6, h: 4.95,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    // Browser Mock Header
    s.addShape(SHAPES.rect, {
      x: 5.9, y: 1.85, w: 6.6, h: 0.35,
      fill: { color: 'F1F5F9' },
      line: { color: C.border, width: 1 }
    });
    s.addShape(SHAPES.oval, { x: 6.05, y: 1.97, w: 0.11, h: 0.11, fill: { color: 'EF4444' }, line: { color: 'EF4444', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.22, y: 1.97, w: 0.11, h: 0.11, fill: { color: 'F59E0B' }, line: { color: 'F59E0B', width: 0 } });
    s.addShape(SHAPES.oval, { x: 6.39, y: 1.97, w: 0.11, h: 0.11, fill: { color: '10B981' }, line: { color: '10B981', width: 0 } });
    s.addText('Be Fit CRM Admin — Tab 2: Database Member & Tombol Retensi WhatsApp', {
      x: 6.6, y: 1.85, w: 5.5, h: 0.35,
      fontSize: 8.5,
      bold: true,
      color: C.slateLight,
      fontFace: FONT_BODY,
      valign: 'middle'
    });

    // High-Res Image
    s.addImage({
      path: path.join(assetsDir, 'ss_admin_crm_retention.png'),
      x: 5.92, y: 2.22, w: 6.56, h: 4.54
    });
  }

  // ==========================================
  // SLIDE 7: ARSITEKTUR & TEKNOLOGI SISTEM
  // ==========================================
  console.log('Building Slide 7: Arsitektur...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Technology Stack & Architecture', 'Arsitektur Teknis & Performa Sistem', 'Kombinasi arsitektur frontend modern, reactive data engine, dan infrastruktur cloud terdistribusi.');

    // 3 Structured Column Cards
    const techCols = [
      {
        badge: 'FRONTEND & UI LAYER',
        title: 'Modern Responsive UI',
        points: [
          'HTML5 & Modern CSS3 Architecture',
          'Tailwind CSS Utility-First Styling',
          'Clean Commercial UI Aesthetics',
          'Mobile-First Viewport Adaptation'
        ]
      },
      {
        badge: 'STATE & CRM ENGINE',
        title: 'Zero-Lag Reactive Store',
        points: [
          'Sinkronisasi 0ms Tanpa Artificial Loading',
          'Reactive LocalStorage Data Persistence',
          'Cross-Tab Storage Event Synchronization',
          'Aturan Bisnis Anti-Bocor Voucher CRM'
        ]
      },
      {
        badge: 'CLOUD & DELIVERY',
        title: 'Cloud & Continuous Deploy',
        points: [
          'EmailJS 5-Digit OTP Verification',
          'Git Distributed Version Control (GitHub)',
          'Vercel Global Edge Network Deployment',
          'Instant Production Rollouts via Webhooks'
        ]
      }
    ];

    techCols.forEach((col, idx) => {
      const cx = 0.8 + idx * 4.0;
      s.addShape(SHAPES.roundRect, {
        x: cx, y: 2.0, w: 3.75, h: 3.4,
        rectRadius: 0.15,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.5 }
      });

      // Top Accent Header
      s.addShape(SHAPES.rect, {
        x: cx, y: 2.0, w: 3.75, h: 0.4,
        fill: { color: C.tealSoft },
        line: { color: C.border, width: 1 }
      });
      s.addText(col.badge, {
        x: cx + 0.2, y: 2.0, w: 3.35, h: 0.4,
        fontSize: 8.5,
        bold: true,
        color: C.tealDark,
        fontFace: FONT_TITLE,
        valign: 'middle'
      });

      // Title
      s.addText(col.title, {
        x: cx + 0.2, y: 2.55, w: 3.35, h: 0.35,
        fontSize: 13,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        margin: 0
      });

      // Bullet points
      const bulletText = col.points.map(pt => ({
        text: `✓  ${pt}\n`,
        options: { fontSize: 9.5, color: C.slate, fontFace: FONT_BODY, lineSpacingMultiple: 1.35 }
      }));
      s.addText(bulletText, {
        x: cx + 0.2, y: 3.0, w: 3.35, h: 2.2,
        margin: 0
      });
    });

    // Bottom Architecture Banner Card
    s.addShape(SHAPES.roundRect, {
      x: 0.8, y: 5.65, w: 11.75, h: 1.15,
      rectRadius: 0.12,
      fill: { color: C.navy },
      line: { color: C.navy, width: 0 }
    });
    s.addText('ALUR ARSITEKTUR END-TO-END BE FIT CRM', {
      x: 1.1, y: 5.8, w: 11.0, h: 0.25,
      fontSize: 8.5,
      bold: true,
      color: '94A3B8',
      fontFace: FONT_TITLE
    });
    s.addText('Portal Member (Browser / Mobile)  ➔  Reactive State Engine  ➔  Admin CRM Dashboard  ➔  WhatsApp Retention API  ➔  Vercel Edge Cloud', {
      x: 1.1, y: 6.1, w: 11.1, h: 0.5,
      fontSize: 11,
      bold: true,
      color: 'FFFFFF',
      fontFace: FONT_TITLE
    });
  }

  // ==========================================
  // SLIDE 8: LIVE DEMO & TAUTAN APLIKASI
  // ==========================================
  console.log('Building Slide 8: Live Demo...');
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addHeader(s, 'Akses Aplikasi & Verifikasi Penguji', 'Live Demo & Akses Aplikasi Be Fit', 'Aplikasi telah aktif di cloud dan siap diuji secara langsung melalui smartphone atau peramban.');

    // Left Column: URL Box & Demo Steps
    // 1. Prominent Live URL Box
    s.addShape(SHAPES.roundRect, {
      x: 0.8, y: 2.0, w: 6.8, h: 1.25,
      rectRadius: 0.15,
      fill: { color: C.tealSoft },
      line: { color: C.teal, width: 2 }
    });
    s.addText('TAUTAN RESMI APLIKASI (LIVE DI VERCEL):', {
      x: 1.1, y: 2.15, w: 6.2, h: 0.25,
      fontSize: 8.5,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE
    });
    s.addText('🌐  https://befit-two-nu.vercel.app', {
      x: 1.1, y: 2.45, w: 6.2, h: 0.55,
      fontSize: 16,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      hyperlink: { url: 'https://befit-two-nu.vercel.app' }
    });

    // 2. Demo Step-by-Step Guide
    const demoSteps = [
      {
        num: 'Langkah 1',
        title: 'Demo Portal Member',
        desc: 'Buka link di browser, pilih cabang Setiabudi, eksplorasi jadwal kelas dan filter direktori Trainer.'
      },
      {
        num: 'Langkah 2',
        title: 'Demo Retensi Voucher 25%',
        desc: 'Tinjau banner peringatan masa aktif kuning di Beranda dan buktikan potongan voucher RENEWLOYAL25 di checkout.'
      },
      {
        num: 'Langkah 3',
        title: 'Demo Dashboard CRM Admin',
        desc: 'Klik logo BF, login dengan akun admin, amati grafik omzet cabang dan uji tombol Kirim Notif Promo (WA).'
      }
    ];

    demoSteps.forEach((ds, idx) => {
      const dsy = 3.45 + idx * 1.05;
      s.addShape(SHAPES.roundRect, {
        x: 0.8, y: dsy, w: 6.8, h: 0.92,
        rectRadius: 0.1,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1.2 }
      });

      // Step Tag
      s.addShape(SHAPES.roundRect, {
        x: 1.0, y: dsy + 0.12, w: 1.1, h: 0.26,
        rectRadius: 0.08,
        fill: { color: C.tealLight },
        line: { color: '99F6E4', width: 1 }
      });
      s.addText(ds.num, {
        x: 1.0, y: dsy + 0.12, w: 1.1, h: 0.26,
        fontSize: 7.5,
        bold: true,
        color: C.tealDark,
        fontFace: FONT_TITLE,
        align: 'center',
        valign: 'middle'
      });

      s.addText(ds.title, {
        x: 2.25, y: dsy + 0.1, w: 5.1, h: 0.3,
        fontSize: 11,
        bold: true,
        color: C.navy,
        fontFace: FONT_TITLE,
        valign: 'middle',
        margin: 0
      });

      s.addText(ds.desc, {
        x: 1.0, y: dsy + 0.44, w: 6.4, h: 0.42,
        fontSize: 9,
        color: C.slate,
        fontFace: FONT_BODY,
        margin: 0
      });
    });

    // Admin Credentials Footer Pill
    s.addShape(SHAPES.roundRect, {
      x: 0.8, y: 6.65, w: 6.8, h: 0.45,
      rectRadius: 0.1,
      fill: { color: 'F1F5F9' },
      line: { color: C.border, width: 1 }
    });
    s.addText('Kredensial Admin CRM: rrizky205@gmail.com  |  Password: wudinjir1911', {
      x: 0.9, y: 6.65, w: 6.6, h: 0.45,
      fontSize: 8.5,
      bold: true,
      color: C.slate,
      fontFace: FONT_BODY,
      valign: 'middle'
    });

    // Right Column: QR Code Showcase Card
    s.addShape(SHAPES.roundRect, {
      x: 8.0, y: 2.0, w: 4.5, h: 5.1,
      rectRadius: 0.15,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1.5 }
    });

    s.addText('PINDAI UNTUK MENCOBA DI SMARTPHONE', {
      x: 8.2, y: 2.2, w: 4.1, h: 0.3,
      fontSize: 9,
      bold: true,
      color: C.tealDark,
      fontFace: FONT_TITLE,
      align: 'center'
    });

    // QR Code Image
    s.addImage({
      path: path.join(assetsDir, 'qr_code.png'),
      x: 8.65, y: 2.65, w: 3.2, h: 3.2
    });

    s.addText('Buka kamera smartphone dan arahkan ke kode QR di atas untuk mengakses langsung Be Fit Gym CRM di Vercel.', {
      x: 8.3, y: 6.0, w: 3.9, h: 0.8,
      fontSize: 9,
      color: C.slate,
      fontFace: FONT_BODY,
      align: 'center',
      lineSpacingMultiple: 1.2
    });
  }

  // ==========================================
  // EXPORT PRESENTATION
  // ==========================================
  const outputPath = path.join(__dirname, 'Presentasi_BeFit_CRM.pptx');
  console.log('Writing presentation to:', outputPath);
  await pres.writeFile({ fileName: outputPath });
  console.log('🎉 SUCCESS! File created:', outputPath);
  console.log('File size:', fs.statSync(outputPath).size, 'bytes');
}

createPresentation().catch(err => {
  console.error('Fatal presentation generation error:', err);
  process.exit(1);
});
