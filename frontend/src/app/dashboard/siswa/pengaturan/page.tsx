"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function PengaturanPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kontak: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch siswa details by user_id (assume user.id links to siswas.user_id)
        const { data: siswa } = await supabase
          .from("siswas")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        if (siswa) {
          setUser(siswa);
          setFormData({
            nama: siswa.nama,
            email: siswa.email || "",
            kontak: siswa.kontak || "",
          });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("siswas")
      .update(formData)
      .eq("id", user.id);
    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      setUser({ ...user, ...formData });
      setEditing(false);
      alert("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form if needed
  };

  if (loading) return <div className="text-white">Loading...</div>;

  if (!user) return <div className="text-white">User not found.</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Pengaturan Akun</h1>
      
      <div className="bg-white p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Profil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nama: e.target.value })}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
            <input
              type="text"
              value={formData.kontak}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, kontak: e.target.value })}
              disabled={!editing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {editing ? (
            <>
              <Button onClick={handleSave} className="bg-blue-600 text-white">Simpan</Button>
              <Button onClick={handleCancel} variant="outline">Batal</Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="bg-blue-600 text-white">Edit Profil</Button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Keamanan</h2>
        <p className="text-gray-600">Ubah kata sandi melalui pengaturan akun Supabase.</p>
      </div>
    </div>
  );
}
