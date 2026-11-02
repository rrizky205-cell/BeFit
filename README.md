# BE FIT — Gym & Fitness Center CRM

Aplikasi CRM (Customer Relationship Management) berbasis web modern, responsif, dan interaktif yang dibangun secara khusus untuk operasional gym & fitness center dengan gaya visual **"High-Performance Athletic Dark UI"**.

---

## 🚀 Fitur Utama & Modul Aplikasi

### 1. Executive Dashboard
- **Retention Alert Banner**: Notifikasi otomatis berwarna Amber jika terdapat member dengan sisa masa aktif $\le 7$ hari (*Expiring Soon*) dengan tombol aksi cepat.
- **4 Real-time KPI Cards**:
  - **Total Active Members**: Menghitung member dengan status `Active` & `Expiring Soon`.
  - **Estimated MRR (Monthly Recurring Revenue)**: Total pendapatan bulanan dalam format Rupiah Indonesia (`Rp`) dari member aktif.
  - **Today's Check-Ins**: Total kunjungan member hari ini melalui pintu Front Desk.
  - **Expiring Soon ($\le 7$ Hari)**: Jumlah member yang perlu segera di-follow up.
- **Ringkasan Aktivitas Operasional**: 5 riwayat check-in terakhir hari ini & jadwal kelas gym terdekat dengan progress bar kapasitas kuota.

### 2. Member Directory (Membership Lifecycle)
- **Kalkulasi Status Dinamis**: Dihitung otomatis secara real-time dari selisih `expiryDate` dan tanggal hari ini:
  - `Active`: Jika `daysRemaining > 7` hari.
  - `Expiring Soon`: Jika `0 <= daysRemaining <= 7` hari.
  - `Expired`: Jika `daysRemaining < 0` hari.
  - `Frozen`: Jika status cuti aktif (`isFrozen: true`).
- **Pencarian & Multi-Filter**: Pencarian instan (Nama, ID `BF-XXXX`, Nomor WhatsApp), filter Status, dan filter Paket.
- **Aksi Cepat Baris**:
  - **Renew (+30 Hari)**: Menambah 30 hari dari `expiryDate` saat ini (jika masih aktif) atau dari hari ini (jika sudah expired).
  - **Freeze / Unfreeze**: Membekukan keanggotaan sementara waktu (member tidak dapat check-in hingga di-unfreeze).
  - **Edit & Delete**: Pembaruan profil dan penghapusan member dengan konfirmasi modal kustom.
- **Export to CSV**: Mengunduh seluruh basis data member yang sedang difilter ke format file `.csv`.

### 3. Sales Funnel & Lead Pipeline (Kanban Board)
- **5 Tahapan Pipeline**: `New Inquiry` $\rightarrow$ `Trial Booked` $\rightarrow$ `Follow Up` $\rightarrow$ `Won (Closed)` $\rightarrow$ `Lost`.
- **Interaksi Fleksibel**: Mendukung **Drag & Drop** HTML5 API dan tombol navigasi panah kiri/kanan untuk kemudahan pada layar sentuh/mobile.
- **Fitur Konversi Otomatis ("Register as Member")**:
  - Kartu prospek di kolom `Won (Closed)` memiliki tombol CTA volt-green **"Register as Member"**.
  - Mengisi formulir pendaftaran member secara otomatis (*pre-filled* Nama, WhatsApp, Minat Paket), dan langsung mengarsipkan prospek tersebut saat pendaftaran berhasil.

### 4. Front Desk Quick Check-In Station (Kiosk Mode)
- **Input Super Cepat (56px Height)**: Input pencarian responsif untuk mengetik atau memindai Member ID (`BF-1001`) atau nama member dengan tombol pintasan simulasi cepat.
- **Visual Verification Card (Dramatis)**:
  - **ACCESS GRANTED (Volt Green `#A3E635` / `#4ADE80`)**: Disertai nada positif (*Web Audio API chime*), menampilkan detail member dan peringatan jika berstatus *Expiring Soon*.
  - **ACCESS DENIED (Merah `#EF4444` / `#F87171`)**: Disertai nada buzzer peringatan (*Web Audio API buzzer*), menampilkan alasan penolakan eksplisit dan tombol pintasan instan (**"Renew Now (+30 Hari)"** atau **"Unfreeze"**).
