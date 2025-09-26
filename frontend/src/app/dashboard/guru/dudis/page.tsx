"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import {
  FaBuilding,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// Tipe data untuk Mitra DUDI
type Dudi = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

const GuruDudiPage = () => {
  const [dudis, setDudis] = useState<Dudi[]>([]);
  const [filteredDudis, setFilteredDudis] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDudi, setCurrentDudi] = useState<Dudi | null>(null);
  const [formData, setFormData] = useState<Omit<Dudi, "id">>({
    name: "",
    address: "",
    phone: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [totalDudi, setTotalDudi] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [rasioSiswa, setRasioSiswa] = useState(0);

  // ---------------------------
  // 1. Ambil data statistik
  // ---------------------------
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { count: dudiCount } = await supabase
        .from("dudis")
        .select("*", { count: "exact", head: true });
      const { count: siswaCount } = await supabase
        .from("siswas")
        .select("*", { count: "exact", head: true });
      const { count: magangCount } = await supabase
        .from("magangs_siswa")
        .select("*", { count: "exact", head: true });

      setTotalDudi(dudiCount || 0);
      setTotalSiswa(siswaCount || 0);
      setRasioSiswa(dudiCount && magangCount ? Math.round(magangCount / dudiCount) : 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setTotalDudi(0);
      setTotalSiswa(0);
      setRasioSiswa(0);
    } finally {
      setStatsLoading(false);
    }
  };

  const dudiStats = [
    { title: "Total DUDI", value: totalDudi.toString(), icon: <FaBuilding /> },
    { title: "Total Siswa", value: totalSiswa.toString(), icon: <FaUserGraduate /> },
    { title: "Rasio Siswa/DUDI", value: rasioSiswa.toString(), icon: <FaChalkboardTeacher /> },
  ];

  // ---------------------------
  // 2. Ambil data DUDI
  // ---------------------------
  const fetchDudis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dudis")
        .select("id, nama, alamat, telepon")
        .order("nama", { ascending: true });

      if (error) throw error;

      const mappedDudis: Dudi[] =
        data?.map((d) => ({
          id: d.id,
          name: d.nama,
          address: d.alamat,
          phone: d.telepon,
        })) || [];

      setDudis(mappedDudis);
      setFilteredDudis(mappedDudis);
    } catch (err) {
      console.error("Error fetching DUDIs:", err);
      setDudis([]);
      setFilteredDudis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDudis();
    fetchStats();
  }, []);

  // ---------------------------
  // 3. Pencarian / Filtering
  // ---------------------------
  useEffect(() => {
    const filtered = dudis.filter(
      (dudi) =>
        dudi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dudi.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDudis(filtered);
  }, [searchTerm, dudis]);

  // ---------------------------
  // 4. Modal + Form Handling
  // ---------------------------
  const handleOpenModal = (dudi: Dudi | null = null) => {
    if (dudi) {
      setIsEditing(true);
      setCurrentDudi(dudi);
      setFormData({
        name: dudi.name,
        address: dudi.address,
        phone: dudi.phone,
      });
    } else {
      setIsEditing(false);
      setCurrentDudi(null);
      setFormData({ name: "", address: "", phone: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDudi(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // 5. CRUD Supabase
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = {
      nama: formData.name,
      alamat: formData.address,
      telepon: formData.phone,
    };

    try {
      if (isEditing && currentDudi) {
        const { error } = await supabase
          .from("dudis")
          .update(submitData)
          .eq("id", currentDudi.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("dudis").insert([submitData]);
        if (error) throw error;
      }
      fetchDudis();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving DUDI:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus DUDI ini?")) {
      try {
        const { error } = await supabase.from("dudis").delete().eq("id", id);
        if (error) throw error;
        fetchDudis();
      } catch (err) {
        console.error("Error deleting DUDI:", err);
      }
    }
  };

  // ---------------------------
  // 6. Render
  // ---------------------------
  const tableHeaders = ["Nama", "Kontak", "Alamat", "Aksi"];
  const tableData = filteredDudis.map((d) => ({
    nama: d.name,
    kontak: d.phone,
    alamat: d.address.length > 40 ? d.address.slice(0, 40) + "..." : d.address,
    aksi: (
      <div className="flex gap-2">
        <button
          onClick={() => handleOpenModal(d)}
          className="text-blue-500 hover:text-blue-700 p-1"
          title="Edit"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => handleDelete(d.id)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Hapus"
        >
          <FaTrash size={16} />
        </button>
      </div>
    ),
  }));

  if (loading || statsLoading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-600">Memuat data DUDI...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manajemen Mitra DUDI
        </h1>
        <p className="text-gray-600">
          Kelola data mitra DUDI untuk program magang
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dudiStats.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Search & Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Cari nama perusahaan atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Tambah DUDI
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="p-4">
          {filteredDudis.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tidak ada data DUDI yang ditemukan.
            </p>
          ) : (
            <Table headers={tableHeaders} data={tableData} />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Mitra DUDI" : "Tambah Mitra DUDI"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Nama Perusahaan
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Alamat
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GuruDudiPage;
