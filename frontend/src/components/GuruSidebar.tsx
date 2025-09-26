"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Clipboard, BookOpen } from "lucide-react"; // Menggunakan ikon yang konsisten

export default function GuruSidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      desc: "Ringkasan aktivitas",
      href: "/dashboard/guru",
      icon: <Home size={20} />,
    },
    {
      name: "DUDI",
      desc: "Manajemen Mitra",
      href: "/dashboard/guru/dudi",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Magang",
      desc: "Manajemen Siswa Magang",
      href: "/dashboard/guru/magang",
      icon: <Clipboard size={20} />,
    },
    {
      name: "Logbook",
      desc: "Verifikasi Laporan",
      href: "/dashboard/guru/logbook",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-white py-6 shadow-md">
      <h2 className="px-6 text-lg font-semibold mb-8">Portal Guru</h2>

      <nav className="flex flex-col gap-2 px-4">
        {menus.map((menu) => {
          const isDashboardLink = menu.href === "/dashboard/guru";
          const active = isDashboardLink ? pathname === menu.href : pathname.startsWith(menu.href);

          return (
            <Link key={menu.name} href={menu.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "text-gray-600 hover:bg-gray-100"}`}>
              <div className={`transition-colors ${active ? "text-white" : "text-gray-400"}`}>{menu.icon}</div>
              <div>
                <p className="text-sm font-medium">{menu.name}</p>
                <p className="text-xs opacity-75">{menu.desc}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
