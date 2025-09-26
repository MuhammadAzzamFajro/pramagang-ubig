"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaUserGraduate, FaBuilding, FaClipboardList } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

export default function GuruDashboard() {
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalDudi, setTotalDudi] = useState(0);
  const [totalMagang, setTotalMagang] = useState(0);
  const [logbookHariIni, setLogbookHariIni] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // 1. Hitung semua siswa
      const { count: siswaCount } = await supabase
        .from("siswa")
        .select("*", { count: "exact", head: true });
      setTotalSiswa(siswaCount || 0);

      // 2. Hitung semua DUDI
      const { count: dudiCount } = await supabase
        .from("dudi")
        .select("*", { count: "exact", head: true });
      setTotalDudi(dudiCount || 0);

      // 3. Hitung siswa yang aktif magang
      const { count: magangCount } = await supabase
        .from("magang")
        .select("*", { count: "exact", head: true })
        .eq("status", "aktif"); // pastikan ada kolom status
      setTotalMagang(magangCount || 0);

      // 4. Hitung logbook yang dibuat hari ini
      const today = new Date().toISOString().split("T")[0];
      const { count: logbookCount } = await supabase
        .from("logbook")
        .select("*", { count: "exact", head: true })
        .eq("tanggal", today); // pastikan nama kolomnya "tanggal"
      setLogbookHariIni(logbookCount || 0);
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-400">
        Selamat datang di sistem pelaporan magang siswa SMK Negeri 1 Surabaya
      </p>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Siswa</h2>
            <p className="text-2xl font-bold">{totalSiswa}</p>
          </div>
          <FaUserGraduate className="text-blue-500 text-3xl" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">DUDI Partner</h2>
            <p className="text-2xl font-bold">{totalDudi}</p>
          </div>
          <FaBuilding className="text-green-500 text-3xl" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Siswa Magang</h2>
            <p className="text-2xl font-bold">{totalMagang}</p>
          </div>
          <MdSchool className="text-purple-500 text-3xl" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Logbook Hari Ini</h2>
            <p className="text-2xl font-bold">{logbookHariIni}</p>
          </div>
          <FaClipboardList className="text-pink-500 text-3xl" />
        </div>
      </div>
    </div>
  );
}
