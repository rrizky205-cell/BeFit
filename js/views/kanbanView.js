/**
 * BE FIT GYM CRM - Sales Funnel & Kanban Pipeline
 * 5 Stages: new -> trial -> followup -> won -> lost
 * Drag & Drop, Left/Right Mobile Controls, and 1-Click "Convert to Member"
 */

import { store } from '../store.js';
import { sanitizeHTML } from '../utils.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { playClick, playSuccess } from '../audio.js';

const STAGES = [
  { id: 'new', title: 'New Inquiry', color: 'border-blue-500/50', badge: 'bg-blue-500/10 text-blue-400' },
  { id: 'trial', title: 'Trial Booked', color: 'border-cyan-500/50', badge: 'bg-cyan-500/10 text-cyan-400' },
  { id: 'followup', title: 'Follow Up', color: 'border-amber-500/50', badge: 'bg-amber-500/10 text-amber-400' },
  { id: 'won', title: 'Won (Closed)', color: 'border-lime-500/50', badge: 'bg-lime-500/10 text-lime-400' },
  { id: 'lost', title: 'Lost', color: 'border-red-500/50', badge: 'bg-red-500/10 text-red-400' }
];

const SOURCE_ICONS = {
  'Walk-in': `<span class="text-[10px] uppercase font-bold text-slate-300">Walk-in</span>`,
  'Instagram': `<span class="text-[10px] uppercase font-bold text-pink-400">Instagram</span>`,
  'Referral': `<span class="text-[10px] uppercase font-bold text-emerald-400">Referral</span>`,
  'Website': `<span class="text-[10px] uppercase font-bold text-cyan-400">Website</span>`
};

