/**
 * BE FIT GYM CRM - Main Application Controller & Router
 * Reactive navigation, Shell UI, Global search & shortcuts
 */

import { store } from './store.js';
import { renderDashboard } from './views/dashboardView.js';
import { renderMembers } from './views/membersView.js';
import { renderKanban } from './views/kanbanView.js';
import { renderCheckIn } from './views/checkInView.js';
import { renderClasses } from './views/classesView.js';
import { renderAnalytics } from './views/analyticsView.js';
import { toast } from './ui/toast.js';
import { modal } from './ui/modal.js';
import { playClick, playSuccess } from './audio.js';

class AppRouter {
  constructor() {
    this.currentPage = 'dashboard';
    this.mainContainer = document.getElementById('main-workspace');
    this.pageTitleEl = document.getElementById('top-page-title');
    this.pageSubtitleEl = document.getElementById('top-page-subtitle');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.routeOptions = {};

    this.init();
  }

  init() {
    // Navigation item clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        if (targetPage) {
          playClick();
          this.navigate(targetPage);
          this.closeMobileSidebar();
        }
      });
    });

    // Top Header Buttons
    document.getElementById('header-btn-checkin')?.addEventListener('click', () => {
      playClick();
      this.navigate('checkin');
    });

    document.getElementById('header-btn-add-action')?.addEventListener('click', () => {
      playClick();
      this.openAddDropdown();
    });

    // Mobile Hamburger
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    hamburgerBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('-translate-x-full');
      backdrop?.classList.toggle('hidden');
    });

    backdrop?.addEventListener('click', () => {
      this.closeMobileSidebar();
    });

    // Global Search Bar in Header
    const globalSearchInput = document.getElementById('global-search-input');
    globalSearchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = globalSearchInput.value.trim();
        if (val) {
          playClick();
          this.navigate('members', { searchQuery: val });
        }
      }
    });

    // Custom events for opening modals from anywhere
    window.addEventListener('befit:open-add-member', () => {
      modal.openMemberModal({
        isEdit: false,
        onSave: (data) => {
          const newM = store.addMember(data);
          playSuccess();
          toast.success(`Member baru ${newM.name} [${newM.id}] berhasil ditambahkan!`, 'Pendaftaran Berhasil');
        }
      });
    });

    window.addEventListener('befit:open-add-lead', () => {
      modal.openLeadModal({
        isEdit: false,
        onSave: (data) => {
          const newL = store.addLead(data);
          playSuccess();
          toast.success(`Prospek ${newL.name} [${newL.id}] berhasil ditambahkan ke pipeline.`, 'Lead Disimpan');
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Focus global search when pressing '/' outside inputs
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        globalSearchInput?.focus();
      }
    });

    // Reactive subscription to state changes
    store.subscribe(() => {
      this.updateSidebarBadges();
      // Re-render current page smoothly
      this.renderCurrentView();
    });

    // Initial render
    this.updateSidebarBadges();
    this.navigate('dashboard');
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    sidebar?.classList.add('-translate-x-full');
    backdrop?.classList.add('hidden');
  }

  updateSidebarBadges() {
    const expiringCount = store.getExpiringSoonMembers().length;
    const badgeExpiring = document.getElementById('nav-badge-expiring');
    if (badgeExpiring) {
      if (expiringCount > 0) {
        badgeExpiring.textContent = expiringCount;
        badgeExpiring.classList.remove('hidden');
      } else {
        badgeExpiring.classList.add('hidden');
      }
    }

    const leadsCount = store.state.leads.filter(l => l.stage !== 'lost').length;
    const badgeLeads = document.getElementById('nav-badge-leads');
    if (badgeLeads) {
      badgeLeads.textContent = leadsCount;
    }
  }

  openAddDropdown() {
    modal.openMemberModal({
      isEdit: false,
      onSave: (data) => {
        const newM = store.addMember(data);
        playSuccess();
        toast.success(`Member baru ${newM.name} [${newM.id}] berhasil didaftarkan!`);
      }
    });
  }

  navigate(page, options = {}) {
    this.currentPage = page;
    this.routeOptions = options;

    // Update active nav link classes
    this.navLinks.forEach(link => {
      const pageAttr = link.getAttribute('data-page');
      const activeBar = link.querySelector('.nav-active-bar');

      if (pageAttr === page) {
        link.classList.add('bg-slate-800/80', 'text-white', 'font-semibold');
        link.classList.remove('text-slate-400');
        if (activeBar) activeBar.classList.remove('hidden');
      } else {
        link.classList.remove('bg-slate-800/80', 'text-white', 'font-semibold');
        link.classList.add('text-slate-400');
        if (activeBar) activeBar.classList.add('hidden');
      }
    });

    // Update Top Header Titles
    const titles = {
      'dashboard': { title: 'Executive Dashboard', subtitle: 'Overview performa finansial, kehadiran, & retensi gym' },
      'members': { title: 'Member Directory', subtitle: 'Manajemen basis data keanggotaan, paket, & status aktif' },
      'kanban': { title: 'Sales Funnel (Kanban)', subtitle: 'Pipeline prospek calon member dan konversi pendaftaran' },
      'checkin': { title: 'Front Desk Quick Check-In', subtitle: 'Kiosk verifikasi akses masuk member & live attendance' },
      'classes': { title: 'Class & PT Schedule', subtitle: 'Jadwal studio grup & sesi reservasi Personal Trainer' },
      'analytics': { title: 'Analytics & Reports', subtitle: 'Laporan pendapatan MRR, efektivitas funnel, & log performa' }
    };

    const cur = titles[page] || titles.dashboard;
    if (this.pageTitleEl) this.pageTitleEl.textContent = cur.title;
    if (this.pageSubtitleEl) this.pageSubtitleEl.textContent = cur.subtitle;

    this.renderCurrentView();

    // Scroll workspace back to top
    if (this.mainContainer) {
      this.mainContainer.scrollTop = 0;
    }
  }

  renderCurrentView() {
    if (!this.mainContainer) return;

    switch (this.currentPage) {
      case 'dashboard':
        renderDashboard(this.mainContainer, this);
        break;
      case 'members':
        renderMembers(this.mainContainer, this, this.routeOptions);
        break;
      case 'kanban':
        renderKanban(this.mainContainer, this);
        break;
      case 'checkin':
        renderCheckIn(this.mainContainer, this);
        break;
      case 'classes':
        renderClasses(this.mainContainer, this);
        break;
      case 'analytics':
        renderAnalytics(this.mainContainer, this);
        break;
      default:
        renderDashboard(this.mainContainer, this);
    }
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.appRouter = new AppRouter();
});
