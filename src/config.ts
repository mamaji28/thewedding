export const weddingData = {
  // 1. Data Mempelai
  pria: {
    namaPanggilan: "Putra",
    namaLengkap: "Aliansyah Pradana Putra, S.Kom, M.Kom",
    urutanAnak: "Putra Kedua",
    namaBapak: "Bapak Adianto Purnomo",
    namaIbu: "Ibu Dewi Suhartati (Almh)",
    alamat: "Jl. Hasanudin No.16 RT 03 RW 13, Purwosari, Laweyan, Surakarta"
  },
  wanita: {
    namaPanggilan: "Ayu",
    namaLengkap: "Ayu Rahmawati, S.Pd.",
    urutanAnak: "Putri Pertama",
    namaBapak: "Bapak ..........",
    namaIbu: "Ibu ..........",
    alamat: "Jl. Merdeka No.45 RT 01 RW 02, Jebres, Surakarta"
  },

  // Gambar Latar (Background) & Foto
  galeri: {
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080", // Foto layar penuh di Tirai awal
    heroImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800", // Foto di dalam bingkai halaman utama
    fotoPria: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300", // Foto Mempelai Pria (Rasio 1:1 / Persegi)
    fotoWanita: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" // Foto Mempelai Wanita (Rasio 1:1 / Persegi)
  },

  // 2. Data Waktu & Acara
  acara: {
    // Format ISO untuk sistem Hitung Mundur (Tahun-Bulan-TanggalTJam:Menit:Detik)
    tanggalISO: "2026-07-29T14:59:00",
    
    // Format Teks untuk ditampilkan di layar
    teksTanggal: "Sabtu, 14 Desember 2024",
    
    akad: {
      waktu: "08.00 WIB – Selesai",
      tempat: "Masjid .....................",
      alamat: "Jl. ............, Kota ..........",
      linkMap: "https://maps.app.goo.gl/3V9bKNCaA6G84TRF9", // Ganti dengan link Google Maps sungguhan
    },
    resepsi: {
      waktu: "11.00 WIB – 14.00 WIB",
      tempat: "Gedung .....................",
      alamat: "Jl. ............, Kota ..........",
      linkMap: "https://maps.app.goo.gl/3V9bKNCaA6G84TRF9", // Ganti dengan link Google Maps sungguhan
    }
  },

  // 3. Cerita Cinta (Love Story)
  ceritaCinta: [
    { 
      tahun: "2018", 
      judul: "Pertama Bertemu", 
      cerita: "Kisah cinta kami dimulai dari sebuah pertemuan sederhana yang tak terlupakan." 
    },
    { 
      tahun: "2020", 
      judul: "Menjalin Kasih", 
      cerita: "Langkah demi langkah, hari demi hari, cinta ini semakin tumbuh dan bertumbuh." 
    },
    { 
      tahun: "2023", 
      judul: "Lamaran", 
      cerita: "Di momen yang penuh haru, sebuah janji suci diucapkan dari hati yang terdalam." 
    },
    { 
      tahun: "2024", 
      judul: "Pernikahan", 
      cerita: "Menyempurnakan separuh agama dan membangun mahligai rumah tangga yang sakinah." 
    },
  ],

  // 4. Amplop Digital (Rekening Bank)
  rekening: [
    { 
      bank: "Bank BCA", 
      noRekening: "1234567890", 
      atasNama: "Aliansyah Pradana Putra" 
    },
    { 
      bank: "Bank BRI", 
      noRekening: "0987654321", 
      atasNama: "Lestari Putri Ningsih" 
    },
  ],

  // 5. Fitur (Saklar Modul)
  fitur: {
    tampilkanBismillah: true,
    tampilkanMempelai: true,
    tampilkanAcara: true,
    tampilkanGaleri: true,
    tampilkanCeritaCinta: true,
    tampilkanRSVP: true,
    tampilkanHadiah: true,
    tampilkanEfekSparkle: true,
    tampilkanOrnamenDaun: true,
    tampilkanGarisAbstrak: true,
  },

  // 6. Musik Latar
  musik: "/song.mp3"
};
