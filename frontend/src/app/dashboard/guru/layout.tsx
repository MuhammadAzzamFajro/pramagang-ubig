import GuruSidebar from "@/components/GuruSidebar";

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <GuruSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 bg-gray-800 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
