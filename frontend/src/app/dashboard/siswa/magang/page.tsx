"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaBuilding, FaUserTie, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

const MagangDetailPage = () => {
  const [magangData, setMagangData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Asumsi: ID siswa didapat dari session/login, untuk sekarang kita hardcode
  const SISWA_ID = 1;

  useEffect(() => {
    const fetchMagangData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("magangs_siswa")
        .select(
          `
          *,
          dudi:dudis(*),
          guru:users(name)
        `
        )
        .eq("siswa_id", SISWA_ID)
        .single(); // Karena satu siswa hanya punya satu data magang aktif

      if (error) {
        console.error("Error fetching magang data:", error);
      } else {
        setMagangData(data);
      }
      setLoading(false);
    };

    fetchMagangData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Memuat data magang Anda...</div>;
  }

  if (!magangData) {
    return <div className="p-6 text-center text-red-500">Data magang tidak ditemukan untuk siswa ini.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Detail Magang Saya</h1>
        <p className="text-gray-600">Berikut adalah informasi lengkap mengenai program magang Anda.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolom Kiri: Info Utama */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-600">{magangData.judul_magang}</h2>
              <p className="text-lg text-gray-500">{magangData.dudi?.nama || "Nama DUDI tidak ditemukan"}</p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaInfoCircle /> Deskripsi Proyek
              </h3>
              <p className="text-gray-600 leading-relaxed">{magangData.deskripsi || "Tidak ada deskripsi."}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <FaCalendarAlt className="text-2xl text-cyan-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Periode Magang</p>
                <p className="text-gray-600">
                  {new Date(magangData.tanggal_mulai).toLocaleDateString()} - {new Date(magangData.tanggal_selesai).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBuilding className="text-2xl text-cyan-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Alamat DUDI</p>
                <p className="text-gray-600">{magangData.dudi?.alamat || "Alamat tidak tersedia"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaUserTie className="text-2xl text-cyan-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Guru Pembimbing</p>
                <p className="text-gray-600">{magangData.guru?.name || "Guru tidak ditemukan"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagangDetailPage;
