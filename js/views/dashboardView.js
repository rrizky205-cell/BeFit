/**
 * BE FIT GYM CRM - Executive Dashboard Module
 * Real-time KPIs, Retention Alert Banner, Quick Check-ins & Class Schedule Overview
 */

import { store } from '../store.js';
import { formatRupiah, formatTime, STATUS_CONFIG, PACKAGE_PRICES } from '../utils.js';

export function renderDashboard(container, router) {
  const activeMembersCount = store.getActiveMembersCount();
  const mrr = store.calculateMRR();
  const todayCheckIns = store.getTodayCheckIns();
  const expiringSoonMembers = store.getExpiringSoonMembers();
  const recentLogs = store.state.checkInLogs.slice(0, 5);
  const classes = store.state.classes;

  const html = `
    <div class="space-y-6">
      <!-- Retention Alert Banner -->
      ${expiringSoonMembers.length > 0 ? `
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">Retention Alert: ${expiringSoonMembers.length} Member Expiring Soon!</h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Action Needed</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 mt-0.5">Terdapat ${expiringSoonMembers.length} member dengan sisa masa aktif $\\le 7$ hari. Segera hubungi via WhatsApp untuk menjaga retensi.</p>
            </div>
          </div>
          <button type="button" id="btn-view-retention" class="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 shrink-0">
            <span>Lihat Member (${expiringSoonMembers.length})</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      ` : ''}

      <!-- KPI Summary Cards Row (4 Columns Desktop, 2 Tablet, 1 Mobile) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <!-- KPI 1: Active Members -->
        <div class="kpi-card bg-[#111827] border border-[#1E293B] rounded-xl p-5 hover:border-lime-500/40 transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Active Members</span>
            <div class="w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-[#A3E635] group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-3xl font-extrabold text-white font-mono tracking-tight">${activeMembersCount}</div>
            <div class="mt-1 flex items-center gap-1.5 text-xs text-lime-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              <span>Status Aktif & Expiring Soon</span>
            </div>
          </div>
        </div>

        <!-- KPI 2: Estimated MRR -->
        <div class="kpi-card bg-[#111827] border border-[#1E293B] rounded-xl p-5 hover:border-lime-500/40 transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated MRR</span>
            <div class="w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-[#A3E635] group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#A3E635] font-mono tracking-tight">${formatRupiah(mrr)}</div>
            <div class="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <span>Dari ${activeMembersCount} paket aktif bulanan</span>
            </div>
          </div>
        </div>

        <!-- KPI 3: Today's Check-Ins -->
        <div class="kpi-card bg-[#111827] border border-[#1E293B] rounded-xl p-5 hover:border-cyan-500/40 transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Check-Ins</span>
            <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-3xl font-extrabold text-white font-mono tracking-tight">${todayCheckIns.length}</div>
            <div class="mt-1 flex items-center gap-1.5 text-xs text-cyan-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <span>Kunjungan Front Desk Hari Ini</span>
            </div>
          </div>
        </div>

        <!-- KPI 4: Expiring Soon -->
        <div class="kpi-card bg-[#111827] border border-[#1E293B] rounded-xl p-5 hover:border-amber-500/40 transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Expiring Soon (≤ 7 Hari)</span>
            <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#FBBF24] group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-3xl font-extrabold text-[#FBBF24] font-mono tracking-tight">${expiringSoonMembers.length}</div>
            <div class="mt-1 flex items-center gap-1.5 text-xs text-amber-400">
              <span>Perlu follow up renewal segera</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Shortcuts Bar -->
      <div class="p-4 bg-[#111827] border border-[#1E293B] rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping"></span>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Front Desk & CRM Quick Actions</span>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <button type="button" id="btn-quick-checkin-action" class="px-4 py-2 text-xs font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-md shadow-lime-950/40 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Kiosk Check-In Gate</span>
          </button>
          <button type="button" id="btn-add-member-action" class="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            <span>+ Tambah Member</span>
          </button>
          <button type="button" id="btn-add-lead-action" class="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>+ Lead Prospek</span>
          </button>
        </div>
      </div>

      <!-- Two-Column Operational Activity Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Check-Ins Today -->
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/20 text-[#A3E635] flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white">5 Kunjungan Terakhir Hari Ini</h3>
                  <p class="text-xs text-slate-400">Log kehadiran Front Desk Gate</p>
                </div>
              </div>
              <button type="button" id="btn-goto-checkin" class="text-xs text-[#A3E635] hover:underline font-semibold">Buka Kiosk &rarr;</button>
            </div>

            <div class="mt-4 divide-y divide-[#1E293B]/60">
              ${recentLogs.length === 0 ? `
                <div class="py-8 text-center text-slate-500 text-sm">Belum ada aktivitas check-in tercatat hari ini.</div>
              ` : recentLogs.map(log => `
                <div class="py-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-lg bg-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      ${log.memberId.replace('BF-', '')}
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-semibold text-white truncate">${log.memberName}</h4>
                      <p class="text-xs text-slate-400 font-mono">${log.memberId} • ${log.packageType}</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-xs font-mono font-medium text-slate-300 block">${formatTime(log.timestamp)}</span>
                    ${log.wasExpiringSoon ? `
                      <span class="inline-block mt-0.5 text-[10px] text-amber-400 font-semibold uppercase">Expiring Soon</span>
                    ` : `
                      <span class="inline-block mt-0.5 text-[10px] text-lime-400 font-semibold uppercase">Active Gate</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#1E293B] text-xs text-slate-400 flex items-center justify-between">
            <span>Total Kunjungan Hari Ini: <strong class="text-white font-mono">${todayCheckIns.length}</strong></span>
            <span>Update otomatis secara real-time</span>
          </div>
        </div>

        <!-- Upcoming Classes Schedule Preview -->
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#38BDF8] flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white">Jadwal Kelas Gym Hari Ini</h3>
                  <p class="text-xs text-slate-400">Studio & sesi Personal Trainer</p>
                </div>
              </div>
              <button type="button" id="btn-goto-classes" class="text-xs text-[#38BDF8] hover:underline font-semibold">Semua Jadwal &rarr;</button>
            </div>

            <div class="mt-4 space-y-3">
              ${classes.map(c => {
                const booked = c.attendees ? c.attendees.length : 0;
                const percent = Math.min(100, Math.round((booked / c.capacity) * 100));
                const isFull = booked >= c.capacity;

                return `
                  <div class="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl hover:border-slate-700 transition-colors">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-bold text-white">${c.name}</h4>
                        <p class="text-xs text-slate-400">${c.coach} • <span class="text-cyan-400 font-mono">${c.scheduleTime}</span></p>
                      </div>
                      <span class="text-xs font-mono font-bold ${isFull ? 'text-red-400' : 'text-lime-400'}">
                        ${booked} / ${c.capacity}
                      </span>
                    </div>
                    <!-- Quota Progress Bar -->
                    <div class="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : percent > 75 ? 'bg-amber-400' : 'bg-[#A3E635]'}" style="width: ${percent}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#1E293B] text-xs text-slate-400 flex items-center justify-between">
            <span>Sistem reservasi divalidasi status aktif</span>
            <span class="text-cyan-400 font-medium">Be Fit Studio</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Event handlers
  document.getElementById('btn-view-retention')?.addEventListener('click', () => {
    router.navigate('members', { filterStatus: 'Expiring Soon' });
  });

  document.getElementById('btn-goto-checkin')?.addEventListener('click', () => {
    router.navigate('checkin');
  });

  document.getElementById('btn-quick-checkin-action')?.addEventListener('click', () => {
    router.navigate('checkin');
  });

  document.getElementById('btn-goto-classes')?.addEventListener('click', () => {
    router.navigate('classes');
  });

  document.getElementById('btn-add-member-action')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('befit:open-add-member'));
  });

  document.getElementById('btn-add-lead-action')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('befit:open-add-lead'));
  });
}
