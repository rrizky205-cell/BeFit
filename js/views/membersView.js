/**
 * BE FIT GYM CRM - Member Directory Module
 * Real-time filter, status computation, Renew (+30d), Freeze/Unfreeze, CSV Export & Details
 */

import { store } from '../store.js';
import {
  formatRupiah,
  formatDate,
  getDaysDifference,
  sanitizeHTML,
  getInitials,
  exportMembersToCSV,
  STATUS_CONFIG,
  PACKAGE_PRICES,
  PACKAGE_COLORS
} from '../utils.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { playClick, playSuccess } from '../audio.js';

let currentFilterStatus = 'All';
let currentFilterPackage = 'All';
let currentSearchQuery = '';

export function renderMembers(container, router, options = {}) {
  if (options.filterStatus) {
    currentFilterStatus = options.filterStatus;
  }

  function getFilteredMembers() {
    return store.state.members.filter(m => {
      const status = store.getMemberStatus(m);
      
      // Status filter
      if (currentFilterStatus !== 'All' && status !== currentFilterStatus) {
        return false;
      }

      // Package filter
      if (currentFilterPackage !== 'All' && m.packageType !== currentFilterPackage) {
        return false;
      }

      // Search query
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesPhone = m.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPhone) return false;
      }

      return true;
    });
  }

  function updateTable() {
    const filtered = getFilteredMembers();
    const countBadge = document.getElementById('members-count-badge');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} dari ${store.state.members.length} Member`;
    }

    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-500">
            <div class="flex flex-col items-center justify-center gap-2">
              <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <p class="text-sm font-medium">Tidak ada data member yang sesuai dengan filter.</p>
              <button type="button" id="btn-reset-filters" class="mt-2 text-xs text-[#A3E635] hover:underline">Reset Semua Filter</button>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
        currentFilterStatus = 'All';
        currentFilterPackage = 'All';
        currentSearchQuery = '';
        renderMembers(container, router);
      });
      return;
    }

    tbody.innerHTML = filtered.map(member => {
      const status = store.getMemberStatus(member);
      const days = getDaysDifference(member.expiryDate);
      const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
      const pkgColors = PACKAGE_COLORS[member.packageType] || PACKAGE_COLORS.Basic;
      const cleanPhone = member.phone.replace(/[^0-9]/g, '');

      let daysDisplay = '';
      if (member.isFrozen) {
        daysDisplay = `<span class="text-cyan-400 font-mono font-medium">Cuti Aktif</span>`;
      } else if (days < 0) {
        daysDisplay = `<span class="text-red-400 font-mono font-medium">Lewat ${Math.abs(days)} hari</span>`;
      } else if (days === 0) {
        daysDisplay = `<span class="text-amber-400 font-mono font-bold animate-pulse">Hari ini!</span>`;
      } else if (days <= 7) {
        daysDisplay = `<span class="text-amber-400 font-mono font-semibold">${days} hari lagi</span>`;
      } else {
        daysDisplay = `<span class="text-slate-300 font-mono">${days} hari lagi</span>`;
      }

      return `
        <tr class="hover:bg-slate-800/40 transition-colors border-b border-[#1E293B]/60 group">
          <!-- Member Name & ID -->
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ${getInitials(member.name)}
              </div>
              <div class="min-w-0">
                <button type="button" class="btn-member-name text-sm font-bold text-white hover:text-[#A3E635] text-left transition-colors truncate block" data-id="${member.id}">
                  ${sanitizeHTML(member.name)}
                </button>
                <div class="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span class="text-lime-400/90 font-semibold">${member.id}</span>
                  <span>•</span>
                  <span>Gabung: ${formatDate(member.joinDate)}</span>
                </div>
              </div>
            </div>
          </td>

          <!-- Contact / WhatsApp -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-slate-300">${sanitizeHTML(member.phone)}</span>
              <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noopener noreferrer" title="Chat via WhatsApp"
                class="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </a>
            </div>
          </td>

          <!-- Package -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${pkgColors.bg} ${pkgColors.text} border ${pkgColors.border}">
              ${member.packageType}
            </span>
            <div class="text-[11px] font-mono text-slate-400 mt-0.5">
              ${formatRupiah(PACKAGE_PRICES[member.packageType] || 0)}
            </div>
          </td>

          <!-- Expiry Date & Days Left -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="text-xs text-slate-200 font-medium">${formatDate(member.expiryDate)}</div>
            <div class="text-xs mt-0.5">${daysDisplay}</div>
          </td>

          <!-- Dynamic Status Badge -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style="color: ${statusCfg.textColor}; background-color: ${statusCfg.bgColor}; border: 1px solid ${statusCfg.borderColor};">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${statusCfg.textColor};"></span>
              ${statusCfg.label}
            </span>
          </td>

          <!-- Quick Action Buttons -->
          <td class="py-3.5 px-4 whitespace-nowrap text-right">
            <div class="flex items-center justify-end gap-1.5">
              <!-- Renew +30 Days -->
              <button type="button" class="btn-renew-member p-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-[#A3E635] border border-lime-500/30 transition-all text-xs font-semibold flex items-center gap-1"
                data-id="${member.id}" title="Perpanjang 30 Hari">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span class="hidden md:inline">Renew</span>
              </button>

              <!-- Freeze / Unfreeze -->
              <button type="button" class="btn-freeze-member p-1.5 rounded-lg ${member.isFrozen ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'} border transition-colors text-xs"
                data-id="${member.id}" title="${member.isFrozen ? 'Unfreeze Membership' : 'Freeze / Cuti Member'}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </button>

              <!-- Edit -->
              <button type="button" class="btn-edit-member p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-xs"
                data-id="${member.id}" title="Edit Data Member">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>

              <!-- Delete -->
              <button type="button" class="btn-delete-member p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors text-xs"
                data-id="${member.id}" title="Hapus Member">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button events
    tbody.querySelectorAll('.btn-member-name').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openDetails(id);
      });
    });

    tbody.querySelectorAll('.btn-renew-member').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        handleRenew(id);
      });
    });

    tbody.querySelectorAll('.btn-freeze-member').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        handleToggleFreeze(id);
      });
    });

    tbody.querySelectorAll('.btn-edit-member').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        handleEdit(id);
      });
    });

    tbody.querySelectorAll('.btn-delete-member').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        handleDelete(id);
      });
    });
  }

  function handleRenew(id) {
    const member = store.state.members.find(m => m.id === id);
    if (!member) return;

    modal.confirm({
      title: 'Perpanjang Membership (+30 Hari)',
      message: `Perpanjang masa aktif untuk ${member.name} (${member.packageType}) selama 30 hari ke depan?`,
      confirmText: 'Ya, Perpanjang',
      confirmType: 'primary',
      onConfirm: () => {
        const updated = store.renewMember(id);
        if (updated) {
          playSuccess();
          toast.success(`Membership ${updated.name} berhasil diperpanjang hingga ${formatDate(updated.expiryDate)}!`, 'Perpanjangan Berhasil');
        }
      }
    });
  }

  function handleToggleFreeze(id) {
    const member = store.state.members.find(m => m.id === id);
    if (!member) return;

    const willFreeze = !member.isFrozen;
    modal.confirm({
      title: willFreeze ? 'Bekukan Membership (Freeze)' : 'Aktifkan Kembali Membership (Unfreeze)',
      message: willFreeze
        ? `Status member ${member.name} akan dibekukan (cuti). Selama cuti, member tidak dapat check-in di front desk.`
        : `Aktifkan kembali membership untuk ${member.name}? Member akan dapat melakukan check-in normal kembali.`,
      confirmText: willFreeze ? 'Ya, Bekukan Status' : 'Ya, Aktifkan Kembali',
      confirmType: willFreeze ? 'warning' : 'primary',
      onConfirm: () => {
        const updated = store.toggleFreezeMember(id);
        if (updated) {
          playClick();
          toast.info(`Status ${updated.name} sekarang: ${updated.isFrozen ? 'FROZEN (Cuti)' : 'NORMAL (Aktif)'}`, 'Status Diperbarui');
        }
      }
    });
  }

  function handleEdit(id) {
    const member = store.state.members.find(m => m.id === id);
    if (!member) return;

    modal.openMemberModal({
      member,
      isEdit: true,
      onSave: (updates) => {
        store.updateMember(id, updates);
        toast.success(`Data member ${updates.name} berhasil diperbarui.`);
      }
    });
  }

  function handleDelete(id) {
    const member = store.state.members.find(m => m.id === id);
    if (!member) return;

    modal.confirm({
      title: 'Hapus Member',
      message: `PERINGATAN: Apakah Anda yakin ingin menghapus data member "${member.name}" [${member.id}]? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus Member',
      confirmType: 'danger',
      onConfirm: () => {
        store.deleteMember(id);
        toast.warning(`Member ${member.name} telah dihapus.`);
      }
    });
  }

  function openDetails(id) {
    const member = store.state.members.find(m => m.id === id);
    if (!member) return;

    const status = store.getMemberStatus(member);
    const days = getDaysDifference(member.expiryDate);

    modal.openMemberDetailsModal({
      member,
      status,
      daysRemaining: days,
      onRenew: () => handleRenew(id),
      onToggleFreeze: () => handleToggleFreeze(id),
      onEdit: () => handleEdit(id),
      onDelete: () => handleDelete(id)
    });
  }

  // Shell HTML
  const html = `
    <div class="space-y-5">
      <!-- Top Header Controls -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-white tracking-tight">Direktori Member</h2>
            <span id="members-count-badge" class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              0 Member
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">Kelola keanggotaan, perpanjangan, dan status cuti member Be Fit Gym</p>
        </div>

        <div class="flex items-center gap-2.5">
          <button type="button" id="btn-export-csv" class="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm">
            <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Export CSV</span>
          </button>

          <button type="button" id="btn-add-member-top" class="px-4 py-2 text-xs font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-md shadow-lime-950/40 transition-all flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            <span>+ Member Baru</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="p-4 bg-[#111827] border border-[#1E293B] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <!-- Search Input -->
        <div class="relative flex-1">
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="member-search-input" value="${sanitizeHTML(currentSearchQuery)}" placeholder="Cari berdasarkan Nama, Member ID (BF-XXXX), atau WhatsApp..."
            class="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] text-white text-xs sm:text-sm rounded-lg pl-10 pr-4 py-2.5 transition-colors outline-none placeholder:text-slate-500" />
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Status Filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status:</label>
            <select id="filter-status-select" class="bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] text-white text-xs rounded-lg px-3 py-2.5 outline-none font-medium">
              <option value="All" ${currentFilterStatus === 'All' ? 'selected' : ''}>Semua Status</option>
              <option value="Active" ${currentFilterStatus === 'Active' ? 'selected' : ''}>Aktif</option>
              <option value="Expiring Soon" ${currentFilterStatus === 'Expiring Soon' ? 'selected' : ''}>Expiring Soon (≤7 Hari)</option>
              <option value="Frozen" ${currentFilterStatus === 'Frozen' ? 'selected' : ''}>Cuti / Frozen</option>
              <option value="Expired" ${currentFilterStatus === 'Expired' ? 'selected' : ''}>Expired</option>
            </select>
          </div>

          <!-- Package Filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Paket:</label>
            <select id="filter-package-select" class="bg-[#090D16] border border-[#1E293B] focus:border-[#A3E635] text-white text-xs rounded-lg px-3 py-2.5 outline-none font-medium">
              <option value="All" ${currentFilterPackage === 'All' ? 'selected' : ''}>Semua Paket</option>
              <option value="Basic" ${currentFilterPackage === 'Basic' ? 'selected' : ''}>Basic</option>
              <option value="Pro" ${currentFilterPackage === 'Pro' ? 'selected' : ''}>Pro</option>
              <option value="VIP" ${currentFilterPackage === 'VIP' ? 'selected' : ''}>VIP</option>
              <option value="PT Pack" ${currentFilterPackage === 'PT Pack' ? 'selected' : ''}>PT Pack</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#090D16]/80 border-b border-[#1E293B] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-3 px-4">Member Info</th>
                <th class="py-3 px-4">Kontak WhatsApp</th>
                <th class="py-3 px-4">Paket & Harga</th>
                <th class="py-3 px-4">Masa Berlaku</th>
                <th class="py-3 px-4">Status Membership</th>
                <th class="py-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody id="members-table-body" class="divide-y divide-[#1E293B]/40">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Search and filter listeners
  const searchInput = document.getElementById('member-search-input');
  searchInput?.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    updateTable();
  });

  document.getElementById('filter-status-select')?.addEventListener('change', (e) => {
    currentFilterStatus = e.target.value;
    updateTable();
  });

  document.getElementById('filter-package-select')?.addEventListener('change', (e) => {
    currentFilterPackage = e.target.value;
    updateTable();
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const listToExport = getFilteredMembers();
    exportMembersToCSV(listToExport, (m) => store.getMemberStatus(m));
    toast.info(`Berhasil mengekspor ${listToExport.length} data member ke file CSV.`, 'Export Selesai');
  });

  document.getElementById('btn-add-member-top')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('befit:open-add-member'));
  });

  // Initial table render
  updateTable();
}
