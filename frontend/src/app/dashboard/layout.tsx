import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar akan muncul di sini */}
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
