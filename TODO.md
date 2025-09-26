# TODO: Rename Magang Table to magangs_siswa

## Backend Changes
- [x] Update migration file: backend/database/migrations/2025_09_25_011043_create_magangs_siswa_table.php - Change Schema::create('magangs') to Schema::create('magangs_siswa') and dropIfExists accordingly
- [x] Update model: backend/app/Models/Magang.php - Change $table = 'magangs' to $table = 'magangs_siswa'

## Frontend Changes
- [x] Update seed script: frontend/scripts/seed-magang.js - Change .from('magangs') to .from('magangs_siswa')
- [x] Update siswa dashboard: frontend/src/app/dashboard/siswa/page.tsx - Change .from("magangs") to .from("magangs_siswa")
- [x] Update guru dashboard: frontend/src/app/dashboard/guru/page.tsx - Change both .from("magangs") to .from("magangs_siswa")
- [x] Update guru magang page: frontend/src/app/dashboard/guru/magang/page.tsx - Change .from('magang') to .from('magangs_siswa')

## Followup Steps
- [ ] Run php artisan migrate:fresh in backend to apply new schema
- [ ] Update Supabase table name to 'magangs_siswa' manually
- [ ] Test backend seeder and frontend seed script
- [ ] Verify API endpoints and frontend pages load data correctly
