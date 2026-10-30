# Submission Proyek Akhir: OpenJob RESTful API Versi 2

Kelas Back-End Fundamental dengan JavaScript

---

## Daftar Isi

1. [Pengantar](#pengantar)
2. [Sistem Penilaian](#sistem-penilaian)
3. [Kriteria 1: Unggah Berkas PDF](#kriteria-1-unggah-berkas-pdf)
4. [Kriteria 2: Caching dengan Redis](#kriteria-2-caching-dengan-redis)
5. [Kriteria 3: Message Queue dengan RabbitMQ](#kriteria-3-message-queue-dengan-rabbitmq)
6. [Environment Variables](#environment-variables)
7. [Panduan Pengujian Postman](#panduan-pengujian-postman)
8. [Perhitungan Nilai Akhir](#perhitungan-nilai-akhir)
9. [Ketentuan Pengiriman Submission](#ketentuan-pengiriman-submission)
10. [Kriteria Auto-Reject](#kriteria-auto-reject)
11. [Forum Diskusi](#forum-diskusi)

---

## Pengantar

Submission ini merupakan kelanjutan dari proyek **OpenJob RESTful API Versi 1**. Pada versi 2, pengembangan difokuskan pada integrasi tiga komponen utama:

| No  | Komponen       | Teknologi | Tujuan                                            |
| :-: | :------------- | :-------- | :------------------------------------------------ |
|  1  | Storage        | Multer    | Unggah dokumen CV/Resume pelamar dalam format PDF |
|  2  | Caching        | Redis     | Meningkatkan performa pembacaan data              |
|  3  | Message Broker | RabbitMQ  | Memproses background job secara asynchronous      |

Studi kasusnya adalah memenuhi kebutuhan unggah CV/Resume pelamar, mempercepat pembacaan data, dan mengirim notifikasi asynchronous kepada pemilik lowongan ketika ada lamaran masuk.

---

## Sistem Penilaian

Setiap kriteria dinilai dengan bobot 0 sampai 4 poin.

| Level    | Poin | Penjelasan                                                                                             |
| :------- | :--: | :----------------------------------------------------------------------------------------------------- |
| Reject   |  0   | Kriteria tidak terpenuhi. Jika ada satu saja kriteria bernilai 0, submission langsung ditolak.         |
| Basic    |  2   | Standar minimum kelulusan.                                                                             |
| Skilled  |  3   | Memenuhi standar menengah dan lulus uji mandatory Postman.                                             |
| Advanced |  4   | Memenuhi seluruh spesifikasi lanjutan dan lulus seluruh pengujian Postman (mandatory maupun opsional). |

> **Syarat lulus:** minimal **2 poin pada setiap kriteria**.

---

## Kriteria 1: Unggah Berkas PDF

RESTful API harus mampu menerima dan menyimpan berkas dokumen PDF.

### Reject (0 poin)

- RESTful API tidak dapat mengunggah berkas PDF.

### Basic (2 poin)

- RESTful API dapat mengunggah berkas PDF.
- Validasi ukuran berkas: maksimal **5 MB**.
- Validasi MIME type: hanya menerima `application/pdf`.

### Skilled (3 poin)

- Memenuhi semua ketentuan Basic.
- Semua pengujian mandatory Postman berhasil tanpa error.
- Menggunakan library `multer`.
- Menyimpan nama berkas yang berhasil diunggah ke dalam tabel database.

### Advanced (4 poin)

- Memenuhi semua ketentuan Skilled.
- RESTful API dapat menampilkan atau mengunduh berkas yang telah diunggah.
- Seluruh pengujian Postman (mandatory dan opsional) berhasil tanpa error.

---

## Kriteria 2: Caching dengan Redis

RESTful API harus menerapkan caching menggunakan Redis.

### Reject (0 poin)

- RESTful API tidak menerapkan caching, atau
- Caching tidak menggunakan Redis.

### Basic (2 poin)

Menerapkan caching pada endpoint detail **salah satu** resource berikut:

| Endpoint                | Resource          |
| :---------------------- | :---------------- |
| `GET /companies/:id`    | Detail perusahaan |
| `GET /users/:id`        | Detail kandidat   |
| `GET /applications/:id` | Detail lamaran    |

### Skilled (3 poin)

- Memenuhi semua ketentuan Basic.
- Semua pengujian mandatory Postman berhasil tanpa error.
- TTL cache diatur selama **1 jam (3600 detik)**.
- Kredensial Redis disimpan di environment variable dengan nama wajib `REDIS_HOST`.

### Advanced (4 poin)

- Memenuhi semua ketentuan Skilled.
- Seluruh pengujian Postman (mandatory dan opsional) berhasil tanpa error.
- Menerapkan caching pada endpoint lain selain endpoint detail yang dipilih pada kriteria Basic.
- Mengembalikan response header custom `X-Data-Source: cache` jika respons diambil dari cache Redis.
- Menerapkan mekanisme cache invalidation otomatis ketika data berubah (lihat aturan di bawah).

### Aturan Cache Invalidation (Advanced)

Cache harus dihapus setiap kali terjadi mutasi data terkait:

| Mutasi Data                                  | Cache yang Dihapus                                                                                                                                                      |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CREATE`, `UPDATE`, atau `DELETE` Perusahaan | `GET /companies/:id`                                                                                                                                                    |
| `UPDATE` User                                | `GET /users/:id`                                                                                                                                                        |
| `CREATE` Lamaran                             | `GET /applications/user/:userId` (daftar lamaran kandidat)<br>`GET /applications/job/:jobId` (daftar lamaran pada lowongan)                                             |
| `UPDATE` Lamaran                             | `GET /applications/:id` (detail lamaran)<br>`GET /applications/user/:userId` (daftar lamaran kandidat)<br>`GET /applications/job/:jobId` (daftar lamaran pada lowongan) |
| `CREATE` atau `DELETE` Bookmark              | `GET /bookmarks` (daftar bookmark kandidat)                                                                                                                             |

---

## Kriteria 3: Message Queue dengan RabbitMQ

RESTful API harus menerapkan RabbitMQ untuk memproses tugas secara asynchronous.

### Reject (0 poin)

- Tidak ada penerapan RabbitMQ (publish dan consume), atau
- Menggunakan message queue selain RabbitMQ.

### Basic (2 poin)

- Mengirim pesan (publish) ke RabbitMQ saat kandidat membuat lamaran baru.
- Payload pesan hanya berisi `application_id`.
- Terdapat satu program consumer yang memproses pesan secara asynchronous dari RabbitMQ.

### Skilled (3 poin)

- Memenuhi semua ketentuan Basic.
- Semua pengujian mandatory Postman berhasil tanpa error.
- Kredensial RabbitMQ dikonfigurasi melalui environment variables:
  - `RABBITMQ_HOST` (wajib)
  - `RABBITMQ_PORT`
  - `RABBITMQ_USER`
  - `RABBITMQ_PASSWORD`

> **Catatan:** `AMQP_URL` diperbolehkan, tetapi `RABBITMQ_HOST` tetap wajib didefinisikan.

### Advanced (4 poin)

- Memenuhi semua ketentuan Skilled.
- Seluruh pengujian Postman (mandatory dan opsional) berhasil tanpa error.
- Consumer mengirim email notifikasi menggunakan library `nodemailer`.
- Alamat email penerima diambil dari database secara dinamis (bukan hardcoded).
- Notifikasi email **hanya dikirim ke pemilik lowongan (job owner)**, bukan ke pelamar.
- Isi email memuat data pelamar yang diambil dari database:
  - Email pelamar
  - Nama pelamar
  - Tanggal lamaran
- Kredensial server email **wajib** disimpan dalam environment variables:
  - `MAIL_HOST`
  - `MAIL_PORT`
  - `MAIL_USER`
  - `MAIL_PASSWORD`

---

## Environment Variables

Sesuaikan berkas `.env` dengan variabel berikut.

### Redis

```env
REDIS_HOST=localhost
```

### RabbitMQ

```env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

### Email (Nodemailer)

```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_smtp_user
MAIL_PASSWORD=your_smtp_password
```

---

## Panduan Pengujian Postman

Pengujian dilakukan menggunakan Postman Collection dan Postman Environment yang disediakan Dicoding (pembaruan 15 Juni 2026).

### Langkah Impor Berkas

1. Ekstrak berkas arsip yang diunduh hingga diperoleh dua berkas JSON (Collection dan Environment).
2. Buka Postman, lalu klik tombol **Import** di panel kiri atas.
3. Pilih **Upload Files**, lalu pilih kedua berkas JSON tersebut.
4. Pastikan environment aktif mengarah ke environment **OpenJob V2** yang telah diimpor.

### Catatan Penting

- **Jangan mengubah urutan request** pada collection yang telah diimpor.
- **Folder `[Mandatory] Documents`** jangan disertakan saat menjalankan pengujian otomatis melalui Collection Runner, karena akan selalu gagal (memerlukan payload file nyata). Jalankan folder ini secara manual dengan mengunggah berkas PDF langsung pada tab **form-data** di Postman.

---

## Perhitungan Nilai Akhir

```text
Nilai Akhir = Total Poin / Jumlah Kriteria
```

|    Nilai Akhir     | Predikat Dicoding | Nilai Huruf | Level of Mastery | Keterangan                                                                        |
| :----------------: | :---------------- | :---------: | :--------------- | :-------------------------------------------------------------------------------- |
|       < 1.00       | Rejected          |      E      | Tidak Lulus      | Belum memenuhi kompetensi minimal.                                                |
| 1.00 sampai < 2.00 | Bintang 2         |      D      | Below Basic      | Memenuhi kompetensi dasar minimal, namun masih banyak area yang perlu diperbaiki. |
| 2.00 sampai < 3.00 | Bintang 3         |      C      | Basic            | Memenuhi semua kompetensi minimal yang disyaratkan.                               |
| 3.00 sampai < 4.00 | Bintang 4         |      B      | Skilled          | Memenuhi seluruh kompetensi dengan baik dan mahir.                                |
|        4.00        | Bintang 5         |      A      | Advanced         | Memenuhi seluruh kriteria mandatory dan opsional dengan tingkat lanjut.           |

---

## Ketentuan Pengiriman Submission

1. Kirim folder proyek OpenJob RESTful API dalam format arsip **ZIP**.
2. Pastikan berkas `package.json` tersedia di root folder proyek.
3. Folder `node_modules` **wajib dihapus** sebelum proyek dikompresi.
4. Berkas `.env` boleh tidak disertakan demi keamanan kredensial, dengan ketentuan nama environment variable harus persis mengikuti spesifikasi di atas.
5. Sediakan berkas `.env.example` sebagai dokumentasi konfigurasi yang dibutuhkan.

---

## Kriteria Auto-Reject

Submission langsung ditolak apabila:

1. Kriteria wajib OpenJob RESTful API Versi 1 tidak terpenuhi.
2. Struktur berkas submission tidak sesuai ketentuan (misalnya menyertakan `node_modules` atau tidak ada `package.json`).
3. Aplikasi Node.js gagal dijalankan pada Node.js LTS terbaru (v22).
4. Menggunakan bahasa pemrograman atau runtime selain JavaScript dan Node.js.
5. Menggunakan framework selain Express.js.
6. Terbukti melakukan plagiarisme atau kecurangan dalam bentuk apa pun.

---
