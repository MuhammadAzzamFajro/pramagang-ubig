"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isSiswa = pathname.startsWith('/dashboard/siswa');

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-800">
        SMK Negeri 1 Surabaya
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">{isSiswa ? "Siswa" : "Guru Pembimbing"}</div>
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
          {isSiswa ? "S" : "G"}
        </div>
      </div>
    </header>
  );
}
