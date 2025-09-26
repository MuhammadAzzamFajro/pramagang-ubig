import Card from "@/components/Card";
import Table from "@/components/Table";
import { FaBuilding, FaBriefcase, FaCalendar, FaUserTie } from "react-icons/fa";

const DudiPage = () => {
  const dudiData = [
    { title: "DUDI Terpilih", value: "PT Teknologi Nusantara", icon: <FaBuilding /> },
    { title: "Status Magang", value: "Aktif", icon: <FaBriefcase /> },
    { title: "Durasi Magang", value: "15/01/2025 - 15/04/2025", icon: <FaCalendar /> },
    { title: "Pembimbing Lapangan", value: "Pak Joko", icon: <FaUserTie /> },
  ];

  const tableHeaders = ["No", "Nama DUDI", "Alamat", "Bidang Usaha", "Kontak"];
  const dudiTableData = [
    {
      no: 1,
      nama: "PT Teknologi Nusantara",
      alamat: "Jl. Sudirman No. 123, Surabaya",
      bidang: "Teknologi Informasi",
      kontak: "08123456789",
    },
  ];

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DUDI</h1>
        <p className="text-gray-600">Informasi Dunia Usaha & Dunia Industri</p>
      </div>

      {/* DUDI Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dudiData.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* DUDI Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Detail DUDI</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Tambah DUDI</button>
        </div>
        <Table headers={tableHeaders} data={dudiTableData} />
      </div>
    </div>
  );
};

export default DudiPage;
