export const weddingData = {
  // 1. Data Mempelai
  pria: {
    namaPanggilan: "Putra",
    namaLengkap: "Aliansyah Pradana Putra, S.Kom, M.Kom",
    namaBapak: "Bapak ..........",
    namaIbu: "Ibu ..........",
  },
  wanita: {
    namaPanggilan: "Putri",
    namaLengkap: "Lestari Putri Ningsih, S.Pd.",
    namaBapak: "Bapak ..........",
    namaIbu: "Ibu ..........",
  },

  // Gambar Latar (Background)
  galeri: {
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080", // Foto layar penuh di Tirai awal
    heroImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800" // Foto di dalam bingkai halaman utama
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
  ]
};
