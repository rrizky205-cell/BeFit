/**
 * BE FIT GYM CRM - Analytics & Reports Module
 * MRR Breakdown by Package, Win Rate Conversion, Attendance Trends & Member Health
 */

import { store } from '../store.js';
import { formatRupiah, PACKAGE_PRICES } from '../utils.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { playClick, playSuccess } from '../audio.js';

export function renderAnalytics(container, router) {
  const members = store.state.members;
  const leads = store.state.leads;
  const checkInLogs = store.state.checkInLogs;
  const mrr = store.calculateMRR();

  // 1. Package Revenue Breakdown
  const packageStats = {
    'Basic': { count: 0, revenue: 0, color: '#94A3B8' },
    'Pro': { count: 0, revenue: 0, color: '#38BDF8' },
    'VIP': { count: 0, revenue: 0, color: '#FBBF24' },
    'PT Pack': { count: 0, revenue: 0, color: '#A3E635' }
  };

  members.forEach(m => {
    const status = store.getMemberStatus(m);
    if (status === 'Active' || status === 'Expiring Soon') {
      const pkg = m.packageType || 'Basic';
      if (packageStats[pkg]) {
        packageStats[pkg].count += 1;
        packageStats[pkg].revenue += PACKAGE_PRICES[pkg] || 0;
      }
    }
  });

  // 2. Member Retention Health
  const statusCounts = {
    Active: store.getMembersByStatus('Active').length,
    ExpiringSoon: store.getMembersByStatus('Expiring Soon').length,
    Frozen: store.getMembersByStatus('Frozen').length,
    Expired: store.getMembersByStatus('Expired').length
  };
  const totalMembers = members.length || 1;
  const activeRate = Math.round(((statusCounts.Active + statusCounts.ExpiringSoon) / totalMembers) * 100);

  // 3. Lead Conversion & Funnel
  const wonLeads = leads.filter(l => l.stage === 'won').length;
  const lostLeads = leads.filter(l => l.stage === 'lost').length;
  const closedTotal = wonLeads + lostLeads;
  const winRate = closedTotal > 0 ? Math.round((wonLeads / closedTotal) * 100) : 0;

  const funnelStages = [
    { label: 'New Inquiry', count: leads.filter(l => l.stage === 'new').length, color: 'bg-blue-500' },
    { label: 'Trial Booked', count: leads.filter(l => l.stage === 'trial').length, color: 'bg-cyan-500' },
    { label: 'Follow Up', count: leads.filter(l => l.stage === 'followup').length, color: 'bg-amber-500' },
    { label: 'Won (Closed)', count: wonLeads, color: 'bg-lime-500' },
    { label: 'Lost', count: lostLeads, color: 'bg-red-500' }
  ];

  const html = `
    <div class="space-y-6">
      <!-- Header with Reset Demo Data Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Analitik Bisnis & Laporan Performa</h2>
          <p class="text-xs text-slate-400 mt-0.5">Metrik finansial MRR, konversi penjualan prospek, dan kesehatan retensi member</p>
        </div>

        <button type="button" id="btn-reset-demo-data" class="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto">
          <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          <span>Reset Demo Data</span>
        </button>
      </div>

      <!-- High-Level Financial & Conversion Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Monthly Recurring Revenue</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-[#A3E635] font-mono tracking-tight">${formatRupiah(mrr)}</div>
          <p class="text-xs text-slate-400 mt-2">Dihitung hanya dari member aktif dan expiring soon (tidak termasuk cuti & expired).</p>
        </div>

        <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Lead Conversion Win Rate</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] font-mono tracking-tight">${winRate}%</div>
          <p class="text-xs text-slate-400 mt-2">${wonLeads} prospek berhasil dimenangkan dari ${closedTotal} prospek yang telah selesai dievaluasi.</p>
        </div>

        <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Rasio Retensi Member Aktif</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-lime-400 font-mono tracking-tight">${activeRate}%</div>
          <p class="text-xs text-slate-400 mt-2">${statusCounts.Active + statusCounts.ExpiringSoon} member aktif dari total ${totalMembers} database member.</p>
        </div>
      </div>

      <!-- Visual Breakdown Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Breakdown by Package Tier -->
        <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/20 text-[#A3E635] flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>
                </div>
                <h3 class="text-sm font-bold text-white">Distribusi Pendapatan per Paket</h3>
              </div>
              <span class="text-xs font-mono font-bold text-[#A3E635]">${formatRupiah(mrr)}</span>
            </div>

            <!-- Custom Horizontal Bars for Packages -->
            <div class="mt-5 space-y-4">
              ${Object.entries(packageStats).map(([pkgName, data]) => {
                const pkgPercentage = mrr > 0 ? Math.round((data.revenue / mrr) * 100) : 0;
                return `
                  <div>
                    <div class="flex items-center justify-between text-xs mb-1.5">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${data.color}"></span>
                        <span class="font-bold text-white">${pkgName}</span>
                        <span class="text-slate-400 font-mono">(${data.count} member)</span>
                      </div>
                      <div class="text-right font-mono">
                        <strong class="text-white">${formatRupiah(data.revenue)}</strong>
                        <span class="text-slate-400 ml-1">(${pkgPercentage}%)</span>
                      </div>
                    </div>
                    <div class="w-full bg-[#090D16] h-2.5 rounded-full overflow-hidden border border-[#1E293B]">
                      <div class="h-full rounded-full transition-all duration-700" style="width: ${pkgPercentage}%; background-color: ${data.color};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Paket PT Pack menyumbang pendapatan per kapita tertinggi.</span>
            <span class="text-[#A3E635] font-semibold font-mono">Be Fit Financials</span>
          </div>
        </div>

        <!-- Sales Funnel Pipeline Stage Distribution -->
        <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#38BDF8] flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 class="text-sm font-bold text-white">Sales Pipeline & Win-Loss Ratio</h3>
              </div>
              <span class="text-xs font-mono font-bold text-cyan-400">${leads.length} Total Leads</span>
            </div>

            <!-- Funnel Stages Graph -->
            <div class="mt-5 space-y-3.5">
              ${funnelStages.map(stage => {
                const totalLeadsCount = leads.length || 1;
                const percent = Math.round((stage.count / totalLeadsCount) * 100);

                return `
                  <div>
                    <div class="flex items-center justify-between text-xs mb-1">
                      <span class="font-bold text-slate-300">${stage.label}</span>
                      <span class="font-mono text-slate-300 font-semibold">${stage.count} Prospek (${percent}%)</span>
                    </div>
                    <div class="w-full bg-[#090D16] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                      <div class="h-full rounded-full transition-all duration-700 ${stage.color}" style="width: ${percent}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Rasio Konversi Efektif: <strong class="text-lime-400 font-mono">${winRate}%</strong></span>
            <span class="text-cyan-400 font-medium">Sales Pipeline Health</span>
          </div>
        </div>
      </div>

      <!-- Membership Health Status Distribution -->
      <div class="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
        <h3 class="text-sm font-bold text-white mb-4">Ringkasan Kesehatan Database Keanggotaan</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-3.5 bg-[#090D16] rounded-xl border border-lime-500/20">
            <span class="text-[11px] font-bold text-lime-400 uppercase tracking-wider block">Aktif Normal</span>
            <div class="text-2xl font-mono font-black text-white mt-1">${statusCounts.Active}</div>
            <span class="text-[11px] text-slate-400">Masa aktif &gt; 7 hari</span>
          </div>

          <div class="p-3.5 bg-[#090D16] rounded-xl border border-amber-500/20">
            <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Expiring Soon</span>
            <div class="text-2xl font-mono font-black text-amber-400 mt-1">${statusCounts.ExpiringSoon}</div>
            <span class="text-[11px] text-slate-400">Masa aktif 0 – 7 hari</span>
          </div>

          <div class="p-3.5 bg-[#090D16] rounded-xl border border-cyan-500/20">
            <span class="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Cuti / Frozen</span>
            <div class="text-2xl font-mono font-black text-cyan-400 mt-1">${statusCounts.Frozen}</div>
            <span class="text-[11px] text-slate-400">Tidak dapat check-in</span>
          </div>

          <div class="p-3.5 bg-[#090D16] rounded-xl border border-red-500/20">
            <span class="text-[11px] font-bold text-red-400 uppercase tracking-wider block">Expired / Lost</span>
            <div class="text-2xl font-mono font-black text-red-400 mt-1">${statusCounts.Expired}</div>
            <span class="text-[11px] text-slate-400">Target win-back campaign</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Reset Demo Data Event Handler
  document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
    modal.confirm({
      title: 'Reset Demo Data',
      message: 'PERINGATAN: Tindakan ini akan mengembalikan data awal simulasi (member, leads, jadwal kelas, dan log kehadiran). Apakah Anda ingin melanjutkan?',
      confirmText: 'Ya, Kembalikan Data Demo',
      confirmType: 'danger',
      onConfirm: () => {
        store.resetDemoData();
        playSuccess();
        toast.info('Data demo telah berhasil di-reset ke kondisi awal.', 'Reset Berhasil');
        renderAnalytics(container, router);
      }
    });
  });
}
