import Card from "@/components/Card";
import Table from "@/components/Table";
import { FaBriefcase, FaCalendar, FaBuilding, FaUserTie } from "react-icons/fa";

const MagangPage = () => {
  // Hardcoded demo data from screenshot, no login required
  const magangData = [
    { title: "Status Magang Saya", value: "Aktif", icon: <FaBriefcase /> },
    { title: "Durasi Magang", value: "15/01/2025 - 15/04/2025", icon: <FaCalendar /> },
    { title: "DUDI Tujuan", value: "PT Teknologi Nusantara", icon: <FaBuilding /> },
    { title: "Pembimbing Lapangan", value: "Pak Joko", icon: <FaUserTie /> },
  ];

  const tableHeaders = ["No", "Periode", "DUDI", "Status", "Aksi"];
  const magangTableData = [
    {
      no: 1,
      periode: "Januari - April 2025",
      dudi: "PT Teknologi Nusantara",
      status: "Aktif",
      aksi: "Edit | Hapus"
    }
  ];

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Magang</h1>
        <p className="text-gray-300">Data magang saya</p>
      </div>

      {/* Magang Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {magangData.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* Magang Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Riwayat Magang</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Tambah Magang
          </button>
        </div>
        <Table headers={tableHeaders} data={magangTableData} />
      </div>
    </div>
  );
};

export default MagangPage;
