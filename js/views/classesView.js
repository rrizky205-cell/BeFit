/**
 * BE FIT GYM CRM - Class & Personal Trainer (PT) Schedule Module
 * Quota validation, prevent double booking, studio room management & member enrollments
 */

import { store } from '../store.js';
import { sanitizeHTML, getInitials } from '../utils.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { playClick, playSuccess } from '../audio.js';

export function renderClasses(container, router) {
  function updateSchedule() {
    const listContainer = document.getElementById('classes-cards-container');
    if (!listContainer) return;

    const classes = store.state.classes;
    const members = store.state.members;

    if (classes.length === 0) {
      listContainer.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 border border-dashed border-[#1E293B] rounded-2xl">
          <p class="text-sm">Belum ada kelas atau sesi PT yang dijadwalkan.</p>
          <button type="button" id="btn-add-first-class" class="mt-3 px-4 py-2 text-xs font-bold bg-[#A3E635] text-[#090D16] rounded-lg">
            + Buat Kelas Pertama
          </button>
        </div>
      `;
      document.getElementById('btn-add-first-class')?.addEventListener('click', () => {
        openAddClass();
      });
      return;
    }

    listContainer.innerHTML = classes.map(classItem => {
      const attendees = classItem.attendees || [];
      const bookedCount = attendees.length;
      const capacity = classItem.capacity || 12;
      const percent = Math.min(100, Math.round((bookedCount / capacity) * 100));
      const isFull = bookedCount >= capacity;
      const available = capacity - bookedCount;

      return `
        <div class="bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group">
          <div>
            <!-- Header: Class Name, Time & Room -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 mb-1.5">
                  ${classItem.scheduleTime}
                </span>
                <h3 class="text-lg font-bold text-white group-hover:text-[#A3E635] transition-colors tracking-tight">
                  ${sanitizeHTML(classItem.name)}
                </h3>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${isFull ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-lime-500/20 text-lime-400 border border-lime-500/30'}">
                ${isFull ? 'PENUH' : `${available} Kursi Sisa`}
              </span>
            </div>

            <!-- Coach & Studio -->
            <div class="mt-3 flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-[#1E293B]">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span class="font-semibold text-slate-300">${sanitizeHTML(classItem.coach)}</span>
              </div>
              <span class="font-mono text-slate-400">${classItem.room || 'Studio Utama'}</span>
            </div>

            <!-- Capacity Progress Bar -->
            <div class="mt-4">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="text-slate-400 font-medium">Kapasitas Peserta:</span>
                <span class="font-mono font-bold ${isFull ? 'text-red-400' : 'text-white'}">
                  ${bookedCount} / ${capacity} Orang
                </span>
              </div>
              <div class="w-full bg-[#090D16] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                <div class="h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : percent > 80 ? 'bg-amber-400' : 'bg-[#A3E635]'}"
                  style="width: ${percent}%;"></div>
              </div>
            </div>

            <!-- Enrolled Attendees List -->
            <div class="mt-4 pt-3 border-t border-[#1E293B]/60">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Daftar Peserta Terdaftar (${bookedCount})
              </span>
              <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                ${attendees.length === 0 ? `
                  <p class="text-xs text-slate-500 italic py-1">Belum ada member terdaftar di sesi ini.</p>
                ` : attendees.map(memberId => {
                  const m = members.find(mem => mem.id === memberId);
                  const name = m ? m.name : memberId;

                  return `
                    <div class="flex items-center justify-between py-1 px-2 rounded-lg bg-[#090D16]/60 border border-[#1E293B]/60 text-xs">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                          ${m ? getInitials(m.name) : 'ID'}
                        </span>
                        <span class="text-slate-200 font-medium truncate">${sanitizeHTML(name)}</span>
                      </div>
                      <button type="button" class="btn-cancel-attendee text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                        data-class-id="${classItem.id}" data-member-id="${memberId}" title="Batalkan Reservasi">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Bottom Booking Action Button -->
          <div class="mt-5 pt-3.5 border-t border-[#1E293B]">
            <button type="button" class="btn-book-class w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isFull ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] shadow-md shadow-lime-950/40'}"
              data-id="${classItem.id}" ${isFull ? 'disabled' : ''}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>${isFull ? 'Kelas Sudah Penuh' : '+ Reservasi Member'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach booking button events
    listContainer.querySelectorAll('.btn-book-class').forEach(btn => {
      btn.addEventListener('click', () => {
        const classId = btn.getAttribute('data-id');
        openBookingModal(classId);
      });
    });

    // Cancel attendee button events
    listContainer.querySelectorAll('.btn-cancel-attendee').forEach(btn => {
      btn.addEventListener('click', () => {
        const classId = btn.getAttribute('data-class-id');
        const memberId = btn.getAttribute('data-member-id');
        handleCancelBooking(classId, memberId);
      });
    });
  }

  function openBookingModal(classId) {
    const classItem = store.state.classes.find(c => c.id === classId);
    if (!classItem) return;

    modal.openClassBookingModal({
      classItem,
      members: store.state.members,
      getStatusFn: (m) => store.getMemberStatus(m),
      onBook: (memberId) => {
        const result = store.bookClass(classId, memberId);
        if (result.success) {
          playSuccess();
          toast.success(result.message, 'Reservasi Berhasil');
        } else {
          toast.error(result.reason, 'Gagal Reservasi');
        }
      }
    });
  }

  function handleCancelBooking(classId, memberId) {
    const classItem = store.state.classes.find(c => c.id === classId);
    const member = store.state.members.find(m => m.id === memberId);
    const memberName = member ? member.name : memberId;

    modal.confirm({
      title: 'Batalkan Reservasi Kelas',
      message: `Apakah Anda yakin ingin membatalkan kehadiran ${memberName} dari kelas ${classItem?.name || ''}? Kuota peserta akan kembali bertambah 1.`,
      confirmText: 'Ya, Batalkan',
      confirmType: 'warning',
      onConfirm: () => {
        store.cancelClassBooking(classId, memberId);
        playClick();
        toast.info(`Reservasi ${memberName} telah dibatalkan.`);
      }
    });
  }

  function openAddClass() {
    modal.openAddClassModal({
      onSave: (classData) => {
        store.addClass(classData);
        playSuccess();
        toast.success(`Jadwal kelas "${classData.name}" berhasil ditambahkan.`);
      }
    });
  }

  const html = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Jadwal Kelas & Personal Trainer</h2>
          <p class="text-xs text-slate-400 mt-0.5">Kelola kuota, sesi latihan kelompok, dan pemesanan kelas member</p>
        </div>

        <button type="button" id="btn-add-class-top" class="px-4 py-2 text-xs font-bold bg-[#A3E635] hover:bg-[#8ece28] text-[#090D16] rounded-lg shadow-md shadow-lime-950/40 transition-all flex items-center gap-1.5 self-start sm:self-auto">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          <span>+ Tambah Jadwal Kelas</span>
        </button>
      </div>

      <!-- Class Cards Grid -->
      <div id="classes-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('btn-add-class-top')?.addEventListener('click', openAddClass);

  updateSchedule();
}
