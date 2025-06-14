import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  Settings,
} from "lucide-react";

const AdminHome = () => {
  const cards = [
    {
      to: "/admin/users",
      label: "Users",
      icon: <Users size={32} style={{ color: 'var(--brand-primary)' }} />,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: <Package size={32} style={{ color: 'var(--brand-secondary)' }} />,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: <ShoppingBag size={32} style={{ color: 'var(--brand-accent)' }} />,
    },
    {
      to: "/admin/addresses",
      label: "Addresses",
      icon: <MapPin size={32} style={{ color: 'var(--brand-text)' }} />,
    },
    {
      to: "/admin/payments",
      label: "Payments",
      icon: <CreditCard size={32} style={{ color: 'var(--brand-primary)' }} />,
    },
    {
      to: "/admin/settings",
      label: "Settings",
      icon: <Settings size={32} style={{ color: 'var(--brand-secondary)' }} />,
    },
  ];
  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: 'var(--brand-primary)' }}
      >
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl shadow-md hover:shadow-lg p-8 flex flex-col items-center justify-center transition group border"
            style={{ borderColor: 'var(--brand-secondary)' }}
          >
            {card.icon}
            <span
              className="mt-4 text-lg font-semibold group-hover:underline"
              style={{ color: 'var(--brand-text)' }}
            >
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AdminHome;
