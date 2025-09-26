import React from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import DashboardTabs from "@/components/ui/tabs";
import { FaUserGraduate, FaBuilding, FaClipboardList, FaChalkboardTeacher } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";

// --- FUNGSI PENGAMBILAN DATA DARI SUPABASE ---
async function getDashboardData() {
  // Mengambil data secara paralel untuk efisiensi
  const [studentsRes, partnersRes, internsRes, gurusRes, recentMagangsRes] = await Promise.all([
    supabase.from("siswas").select("*", { count: "exact", head: true }),
    supabase.from("dudis").select("*", { count: "exact", head: true }),
    supabase.from("magangs_siswa").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("magangs_siswa")
      .select(
        `
        id,
        tanggal_mulai,
        tanggal_selesai,
        status,
        siswa:siswa_id ( nama ),
        dudi:dudi_id ( nama ),
        guru:guru_pembimbing_id ( name )
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Mengambil jumlah logbook hari ini
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count: todayLogCount } = await supabase.from("logbooks").select("*", { count: "exact", head: true }).gte("created_at", startOfDay.toISOString());

  // Memformat data magang terbaru
  const recentMagangs =
    recentMagangsRes.data?.map((m: any) => ({
      id: m.id,
      nama: m.siswa?.nama || "Siswa Tidak Ditemukan",
      dudi: m.dudi?.nama || "DUDI Tidak Ditemukan",
      guru: m.guru?.name || "Guru Tidak Ditemukan",
      tanggal_mulai: m.tanggal_mulai,
      tanggal_selesai: m.tanggal_selesai,
      status: m.status,
    })) ?? [];

  return {
    totalStudents: studentsRes?.count ?? 0,
    totalPartners: partnersRes?.count ?? 0,
    totalInterns: internsRes?.count ?? 0,
    totalGurus: gurusRes?.count ?? 0,
    recentMagangs,
    todayLogCount: todayLogCount ?? 0,
  };
}

const DashboardPage = async () => {
  const { totalStudents, totalPartners, totalInterns, totalGurus, recentMagangs, todayLogCount } = await getDashboardData();

  const metrics = [
    { title: "Total Siswa", value: totalStudents, icon: <FaUserGraduate className="text-2xl" /> },
    { title: "DUDI Partner", value: totalPartners, icon: <FaBuilding className="text-2xl" /> },
    { title: "Guru Pembimbing", value: totalGurus, icon: <FaChalkboardTeacher className="text-2xl" /> },
    { title: "Logbook Hari Ini", value: todayLogCount, icon: <FaClipboardList className="text-2xl" /> },
  ];

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center mb-6 mt-9">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Selamat datang di sistem pelaporan magang siswa SMK Negeri 1 Surabaya</p>
        </div>
        <div>
          <DashboardTabs />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center">{m.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{m.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Magang Terbaru</h2>
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <HiOutlineCalendar /> Terbaru
          </span>
        </div>
        <div className="space-y-4">
          {recentMagangs.length === 0 && <p className="text-gray-500">Belum ada data magang.</p>}
          {recentMagangs.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 font-bold">{String(m.nama).charAt(0) || "U"}</div>
                <div>
                  <p className="font-medium text-gray-800">{m.nama}</p>
                  <p className="text-sm text-gray-500">
                    {m.dudi} • <span className="text-xs text-gray-400">Pembimbing: {m.guru}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {m.tanggal_mulai ? new Date(m.tanggal_mulai).toLocaleDateString() : "-"} — {m.tanggal_selesai ? new Date(m.tanggal_selesai).toLocaleDateString() : "..."}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-sm px-3 py-1 rounded-full ${String(m.status).toLowerCase().includes("aktif") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status ?? "Aktif"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
