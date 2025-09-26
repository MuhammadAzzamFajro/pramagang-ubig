"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

type Dudi = {
  id: number;
  nama: string;
  alamat: string;
  telepon: string;
};

const GuruDudiPage = () => {
  const [dudis, setDudis] = useState<Dudi[]>([]);
  const [filteredDudis, setFilteredDudis] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDudi, setCurrentDudi] = useState<Dudi | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDudis = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("dudis").select("id, nama, alamat, telepon").order("nama", { ascending: true });

    if (error) {
      console.error("Error fetching DUDIs:", error);
      setDudis([]);
    } else {
      setDudis(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDudis();
  }, []);

  useEffect(() => {
    const filtered = dudis.filter((dudi) => dudi.nama.toLowerCase().includes(searchTerm.toLowerCase()) || dudi.alamat.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredDudis(filtered);
  }, [searchTerm, dudis]);

  const handleOpenModal = (dudi: Dudi | null = null) => {
    if (dudi) {
      setIsEditing(true);
      setCurrentDudi(dudi);
      setFormData({ name: dudi.nama, address: dudi.alamat, phone: dudi.telepon });
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
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = { nama: formData.name, alamat: formData.address, telepon: formData.phone };

    if (isEditing && currentDudi) {
      const { error } = await supabase.from("dudis").update(submitData).eq("id", currentDudi.id);
      if (error) console.error("Error updating DUDI:", error.message);
    } else {
      const { error } = await supabase.from("dudis").insert([submitData]);
      if (error) console.error("Error adding DUDI:", error.message);
    }
    fetchDudis();
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus DUDI ini?")) {
      const { error } = await supabase.from("dudis").delete().eq("id", id);
      if (error) console.error("Error deleting DUDI:", error.message);
      else fetchDudis();
    }
  };

  const tableHeaders = ["ID", "Nama Perusahaan", "Alamat", "Telepon", "Aksi"];
  const tableData = filteredDudis.map((d: Dudi) => ({
    id: d.id,
    name: d.nama,
    address: d.alamat,
    phone: d.telepon,
    actions: (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(d)} className="text-blue-500 hover:text-blue-700 hover:underline">
          Edit
        </button>
        <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700 hover:underline">
          Hapus
        </button>
      </div>
    ),
  }));

  if (loading) return <div className="p-6 text-center">Memuat data DUDI...</div>;

  return (
    <>
      <Navbar />
      <div className="mb-6 mt-9">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Mitra DUDI</h1>
        <p className="text-gray-600">Kelola data mitra DUDI untuk program magang</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Cari nama perusahaan atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={() => handleOpenModal(null)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
          + Tambah DUDI
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="p-4">{filteredDudis.length === 0 && !loading ? <p className="text-center text-gray-500 py-8">Tidak ada data DUDI.</p> : <Table headers={tableHeaders} data={tableData} />}</div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal} title={isEditing ? "Edit Mitra DUDI" : "Tambah Mitra DUDI"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Perusahaan</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Telepon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              {isEditing ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GuruDudiPage;
