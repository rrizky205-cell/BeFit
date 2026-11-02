/**
 * BE FIT GYM CRM - Front Desk Quick Check-In Station (Kiosk Mode)
 * Big 56px input, Dramatic Visual Verification Card, Web Audio Synthesizer,
 * Inline Renewal/Unfreeze shortcuts & Live Attendance Log.
 */

import { store } from '../store.js';
import {
  formatDate,
  formatTime,
  getDaysDifference,
  sanitizeHTML,
  getInitials,
  STATUS_CONFIG,
  PACKAGE_COLORS
} from '../utils.js';
import { playChime, playBuzzer, playSuccess } from '../audio.js';
import { toast } from '../ui/toast.js';

let lastVerificationResult = null; // { success, member, status, daysRemaining, message, reason }

export function renderCheckIn(container, router) {
  function updateLogsTable() {
    const tbody = document.getElementById('checkin-history-body');
    const countEl = document.getElementById('today-checkin-count');
    const todayLogs = store.getTodayCheckIns();

    if (countEl) {
      countEl.textContent = `${todayLogs.length} Kunjungan Hari Ini`;
    }

    if (!tbody) return;

    if (todayLogs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-slate-500 text-xs">
            Belum ada log kehadiran yang tercatat hari ini.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = todayLogs.map(log => {
      const pkgColors = PACKAGE_COLORS[log.packageType] || PACKAGE_COLORS.Basic;
      return `
        <tr class="hover:bg-slate-800/40 transition-colors border-b border-[#1E293B]/40">
          <td class="py-3 px-4 text-xs font-mono font-bold text-white">
            ${formatTime(log.timestamp)}
          </td>
          <td class="py-3 px-4">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-slate-800 text-lime-400 font-mono text-[11px] font-bold flex items-center justify-center">
                ${log.memberId.replace('BF-', '')}
              </span>
              <div>
                <span class="text-xs font-bold text-white block">${sanitizeHTML(log.memberName)}</span>
                <span class="text-[10px] text-slate-400 font-mono">${log.memberId}</span>
              </div>
            </div>
          </td>
          <td class="py-3 px-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${pkgColors.bg} ${pkgColors.text} border ${pkgColors.border}">
              ${log.packageType}
            </span>
          </td>
          <td class="py-3 px-4">
            ${log.wasExpiringSoon ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Expiring Soon
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Pass
              </span>
            `}
          </td>
          <td class="py-3 px-4 text-right">
            <span class="text-[11px] font-mono text-slate-400">Gate Verified</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderVerificationCard(result) {
    const cardEl = document.getElementById('verification-card-container');
    if (!cardEl) return;

    if (!result) {
      cardEl.innerHTML = `
        <div class="p-8 border-2 border-dashed border-[#1E293B] rounded-2xl flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0a8.003 8.003 0 0115.357-2"/></svg>
          </div>
          <h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider">Gate Verifikasi Standby</h4>
          <p class="text-xs text-slate-500 max-w-sm mt-1">Ketik ID Member (contoh: BF-1001) atau nama, lalu tekan Enter atau klik tombol Check-In.</p>
        </div>
      `;
      return;
    }

    const { success, member, status, daysRemaining, message, reason } = result;

    if (success) {
      // ACCESS GRANTED
      const isExpiringSoon = status === 'Expiring Soon';

      cardEl.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] via-[#0b1b11] to-[#090D16] border-2 border-lime-400 p-6 sm:p-7 shadow-2xl shadow-lime-950/50 animate-pulse-subtle">
          <!-- Ambient Glow Bar -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-400 via-emerald-400 to-[#A3E635]"></div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-lime-400/20 border-2 border-lime-400 flex items-center justify-center text-lime-400 shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-2.5">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-lime-400 text-slate-950 font-mono">
                    ACCESS GRANTED
                  </span>
                  <span class="text-xs font-mono font-bold text-lime-400">${member.id}</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">${sanitizeHTML(member.name)}</h3>
                <p class="text-xs text-slate-300 font-mono mt-0.5">Paket: <strong class="text-white">${member.packageType}</strong> • Exp: ${formatDate(member.expiryDate)} (${daysRemaining} hari)</p>
              </div>
            </div>

            <div class="text-right self-stretch sm:self-auto flex flex-col justify-center items-end bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Waktu Masuk:</span>
              <span class="text-sm font-mono font-bold text-white">${formatTime(new Date())}</span>
              <span class="text-[11px] text-lime-400 mt-0.5 font-semibold">Tercatat di Log Kehadiran</span>
            </div>
          </div>

          <!-- Expiring Soon Notice if applicable -->
          ${isExpiringSoon ? `
            <div class="mt-5 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div class="flex-1 text-xs">
                <strong class="font-bold text-amber-300 uppercase tracking-wider block">Peringatan Front Desk: Sisa Masa Aktif $\\le 7$ Hari!</strong>
                <p class="text-slate-200 mt-0.5">Membership member ini akan berakhir dalam <strong class="text-amber-300">${daysRemaining} hari</strong>. Tawarkan perpanjangan membership sekarang juga.</p>
              </div>
              <button type="button" id="btn-quick-renew-kiosk" class="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shrink-0">
                Renew (+30 Hari)
              </button>
            </div>
          ` : `
            <div class="mt-4 text-xs text-lime-400/90 font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
              <span>${sanitizeHTML(message)}</span>
            </div>
          `}
        </div>
      `;

      document.getElementById('btn-quick-renew-kiosk')?.addEventListener('click', () => {
        store.renewMember(member.id);
        playSuccess();
        toast.success(`Membership ${member.name} berhasil diperpanjang 30 hari.`);
        performCheckIn(member.id);
      });

    } else {
      // ACCESS DENIED
      const isFrozen = status === 'Frozen';
      const isExpired = status === 'Expired';

      cardEl.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] via-[#210c0e] to-[#090D16] border-2 border-red-500 p-6 sm:p-7 shadow-2xl shadow-red-950/60 animate-shake">
          <!-- Ambient Glow Bar -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-2.5">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-500 text-white font-mono">
                    ACCESS DENIED
                  </span>
                  ${member ? `<span class="text-xs font-mono font-bold text-red-400">${member.id}</span>` : ''}
                </div>
                <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  ${member ? sanitizeHTML(member.name) : 'Akses Ditolak'}
                </h3>
                <p class="text-xs text-red-300 mt-1 font-medium">${sanitizeHTML(reason)}</p>
              </div>
            </div>

            <!-- Instant Resolution CTA Buttons -->
            ${member ? `
              <div class="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                ${isExpired ? `
                  <button type="button" id="btn-fix-renew" class="px-4 py-2.5 text-xs font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <span>Renew Now (+30 Hari)</span>
                  </button>
                ` : ''}

                ${isFrozen ? `
                  <button type="button" id="btn-fix-unfreeze" class="px-4 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-[#090D16] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    <span>Unfreeze Member Sekarang</span>
                  </button>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      if (member) {
        document.getElementById('btn-fix-renew')?.addEventListener('click', () => {
          store.renewMember(member.id);
          playSuccess();
          toast.success(`Membership ${member.name} berhasil diperpanjang.`);
          performCheckIn(member.id);
        });

        document.getElementById('btn-fix-unfreeze')?.addEventListener('click', () => {
          store.toggleFreezeMember(member.id);
          playSuccess();
          toast.success(`Status ${member.name} berhasil di-unfreeze.`);
          performCheckIn(member.id);
        });
      }
    }
  }

  function performCheckIn(query) {
    const result = store.checkInMember(query);
    lastVerificationResult = result;

    if (result.success) {
      playChime();
      toast.success(result.message, 'Akses Diterima');
    } else {
      playBuzzer();
      toast.error(result.reason, 'Akses Ditolak');
    }

    renderVerificationCard(result);
    updateLogsTable();

    // Clear input
    const input = document.getElementById('kiosk-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  const html = `
    <div class="space-y-6 max-w-5xl mx-auto">
      <!-- Kiosk Header -->
      <div class="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full bg-[#A3E635] animate-ping"></div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">Front Desk Check-In Station</h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Gerbang verifikasi kehadiran member real-time (Kiosk Mode)</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-lime-400 border border-slate-700">
          KIOSK GATE ONLINE
        </span>
      </div>

      <!-- Kiosk Big Input Field (56px Height) -->
      <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-2xl">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Pindai Kartu / Masukkan Member ID atau Nama:
        </label>
        
        <form id="kiosk-form" class="relative flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <svg class="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
            <input type="text" id="kiosk-search-input" autofocus autocomplete="off"
              placeholder="Ketik ID (BF-1001) atau nama member..."
              class="w-full h-14 bg-[#090D16] border-2 border-[#1E293B] focus:border-[#A3E635] text-white text-base sm:text-lg font-mono rounded-xl pl-12 pr-4 outline-none transition-all placeholder:text-slate-600 shadow-inner" />
          </div>

          <button type="submit" class="h-14 px-8 bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] text-base font-extrabold rounded-xl shadow-lg shadow-lime-950/40 transition-all flex items-center justify-center gap-2 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Verifikasi Check-In</span>
          </button>
        </form>

        <!-- Quick Pick Suggestions -->
        <div class="mt-4 pt-3.5 border-t border-[#1E293B] flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400 font-semibold mr-1">Uji Cepat Simulasi:</span>
          ${store.state.members.slice(0, 5).map(m => {
            const s = store.getMemberStatus(m);
            let color = 'text-lime-400 border-lime-800/60 bg-lime-950/30';
            if (s === 'Expiring Soon') color = 'text-amber-400 border-amber-800/60 bg-amber-950/30';
            if (s === 'Frozen') color = 'text-cyan-400 border-cyan-800/60 bg-cyan-950/30';
            if (s === 'Expired') color = 'text-red-400 border-red-800/60 bg-red-950/30';

            return `
              <button type="button" class="btn-quick-member-pick px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors hover:brightness-125 ${color}"
                data-id="${m.id}" title="${m.name} (${s})">
                ${m.id} (${s})
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Dramatic Visual Verification Card Container -->
      <div id="verification-card-container">
        <!-- Rendered dynamically -->
      </div>

      <!-- Live Attendance Log Today -->
      <div class="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
        <div class="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#38BDF8] flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Log Kehadiran Hari Ini (Live Attendance)</h3>
              <p class="text-xs text-slate-400">Riwayat akses masuk member melalui gerbang front desk</p>
            </div>
          </div>
          <span id="today-checkin-count" class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
            0 Kunjungan Hari Ini
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#090D16]/60 border-b border-[#1E293B] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-3 px-4">Waktu</th>
                <th class="py-3 px-4">Member Info</th>
                <th class="py-3 px-4">Paket</th>
                <th class="py-3 px-4">Status Verifikasi</th>
                <th class="py-3 px-4 text-right">Otoritas</th>
              </tr>
            </thead>
            <tbody id="checkin-history-body" class="divide-y divide-[#1E293B]/40">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Form submit
  document.getElementById('kiosk-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('kiosk-search-input');
    if (input && input.value.trim()) {
      performCheckIn(input.value.trim());
    }
  });

  // Quick pick buttons
  document.querySelectorAll('.btn-quick-member-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) {
        performCheckIn(id);
      }
    });
  });

  // Initial render
  renderVerificationCard(lastVerificationResult);
  updateLogsTable();
}
