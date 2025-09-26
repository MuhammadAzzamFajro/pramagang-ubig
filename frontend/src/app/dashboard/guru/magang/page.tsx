"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";

// Tipe data
type Magang = {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  judul_magang: string;
  deskripsi: string;
  siswa: { id: number; nama: string } | null;
  dudi: { id: number; nama: string } | null;
  guru: { id: number; name: string } | null;
};
type Siswa = { id: number; nama: string };
type Dudi = { id: number; nama: string };
type Guru = { id: number; name: string };

const ManajemenMagangPage = () => {
  const [magangList, setMagangList] = useState<Magang[]>([]);
  const [siswas, setSiswas] = useState<Siswa[]>([]);
  const [dudis, setDudis] = useState<Dudi[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMagang, setCurrentMagang] = useState<Magang | null>(null);

  const [formData, setFormData] = useState({
    siswa_id: "",
    dudi_id: "",
    guru_pembimbing_id: "",
    judul_magang: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "Pending",
  });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    // Mengambil semua data yang dibutuhkan secara paralel
    const [magangRes, siswaRes, dudiRes, guruRes] = await Promise.all([
      supabase.from("magangs_siswa").select(`
        id, tanggal_mulai, tanggal_selesai, status, judul_magang, deskripsi,
        siswa:siswas (id, nama),
        dudi:dudis (id, nama),
        guru:users (id, name)
      `),
      supabase.from("siswas").select("id, nama"),
      supabase.from("dudis").select("id, nama"),
      supabase.from("users").select("id, name"), // Asumsi: guru ada di tabel users
    ]);

    if (magangRes.error) console.error("Error fetching magang:", magangRes.error.message);
    else setMagangList((magangRes.data as any) || []);

    if (siswaRes.error) console.error("Error fetching siswa:", siswaRes.error.message);
    else setSiswas(siswaRes.data || []);

    if (dudiRes.error) console.error("Error fetching dudi:", dudiRes.error.message);
    else setDudis(dudiRes.data || []);

    if (guruRes.error) console.error("Error fetching guru:", guruRes.error.message);
    else setGurus(guruRes.data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenModal = (magang: Magang | null = null) => {
    if (magang) {
      setIsEditing(true);
      setCurrentMagang(magang);
      setFormData({
        siswa_id: String(magang.siswa?.id || ""),
        dudi_id: String(magang.dudi?.id || ""),
        guru_pembimbing_id: String(magang.guru?.id || ""),
        judul_magang: magang.judul_magang,
        deskripsi: magang.deskripsi,
        tanggal_mulai: magang.tanggal_mulai,
        tanggal_selesai: magang.tanggal_selesai,
        status: magang.status,
      });
    } else {
      setIsEditing(false);
      setCurrentMagang(null);
      setFormData({
        siswa_id: "",
        dudi_id: "",
        guru_pembimbing_id: "",
        judul_magang: "",
        deskripsi: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "Pending",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      siswa_id: Number(formData.siswa_id),
      dudi_id: Number(formData.dudi_id),
      guru_pembimbing_id: Number(formData.guru_pembimbing_id),
      judul_magang: formData.judul_magang,
      deskripsi: formData.deskripsi,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: formData.status,
    };

    if (isEditing && currentMagang) {
      const { error } = await supabase.from("magangs_siswa").update(submitData).eq("id", currentMagang.id);
      if (error) alert("Error: " + error.message);
    } else {
      const { error } = await supabase.from("magangs_siswa").insert([submitData]);
      if (error) alert("Error: " + error.message);
    }
    fetchAllData();
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus data magang ini?")) {
      const { error } = await supabase.from("magangs_siswa").delete().eq("id", id);
      if (error) alert("Error: " + error.message);
      else fetchAllData();
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;

  return (
    <>
      <Navbar />
      <div className="mb-6 mt-9">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Magang</h1>
        <p className="text-gray-600">Kelola penempatan magang siswa dengan mitra DUDI.</p>
      </div>
      <div className="flex justify-end mb-6">
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          + Tetapkan Magang Baru
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Siswa</th>
              <th className="px-6 py-3">DUDI</th>
              <th className="px-6 py-3">Guru Pembimbing</th>
              <th className="px-6 py-3">Periode</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {magangList.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{m.siswa?.nama || "N/A"}</td>
                <td className="px-6 py-4">{m.dudi?.nama || "N/A"}</td>
                <td className="px-6 py-4">{m.guru?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  {m.tanggal_mulai} - {m.tanggal_selesai}
                </td>
                <td className="px-6 py-4">{m.status}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button onClick={() => handleOpenModal(m)} className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onClose={handleCloseModal} title={isEditing ? "Edit Data Magang" : "Tambah Data Magang"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Siswa</label>
            <select name="siswa_id" value={formData.siswa_id} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Pilih Siswa</option>
              {siswas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">DUDI</label>
            <select name="dudi_id" value={formData.dudi_id} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Pilih DUDI</option>
              {dudis.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Guru Pembimbing</label>
            <select name="guru_pembimbing_id" value={formData.guru_pembimbing_id} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Pilih Guru</option>
              {gurus.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Judul Magang</label>
            <input type="text" name="judul_magang" value={formData.judul_magang} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Tanggal Mulai</label>
              <input type="date" name="tanggal_mulai" value={formData.tanggal_mulai} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Tanggal Selesai</label>
              <input type="date" name="tanggal_selesai" value={formData.tanggal_selesai} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="Pending">Pending</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-md">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isEditing ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManajemenMagangPage;
