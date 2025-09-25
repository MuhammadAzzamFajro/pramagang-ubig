<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    /** @use HasFactory<\Database\Factories\SiswaFactory> */
    use HasFactory;

    protected $fillable = [
        'nis',
        'nama',
        'kelas_id',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
    ];

    /**
     * Get the kelas that owns the siswa.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
