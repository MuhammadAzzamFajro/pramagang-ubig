import React from "react";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/Card";
import Table from "@/components/Table";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import DashboardTabs from "@/components/ui/tabs";
import { FaUserGraduate, FaBuilding, FaClipboardList } from "react-icons/fa";

// Ambil data dashboard
async function getDashboardData() {
  const { count: totalStudents } = await supabase.from("siswas").select("*", { count: "exact", head: true });

  const { count: totalPartners } = await supabase.from("dudis").select("*", { count: "exact", head: true });

  const { count: totalInterns } = await supabase.from("magangs_siswa").select("*", { count: "exact", head: true });

  const { data: recentLogs } = await supabase
    .from("logbook")
    .select("id, siswa:siswas(nama), activity, status") // relasi ke siswas
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalStudents: totalStudents ?? 0,
    totalPartners: totalPartners ?? 0,
    totalInterns: totalInterns ?? 0,
    recentLogs:
      recentLogs?.map((log: any) => ({
        id: log.id,
        name: (log.siswa as any)?.nama ?? "-",
        activity: log.activity,
        status: log.status,
      })) ?? [],
  };
}

const DashboardPage = async () => {
  const { totalStudents, totalPartners, totalInterns, recentLogs } = await getDashboardData();

  const dashboardData = [
    { title: "Total Siswa", value: totalStudents, icon: <FaUserGraduate /> },
    { title: "Mitra DUDI", value: totalPartners, icon: <FaBuilding /> },
    { title: "Siswa Magang", value: totalInterns, icon: <FaUserGraduate /> },
    { title: "Laporan Harian", value: "98%", icon: <FaClipboardList /> },
  ];

  const tableHeaders = ["ID", "Nama", "Aktivitas", "Status"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Konten utama */}
      <main className="flex-1 p-6">
        <Navbar />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Selamat datang di portal siswa SMK Negeri 1 Surabaya</p>
          </div>

          <div>
            <DashboardTabs />
          </div>
        </div>

        {/* Metrics Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.map((item, index) => (
            <Card key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>

        {/* Recent Activity Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Aktivitas Terbaru</h2>
          <Table headers={tableHeaders} data={recentLogs} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
