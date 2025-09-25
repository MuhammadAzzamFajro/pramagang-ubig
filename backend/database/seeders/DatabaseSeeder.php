<?php

// ...existing code...
namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Pelanggaran;
use App\Models\BuktiPelanggaran;
use App\Models\Dudi;
use App\Models\Logbook;
use App\Models\Magang;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(10)->create();
        Kelas::factory()->count(30)->create();
        Siswa::factory()->count(50)->create();
        Pelanggaran::factory()->count(10)->create();
        BuktiPelanggaran::factory()->count(10)->create();
        Logbook::factory()->count(50)->create();
        Dudi::factory()->count(10)->create();

        // Pastikan ada data relasi untuk digunakan oleh Magang
        $students = Siswa::all();
        $dudis = Dudi::all();
        $gurus = User::all();

        // Buat Magang dengan referensi yang valid (menghindari null pada foreign keys)
        Magang::factory()->count(10)->make()->each(function ($magang) use ($students, $dudis, $gurus) {
            $magang->siswa_id = $students->random()->id;
            $magang->dudi_id = $dudis->random()->id;
            $magang->guru_pembimbing_id = $gurus->random()->id;
            $magang->save();
        });
    }
}

