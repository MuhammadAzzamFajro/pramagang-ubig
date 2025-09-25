<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Pelanggaran;
use App\Models\BuktiPelanggaran;
use App\Models\Dudi;
use App\Models\logbook;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Symfony\Component\HttpKernel\EventListener\DebugHandlersListener;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->count(10)->create();
        Kelas::factory()->count(30)->create();
        Siswa::factory()->count(50)->create();
        Pelanggaran::factory()->count(10)->create();
        BuktiPelanggaran::factory()->count(10)->create();
        Logbook::factory()->count(50)->create();
        Dudi::factory()->count(10)->create();
    }
}
