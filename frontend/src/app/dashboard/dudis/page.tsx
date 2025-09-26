"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

// Tipe data untuk Mitra DUDI
type Dudi = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

const DudiPage = () => {
  const router = useRouter();
  const [dudis, setDudis] = useState<Dudi[]>([]);
  const [filteredDudis, setFilteredDudis] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDudi, setCurrentDudi] = useState<Dudi | null>(null);
  const [formData, setFormData] = useState<Omit<Dudi, 'id'>>({ 
    name: '', 
    address: '', 
    phone: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');

  // -----------------------------------------------------
  // 1. DATA FETCHING
  // -----------------------------------------------------
  const fetchDudis = async () => {
    setLoading(true);
    try {
      // Asumsikan nama tabel di Supabase adalah 'dudis'
      const { data, error } = await supabase.from('dudis').select('*').order('nama', { ascending: true });
      
      if (error) {
        console.error('Error fetching DUDIs:', error);
        setDudis([]);
        setFilteredDudis([]);
      } else {
        const dudisData = data || [];
        const mappedDudis = dudisData.map((d: any) => ({
          id: d.id,
          name: d.nama || '',
          address: d.alamat || '',
          phone: d.telepon || '',
        })) as Dudi[];
        setDudis(mappedDudis);
        setFilteredDudis(mappedDudis);
      }
    } catch (err) {
      console.error('Unexpected error fetching DUDIs:', err);
      setDudis([]);
      setFilteredDudis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      fetchDudis();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (session) {
        fetchDudis();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // -----------------------------------------------------
  // 2. SEARCH / FILTERING LOGIC
  // -----------------------------------------------------
  useEffect(() => {
    const filtered = dudis.filter(dudi =>
      dudi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dudi.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDudis(filtered);
  }, [searchTerm, dudis]);

  // -----------------------------------------------------
  // 3. MODAL AND FORM HANDLING
  // -----------------------------------------------------
  const handleOpenModal = (dudi: Dudi | null = null) => {
    if (dudi) {
      setIsEditing(true);
      setCurrentDudi(dudi);
      setFormData({ 
        name: dudi.name, 
        address: dudi.address, 
        phone: dudi.phone 
      });
    } else {
      setIsEditing(false);
      setCurrentDudi(null);
      setFormData({ 
        name: '', 
        address: '', 
        phone: '' 
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDudi(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // -----------------------------------------------------
  // 4. CRUD OPERATIONS
  // -----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = {
      nama: formData.name,
      alamat: formData.address,
      telepon: formData.phone,
      // Optional: email, jabatan, bidang_usaha can be added if form expanded
    };

    if (isEditing && currentDudi) {
      // Logic untuk UPDATE (Edit)
      const { error } = await supabase
        .from('dudis')
        .update(submitData)
        .eq('id', currentDudi.id);
      if (error) console.error('Error updating DUDI:', error);
    } else {
      // Logic untuk INSERT (Tambah Baru)
      const { error } = await supabase.from('dudis').insert([submitData]);
      if (error) console.error('Error adding DUDI:', error);
    }

    fetchDudis(); // Refresh data
    handleCloseModal();
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus DUDI ini?')) {
        const { error } = await supabase.from('dudis').delete().eq('id', id);
        if (error) {
            console.error('Error deleting DUDI:', error);
        } else {
            fetchDudis(); // Refresh data
        }
    }
  };

  // -----------------------------------------------------
  // 5. RENDER LOGIC
  // -----------------------------------------------------
  const tableHeaders = ['ID', 'Nama Perusahaan', 'Alamat', 'Telepon', 'Aksi'];
  const tableData = filteredDudis.map((d: Dudi) => ({
    id: d.id,
    name: d.name,
    address: d.address.length > 40 ? `${d.address.substring(0, 40)}...` : d.address,
    phone: d.phone,
    actions: (
      <div className="flex gap-2">
        <button 
            onClick={() => handleOpenModal(d)} 
            className="text-blue-500 hover:text-blue-700 hover:underline"
        >
            Edit
        </button>
        <button 
            onClick={() => handleDelete(d.id)} 
            className="text-red-500 hover:text-red-700 hover:underline"
        >
            Hapus
        </button>
      </div>
    ),
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <Navbar />
          <div className="p-6 text-center">Memuat data DUDI...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama */}
      <main className="flex-1 p-6">
        <Navbar />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Mitra DUDI</h1>
            <p className="text-gray-600">Kelola data mitra DUDI untuk program magang</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari nama perusahaan atau alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            + Tambah DUDI
          </button>
        </div>

        <div className="bg-white p-2 rounded-lg shadow-lg w-full max-w-full mx-auto">
          {filteredDudis.length === 0 && !loading ? (
              <p className="text-center text-gray-500">Tidak ada data DUDI yang ditemukan.</p>
          ) : (
              <Table headers={tableHeaders} data={tableData} />
          )}
        </div>

        {/* Modal untuk Tambah/Edit */}
        <Modal 
          show={showModal} 
          onClose={handleCloseModal} 
          title={isEditing ? 'Edit Mitra DUDI' : 'Tambah Mitra DUDI'}
        >
          <form onSubmit={handleSubmit}>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nama Perusahaan</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Telepon</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambah'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default DudiPage;
