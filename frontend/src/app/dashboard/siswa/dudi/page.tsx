"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import { supabase } from "@/lib/supabaseClient";
import { FaBuilding, FaBriefcase, FaCalendar, FaUserTie } from "react-icons/fa";

const DudiPage = () => {
  const [magangInfo, setMagangInfo] = useState<any>(null);
  const [allDudis, setAllDudis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Asumsi: kita menggunakan ID siswa yang statis karena belum ada login
  const CURRENT_SISWA_ID = 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Ambil data magang siswa saat ini untuk mendapatkan detail DUDI-nya
      const { data: magangData, error: magangError } = await supabase.from("magangs_siswa").select(`*, dudi:dudis(*), guru:users(name)`).eq("siswa_id", CURRENT_SISWA_ID).single(); // Ambil satu data saja

      if (magangError) console.error("Error fetching magang info:", magangError);
      setMagangInfo(magangData);

      // 2. Ambil semua data DUDI untuk ditampilkan di tabel
      const { data: allDudisData, error: dudisError } = await supabase.from("dudis").select("*");
      if (dudisError) console.error("Error fetching all DUDIs:", dudisError);
      setAllDudis(allDudisData || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  const dudiData = [
    { title: "DUDI Terpilih", value: magangInfo?.dudi?.nama || "-", icon: <FaBuilding /> },
    { title: "Status Magang", value: magangInfo?.status || "-", icon: <FaBriefcase /> },
    { title: "Durasi Magang", value: `${magangInfo?.tanggal_mulai || ".."} - ${magangInfo?.tanggal_selesai || ".."}`, icon: <FaCalendar /> },
    { title: "Pembimbing Lapangan", value: magangInfo?.dudi?.penanggung_jawab || "-", icon: <FaUserTie /> },
  ];

  const tableHeaders = ["No", "Nama DUDI", "Alamat", "Bidang Usaha", "Kontak"];
  const dudiTableData = allDudis.map((dudi, index) => ({
    no: index + 1,
    nama: dudi.nama,
    alamat: dudi.alamat,
    bidang: dudi.bidang_usaha,
    kontak: dudi.telepon,
  }));

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DUDI</h1>
        <p className="text-gray-600">Informasi Dunia Usaha & Dunia Industri tempat magang</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dudiData.map((item, index) => (
          <Card key={index} title={item.title} value={String(item.value)} icon={item.icon} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daftar Semua DUDI Mitra</h2>
        <Table headers={tableHeaders} data={dudiTableData} />
      </div>
    </div>
  );
};

export default DudiPage;
