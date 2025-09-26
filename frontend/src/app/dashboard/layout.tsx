export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="flex-1 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
