/**
 * BE FIT GYM CRM - Custom Modal Dialog Engine
 * Eliminates all native alert(), confirm(), prompt() dialogs.
 */

import { sanitizeHTML, formatDate, formatRupiah, PACKAGE_PRICES, STATUS_CONFIG, toISODateString, addDays } from '../utils.js';
import { playClick } from '../audio.js';

class ModalManager {
  constructor() {
    this.modalRoot = null;
    this.activeModal = null;
    this.init();
  }

  init() {
    if (!document.getElementById('modal-root')) {
      this.modalRoot = document.createElement('div');
      this.modalRoot.id = 'modal-root';
      this.modalRoot.className = 'fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-200';
      document.body.appendChild(this.modalRoot);

      // Close on backdrop click
      this.modalRoot.addEventListener('click', (e) => {
        if (e.target === this.modalRoot) {
          this.close();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.modalRoot.classList.contains('hidden')) {
          this.close();
        }
      });
    } else {
      this.modalRoot = document.getElementById('modal-root');
    }
  }

  open(contentHtml) {
    this.init();
    this.modalRoot.innerHTML = `
      <div class="relative w-full max-w-lg bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto transform transition-all duration-200 scale-95 opacity-0">
        ${contentHtml}
      </div>
    `;

    this.modalRoot.classList.remove('hidden');
    this.modalRoot.classList.add('flex');

    requestAnimationFrame(() => {
      const box = this.modalRoot.querySelector('div');
      if (box) {
        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
      }
    });

    const closeButtons = this.modalRoot.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playClick();
        this.close();
      });
    });
  }

  close() {
    if (!this.modalRoot) return;
    const box = this.modalRoot.querySelector('div');
    if (box) {
      box.classList.remove('scale-100', 'opacity-100');
      box.classList.add('scale-95', 'opacity-0');
    }
    setTimeout(() => {
      this.modalRoot.classList.add('hidden');
      this.modalRoot.classList.remove('flex');
      this.modalRoot.innerHTML = '';
    }, 180);
  }

  // ==================== SPECIFIC MODALS ====================

  /**
   * Custom Confirmation Dialog (Replaces confirm())
   */
  confirm({
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Lanjutkan',
    cancelText = 'Batal',
    confirmType = 'danger', // danger | primary | warning
    onConfirm
  }) {
    let confirmBtnClass = 'bg-red-500 hover:bg-red-600 text-white shadow-red-950/40';
    if (confirmType === 'primary') {
      confirmBtnClass = 'bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] font-bold shadow-lime-950/40';
    } else if (confirmType === 'warning') {
      confirmBtnClass = 'bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-amber-950/40';
    }

    const html = `
      <div class="flex items-start gap-4">
        <div class="p-3 rounded-xl ${confirmType === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-lime-500/10 text-lime-400 border border-lime-500/20'}">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-white tracking-tight">${sanitizeHTML(title)}</h3>
          <p class="mt-2 text-sm text-slate-300 leading-relaxed">${sanitizeHTML(message)}</p>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
        <button type="button" data-modal-close class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          ${sanitizeHTML(cancelText)}
        </button>
        <button type="button" id="modal-confirm-btn" class="px-4 py-2 text-sm rounded-lg shadow-lg transition-all ${confirmBtnClass}">
          ${sanitizeHTML(confirmText)}
        </button>
      </div>
    `;

    this.open(html);

    const btn = document.getElementById('modal-confirm-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        playClick();
        this.close();
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      });
    }
  }

  /**
   * Member Form Modal (Add / Edit)
   */
  openMemberModal({
    member = null,
    isEdit = false,
    prefilledData = null,
    onSave
  }) {
    const isEditing = isEdit && member;
    const initialName = member ? member.name : (prefilledData?.name || '');
    const initialPhone = member ? member.phone : (prefilledData?.phone || '');
    const initialPackage = member ? member.packageType : (prefilledData?.packageType || 'Pro');
    const initialJoinDate = member ? member.joinDate : toISODateString(new Date());
    const initialExpiryDate = member ? member.expiryDate : toISODateString(addDays(new Date(), 30));
    const initialIsFrozen = member ? Boolean(member.isFrozen) : false;
    const initialNotes = member ? (member.notes || '') : (prefilledData?.notes || '');

    const html = `
      <div class="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white tracking-tight">${isEditing ? 'Edit Data Member' : 'Pendaftaran Member Baru'}</h3>
            <p class="text-xs text-slate-400">${isEditing ? `ID: ${member.id}` : 'Lengkapi data profil dan paket membership'}</p>
          </div>
        </div>
        <button type="button" data-modal-close class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="member-form" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Nama Lengkap *</label>
          <input type="text" id="member-name" required value="${sanitizeHTML(initialName)}" placeholder="Contoh: Dimas Arya Pratama"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Nomor WhatsApp *</label>
          <input type="tel" id="member-phone" required value="${sanitizeHTML(initialPhone)}" placeholder="Contoh: +62 812-3456-7890"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none font-mono" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Paket Membership *</label>
            <select id="member-package" class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none">
              <option value="Basic" ${initialPackage === 'Basic' ? 'selected' : ''}>Basic (${formatRupiah(PACKAGE_PRICES.Basic)})</option>
              <option value="Pro" ${initialPackage === 'Pro' ? 'selected' : ''}>Pro (${formatRupiah(PACKAGE_PRICES.Pro)})</option>
              <option value="VIP" ${initialPackage === 'VIP' ? 'selected' : ''}>VIP (${formatRupiah(PACKAGE_PRICES.VIP)})</option>
              <option value="PT Pack" ${initialPackage === 'PT Pack' ? 'selected' : ''}>PT Pack (${formatRupiah(PACKAGE_PRICES['PT Pack'])})</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Masa Berlaku Berakhir *</label>
            <input type="date" id="member-expiry" required value="${initialExpiryDate}"
              class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3 py-2.5 transition-colors outline-none font-mono" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Tanggal Bergabung</label>
          <input type="date" id="member-join" value="${initialJoinDate}"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3 py-2 transition-colors outline-none font-mono text-slate-400" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Catatan Khusus</label>
          <textarea id="member-notes" rows="2" placeholder="Catatan medis, target latihan, preferensi coach..."
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg p-3 transition-colors outline-none">${sanitizeHTML(initialNotes)}</textarea>
        </div>

        ${isEditing ? `
          <div class="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <input type="checkbox" id="member-frozen" ${initialIsFrozen ? 'checked' : ''} class="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 border-slate-700 bg-slate-800" />
            <label for="member-frozen" class="text-sm font-medium text-slate-300 cursor-pointer">
              Status Cuti / Beku (<span class="text-cyan-400 font-semibold">Frozen</span>) — Member tidak dapat check-in sementara waktu.
            </label>
          </div>
        ` : ''}

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#1E293B]">
          <button type="button" data-modal-close class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Batal
          </button>
          <button type="submit" class="px-5 py-2.5 text-sm font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-lg shadow-lime-950/40 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            ${isEditing ? 'Simpan Perubahan' : 'Daftarkan Member'}
          </button>
        </div>
      </form>
    `;

    this.open(html);

    const form = document.getElementById('member-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('member-name').value.trim();
        const phoneInput = document.getElementById('member-phone').value.trim();
        const packageType = document.getElementById('member-package').value;
        const expiryDate = document.getElementById('member-expiry').value;
        const joinDate = document.getElementById('member-join').value;
        const notes = document.getElementById('member-notes').value.trim();
        const isFrozen = isEditing ? document.getElementById('member-frozen').checked : false;

        if (!nameInput) return;

        playClick();
        this.close();

        if (typeof onSave === 'function') {
          onSave({
            name: nameInput,
            phone: phoneInput,
            packageType,
            expiryDate,
            joinDate,
            notes,
            isFrozen
          });
        }
      });
    }
  }

  /**
   * Lead Form Modal (Add / Edit)
   */
  openLeadModal({
    lead = null,
    isEdit = false,
    onSave
  }) {
    const isEditing = isEdit && lead;
    const initialName = lead ? lead.name : '';
    const initialPhone = lead ? lead.phone : '';
    const initialStage = lead ? lead.stage : 'new';
    const initialSource = lead ? lead.source : 'Walk-in';
    const initialPackage = lead ? lead.packageInterest : 'Pro';
    const initialNotes = lead ? (lead.notes || '') : '';

    const html = `
      <div class="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white tracking-tight">${isEditing ? 'Edit Data Lead' : 'Tambah Prospek / Lead Baru'}</h3>
            <p class="text-xs text-slate-400">Pipeline Sales Funnel Be Fit Gym</p>
          </div>
        </div>
        <button type="button" data-modal-close class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="lead-form" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Nama Prospek *</label>
          <input type="text" id="lead-name" required value="${sanitizeHTML(initialName)}" placeholder="Contoh: Kevin Sanjaya"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Nomor WhatsApp *</label>
          <input type="tel" id="lead-phone" required value="${sanitizeHTML(initialPhone)}" placeholder="Contoh: +62 813-1122-3344"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none font-mono" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Sumber Lead</label>
            <select id="lead-source" class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none">
              <option value="Walk-in" ${initialSource === 'Walk-in' ? 'selected' : ''}>Walk-in</option>
              <option value="Instagram" ${initialSource === 'Instagram' ? 'selected' : ''}>Instagram</option>
              <option value="Referral" ${initialSource === 'Referral' ? 'selected' : ''}>Referral</option>
              <option value="Website" ${initialSource === 'Website' ? 'selected' : ''}>Website</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Minat Paket</label>
            <select id="lead-package" class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none">
              <option value="Basic" ${initialPackage === 'Basic' ? 'selected' : ''}>Basic</option>
              <option value="Pro" ${initialPackage === 'Pro' ? 'selected' : ''}>Pro</option>
              <option value="VIP" ${initialPackage === 'VIP' ? 'selected' : ''}>VIP</option>
              <option value="PT Pack" ${initialPackage === 'PT Pack' ? 'selected' : ''}>PT Pack</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Tahapan Pipeline</label>
          <select id="lead-stage" class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none">
            <option value="new" ${initialStage === 'new' ? 'selected' : ''}>New Inquiry</option>
            <option value="trial" ${initialStage === 'trial' ? 'selected' : ''}>Trial Booked</option>
            <option value="followup" ${initialStage === 'followup' ? 'selected' : ''}>Follow Up</option>
            <option value="won" ${initialStage === 'won' ? 'selected' : ''}>Won (Closed)</option>
            <option value="lost" ${initialStage === 'lost' ? 'selected' : ''}>Lost</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Catatan Interaksi</label>
          <textarea id="lead-notes" rows="2" placeholder="Pertanyaan member, jadwal trial, promo yang ditawarkan..."
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-white text-sm rounded-lg p-3 transition-colors outline-none">${sanitizeHTML(initialNotes)}</textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#1E293B]">
          <button type="button" data-modal-close class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Batal
          </button>
          <button type="submit" class="px-5 py-2.5 text-sm font-bold bg-[#38BDF8] hover:bg-[#0284C7] text-[#090D16] rounded-lg shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            ${isEditing ? 'Simpan Perubahan' : 'Tambah Prospek'}
          </button>
        </div>
      </form>
    `;

    this.open(html);

    const form = document.getElementById('lead-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('lead-name').value.trim();
        const phone = document.getElementById('lead-phone').value.trim();
        const source = document.getElementById('lead-source').value;
        const packageInterest = document.getElementById('lead-package').value;
        const stage = document.getElementById('lead-stage').value;
        const notes = document.getElementById('lead-notes').value.trim();

        if (!name) return;

        playClick();
        this.close();

        if (typeof onSave === 'function') {
          onSave({
            name,
            phone,
            source,
            packageInterest,
            stage,
            notes
          });
        }
      });
    }
  }

  /**
   * Class Booking Modal (Register member to class with live validation)
   */
  openClassBookingModal({
    classItem,
    members = [],
    getStatusFn,
    onBook
  }) {
    // Filter out already booked or expired/frozen members for the dropdown helper
    const bookedIds = new Set(classItem.attendees || []);
    const availableSlots = classItem.capacity - bookedIds.size;

    const memberOptions = members.map(m => {
      const status = getStatusFn(m);
      const isBooked = bookedIds.has(m.id);
      const isEligible = (status === 'Active' || status === 'Expiring Soon') && !isBooked;

      let suffix = `(${status})`;
      if (isBooked) suffix = '— SUDAH TERDAFTAR';
      else if (status === 'Expired') suffix = '— EXPIRED';
      else if (status === 'Frozen') suffix = '— FROZEN';

      return `
        <option value="${m.id}" ${!isEligible ? 'disabled class="text-slate-500 bg-slate-900"' : 'class="text-white bg-slate-900"'}>
          ${sanitizeHTML(m.name)} [${m.id}] ${suffix}
        </option>
      `;
    }).join('');

    const html = `
      <div class="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white tracking-tight">Reservasi Kelas</h3>
            <p class="text-xs text-lime-400 font-semibold">${sanitizeHTML(classItem.name)} • ${sanitizeHTML(classItem.scheduleTime)}</p>
          </div>
        </div>
        <button type="button" data-modal-close class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="my-4 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block">Pelatih / Instruktur:</span>
          <span class="text-sm font-bold text-white">${sanitizeHTML(classItem.coach)}</span>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 block">Sisa Kuota:</span>
          <span class="text-sm font-mono font-bold ${availableSlots <= 2 ? 'text-amber-400' : 'text-lime-400'}">${availableSlots} / ${classItem.capacity} kursi</span>
        </div>
      </div>

      <form id="class-booking-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Pilih Member *</label>
          <select id="booking-member-id" required class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-3 transition-colors outline-none font-sans">
            <option value="" disabled selected>-- Pilih Member Aktif --</option>
            ${memberOptions}
          </select>
          <p class="mt-1.5 text-xs text-slate-500">Hanya member berstatus Aktif atau Expiring Soon yang dapat didaftarkan.</p>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#1E293B]">
          <button type="button" data-modal-close class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Batal
          </button>
          <button type="submit" ${availableSlots <= 0 ? 'disabled' : ''} class="px-5 py-2.5 text-sm font-bold ${availableSlots <= 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] shadow-lime-950/40'} rounded-lg shadow-lg transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            ${availableSlots <= 0 ? 'Kelas Penuh' : 'Daftarkan Member'}
          </button>
        </div>
      </form>
    `;

    this.open(html);

    const form = document.getElementById('class-booking-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const memberId = document.getElementById('booking-member-id').value;
        if (!memberId) return;

        playClick();
        this.close();

        if (typeof onBook === 'function') {
          onBook(memberId);
        }
      });
    }
  }

  /**
   * Add New Class Modal
   */
  openAddClassModal({ onSave }) {
    const html = `
      <div class="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white tracking-tight">Tambah Jadwal Kelas Baru</h3>
            <p class="text-xs text-slate-400">Jadwal Studio & Personal Trainer Be Fit</p>
          </div>
        </div>
        <button type="button" data-modal-close class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="add-class-form" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Nama Kelas *</label>
          <input type="text" id="class-name" required placeholder="Contoh: Crossfit Strength & Conditioning"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Instruktur / Coach *</label>
          <input type="text" id="class-coach" required placeholder="Contoh: Coach Alex"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Waktu Sesi *</label>
            <input type="text" id="class-time" required placeholder="08:00 - 09:30 WIB"
              class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none font-mono" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Kapasitas Maksimal *</label>
            <input type="number" id="class-capacity" required min="1" max="50" value="12"
              class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none font-mono" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Ruangan / Studio</label>
          <input type="text" id="class-room" placeholder="Studio Utama / Studio B"
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-sm rounded-lg px-3.5 py-2.5 transition-colors outline-none" />
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#1E293B]">
          <button type="button" data-modal-close class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Batal
          </button>
          <button type="submit" class="px-5 py-2.5 text-sm font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-lg shadow-lime-950/40 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            Simpan Jadwal Kelas
          </button>
        </div>
      </form>
    `;

    this.open(html);

    const form = document.getElementById('add-class-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('class-name').value.trim();
        const coach = document.getElementById('class-coach').value.trim();
        const scheduleTime = document.getElementById('class-time').value.trim();
        const capacity = document.getElementById('class-capacity').value;
        const room = document.getElementById('class-room').value.trim();

        if (!name || !coach) return;

        playClick();
        this.close();

        if (typeof onSave === 'function') {
          onSave({ name, coach, scheduleTime, capacity, room });
        }
      });
    }
  }

  /**
   * Member Detail Modal
   */
  openMemberDetailsModal({
    member,
    status,
    daysRemaining,
    onRenew,
    onToggleFreeze,
    onEdit,
    onDelete
  }) {
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
    const price = PACKAGE_PRICES[member.packageType] || 0;

    let daysText = `${daysRemaining} hari tersisa`;
    if (daysRemaining < 0) {
      daysText = `Expired ${Math.abs(daysRemaining)} hari yang lalu`;
    } else if (daysRemaining === 0) {
      daysText = `Kedaluwarsa Hari Ini!`;
    }

    const html = `
      <div class="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 text-[#A3E635] font-black text-lg flex items-center justify-center font-mono">
            ${member.id.replace('BF-', '')}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-white tracking-tight">${sanitizeHTML(member.name)}</h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style="color: ${statusCfg.textColor}; background-color: ${statusCfg.bgColor}; border: 1px solid ${statusCfg.borderColor};">
                ${statusCfg.label}
              </span>
            </div>
            <p class="text-xs text-slate-400 font-mono">${member.id} • ${sanitizeHTML(member.phone)}</p>
          </div>
        </div>
        <button type="button" data-modal-close class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="my-5 grid grid-cols-2 gap-3.5">
        <div class="p-3 bg-[#090D16] rounded-xl border border-[#1E293B]">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Paket Membership</span>
          <span class="text-base font-bold text-white">${member.packageType}</span>
          <span class="text-xs text-lime-400 font-mono block mt-0.5">${formatRupiah(price)} / bulan</span>
        </div>
        <div class="p-3 bg-[#090D16] rounded-xl border border-[#1E293B]">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Masa Aktif</span>
          <span class="text-sm font-bold text-white">${formatDate(member.expiryDate)}</span>
          <span class="text-xs font-mono font-medium block mt-0.5" style="color: ${statusCfg.textColor}">${daysText}</span>
        </div>
        <div class="p-3 bg-[#090D16] rounded-xl border border-[#1E293B]">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Tanggal Bergabung</span>
          <span class="text-sm font-medium text-slate-300 font-mono">${formatDate(member.joinDate)}</span>
        </div>
        <div class="p-3 bg-[#090D16] rounded-xl border border-[#1E293B]">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Status Cuti (Freeze)</span>
          <span class="text-sm font-bold ${member.isFrozen ? 'text-cyan-400' : 'text-slate-400'}">${member.isFrozen ? 'Ya (Aktif Dibekukan)' : 'Tidak (Normal)'}</span>
        </div>
      </div>

      ${member.notes ? `
        <div class="mb-5 p-3.5 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span class="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">Catatan Staf / PT:</span>
          ${sanitizeHTML(member.notes)}
        </div>
      ` : ''}

      <div class="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E293B]">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-modal-delete" class="px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20">
            Hapus
          </button>
          <button type="button" id="btn-modal-freeze" class="px-3 py-2 text-xs font-semibold ${member.isFrozen ? 'text-lime-400 hover:bg-lime-500/10 border-lime-500/20' : 'text-cyan-400 hover:bg-cyan-500/10 border-cyan-500/20'} rounded-lg transition-colors border">
            ${member.isFrozen ? 'Unfreeze' : 'Freeze (Cuti)'}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" id="btn-modal-edit" class="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700">
            Edit
          </button>
          <button type="button" id="btn-modal-renew" class="px-4 py-2 text-xs font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-lg shadow-lime-950/40 transition-all flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Renew (+30 Hari)
          </button>
        </div>
      </div>
    `;

    this.open(html);

    document.getElementById('btn-modal-renew')?.addEventListener('click', () => {
      playClick();
      this.close();
      if (onRenew) onRenew();
    });

    document.getElementById('btn-modal-freeze')?.addEventListener('click', () => {
      playClick();
      this.close();
      if (onToggleFreeze) onToggleFreeze();
    });

    document.getElementById('btn-modal-edit')?.addEventListener('click', () => {
      playClick();
      this.close();
      if (onEdit) onEdit();
    });

    document.getElementById('btn-modal-delete')?.addEventListener('click', () => {
      playClick();
      this.close();
      if (onDelete) onDelete();
    });
  }
}

export const modal = new ModalManager();
