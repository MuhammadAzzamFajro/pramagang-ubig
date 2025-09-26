"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBriefcase, FiBookOpen, FiClipboard } from "react-icons/fi";

export default function GuruSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-md border-r border-gray-100 min-h-screen px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
            <FiHome />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Magang</h3>
            <p className="text-xs text-gray-500">Management</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <Link href="/dashboard/guru" className={`flex items-center gap-3 p-3 rounded-lg ${isActive("/dashboard/guru") ? "bg-cyan-500 text-white" : "hover:bg-gray-50"}`}>
          <FiHome className={`text-xl ${isActive("/dashboard/guru") ? "text-white" : "text-cyan-600"}`} />
          <span className={`font-medium ${isActive("/dashboard/guru") ? "text-white" : "text-gray-800"}`}>Dashboard</span>
        </Link>

        <Link href="/dashboard/guru/dudis" className={`flex items-center gap-3 p-3 rounded-lg ${isActive("/dashboard/guru/dudis") ? "bg-cyan-500 text-white" : "hover:bg-gray-50"}`}>
          <FiBriefcase className={`text-xl ${isActive("/dashboard/guru/dudis") ? "text-white" : "text-cyan-600"}`} />
          <div>
            <div className={`font-medium ${isActive("/dashboard/guru/dudis") ? "text-white" : "text-gray-800"}`}>DUDI</div>
            <div className={`text-xs ${isActive("/dashboard/guru/dudis") ? "text-white/80" : "text-gray-400"}`}>Dunia Usaha & Industri</div>
          </div>
        </Link>

        <Link href="/dashboard/guru/magang" className={`flex items-center gap-3 p-3 rounded-lg ${isActive("/dashboard/guru/magang") ? "bg-cyan-500 text-white" : "hover:bg-gray-50"}`}>
          <FiClipboard className={`text-xl ${isActive("/dashboard/guru/magang") ? "text-white" : "text-cyan-600"}`} />
          <div>
            <div className={`font-medium ${isActive("/dashboard/guru/magang") ? "text-white" : "text-gray-800"}`}>Magang</div>
            <div className={`text-xs ${isActive("/dashboard/guru/magang") ? "text-white/80" : "text-gray-400"}`}>Data siswa magang</div>
          </div>
        </Link>

        <Link href="/dashboard/guru/logbook" className={`flex items-center gap-3 p-3 rounded-lg ${isActive("/dashboard/guru/logbook") ? "bg-cyan-500 text-white" : "hover:bg-gray-50"}`}>
          <FiBookOpen className={`text-xl ${isActive("/dashboard/guru/logbook") ? "text-white" : "text-cyan-600"}`} />
          <div>
            <div className={`font-medium ${isActive("/dashboard/guru/logbook") ? "text-white" : "text-gray-800"}`}>Logbook</div>
            <div className={`text-xs ${isActive("/dashboard/guru/logbook") ? "text-white/80" : "text-gray-400"}`}>Catatan harian</div>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
