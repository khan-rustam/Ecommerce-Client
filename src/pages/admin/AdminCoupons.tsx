import React, { useState } from "react";
import { Plus, FileText, Save, X } from "lucide-react";

const initialPromocodes: any[] = [];

const PromocodeModal = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (promo: any) => void;
}) => {
  const [form, setForm] = useState({
    code: "",
    percent: false,
    amount: "",
    foreignAmount: "",
    enabled: false,
    start: "",
    end: "",
    categories: [],
    newOnly: false,
  });
  const [saving, setSaving] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2
          className="text-xl font-bold mb-6"
          style={{ color: 'var(--brand-primary)' }}
        >
          Create promocode
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSaving(true);
            setTimeout(() => {
              onSave(form);
              setSaving(false);
            }, 500);
          }}
        >
          <div>
            <label className="block font-semibold mb-1">
              Promocode <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2 w-full"
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded p-3">
            <span className="font-medium flex-1">
              Calculate amount in percentage(%)
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.percent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, percent: e.target.checked }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 transition-all"></div>
            </label>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Amount / Rate{form.percent ? "(%)" : ""}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                className="border rounded px-3 py-2 w-full"
                required
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Foreign Amount / Rate{form.percent ? "(%)" : ""}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l">
                  $
                </span>
                <input
                  className="border rounded-r px-3 py-2 w-full"
                  required
                  type="number"
                  value={form.foreignAmount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, foreignAmount: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Start Date</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="date"
                value={form.start}
                onChange={(e) =>
                  setForm((f) => ({ ...f, start: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">End Date</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="date"
                value={form.end}
                onChange={(e) =>
                  setForm((f) => ({ ...f, end: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Apply on categories{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.newOnly}
                onChange={(e) =>
                  setForm((f) => ({ ...f, newOnly: e.target.checked }))
                }
              />
              <span>New</span>
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition text-base"
            style={{ background: 'var(--brand-primary)', color: 'var(--brand-background)' }}
            disabled={saving}
          >
            <Save size={18} /> Save
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminCoupons = () => {
  const [promocodes, setPromocodes] = useState(initialPromocodes);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPromocodes = promocodes.filter((p: any) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center"
      style={{ background: 'var(--brand-background)' }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Promocodes
          </h1>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200"
            onClick={() => setShowModal(true)}
            aria-label="Add Promocode"
          >
            <Plus size={22} />
          </button>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#2563eb)] bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 text-left">Promocode</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Amount / rate</th>
                <th className="py-3 px-4 text-left">Foreign amount / rate</th>
                <th className="py-3 px-4 text-left">Activate</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromocodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <FileText size={56} className="text-gray-300 mb-2" />
                      <div className="text-xl font-semibold text-gray-500">
                        No Promocodes Added Yet
                      </div>
                      <div className="text-gray-400 mb-4">
                        Create your first promocode by clicking the + button in
                        the top right corner.
                      </div>
                      <button
                        className="px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition text-base bg-gray-500 text-white"
                        onClick={() => setShowModal(true)}
                      >
                        <Plus size={18} className="inline-block mr-2" /> Add
                        Promocode
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPromocodes.map((promo: any, idx: number) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{promo.code}</td>
                    <td className="py-3 px-4">
                      {promo.start} - {promo.end}
                    </td>
                    <td className="py-3 px-4">
                      {promo.amount}
                      {promo.percent ? "%" : ""}
                    </td>
                    <td className="py-3 px-4">
                      ${promo.foreignAmount}
                      {promo.percent ? "%" : ""}
                    </td>
                    <td className="py-3 px-4">
                      {promo.enabled ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PromocodeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(promo) => {
          setPromocodes((prev: any) => [...prev, promo]);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default AdminCoupons;
