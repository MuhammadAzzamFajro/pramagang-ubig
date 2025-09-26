"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// --- PERBAIKAN TIPE DATA ---
// Tipe siswa sekarang bisa berupa object tunggal atau array object
type SiswaRelation = { nama: string } | { nama: string }[] | null;

type Logbook = {
  id: number;
  tanggal: string;
  kegiatan: string;
  status: string;
  siswa: SiswaRelation;
};

const LogbookVerificationPage = () => {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogbooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("logbooks")
      .select(
        `
        id,
        tanggal,
        kegiatan,
        status,
        siswa:siswas ( nama )
      `
      )
      .order("tanggal", { ascending: false });

    if (error) {
      console.error("Error fetching logbooks:", error);
      setLogbooks([]);
    } else {
      setLogbooks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const handleVerification = async (logbookId: number, newStatus: "Disetujui" | "Ditolak") => {
    const GURU_ID = 1;

    const { error } = await supabase
      .from("logbooks")
      .update({
        status: newStatus,
        diverifikasi_oleh: GURU_ID,
        diverifikasi_pada: new Date().toISOString(),
      })
      .eq("id", logbookId);

    if (error) {
      alert(`Gagal memverifikasi logbook: ${error.message}`);
    } else {
      fetchLogbooks();
    }
  };

  const getSiswaName = (siswa: SiswaRelation) => {
    if (!siswa) return "Siswa tidak ada";
    if (Array.isArray(siswa)) {
      return siswa[0]?.nama || "Nama siswa tidak ada";
    }
    return siswa.nama;
  };

  if (loading) {
    return <div className="p-6 text-center">Memuat data logbook...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mb-6 mt-9">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifikasi Logbook Siswa</h1>
        <p className="text-gray-600">Periksa dan berikan status pada logbook harian siswa magang.</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Nama Siswa</th>
              <th className="px-6 py-3">Kegiatan</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Tidak ada data logbook untuk diverifikasi.
                </td>
              </tr>
            ) : (
              logbooks.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(log.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{getSiswaName(log.siswa)}</td>
                  <td className="px-6 py-4 max-w-sm truncate">{log.kegiatan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.status === "Disetujui" ? "bg-green-100 text-green-800" : log.status === "Ditolak" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {log.status === "Menunggu" && (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleVerification(log.id, "Disetujui")} className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100" title="Setujui">
                          <FaCheckCircle size={18} />
                        </button>
                        <button onClick={() => handleVerification(log.id, "Ditolak")} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100" title="Tolak">
                          <FaTimesCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LogbookVerificationPage;
