import React from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Table from "@/components/Table";
import { FaClock, FaCheckCircle, FaTimesCircle, FaBookOpen } from "react-icons/fa";

const GuruLogbookPage = () => {
  // Dummy data for demonstration
  const logbookStats = [
    { title: "Pending Approvals", value: "5", icon: <FaClock /> },
    { title: "Approved Today", value: "12", icon: <FaCheckCircle /> },
    { title: "Rejected Today", value: "2", icon: <FaTimesCircle /> },
    { title: "Total Logbooks", value: "47", icon: <FaBookOpen /> },
  ];

  const tableHeaders = ["Student", "Date", "Activity", "Status", "Actions"];

  const pendingLogbooks = [
    {
      student: "Budi Santoso",
      date: "2025-01-15",
      activity: "Belajar HTML & CSS",
      status: "Pending",
    },
    {
      student: "Siti Nurhaliza",
      date: "2025-01-15",
      activity: "Membuat prototipe aplikasi",
      status: "Pending",
    },
    {
      student: "Ahmad Rizki",
      date: "2025-01-14",
      activity: "Debugging kode",
      status: "Pending",
    },
    {
      student: "Dewi Sartika",
      date: "2025-01-14",
      activity: "Presentasi proyek",
      status: "Pending",
    },
  ];

  const tableData = pendingLogbooks.map((log) => ({
    student: log.student,
    date: log.date,
    activity: log.activity,
    status: (
      <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
        {log.status}
      </span>
    ),
    actions: (
      <div className="flex gap-2">
        <button className="text-green-500 hover:underline">Approve</button>
        <button className="text-red-500 hover:underline">Reject</button>
      </div>
    ),
  }));

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Approval Logbook</h1>
          <p className="text-white">Kelola dan setujui logbook siswa magang</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {logbookStats.map((item, index) => (
            <Card key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>

        {/* Pending Logbooks Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Approvals</h2>
            <Table headers={tableHeaders} data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GuruLogbookPage;
