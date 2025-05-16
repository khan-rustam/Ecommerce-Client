import { useEffect, useState } from "react";
import { useBrandColors } from "../../contexts/BrandColorContext";

const CUSTOM_PALETTE = {
  name: "Custom",
  primary: "#ea580c",
  secondary: "#fbbf24",
  accent: "#ffecd2",
  background: "#fff8f1",
  text: "#222222",
  bg: "bg-gradient-to-br from-gray-50 to-gray-200",
};

const PALETTES = [
  {
    name: "Sunset Orange",
    primary: "#ff6600",
    secondary: "#ffb347",
    accent: "#ffecd2",
    background: "#fff8f1",
    text: "#222222",
    bg: "bg-gradient-to-br from-orange-50 to-orange-200",
  },
  {
    name: "Ocean Blue",
    primary: "#0077b6",
    secondary: "#90e0ef",
    accent: "#caf0f8",
    background: "#e0f7fa",
    text: "#1a237e",
    bg: "bg-gradient-to-br from-blue-50 to-blue-200",
  },
  {
    name: "Emerald Green",
    primary: "#10b981",
    secondary: "#6ee7b7",
    accent: "#d1fae5",
    background: "#e6fff7",
    text: "#065f46",
    bg: "bg-gradient-to-br from-green-50 to-green-200",
  },
  {
    name: "Royal Purple",
    primary: "#7c3aed",
    secondary: "#c4b5fd",
    accent: "#ede9fe",
    background: "#f3e8ff",
    text: "#2e1065",
    bg: "bg-gradient-to-br from-purple-50 to-purple-200",
  },
  {
    name: "Berry Pink",
    primary: "#d72660",
    secondary: "#f46036",
    accent: "#2e294e",
    background: "#fff1f7",
    text: "#2e294e",
    bg: "bg-gradient-to-br from-pink-50 to-pink-200",
  },
  {
    name: "Slate Gray",
    primary: "#334e68",
    secondary: "#7d8597",
    accent: "#bcccdc",
    background: "#f0f4f8",
    text: "#102a43",
    bg: "bg-gradient-to-br from-gray-50 to-gray-200",
  },
  {
    name: "Lime Fresh",
    primary: "#a3e635",
    secondary: "#bef264",
    accent: "#f7fee7",
    background: "#fafff0",
    text: "#365314",
    bg: "bg-gradient-to-br from-lime-50 to-lime-200",
  },
  {
    name: "Classic Red",
    primary: "#dc2626",
    secondary: "#f87171",
    accent: "#fee2e2",
    background: "#fff5f5",
    text: "#7f1d1d",
    bg: "bg-gradient-to-br from-red-50 to-red-200",
  },
];

const API_URL = "/api/admin/brand-settings";

const AdminBrandSettings = () => {
  const [selected, setSelected] = useState(PALETTES[0]);
  const [custom, setCustom] = useState(CUSTOM_PALETTE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { setColors } = useBrandColors();

  useEffect(() => {
    // On mount, fetch current brand settings
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.paletteName) {
          const found = PALETTES.find((p) => p.name === data.paletteName);
          if (found) setSelected(found);
        }
      });
  }, []);

  const handleApply = () => {
    const palette = selected.name === "Custom" ? custom : selected;
    setColors({
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
      text: palette.text,
    });
    document.documentElement.style.setProperty("--brand-accent", palette.accent);
    document.documentElement.style.setProperty("--brand-background", palette.background);
    document.documentElement.style.setProperty("--brand-text", palette.text);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paletteName: selected.name }),
      });
      if (!res.ok) throw new Error("Failed to save brand settings");
      setMessage("Brand settings saved!");
    } catch (err) {
      setMessage("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${selected.bg || custom.bg} py-8 px-2`}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight text-gray-900">Brand Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {PALETTES.map((palette) => (
              <div
                key={palette.name}
                className={`rounded-xl p-6 shadow-md cursor-pointer border-2 transition-all duration-200 flex flex-col items-center ${selected.name === palette.name ? "border-orange-500 scale-105 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300"}`}
                style={{ background: palette.accent }}
                onClick={() => setSelected(palette)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full block" style={{ background: palette.primary }} title="Primary"></span>
                  <span className="w-5 h-5 rounded-full block" style={{ background: palette.secondary }} title="Secondary"></span>
                  <span className="w-5 h-5 rounded-full block" style={{ background: palette.accent }} title="Accent"></span>
                  <span className="w-5 h-5 rounded-full block" style={{ background: palette.background, border: '1px solid #eee' }} title="Background"></span>
                </div>
                <span className="font-semibold text-base text-gray-800">{palette.name}</span>
              </div>
            ))}
            {/* Custom Palette Card */}
            <div
              className={`rounded-xl p-6 shadow-md cursor-pointer border-2 transition-all duration-200 flex flex-col items-center ${selected.name === "Custom" ? "border-orange-500 scale-105 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300"}`}
              style={{ background: custom.accent }}
              onClick={() => setSelected({ ...custom, name: "Custom" })}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full block" style={{ background: custom.primary }} title="Primary"></span>
                <span className="w-5 h-5 rounded-full block" style={{ background: custom.secondary }} title="Secondary"></span>
                <span className="w-5 h-5 rounded-full block" style={{ background: custom.accent }} title="Accent"></span>
                <span className="w-5 h-5 rounded-full block" style={{ background: custom.background, border: '1px solid #eee' }} title="Background"></span>
              </div>
              <span className="font-semibold text-base text-gray-800">Custom</span>
            </div>
          </div>
          {/* Custom Color Pickers */}
          {selected.name === "Custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Primary</label>
                <input type="color" value={custom.primary} onChange={e => setCustom({ ...custom, primary: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Secondary</label>
                <input type="color" value={custom.secondary} onChange={e => setCustom({ ...custom, secondary: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Accent</label>
                <input type="color" value={custom.accent} onChange={e => setCustom({ ...custom, accent: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Background</label>
                <input type="color" value={custom.background} onChange={e => setCustom({ ...custom, background: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Text</label>
                <input type="color" value={custom.text} onChange={e => setCustom({ ...custom, text: e.target.value })} />
              </div>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-all"
              onClick={() => {
                handleApply();
                setMessage("Brand settings saved and applied!");
              }}
              type="button"
            >
              Save & Apply
            </button>
          </div>
          {message && (
            <div className="mt-6 text-center text-lg font-semibold text-orange-600">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBrandSettings;
