import Card from "@/components/Card";
import Table from "@/components/Table";
import { FaBook, FaPen, FaClock, FaCheckCircle } from "react-icons/fa";

const LogbookPage = () => {
  // Hardcoded demo data from screenshot, no login required
  const logbookData = [
    { title: "Total Logbook", value: "12", icon: <FaBook /> },
    { title: "Status Terakhir", value: "Disetujui", icon: <FaCheckCircle /> },
    { title: "Rata-rata Durasi", value: "2 jam/hari", icon: <FaClock /> },
    { title: "Kendala Tercatat", value: "3", icon: <FaPen /> },
  ];

  const tableHeaders = ["No", "Tanggal", "Aktivitas", "Kendala", "Status"];
  const logbookTableData = [
    {
      no: 1,
      tanggal: "15/01/2025",
      aktivitas: "Pengenalan sistem IT",
      kendala: "-",
      status: "Disetujui"
    },
    {
      no: 2,
      tanggal: "16/01/2025",
      aktivitas: "Pengembangan web",
      kendala: "Masalah koneksi",
      status: "Menunggu"
    },
    {
      no: 3,
      tanggal: "17/01/2025",
      aktivitas: "Testing aplikasi",
      kendala: "-",
      status: "Disetujui"
    }
  ];

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Logbook Magang Saya</h1>
        <p className="text-white">Catat kegiatan harian dan kendala yang Anda hadapi selama magang</p>
      </div>

      {/* Logbook Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {logbookData.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* Logbook Entries Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Entri Logbook</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Tambah Logbook
          </button>
        </div>
        <Table headers={tableHeaders} data={logbookTableData} />
      </div>
    </div>
  );
};

export default LogbookPage;
