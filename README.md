# Mini Technical Test - Todo App

Aplikasi Todo List sederhana dengan backend NestJS dan frontend React (Vite).

## Persyaratan
Model ini dikembangkan menggunakan:
- **Node.js**: v22.13.0 (Disarankan v18 ke atas)
- **NPM**: Bawaan Node.js

## Cara Menjalankan Aplikasi

### 1. Jalankan Backend (NestJS)
Buka terminal baru, lalu:
```bash
cd backend
npm install
# Buat file .env jika belum ada (Opsional untuk dev, default PORT=3000)
# echo "ALLOWED_ORIGIN=http://localhost:5173" > .env 

npm run start:dev
```
Server akan berjalan di `http://localhost:3000`.

### 2. Jalankan Frontend (React)
Buka terminal lain, lalu:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:5173` (atau port lain yang ditampilkan terminal).

## Keputusan Teknis
1.  **In-Memory Storage**: Karena keterbatasan waktu dan persyaratan "in-memory", data disimpan sementara dalam variabel array di Service layer. Data akan hilang saat server restart.
2.  **Optimistic UI Updates**: Di frontend, status checkbox todo diupdate terlebih dahulu secara visual sebelum response server diterima agar UX lebih responsif. Jika request gagal, status akan dikembalikan (revert).
3.  **Strict Validation**: Menggunakan `class-validator` di backend dan custom Exception Filter untuk memastikan format error response yang konsisten dan mudah dibaca frontend.
