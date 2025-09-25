"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, GraduationCap, BookOpen } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      desc: "Ringkasan aktivitas",
      href: "/dashboard/siswa",
      icon: <Home size={20} />,
    },
    {
      name: "DUDI",
      desc: "Dunia Usaha & Industri",
      href: "/dashboard/dudi",
      icon: <Building2 size={20} />,
    },
    {
      name: "Magang",
      desc: "Data magang saya",
      href: "/dashboard/magang",
      icon: <GraduationCap size={20} />,
    },
    {
      name: "Logbook",
      desc: "Catatan harian",
      href: "/dashboard/logbook",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col py-6">
      <h2 className="px-6 text-lg font-semibold mb-8">Portal Siswa</h2>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const active = pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition
                ${active ? "bg-cyan-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              {menu.icon}
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