- **Live Attendance Log**: Tabel kehadiran real-time yang mencatat setiap kunjungan member hari ini lengkap dengan timestamp waktu lokal.

### 5. Class & Personal Trainer (PT) Schedule
- **Jadwal Kelas Studio**: Menampilkan daftar kelas (*HIIT Burn, Powerlifting, Vinyasa Yoga, RPM Spinning*), nama Coach, jam sesi, dan studio.
- **Progress Bar Kuota**: Visualisasi kapasitas terisi / maksimal.
- **Validasi Reservasi Ketat**:
  - Menolak booking jika kuota kelas penuh.
  - Menolak booking jika member berstatus `Expired` atau `Frozen`.
  - Menolak booking jika member sudah terdaftar di kelas yang sama (*mencegah double booking*).

### 6. Analytics & Reports
- **Breakdown Pendapatan per Paket**: Visualisasi kontribusi nominal MRR dan persentase untuk masing-masing tier (`Basic` Rp 350.000, `Pro` Rp 550.000, `VIP` Rp 850.000, `PT Pack` Rp 1.500.000).
- **Rasio Konversi Lead (Win Rate)**: Persentase efektivitas konversi prospek dari seluruh lead yang selesai dievaluasi.
- **Kesehatan Retensi Member**: Ringkasan status aktif vs expiring soon vs cuti vs expired.
- **Reset Demo Data**: Fitur untuk mengembalikan data awal simulasi kapan saja.

---

## 🎨 Spesifikasi Desain & Standar Teknis

- **Palet Warna**:
  - Primary Background: `#090D16` (Deep Obsidian Slate)
  - Card / Surface: `#111827` (Dark Gunmetal)
  - Border: `#1E293B` (Subtle Steel)
  - Primary Brand Accent: `#A3E635` (Electric Lime / Volt Green)
  - Secondary Accent: `#38BDF8` (Cyan Sky)
  - Semantic Status:
    - `Active`: Text `#4ADE80`, Background `rgba(74, 222, 128, 0.12)`, Border `#22C55E`
    - `Expiring Soon`: Text `#FBBF24`, Background `rgba(251, 191, 36, 0.12)`, Border `#F59E0B`
    - `Frozen`: Text `#38BDF8`, Background `rgba(56, 189, 248, 0.12)`, Border `#0284C7`
    - `Expired`: Text `#F87171`, Background `rgba(248, 113, 113, 0.12)`, Border `#EF4444`
- **Tipografi**:
  - UI: `Plus Jakarta Sans`, sans-serif
  - Monospace (ID, Nominal Rupiah, KPI, Jam): `JetBrains Mono`
- **Zero Native Dialogs**: Seluruh interaksi menggunakan **Custom Toast Notification** dan **Custom Modal Dialog** (tanpa `alert()`, `confirm()`, atau `prompt()`).
- **Web Audio API**: Synthesizer audio murni tanpa ketergantungan file audio eksternal.
- **Penyimpanan Lokal**: Persistensi state ke `localStorage` dengan namespace `befit_crm_state_v1`.

---

## 🏃 Cara Menjalankan Aplikasi

### Opsi 1: Menjalankan Server Lokal (Disarankan)
Jalankan file batch:
```cmd
start.bat
```
Atau menggunakan Node.js:
```bash
node server.js
```
Buka browser pada: `http://localhost:3000`

### Opsi 2: Buka Langsung File HTML
Anda juga dapat langsung membuka file `index.html` menggunakan browser Google Chrome, Microsoft Edge, atau browser modern lainnya.
