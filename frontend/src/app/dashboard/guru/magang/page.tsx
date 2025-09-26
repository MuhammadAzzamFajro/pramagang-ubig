"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Table from "@/components/Table";
import { FaUserGraduate, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";

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
  const router = useRouter();
  const [students, setStudents] = useState<InternStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      setLoading(true);
      try {
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
          if (magangRes.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
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
  }, [router]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  // Hitung statistik
  const total = students.length;
  const aktif = students.filter(s => s.status === "Aktif").length;
  const selesai = students.filter(s => s.status === "Selesai").length;
  const pending = students.filter(s => s.status === "Pending").length;

  const stats = [
    { title: "Total Siswa Magang", value: total.toString(), icon: <FaUserGraduate /> },
    { title: "Status Aktif", value: aktif.toString(), icon: <FaCheckCircle /> },
    { title: "Selesai", value: selesai.toString(), icon: <FaClock /> },
    { title: "Pending", value: pending.toString(), icon: <FaExclamationTriangle /> },
  ];

  const tableHeaders = ["Siswa", "Kelas", "DUDI", "Periode", "Status", "Nilai", "Aksi"];

  const tableData = students.map((s) => ({
    siswa: (
      <div>
        <div className="font-semibold">{s.nama}</div>
        <div className="text-xs text-gray-500">NIS: {s.nis}</div>
        <div className="text-xs text-gray-400">{s.email} | {s.kontak}</div>
      </div>
    ),
    kelas: s.kelas,
    dudi: s.dudi,
    periode: `${s.start_date} s.d ${s.end_date}`,
    status: (
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
    ),
    nilai: s.nilai,
    aksi: <button className="text-blue-500 hover:underline">Edit</button>,
  }));

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Manajemen Siswa Magang</h1>
          <p className="text-white">Kelola data siswa yang sedang melaksanakan magang di industri</p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <Card key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari siswa, NIS, kelas, DUDI..."
            className="flex-1 max-w-md rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              + Tambah Siswa
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Download PDF
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-lg shadow-lg">
          <Table headers={tableHeaders} data={tableData} />
        </div>
      </div>
    </>
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
