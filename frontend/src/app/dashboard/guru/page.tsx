// ...existing code...
import React from "react";
import { supabase } from "@/lib/supabaseClient";
import GuruSidebar from "@/components/GuruSidebar";
import Navbar from "@/components/Navbar";
import DashboardTabs from "@/components/ui/tabs";
import { FaUserGraduate, FaBuilding, FaClipboardList, FaChalkboardTeacher } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";

export const dynamic = "force-static";

async function getDashboardData() {
  const [studentsRes, partnersRes, internsRes, gurusRes] = await Promise.all([
    supabase.from("siswas").select("*", { count: "exact", head: true }),
    supabase.from("dudis").select("*", { count: "exact", head: true }),
    supabase.from("magangs_siswa").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
  ]);

  const totalStudents = studentsRes?.count ?? 0;
  const totalPartners = partnersRes?.count ?? 0;
  const totalInterns = internsRes?.count ?? 0;
  const totalGurus = gurusRes?.count ?? 0;

  // Static dummy data for recent magangs to avoid DB fetch for speed
  const recentMagangs = [
    {
      id: 1,
      nama: "Budi Santoso",
      dudi: "PT Teknologi Nusantara",
      guru: "Pak Andi",
      tanggal_mulai: "2025-01-10",
      tanggal_selesai: "2025-04-10",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      dudi: "CV Digital Kreatif",
      guru: "Bu Siti",
      tanggal_mulai: "2025-02-01",
      tanggal_selesai: "2025-05-01",
      status: "Pending",
    },
    {
      id: 3,
      nama: "Ahmad Rizki",
      dudi: "PT Teknologi Nusantara",
      guru: "Pak Joko",
      tanggal_mulai: "2025-01-15",
      tanggal_selesai: "2025-04-15",
      status: "Aktif",
    },
  ];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const logRes = await supabase.from("logbooks").select("*", { count: "exact", head: true }).gte("created_at", startOfDay.toISOString()).lte("created_at", endOfDay.toISOString());

  const todayLogCount = logRes?.count ?? 0;

  return {
    totalStudents,
    totalPartners,
    totalInterns,
    totalGurus,
    recentMagangs,
    todayLogCount,
  };
}

const DashboardPage = async () => {
  const { totalStudents, totalPartners, totalInterns, totalGurus, recentMagangs, todayLogCount } = await getDashboardData();

  const activePercent = totalStudents > 0 ? Math.round((totalInterns / totalStudents) * 100) : 0;
  const logbookPercent = 100;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Magang Terbaru</h2>
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <HiOutlineCalendar /> Terbaru
            </span>
          </div>

          <div className="space-y-4">
            {recentMagangs.length === 0 && <p className="text-gray-500">Belum ada data magang.</p>}
            {recentMagangs.map((m: any) => (
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

        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
            <p className="text-sm text-gray-500">Ringkasan status magang dan logbook</p>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Siswa Aktif Magang</span>
                  <span>{activePercent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded mt-2">
                  <div className="h-3 bg-cyan-500 rounded" style={{ width: `${activePercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Logbook Hari Ini</span>
                  <span>{todayLogCount}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded mt-2">
                  <div className="h-3 bg-indigo-500 rounded" style={{ width: `${logbookPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">DUDI Aktif</h4>
            <div className="text-3xl font-semibold text-gray-900">{totalPartners}</div>
            <p className="text-sm text-gray-500">Perusahaan mitra terdaftar</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
// ...existing code...
