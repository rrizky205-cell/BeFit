/**
 * BE FIT GYM CRM - Central Reactive Store & Domain Business Logic
 * Persisted in localStorage namespace: befit_crm_state_v1
 */

import {
  PACKAGE_PRICES,
  getDaysDifference,
  addDays,
  toISODateString,
  generateMemberId,
  generateLeadId
} from './utils.js';

const STORAGE_KEY = 'befit_crm_state_v1';

/**
 * Generate initial realistic seed data relative to current date
 */
function createSeedData() {
  const now = new Date();

  // Helper relative date string
  const relDate = (days) => toISODateString(addDays(now, days));
  const pastDate = (days) => toISODateString(addDays(now, -days));

  const members = [
    {
      id: 'BF-1001',
      name: 'Dimas Arya Pratama',
      phone: '+62 812-3456-7890',
      packageType: 'VIP',
      joinDate: pastDate(90),
      expiryDate: relDate(45), // Active
      isFrozen: false,
      notes: 'Sering latihan sore, goal hipertrofi.'
    },
    {
      id: 'BF-1002',
      name: 'Siti Rahmawati',
      phone: '+62 813-8899-2211',
      packageType: 'PT Pack',
      joinDate: pastDate(60),
      expiryDate: relDate(3), // Expiring Soon (3 hari lagi)
      isFrozen: false,
      notes: 'PT dengan Coach Maya. Follow-up renewal segera.'
    },
    {
      id: 'BF-1003',
      name: 'Budi Santoso',
      phone: '+62 815-7766-3344',
      packageType: 'Pro',
      joinDate: pastDate(120),
      expiryDate: relDate(6), // Expiring Soon (6 hari lagi)
      isFrozen: false,
      notes: 'Member setia pagi hari jam 07:00.'
    },
    {
      id: 'BF-1004',
      name: 'Dewi Lestari',
      phone: '+62 817-4433-2211',
      packageType: 'Basic',
      joinDate: pastDate(150),
      expiryDate: pastDate(12), // Expired (-12 hari)
      isFrozen: false,
      notes: 'Belum sempat renew karena tugas luar kota.'
    },
    {
      id: 'BF-1005',
      name: 'Reza Firmansyah',
      phone: '+62 821-9988-7766',
      packageType: 'PT Pack',
      joinDate: pastDate(40),
      expiryDate: relDate(35), // Frozen
      isFrozen: true,
      notes: 'Mengajukan cuti 2 minggu karena cedera engkel.'
    },
    {
      id: 'BF-1006',
      name: 'Jessica Tanuwijaya',
      phone: '+62 819-0011-2233',
      packageType: 'VIP',
      joinDate: pastDate(30),
      expiryDate: relDate(60), // Active
      isFrozen: false,
      notes: 'Penggemar spinning RPM dan sauna.'
    },
    {
      id: 'BF-1007',
      name: 'Agus Setiawan',
      phone: '+62 856-1122-3344',
      packageType: 'Pro',
      joinDate: pastDate(200),
      expiryDate: relDate(1), // Expiring Soon (1 hari lagi)
      isFrozen: false,
      notes: 'Perlu diingatkan saat check-in.'
    },
    {
      id: 'BF-1008',
      name: 'Nadia Safitri',
      phone: '+62 812-7788-9900',
      packageType: 'Basic',
      joinDate: pastDate(75),
      expiryDate: relDate(22), // Active
      isFrozen: false,
      notes: 'Latihan rutin bersama rekan kantor.'
    },
    {
      id: 'BF-1009',
      name: 'Rian Hidayat',
      phone: '+62 878-5544-3322',
      packageType: 'Pro',
      joinDate: pastDate(180),
      expiryDate: pastDate(45), // Expired (-45 hari)
      isFrozen: false,
      notes: 'Follow-up promo comeback member.'
    }
  ];

  const leads = [
    {
      id: 'LD-1001',
      name: 'Andi Wijaya',
      phone: '+62 813-1122-3301',
      stage: 'new',
      source: 'Instagram',
      packageInterest: 'Pro',
      notes: 'Tanya promo membership semesteran via DM IG.'
    },
    {
      id: 'LD-1002',
      name: 'Putri Maharani',
      phone: '+62 812-2233-4402',
      stage: 'new',
      source: 'Website',
      packageInterest: 'VIP',
      notes: 'Isi formulir kontak web, minat fasilitas VIP.'
    },
    {
      id: 'LD-1003',
      name: 'Kevin Sanjaya',
      phone: '+62 818-3344-5503',
      stage: 'trial',
      source: 'Walk-in',
      packageInterest: 'PT Pack',
      notes: 'Trial sesi privat bersama Coach Alex Sabtu ini.'
    },
    {
      id: 'LD-1004',
      name: 'Rina Kusuma',
      phone: '+62 857-4455-6604',
      stage: 'followup',
      source: 'Referral',
      packageInterest: 'Pro',
      notes: 'Teman sekantor Siti Rahmawati. Sudah coba gym 1x.'
    },
    {
      id: 'LD-1005',
      name: 'Fajar Alfian',
      phone: '+62 822-5566-7705',
      stage: 'won',
      source: 'Walk-in',
      packageInterest: 'VIP',
      notes: 'Sudah sepakat bayar VIP, tinggal aktivasi akun!'
    },
    {
      id: 'LD-1006',
      name: 'Gita Gutawa',
      phone: '+62 819-6677-8806',
      stage: 'lost',
      source: 'Instagram',
      packageInterest: 'Basic',
      notes: 'Memilih gym dekat tempat tinggal baru.'
    }
  ];

  const classes = [
    {
      id: 'CLS-1',
      name: 'HIIT Metabolic Burn',
      coach: 'Coach Alex "The Beast"',
      scheduleTime: '07:00 - 08:00 WIB',
      room: 'Studio A (Functional)',
      capacity: 12,
      attendees: ['BF-1001', 'BF-1002', 'BF-1003', 'BF-1006', 'BF-1008']
    },
    {
      id: 'CLS-2',
      name: 'Powerlifting Intensive',
      coach: 'Coach Mike Iron',
      scheduleTime: '10:00 - 11:30 WIB',
      room: 'Heavy Iron Zone',
      capacity: 8,
      attendees: ['BF-1001', 'BF-1006']
    },
    {
      id: 'CLS-3',
      name: 'Vinyasa Flow Yoga',
      coach: 'Coach Maya Zen',
      scheduleTime: '16:30 - 17:30 WIB',
      room: 'Mind & Body Studio',
      capacity: 15,
      attendees: ['BF-1002', 'BF-1003', 'BF-1007', 'BF-1008']
    },
    {
      id: 'CLS-4',
      name: 'RPM Indoor Cycling',
      coach: 'Coach Daniel Turbo',
      scheduleTime: '18:30 - 19:30 WIB',
      room: 'Spinning Theater',
      capacity: 10,
      attendees: ['BF-1001', 'BF-1006', 'BF-1008']
    }
  ];

  // Past check-in logs for today
  const checkInLogs = [
    {
      id: 'LOG-1',
      memberId: 'BF-1001',
      memberName: 'Dimas Arya Pratama',
      packageType: 'VIP',
      status: 'Active',
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 12).toISOString(),
      wasExpiringSoon: false
    },
    {
      id: 'LOG-2',
      memberId: 'BF-1003',
      memberName: 'Budi Santoso',
      packageType: 'Pro',
      status: 'Expiring Soon',
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 45).toISOString(),
      wasExpiringSoon: true
    },
    {
      id: 'LOG-3',
      memberId: 'BF-1006',
      memberName: 'Jessica Tanuwijaya',
      packageType: 'VIP',
      status: 'Active',
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 20).toISOString(),
      wasExpiringSoon: false
    },
    {
      id: 'LOG-4',
      memberId: 'BF-1008',
      memberName: 'Nadia Safitri',
      packageType: 'Basic',
      status: 'Active',
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30).toISOString(),
      wasExpiringSoon: false
    }
  ];

  return {
    members,
    leads,
    classes,
    checkInLogs
  };
}

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.members && parsed.leads && parsed.classes && parsed.checkInLogs) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, falling back to seed data:', e);
    }
    const seed = createSeedData();
    this.saveState(seed);
    return seed;
  }

  saveState(stateToSave = this.state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Error in store subscriber listener:', err);
      }
    });
  }

  resetDemoData() {
    this.state = createSeedData();
    this.notify();
  }

  // ==================== DOMAIN LOGIC: MEMBERSHIP ====================

  /**
   * Aturan Siklus Hidup & Status Membership (Domain Rules):
   * 1. Frozen: jika isFrozen === true
   * 2. Expired: jika !isFrozen dan (expiryDate - today) < 0
   * 3. Expiring Soon: jika !isFrozen dan 0 <= daysRemaining <= 7
   * 4. Active: jika !isFrozen dan daysRemaining > 7
   */
  getMemberStatus(member, baseDate = new Date()) {
    if (!member) return 'Expired';
    if (member.isFrozen) return 'Frozen';

    const daysRemaining = getDaysDifference(member.expiryDate, baseDate);
    if (daysRemaining < 0) return 'Expired';
    if (daysRemaining <= 7) return 'Expiring Soon';
    return 'Active';
  }

  /**
   * Perhitungan MRR (Monthly Recurring Revenue):
   * Hanya menjumlahkan harga paket dari member berstatus Active dan Expiring Soon.
   * Member Expired dan Frozen tidak dihitung.
   */
  calculateMRR() {
    return this.state.members.reduce((total, member) => {
      const status = this.getMemberStatus(member);
      if (status === 'Active' || status === 'Expiring Soon') {
        const price = PACKAGE_PRICES[member.packageType] || 0;
        return total + price;
      }
      return total;
    }, 0);
  }

  getMembersByStatus(statusName) {
    return this.state.members.filter(m => this.getMemberStatus(m) === statusName);
  }

  getExpiringSoonMembers() {
    return this.getMembersByStatus('Expiring Soon');
  }

  getActiveMembersCount() {
    return this.state.members.filter(m => {
      const s = this.getMemberStatus(m);
      return s === 'Active' || s === 'Expiring Soon';
    }).length;
  }

  getTodayCheckIns() {
    const todayStr = new Date().toISOString().slice(0, 10);
    return this.state.checkInLogs.filter(log => {
      return log.timestamp && log.timestamp.startsWith(todayStr);
    });
  }

  // ==================== MUTATIONS: MEMBERS ====================

  addMember(data) {
    const newMember = {
      id: data.id || generateMemberId(this.state.members),
      name: data.name.trim(),
      phone: data.phone.trim(),
      packageType: data.packageType || 'Basic',
      joinDate: data.joinDate || toISODateString(new Date()),
      expiryDate: data.expiryDate || toISODateString(addDays(new Date(), 30)),
      isFrozen: Boolean(data.isFrozen),
      notes: data.notes ? data.notes.trim() : ''
    };

    this.state.members.unshift(newMember);
    this.notify();
    return newMember;
  }

  updateMember(id, updates) {
    const index = this.state.members.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.state.members[index] = {
      ...this.state.members[index],
      ...updates
    };

    this.notify();
    return this.state.members[index];
  }

  deleteMember(id) {
    this.state.members = this.state.members.filter(m => m.id !== id);
    // Also remove from any class attendees
    this.state.classes.forEach(c => {
      c.attendees = c.attendees.filter(attId => attId !== id);
    });
    this.notify();
  }

  /**
   * Aturan Perpanjangan (Renew +30 Hari):
   * - Jika masih Active atau Expiring Soon: expiryDate = expiryDate + 30 hari.
   * - Jika sudah Expired: expiryDate = today + 30 hari.
   * - Unfreeze otomatis jika sebelumnya frozen.
   */
  renewMember(id) {
    const member = this.state.members.find(m => m.id === id);
    if (!member) return null;

    const currentStatus = this.getMemberStatus(member);
    let newExpiry;

    if (currentStatus === 'Active' || currentStatus === 'Expiring Soon') {
      newExpiry = toISODateString(addDays(member.expiryDate, 30));
    } else {
      // Expired or Frozen
      newExpiry = toISODateString(addDays(new Date(), 30));
    }

    member.expiryDate = newExpiry;
    member.isFrozen = false; // Unfreeze upon renewing
    this.notify();
    return member;
  }

  /**
   * Toggle Freeze / Unfreeze
   */
  toggleFreezeMember(id) {
    const member = this.state.members.find(m => m.id === id);
    if (!member) return null;

    member.isFrozen = !member.isFrozen;
    this.notify();
    return member;
  }

  // ==================== MUTATIONS: CHECK-IN GATE ====================

  /**
   * Check-in Gate Validation:
   * - Granted: Active atau Expiring Soon
   * - Denied: Expired atau Frozen
   */
  checkInMember(searchQuery) {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return { success: false, reason: 'Harap masukkan ID Member atau nama.' };
    }

    const member = this.state.members.find(m => {
      return m.id.toLowerCase() === query || m.name.toLowerCase().includes(query);
    });

    if (!member) {
      return { success: false, reason: `Member dengan pencarian "${searchQuery}" tidak ditemukan.` };
    }

    const status = this.getMemberStatus(member);
    const days = getDaysDifference(member.expiryDate);

    if (status === 'Frozen') {
      return {
        success: false,
        member,
        status,
        daysRemaining: days,
        reason: 'Status membership sedang cuti (FROZEN). Tidak dapat check-in hingga di-unfreeze.'
      };
    }

    if (status === 'Expired') {
      return {
        success: false,
        member,
        status,
        daysRemaining: days,
        reason: `Membership telah kedaluwarsa (${Math.abs(days)} hari yang lalu). Harap lakukan perpanjangan terlebih dahulu.`
      };
    }

    // Granted: Active or Expiring Soon
    const logEntry = {
      id: 'LOG-' + Date.now(),
      memberId: member.id,
      memberName: member.name,
      packageType: member.packageType,
      status: status,
      timestamp: new Date().toISOString(),
      wasExpiringSoon: status === 'Expiring Soon'
    };

    this.state.checkInLogs.unshift(logEntry);
    this.notify();

    return {
      success: true,
      member,
      status,
      daysRemaining: days,
      message: status === 'Expiring Soon'
        ? `Akses Diterima! PERINGATAN: Masa aktif tersisa ${days} hari lagi. Tawarkan perpanjangan!`
        : 'Akses Diterima! Selamat berlatih di Be Fit Gym.'
    };
  }

  // ==================== MUTATIONS: SALES FUNNEL (KANBAN) ====================

  addLead(data) {
    const newLead = {
      id: data.id || generateLeadId(this.state.leads),
      name: data.name.trim(),
      phone: data.phone.trim(),
      stage: data.stage || 'new',
      source: data.source || 'Walk-in',
      packageInterest: data.packageInterest || 'Pro',
      notes: data.notes ? data.notes.trim() : ''
    };

    this.state.leads.unshift(newLead);
    this.notify();
    return newLead;
  }

  updateLeadStage(id, newStage) {
    const validStages = ['new', 'trial', 'followup', 'won', 'lost'];
    if (!validStages.includes(newStage)) return null;

    const lead = this.state.leads.find(l => l.id === id);
    if (!lead) return null;

    lead.stage = newStage;
    this.notify();
    return lead;
  }

  deleteLead(id) {
    this.state.leads = this.state.leads.filter(l => l.id !== id);
    this.notify();
  }

  convertLeadToMember(leadId, memberData) {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (!lead) return null;

    // Add member
    const newMember = this.addMember({
      name: memberData.name || lead.name,
      phone: memberData.phone || lead.phone,
      packageType: memberData.packageType || lead.packageInterest,
      joinDate: memberData.joinDate || toISODateString(new Date()),
      expiryDate: memberData.expiryDate || toISODateString(addDays(new Date(), 30)),
      notes: `Dikonversi dari Lead [${lead.id}] (${lead.source}). ${memberData.notes || ''}`
    });

    // Remove or archive lead
    this.deleteLead(leadId);

    return newMember;
  }

  // ==================== MUTATIONS: CLASSES & PT ====================

  bookClass(classId, memberId) {
    const classItem = this.state.classes.find(c => c.id === classId);
    if (!classItem) {
      return { success: false, reason: 'Kelas tidak ditemukan.' };
    }

    const member = this.state.members.find(m => m.id === memberId);
    if (!member) {
      return { success: false, reason: 'Member tidak ditemukan.' };
    }

    // 1. Tolak jika kuota penuh
    if (classItem.attendees.length >= classItem.capacity) {
      return { success: false, reason: `Kelas ${classItem.name} sudah penuh (Maksimal ${classItem.capacity} peserta).` };
    }

    // 2. Tolak jika Expired atau Frozen
    const status = this.getMemberStatus(member);
    if (status === 'Expired') {
      return { success: false, reason: `Member ${member.name} berstatus Expired. Perpanjang membership untuk reservasi kelas.` };
    }
    if (status === 'Frozen') {
      return { success: false, reason: `Member ${member.name} sedang cuti (Frozen). Unfreeze status untuk reservasi kelas.` };
    }

    // 3. Tolak jika sudah terdaftar
    if (classItem.attendees.includes(memberId)) {
      return { success: false, reason: `Member ${member.name} sudah terdaftar di kelas ini (Double booking dicegah).` };
    }

    classItem.attendees.push(memberId);
    this.notify();

    return {
      success: true,
      message: `Berhasil mendaftarkan ${member.name} ke kelas ${classItem.name}.`
    };
  }

  cancelClassBooking(classId, memberId) {
    const classItem = this.state.classes.find(c => c.id === classId);
    if (!classItem) return false;

    classItem.attendees = classItem.attendees.filter(id => id !== memberId);
    this.notify();
    return true;
  }

  addClass(classData) {
    const newClass = {
      id: 'CLS-' + (this.state.classes.length + 1),
      name: classData.name.trim(),
      coach: classData.coach.trim(),
      scheduleTime: classData.scheduleTime.trim(),
      room: classData.room ? classData.room.trim() : 'Studio Utama',
      capacity: parseInt(classData.capacity, 10) || 12,
      attendees: []
    };

    this.state.classes.push(newClass);
    this.notify();
    return newClass;
  }
}

export const store = new Store();
