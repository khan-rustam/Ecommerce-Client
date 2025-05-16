import React from "react";
import { useNavigate } from "react-router-dom";
import { useBrandColors } from "../../contexts/BrandColorContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  { label: "Gross Sale", value: 0, sub: "0 (0.00%)" },
  { label: "Net Sale", value: 0, sub: "0 (0.00%)" },
  { label: "Refunded Orders", value: 0, sub: "0" },
  { label: "Cancelled Orders", value: 0, sub: "0" },
  { label: "My Orders", value: 0, sub: "0 orders today" },
];

const grossSalesData = [
  { date: "16 Apr", value: 0 },
  { date: "17 Apr", value: 0 },
  { date: "18 Apr", value: 0 },
  { date: "19 Apr", value: 0 },
  { date: "20 Apr", value: 0 },
  { date: "21 Apr", value: 0 },
  { date: "22 Apr", value: 0 },
  { date: "23 Apr", value: 0 },
  { date: "24 Apr", value: 0 },
  { date: "25 Apr", value: 0 },
  { date: "26 Apr", value: 0 },
  { date: "27 Apr", value: 0 },
  { date: "28 Apr", value: 0 },
  { date: "29 Apr", value: 0 },
  { date: "30 Apr", value: 0 },
  { date: "01 May", value: 0 },
  { date: "02 May", value: 0 },
  { date: "03 May", value: 0 },
  { date: "04 May", value: 0 },
  { date: "05 May", value: 0 },
  { date: "06 May", value: 0 },
  { date: "07 May", value: 0 },
  { date: "08 May", value: 0 },
  { date: "09 May", value: 0 },
  { date: "10 May", value: 0 },
  { date: "11 May", value: 0 },
  { date: "12 May", value: 0 },
  { date: "13 May", value: 0 },
  { date: "14 May", value: 0 },
  { date: "15 May", value: 0 },
  { date: "16 May", value: 0 },
];

const dashboardCards = [
  {
    label: "Clients",
    count: 3,
    img: "https://ipestretail.com/images/icons/clients.svg",
    to: "/admin/users",
    sub: null,
  },
  {
    label: "Interested Clients",
    count: 0,
    img: "https://ipestretail.com/images/icons/clients.svg",
    to: "/admin/interested-clients",
    sub: "No interested clients yet",
  },
  {
    label: "Products",
    count: 1,
    img: "https://ipestretail.com/images/icons/products.svg",
    to: "/admin/products",
    sub: null,
  },
  {
    label: "Brands",
    count: 1,
    img: "https://ipestretail.com/images/icons/brands.svg",
    to: "/admin/brands",
    sub: null,
  },
  {
    label: "Categories",
    count: 19,
    img: "https://ipestretail.com/images/icons/categories.svg",
    to: "/admin/categories",
    sub: null,
  },
  {
    label: "Notices",
    count: 1,
    img: "https://ipestretail.com/images/icons/reports.svg",
    to: "/admin/notice",
    sub: null,
  },
  {
    label: "New Orders",
    count: 0,
    img: "https://ipestretail.com/images/icons/orders.svg",
    to: "/admin/orders",
    sub: null,
  },
  {
    label: "Queries",
    count: 0,
    img: "https://ipestretail.com/images/icons/queries.svg",
    to: "#",
    sub: "No pending queries yet",
  },
  {
    label: "Pending Enquiries",
    count: 1,
    img: "https://ipestretail.com/images/icons/enquiry.svg",
    to: "#",
    sub: null,
  },
  {
    label: "Ratings",
    count: 0,
    img: "https://ipestretail.com/images/icons/ratings.svg",
    to: "/admin/reviews",
    sub: "No pending ratings",
  },
  {
    label: "Total Sales",
    count: 0,
    img: "https://ipestretail.com/images/icons/reports2.svg",
    to: "#",
    sub: null,
  },
  {
    label: "Reports",
    count: null,
    img: "https://ipestretail.com/images/icons/reports2.svg",
    to: "/admin/reports",
    sub: null,
  },
];

const AdminDashboard = () => {
  const { colors } = useBrandColors();
  const navigate = useNavigate();

  return (
    <div
      className="p-6 min-h-screen"
      style={{ color: colors.text, background: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Stats */}
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
          <div className="text-lg font-semibold mb-2 text-gray-800">
            Gross Sales
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={grossSalesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#eab308"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#eab308", fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, idx) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 cursor-pointer hover:shadow-lg transition group"
              onClick={() => card.to && card.to !== "#" && navigate(card.to)}
              style={{ minHeight: 220 }}
            >
              <div className="mb-4 flex items-center justify-center w-full h-24">
                <img
                  src={card.img}
                  alt={card.label}
                  className="w-28 h-20 object-contain group-hover:scale-105 transition"
                  loading="lazy"
                />
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-2 text-center">
                {card.label}{" "}
                {card.count !== null && (
                  <span className="text-gray-400">({card.count})</span>
                )}
              </div>
              {card.sub && (
                <div className="text-sm text-gray-400 text-center">
                  {card.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
