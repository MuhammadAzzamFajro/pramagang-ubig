"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface InternStudent {
  id: number;
  nis: string;
  nama: string;
  email?: string;
  kontak?: string;
  kelas?: string;
  dudi: string;
  start_date: string;
  end_date: string;
  status: "Aktif" | "Selesai" | "Pending";
  nilai?: string;
}

interface Siswa {
  id: number;
  nis: string;
  nama: string;
  kelas_id?: number;
}

interface Dudi {
  id: number;
  nama: string;
}

export default function ManajemenMagangPage() {
  const [students, setStudents] = useState<InternStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
       if (!token) {
        console.error('No auth token found. Redirecting to login.');
        // Redirect the user to the login page
        // You'll need to use a router for this, like from 'next/navigation'
        window.location.href = '/login'; // Simple redirect for demonstration
        return; // Stop the function execution
      }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Fetch magang with relations
        const magangRes = await fetch(`${API_BASE}/magang`, { 
          method: 'GET',
          headers 
        });

        if (!magangRes.ok) {
          console.error('Magang API error:', magangRes.status, magangRes.statusText);
          throw new Error(`Magang fetch failed: ${magangRes.statusText}`);
        }

        const magangData = await magangRes.json();
        console.log('Magang data from API:', magangData); 

        // Format data directly from nested relations
        let formattedData = magangData.map((item: any) => {
          const siswa = item.siswa || {};
          const dudi = item.dudi || {};
          const kelas = siswa.kelas || {};
          return {
            id: item.id,
            nis: siswa.nis || 'N/A',
            nama: siswa.nama || 'Siswa Dihapus',
            email: siswa.email || '-', 
            kontak: siswa.kontak || '-', 
            kelas: kelas.kelas || '-',
            dudi: dudi.nama || 'N/A',
            start_date: item.tanggal_mulai || 'N/A',
            end_date: item.tanggal_selesai || 'N/A',
            status: item.status || 'Pending',
            nilai: item.nilai || '-'
          };
        });

        console.log('Formatted data:', formattedData);

        // If no data from API, use dummy data
        if (formattedData.length === 0) {
          formattedData = [
            {
              id: 1,
              nis: "12345678",
              nama: "Budi Santoso",
              email: "budi@example.com",
              kontak: "081234567890",
              kelas: "XII TKJ 1",
              dudi: "PT Teknologi Nusantara",
              start_date: "2025-01-10",
              end_date: "2025-04-10",
              status: "Aktif" as const,
              nilai: "A"
            },
            {
              id: 2,
              nis: "87654321",
              nama: "Siti Nurhaliza",
              email: "siti@example.com",
              kontak: "089876543210",
              kelas: "XII TKJ 2",
              dudi: "CV Digital Kreatif",
              start_date: "2025-02-01",
              end_date: "2025-05-01",
              status: "Pending" as const,
              nilai: "-"
            },
            {
              id: 3,
              nis: "11223344",
              nama: "Ahmad Rizki",
              email: "ahmad@example.com",
              kontak: "085512345678",
              kelas: "XII TKJ 1",
              dudi: "PT Teknologi Nusantara",
              start_date: "2025-01-15",
              end_date: "2025-04-15",
              status: "Selesai" as const,
              nilai: "B+"
            },
            {
              id: 4,
              nis: "55667788",
              nama: "Dewi Sartika",
              email: "dewi@example.com",
              kontak: "087654321098",
              kelas: "XII TKJ 3",
              dudi: "CV Digital Kreatif",
              start_date: "2025-03-01",
              end_date: "2025-06-01",
              status: "Aktif" as const,
              nilai: "-"
            }
          ];
        }

        setStudents(formattedData);
      } catch (err) {
        console.error('Unexpected error fetching intern students:', err);
        
        // Fallback to dummy data on error
        const dummyStudents: InternStudent[] = [
          {
            id: 1,
            nis: "12345678",
            nama: "Budi Santoso",
            email: "budi@example.com",
            kontak: "081234567890",
            kelas: "XII TKJ 1",
            dudi: "PT Teknologi Nusantara",
            start_date: "2025-01-10",
            end_date: "2025-04-10",
            status: "Aktif" as const,
            nilai: "A"
          },
          {
            id: 2,
            nis: "87654321",
            nama: "Siti Nurhaliza",
            email: "siti@example.com",
            kontak: "089876543210",
            kelas: "XII TKJ 2",
            dudi: "CV Digital Kreatif",
            start_date: "2025-02-01",
            end_date: "2025-05-01",
            status: "Pending" as const,
            nilai: "-"
          },
          {
            id: 3,
            nis: "11223344",
            nama: "Ahmad Rizki",
            email: "ahmad@example.com",
            kontak: "085512345678",
            kelas: "XII TKJ 1",
            dudi: "PT Teknologi Nusantara",
            start_date: "2025-01-15",
            end_date: "2025-04-15",
            status: "Selesai" as const,
            nilai: "B+"
          },
          {
            id: 4,
            nis: "55667788",
            nama: "Dewi Sartika",
            email: "dewi@example.com",
            kontak: "087654321098",
            kelas: "XII TKJ 3",
            dudi: "CV Digital Kreatif",
            start_date: "2025-03-01",
            end_date: "2025-06-01",
            status: "Aktif" as const,
            nilai: "-"
          }
        ];
        
        setStudents(dummyStudents);
      } finally {
        setLoading(false);
      }
    };

     fetchData();
}, []);

  if (loading) return <div className="p-6">Loading...</div>;

  // Hitung statistik
  const total = students.length;
  const aktif = students.filter(s => s.status === "Aktif").length;
  const selesai = students.filter(s => s.status === "Selesai").length;
  const pending = students.filter(s => s.status === "Pending").length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Siswa Magang</h1>
      <p className="text-gray-600">
        Kelola data siswa yang sedang melaksanakan magang di industri
      </p>

      {/* Statistik */}
      <div className="grid grid-cols-4 gap-4">
        <CardStat title="Total Siswa" value={total} />
        <CardStat title="Aktif" value={aktif} />
        <CardStat title="Selesai" value={selesai} />
        <CardStat title="Pending" value={pending} />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari siswa, NIS, kelas, DUDI..."
          className="border px-3 py-2 rounded-md w-1/3"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            + Tambah Siswa
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md">
            Download PDF
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Siswa</th>
              <th className="px-4 py-2 text-left">Kelas</th>
              <th className="px-4 py-2 text-left">DUDI</th>
              <th className="px-4 py-2 text-left">Periode</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Nilai</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-2">
                  <div className="font-semibold">{s.nama}</div>
                  <div className="text-xs text-gray-600">NIS: {s.nis}</div>
                  <div className="text-xs text-gray-500">
                    {s.email} | {s.kontak}
                  </div>
                </td>
                <td className="px-4 py-2">{s.kelas}</td>
                <td className="px-4 py-2">{s.dudi}</td>
                <td className="px-4 py-2">
                  {s.start_date} s.d {s.end_date}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      s.status === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : s.status === "Selesai"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2">{s.nilai}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CardStat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  );
}