export function renderKanban(container, router) {
  function updateBoard() {
    STAGES.forEach(stage => {
      const columnEl = document.getElementById(`kanban-col-${stage.id}`);
      const counterEl = document.getElementById(`kanban-count-${stage.id}`);
      if (!columnEl) return;

      const leadsInStage = store.state.leads.filter(l => l.stage === stage.id);
      if (counterEl) {
        counterEl.textContent = leadsInStage.length;
      }

      if (leadsInStage.length === 0) {
        columnEl.innerHTML = `
          <div class="h-32 flex flex-col items-center justify-center border border-dashed border-[#1E293B] rounded-xl text-slate-600 text-xs">
            <span>Tidak ada prospek</span>
          </div>
        `;
        return;
      }

      columnEl.innerHTML = leadsInStage.map(lead => {
        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
        const isWon = stage.id === 'won';
        const stageIndex = STAGES.findIndex(s => s.id === stage.id);
        const canMoveLeft = stageIndex > 0;
        const canMoveRight = stageIndex < STAGES.length - 1;

        return `
          <div class="kanban-card bg-[#111827] border border-[#1E293B] hover:border-slate-600 rounded-xl p-4 shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing group"
            draggable="true" data-id="${lead.id}">
            
            <!-- Header: Name & ID -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="text-sm font-bold text-white group-hover:text-[#A3E635] transition-colors">${sanitizeHTML(lead.name)}</h4>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[11px] font-mono font-semibold text-cyan-400">${lead.id}</span>
                  <span class="text-slate-600">•</span>
                  ${SOURCE_ICONS[lead.source] || `<span class="text-[10px] text-slate-400">${lead.source}</span>`}
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button type="button" class="btn-edit-lead text-slate-500 hover:text-white p-1 rounded transition-colors" data-id="${lead.id}" title="Edit Lead">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button type="button" class="btn-delete-lead text-slate-500 hover:text-red-400 p-1 rounded transition-colors" data-id="${lead.id}" title="Hapus Lead">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>

            <!-- Contact & Package Interest -->
            <div class="mt-3 flex items-center justify-between text-xs">
              <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-mono transition-colors">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span>${sanitizeHTML(lead.phone)}</span>
              </a>
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Minat: ${lead.packageInterest}
              </span>
            </div>

            ${lead.notes ? `
              <p class="mt-2.5 text-xs text-slate-400 bg-[#090D16] p-2 rounded-lg border border-[#1E293B] leading-relaxed line-clamp-2">
                ${sanitizeHTML(lead.notes)}
              </p>
            ` : ''}

            <!-- WON CTA: CONVERT TO MEMBER -->
            ${isWon ? `
              <div class="mt-3.5 pt-3 border-t border-[#1E293B]">
                <button type="button" class="btn-convert-lead w-full py-2 px-3 rounded-lg text-xs font-extrabold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] shadow-lg shadow-lime-950/40 transition-all flex items-center justify-center gap-1.5"
                  data-id="${lead.id}">
                  <svg class="w-4 h-4 text-[#090D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  <span>Register as Member</span>
                </button>
              </div>
            ` : ''}

            <!-- Stage Navigation Arrows (Touch friendly) -->
            <div class="mt-3 pt-2.5 border-t border-[#1E293B]/60 flex items-center justify-between text-xs text-slate-500">
              <button type="button" class="btn-move-left p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                data-id="${lead.id}" data-target="${canMoveLeft ? STAGES[stageIndex - 1].id : ''}" ${!canMoveLeft ? 'disabled' : ''} title="Pindah ke tahap sebelumnya">
                &larr; Prev
              </button>
              <span class="text-[10px] uppercase font-mono tracking-wider">${stage.title}</span>
              <button type="button" class="btn-move-right p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                data-id="${lead.id}" data-target="${canMoveRight ? STAGES[stageIndex + 1].id : ''}" ${!canMoveRight ? 'disabled' : ''} title="Pindah ke tahap berikutnya">
                Next &rarr;
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Attach card listeners
      columnEl.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
          card.classList.add('opacity-40');
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('opacity-40');
        });
      });

      // Quick move buttons
      columnEl.querySelectorAll('.btn-move-left, .btn-move-right').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const targetStage = btn.getAttribute('data-target');
          if (id && targetStage) {
            playClick();
            store.updateLeadStage(id, targetStage);
            toast.info(`Tahap prospek dipindahkan ke: ${STAGES.find(s => s.id === targetStage)?.title}`);
          }
        });
      });

      // Convert lead button
      columnEl.querySelectorAll('.btn-convert-lead').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          handleConvert(id);
        });
      });

      // Edit lead
      columnEl.querySelectorAll('.btn-edit-lead').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const lead = store.state.leads.find(l => l.id === id);
          if (lead) {
            modal.openLeadModal({
              lead,
              isEdit: true,
              onSave: (updates) => {
                const idx = store.state.leads.findIndex(l => l.id === id);
                if (idx !== -1) {
                  store.state.leads[idx] = { ...store.state.leads[idx], ...updates };
                  store.notify();
                  toast.success(`Data prospek ${updates.name} diperbarui.`);
                }
              }
            });
          }
        });
      });

      // Delete lead
      columnEl.querySelectorAll('.btn-delete-lead').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const lead = store.state.leads.find(l => l.id === id);
          if (lead) {
            modal.confirm({
              title: 'Hapus Lead Prospek',
              message: `Apakah Anda yakin ingin menghapus prospek ${lead.name}?`,
              confirmText: 'Hapus',
              confirmType: 'danger',
              onConfirm: () => {
                store.deleteLead(id);
                toast.warning(`Prospek ${lead.name} dihapus.`);
              }
            });
          }
        });
      });
    });
  }

  function handleConvert(leadId) {
    const lead = store.state.leads.find(l => l.id === leadId);
    if (!lead) return;

    // Open Member Form Modal pre-filled
    modal.openMemberModal({
      prefilledData: {
        name: lead.name,
        phone: lead.phone,
        packageType: lead.packageInterest,
        notes: `Sumber lead: ${lead.source}. ${lead.notes || ''}`
      },
      isEdit: false,
      onSave: (memberData) => {
        const newMember = store.convertLeadToMember(leadId, memberData);
        if (newMember) {
          playSuccess();
          toast.success(`Selamat! Prospek ${newMember.name} berhasil menjadi Member Resmi [${newMember.id}].`, 'Konversi Sukses!');
        }
      }
    });
  }

  const html = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Sales Funnel (Kanban Pipeline)</h2>
          <p class="text-xs text-slate-400 mt-0.5">Kelola konversi prospek dari Inquiry hingga Member Resmi</p>
        </div>

        <button type="button" id="btn-add-lead-top" class="px-4 py-2 text-xs font-bold bg-[#38BDF8] hover:bg-[#0284C7] text-[#090D16] rounded-lg shadow-md shadow-cyan-950/40 transition-all flex items-center gap-1.5 self-start sm:self-auto">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          <span>+ Tambah Prospek (Lead)</span>
        </button>
      </div>

      <!-- 5-Column Kanban Board -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        ${STAGES.map(stage => `
          <div class="bg-[#090D16] border border-[#1E293B] rounded-2xl p-3.5 flex flex-col min-w-[260px] shadow-lg">
            <!-- Stage Header -->
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-[#1E293B]">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full ${stage.id === 'won' ? 'bg-[#A3E635]' : stage.id === 'lost' ? 'bg-red-500' : 'bg-cyan-400'}"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-white">${stage.title}</h3>
              </div>
              <span id="kanban-count-${stage.id}" class="px-2 py-0.5 rounded-full text-xs font-mono font-bold ${stage.badge}">0</span>
            </div>

            <!-- Drop Zone / Cards List -->
            <div id="kanban-col-${stage.id}" class="kanban-dropzone space-y-3 min-h-[420px] transition-colors rounded-xl p-1" data-stage="${stage.id}">
              <!-- Dynamic Cards -->
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add Lead button
  document.getElementById('btn-add-lead-top')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('befit:open-add-lead'));
  });

  // Setup Drag and Drop on drop zones
  document.querySelectorAll('.kanban-dropzone').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('bg-slate-800/40', 'ring-2', 'ring-lime-500/40');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('bg-slate-800/40', 'ring-2', 'ring-lime-500/40');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('bg-slate-800/40', 'ring-2', 'ring-lime-500/40');
      const leadId = e.dataTransfer.getData('text/plain');
      const targetStage = zone.getAttribute('data-stage');

      if (leadId && targetStage) {
        playClick();
        store.updateLeadStage(leadId, targetStage);
        toast.info(`Status lead dipindahkan ke "${STAGES.find(s => s.id === targetStage)?.title}"`);
      }
    });
  });

  // Render cards
  updateBoard();
}
