import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FileSpreadsheet, FileText } from "lucide-react";

const stats = [
  { label: "Gross Sale", value: 0, percent: 0, sub: "0 (0.00%)" },
  { label: "Net Sale", value: 0, percent: 0, sub: "0 (0.00%)" },
  { label: "Refunded Orders", value: 0, percent: 0, sub: "0" },
  { label: "Cancelled Orders", value: 0, percent: 0, sub: "0" },
  { label: "My Orders", value: 0, percent: 0, sub: "0 orders today" },
];

const reportCards = [
  {
    label: "Clients",
    count: 3,
    img: "https://ipestretail.com/images/icons/clients.svg", // placeholder
  },
  {
    label: "Products",
    count: 1,
    img: "https://ipestretail.com/images/icons/products.svg", // placeholder
  },
  {
    label: "My Orders",
    count: 0,
    img: "https://ipestretail.com/images/icons/reports.svg", // placeholder
  },
  {
    label: "Sales Report",
    count: null,
    img: "https://ipestretail.com/images/icons/reports2.svg", // placeholder
  },
];

const Reports: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  if (!user || !user.isAdmin) return <Navigate to="/" />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Reports</h1>
      {/* Stats Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-xs text-gray-500 mb-1 font-medium">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-[var(--brand-primary,#2563eb)]">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>
          ))}
        </div>
        <hr className="my-2 border-gray-200" />
        {/* Chart Section */}
        <div className="mt-6">
          <div className="text-lg font-semibold mb-2 text-gray-800">
            Gross Sales
          </div>
          {/* Placeholder for chart - replace with chart.js or recharts if available */}
          <div className="w-full h-56 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 600 120">
              <polyline
                fill="none"
                stroke="var(--brand-yellow,#eab308)"
                strokeWidth="3"
                points="10,60 60,60 110,60 160,60 210,60 260,60 310,60 360,60 410,60 460,60 510,60 560,60"
              />
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} cx={10 + i * 50} cy={60} r={4} fill="var(--brand-yellow,#eab308)" />
              ))}
              <text x="10" y="110" fontSize="12" fill="#888">
                16 Apr
              </text>
              <text x="510" y="110" fontSize="12" fill="#888">
                16 May
              </text>
            </svg>
          </div>
        </div>
      </div>
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {reportCards.map((card, idx) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-6"
          >
            {/* Illustration (use img or lottie-player if available) */}
            <div className="mb-4">
              <img
                src={card.img}
                alt={card.label}
                className="w-28 h-20 object-contain"
              />
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {card.label}{" "}
              {card.count !== null && (
                <span className="text-gray-400">({card.count})</span>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--brand-green,#bbf7d0)] text-[var(--brand-green-text,#15803d)] font-medium hover:bg-[var(--brand-green-hover,#86efac)] transition">
                <FileSpreadsheet size={18} /> XLSX
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-medium hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition">
                <FileText size={18} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
