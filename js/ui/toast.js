/**
 * BE FIT GYM CRM - Custom Toast Notification Engine
 * High contrast Athletic Dark UI toasts with auto-dismiss and icons.
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show({ type = 'info', title, message, duration = 4000 }) {
    this.init();

    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'pointer-events-auto transform transition-all duration-300 ease-out translate-y-3 opacity-0 flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md';

    let iconSvg = '';
    let borderClass = '';
    let bgClass = 'bg-[#111827]/95';
    let accentColor = '#38BDF8';

    switch (type) {
      case 'success':
        accentColor = '#A3E635';
        borderClass = 'border-lime-500/40 shadow-lime-950/30';
        iconSvg = `<svg class="w-5 h-5 text-lime-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        break;
      case 'error':
        accentColor = '#EF4444';
        borderClass = 'border-red-500/40 shadow-red-950/30';
        iconSvg = `<svg class="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        break;
      case 'warning':
        accentColor = '#F59E0B';
        borderClass = 'border-amber-500/40 shadow-amber-950/30';
        iconSvg = `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
        break;
      case 'info':
      default:
        accentColor = '#38BDF8';
        borderClass = 'border-cyan-500/40 shadow-cyan-950/30';
        iconSvg = `<svg class="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        break;
    }

    toast.className += ` ${bgClass} ${borderClass}`;

    toast.innerHTML = `
      <div class="mt-0.5">${iconSvg}</div>
      <div class="flex-1 min-w-0 pr-1">
        ${title ? `<h4 class="text-xs font-bold uppercase tracking-wider text-white mb-0.5">${title}</h4>` : ''}
        <p class="text-sm text-slate-300 leading-snug break-words">${message}</p>
      </div>
      <button type="button" class="close-btn text-slate-500 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div class="absolute bottom-0 left-0 h-[2px] rounded-b-xl transition-all linear" style="background-color: ${accentColor}; width: 100%; transition-duration: ${duration}ms;"></div>
    `;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      
      const bar = toast.querySelector('div:last-child');
      if (bar) {
        requestAnimationFrame(() => {
          bar.style.width = '0%';
        });
      }
    });

    const removeToast = () => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    const closeBtn = toast.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', removeToast);
    }

    const timer = setTimeout(removeToast, duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () => setTimeout(removeToast, 2000));
  }

  success(message, title = 'Sukses') {
    this.show({ type: 'success', title, message });
  }

  error(message, title = 'Terjadi Kesalahan') {
    this.show({ type: 'error', title, message, duration: 5500 });
  }

  warning(message, title = 'Perhatian') {
    this.show({ type: 'warning', title, message, duration: 5000 });
  }

  info(message, title = 'Informasi') {
    this.show({ type: 'info', title, message });
  }
}

export const toast = new ToastManager();
