/**
 * BE FIT GYM CRM - Utility Functions
 * Localization, Date Math, Formatting, XSS Sanitization & CSV Export
 */

export const PACKAGE_PRICES = {
  'Basic': 350000,
  'Pro': 550000,
  'VIP': 850000,
  'PT Pack': 1500000
};

export const PACKAGE_COLORS = {
  'Basic': { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  'Pro': { bg: 'bg-blue-950/60', text: 'text-cyan-400', border: 'border-cyan-800/60' },
  'VIP': { bg: 'bg-amber-950/50', text: 'text-amber-400', border: 'border-amber-700/60' },
  'PT Pack': { bg: 'bg-lime-950/50', text: 'text-lime-400', border: 'border-lime-700/60' }
};

export const STATUS_CONFIG = {
  'Active': {
    label: 'Aktif',
    textColor: '#4ADE80',
    bgColor: 'rgba(74, 222, 128, 0.12)',
    borderColor: '#22C55E',
    badgeClass: 'status-badge-active'
  },
  'Expiring Soon': {
    label: 'Expiring Soon',
    textColor: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: '#F59E0B',
    badgeClass: 'status-badge-expiring'
  },
  'Frozen': {
    label: 'Cuti / Frozen',
    textColor: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: '#0284C7',
    badgeClass: 'status-badge-frozen'
  },
  'Expired': {
    label: 'Expired',
    textColor: '#F87171',
    bgColor: 'rgba(248, 113, 113, 0.12)',
    borderColor: '#EF4444',
    badgeClass: 'status-badge-expired'
  }
};

const ID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Format nominal Rupiah (IDR)
 * Standard: Rp 1.500.000
 */
export function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date in Indonesian locale (e.g. "29 Okt 2026")
 */
export function formatDate(dateInput) {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format time in 24h format (e.g. "14:35 WIB")
 */
export function formatTime(dateInput) {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

/**
 * Format date & time combined
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '-';
  return `${formatDate(dateInput)}, ${formatTime(dateInput)}`;
}

/**
 * Calculate difference in days between target date and base date (normalized to midnight)
 * Positive: Days remaining in future
 * 0: Expires today
 * Negative: Days past expiry
 */
export function getDaysDifference(targetDate, baseDate = new Date()) {
  const target = new Date(targetDate);
  const base = new Date(baseDate);
  
  target.setHours(0, 0, 0, 0);
  base.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - base.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a given date
 */
export function addDays(dateInput, days) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Format Date to ISO YYYY-MM-DD for date inputs
 */
export function toISODateString(dateInput) {
  const d = new Date(dateInput);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Prevent XSS by escaping HTML entities
 */
export function sanitizeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate Avatar Initials
 */
export function getInitials(name) {
  if (!name) return 'BF';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate next Member ID in sequence (BF-1001, BF-1002, etc.)
 */
export function generateMemberId(existingMembers = []) {
  let highest = 1000;
  for (const m of existingMembers) {
    if (m.id && m.id.startsWith('BF-')) {
      const num = parseInt(m.id.replace('BF-', ''), 10);
      if (!isNaN(num) && num > highest) {
        highest = num;
      }
    }
  }
  return `BF-${highest + 1}`;
}

/**
 * Generate next Lead ID in sequence (LD-1001, etc.)
 */
export function generateLeadId(existingLeads = []) {
  let highest = 1000;
  for (const l of existingLeads) {
    if (l.id && l.id.startsWith('LD-')) {
      const num = parseInt(l.id.replace('LD-', ''), 10);
      if (!isNaN(num) && num > highest) {
        highest = num;
      }
    }
  }
  return `LD-${highest + 1}`;
}

/**
 * Export Member Directory to CSV file
 */
export function exportMembersToCSV(members, getStatusFn) {
  const headers = ['Member ID', 'Nama Lengkap', 'Nomor WhatsApp', 'Paket Membership', 'Harga Bulanan', 'Tanggal Bergabung', 'Tanggal Berakhir', 'Sisa Hari', 'Status', 'Sedang Cuti'];
  
  const rows = members.map(m => {
    const status = getStatusFn(m);
    const days = getDaysDifference(m.expiryDate);
    const price = PACKAGE_PRICES[m.packageType] || 0;
    
    return [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.phone}"`,
      `"${m.packageType}"`,
      `"${price}"`,
      `"${formatDate(m.joinDate)}"`,
      `"${formatDate(m.expiryDate)}"`,
      days,
      `"${status}"`,
      m.isFrozen ? 'Ya' : 'Tidak'
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `befit_members_export_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
