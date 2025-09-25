"use client";

import React from "react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-800">
        SMK Negeri 1 Surabaya
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Guru Pembimbing</div>
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
          G
        </div>
      </div>
    </header>
  );
}
