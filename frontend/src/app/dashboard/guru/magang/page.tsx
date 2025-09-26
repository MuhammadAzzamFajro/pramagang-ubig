"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

function CardStat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="p-4 text-center bg-white rounded-lg shadow">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  );
}

export default function ManajemenMagangPage() {
  const [students, setStudents] = useState<InternStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: magangData, error: supabaseError } = await supabase.from("magangs_siswa").select(`
            id,
            deskripsi,
            judul_magang,
            tanggal_mulai,
            tanggal_selesai,
            status,
            siswa:siswa_id!inner (
              nis,
              nama,
              email,
              kontak,
              kelas:kelas_id!inner ( kelas )
            ),
            dudi:dudi_id!inner ( nama )
          `);

        if (supabaseError) {
          throw supabaseError;
        }

        const formattedData = magangData.map((item: any) => ({
          id: item.id,
          nis: item.siswa?.nis || "N/A",
          nama: item.siswa?.nama || "Siswa Dihapus",
          email: item.siswa?.email || "-",
          kontak: item.siswa?.kontak || "-",
          kelas: item.siswa?.kelas?.kelas || "-",
          dudi: item.dudi?.nama || "DUDI Dihapus",
          start_date: item.tanggal_mulai || "N/A",
          end_date: item.tanggal_selesai || "N/A",
          status: item.status || "Pending",
          nilai: item.nilai || "-",
        }));

        setStudents(formattedData);
      } catch (err: any) {
        console.error("Error fetching data from Supabase:", err);
        setError("Gagal memuat data siswa magang.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading data from Supabase...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const total = students.length;
  const aktif = students.filter((s) => s.status === "Aktif").length;
  const selesai = students.filter((s) => s.status === "Selesai").length;
  const pending = students.filter((s) => s.status === "Pending").length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Siswa Magang</h1>
      <p className="text-gray-600">Kelola data siswa yang sedang melaksanakan magang di industri</p>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat title="Total Siswa" value={total} />
        <CardStat title="Aktif" value={aktif} />
        <CardStat title="Selesai" value={selesai} />
        <CardStat title="Pending" value={pending} />
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <input type="text" placeholder="Cari siswa, NIS, kelas, DUDI..." className="w-full px-3 py-2 border rounded-md md:w-1/3" />
        <div className="flex w-full gap-2 md:w-auto">
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded-md">+ Tambah Siswa</button>
          <button className="w-full px-4 py-2 text-white bg-green-500 rounded-md">Download PDF</button>
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
                  <span className={`px-2 py-1 rounded text-xs ${s.status === "Aktif" ? "bg-green-100 text-green-700" : s.status === "Selesai" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
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
