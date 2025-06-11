import { useEffect, useState } from "react";
import React, { useRef } from "react";
import {
  useSettings,
  fetchAndUpdateSettings,
} from "../../contexts/SettingsContext";
import toast from "react-hot-toast";

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
  const { settings, setSettings } = useSettings();
  const [selected, setSelected] = useState(PALETTES[0]);
  const [custom, setCustom] = useState(CUSTOM_PALETTE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [logoWidth, setLogoWidth] = useState(settings.logoWidth || 48);
  const [logoHeight, setLogoHeight] = useState(settings.logoHeight || 48);
  const [logoSizeChanged, setLogoSizeChanged] = useState(false);
  const [logoSizeSaving, setLogoSizeSaving] = useState(false);

  // Website details state
  const [websiteDetails, setWebsiteDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    mapIframe: "",
    footerDescription: "",
  });

  // Toast helpers
  const showSuccess = (msg: string) => toast.success(msg);
  const showError = (msg: string) => toast.error(msg);

  // Add at the top, after other useState hooks
  const [heroFields, setHeroFields] = useState({
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    heroTitleFontSize: settings.heroTitleFontSize || 48,
    heroTitleFontWeight: settings.heroTitleFontWeight || "bold",
    heroSubtitleFontSize: settings.heroSubtitleFontSize || 20,
    heroSubtitleFontWeight: settings.heroSubtitleFontWeight || "normal",
  });

  // Keep local heroFields in sync with settings when settings change
  useEffect(() => {
    setHeroFields({
      heroTitle: settings.heroTitle || "",
      heroSubtitle: settings.heroSubtitle || "",
      heroTitleFontSize: settings.heroTitleFontSize || 48,
      heroTitleFontWeight: settings.heroTitleFontWeight || "bold",
      heroSubtitleFontSize: settings.heroSubtitleFontSize || 20,
      heroSubtitleFontWeight: settings.heroSubtitleFontWeight || "normal",
    });
  }, [
    settings.heroTitle,
    settings.heroSubtitle,
    settings.heroTitleFontSize,
    settings.heroTitleFontWeight,
    settings.heroSubtitleFontSize,
    settings.heroSubtitleFontWeight,
  ]);

  useEffect(() => {
    // On mount, fetch current brand settings and set palette
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.paletteName) {
            const found = PALETTES.find((p) => p.name === data.paletteName);
            if (found) setSelected(found);
            else if (data.paletteName === "Custom" && data.customColors) {
              setSelected({ ...CUSTOM_PALETTE, name: "Custom" });
              setCustom({ ...CUSTOM_PALETTE, ...data.customColors });
            }
          }
          if (data.logoWidth) setLogoWidth(data.logoWidth);
          if (data.logoHeight) setLogoHeight(data.logoHeight);
        }
      });
    document.documentElement.style.setProperty("--brand-accent", selected.accent);
    document.documentElement.style.setProperty(
      "--brand-background",
      selected.background
    );
    document.documentElement.style.setProperty("--brand-text", selected.text);
  }, [settings.paletteName, settings.logoWidth, settings.logoHeight]);

  useEffect(() => {
    setWebsiteDetails({
      name: settings.name || "",
      address: settings.address || "",
      email: settings.email || "",
      phone: settings.phone || "",
      facebook: settings.facebook || "",
      twitter: settings.twitter || "",
      instagram: settings.instagram || "",
      linkedin: settings.linkedin || "",
      mapIframe: settings.mapIframe || "",
      footerDescription: settings.footerDescription || "",
    });
  }, [settings]);

  const handleApply = async () => {
    document.documentElement.style.setProperty("--brand-accent", selected.accent);
    document.documentElement.style.setProperty(
      "--brand-background",
      selected.background
    );
    document.documentElement.style.setProperty("--brand-text", selected.text);
    setMessage("Brand settings saved and applied!");
    try {
      const body: any = { paletteName: selected.name };
      if (selected.name === "Custom") {
        body.customColors = custom;
        body.primary = custom.primary;
        body.secondary = custom.secondary;
        body.accent = custom.accent;
        body.background = custom.background;
        body.text = custom.text;
      } else {
        body.primary = selected.primary;
        body.secondary = selected.secondary;
        body.accent = selected.accent;
        body.background = selected.background;
        body.text = selected.text;
      }
      body.heroTitle = heroFields.heroTitle;
      body.heroSubtitle = heroFields.heroSubtitle;
      body.heroTitleFontSize = heroFields.heroTitleFontSize;
      body.heroTitleFontWeight = heroFields.heroTitleFontWeight;
      body.heroSubtitleFontSize = heroFields.heroSubtitleFontSize;
      body.heroSubtitleFontWeight = heroFields.heroSubtitleFontWeight;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings((prev) => ({ ...prev, ...body }));
        showSuccess("Brand color palette saved!");
      } else {
        showError(data.msg || "Failed to save brand settings.");
      }
    } catch {
      showError("Failed to save brand settings.");
    }
  };

  const handleWebsiteDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setWebsiteDetails({ ...websiteDetails, [e.target.name]: e.target.value });
  };

  // Save logo size to backend
  const handleLogoSizeSave = async () => {
    setLogoSizeSaving(true);
    try {
      const res = await fetch("/api/admin/brand-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoWidth, logoHeight }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings((prev) => ({ ...prev, logoWidth, logoHeight }));
        setLogoSizeChanged(false);
      }
    } catch {}
    setLogoSizeSaving(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pb-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 py-14 px-4">
        {/* Color Palette & Customization */}
        <section className="rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-slate-200 bg-white h-fit">
          <h2
            className="text-2xl font-extrabold mb-2 tracking-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Color Palette & Customization
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {PALETTES.map((palette) => (
              <div
                key={palette.name}
                className={`rounded-xl p-4 shadow cursor-pointer border-2 flex flex-col items-center transition-all duration-200 bg-gradient-to-br from-white to-orange-50 hover:scale-105 ${
                  selected.name === palette.name
                    ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                    : "border-gray-200 hover:border-orange-300"
                }`}
                style={{ background: palette.accent }}
                onClick={() => setSelected(palette)}
                tabIndex={0}
                aria-label={`Select ${palette.name} palette`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelected(palette);
                }}
              >
                <span
                  className={`${
                    palette.name === "Berry Pink"
                      ? "text-white"
                      : "text-gray-800"
                  } font-semibold text-base`}
                >
                  {palette.name}
                </span>
                {selected.name === palette.name && (
                  <span className="mt-2 text-orange-500 font-bold">✓</span>
                )}
              </div>
            ))}
            {/* Custom Palette Card */}
            <div
              className={`rounded-xl p-4 shadow cursor-pointer border-2 flex flex-col items-center transition-all duration-200 bg-gradient-to-br from-white to-orange-50 hover:scale-105 ${
                selected.name === "Custom"
                  ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              style={{ background: custom.accent }}
              onClick={() => setSelected({ ...CUSTOM_PALETTE, name: "Custom" })}
              tabIndex={0}
              aria-label="Select Custom palette"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setSelected({ ...CUSTOM_PALETTE, name: "Custom" });
              }}
            >
              <span className="font-semibold text-base text-gray-800">
                Custom
              </span>
              {selected.name === "Custom" && (
                <span className="mt-2 text-orange-500 font-bold">✓</span>
              )}
            </div>
          </div>
          {selected.name === "Custom" && (
            <div className="grid grid-cols-2 gap-4 mt-6 bg-orange-50 rounded-xl p-4">
              {["primary", "secondary", "accent", "background", "text"].map(
                (key) => (
                  <div className="flex flex-col gap-1" key={key}>
                    <label className="font-medium text-xs capitalize">
                      {key}
                    </label>
                    <input
                      type="color"
                      value={custom[key as keyof typeof custom]}
                      onChange={(e) =>
                        setCustom({ ...custom, [key]: e.target.value })
                      }
                      className="w-10 h-10 rounded-full border-2 border-gray-200 shadow"
                    />
                  </div>
                )
              )}
            </div>
          )}
          <button
            className="mt-6 px-6 py-2 rounded-lg font-bold shadow bg-gradient-to-r text-white text-lg hover:scale-105 transition-all"
            style={{
              letterSpacing: 1,
              color: 'var(--brand-primary)',
              background: 'var(--brand-accent)',
            }}
            onClick={handleApply}
            type="button"
          >
            Save & Apply
          </button>
        </section>
        {/* Website Details */}
        <section className="rounded-2xl shadow-lg p-8 flex flex-col bg-white gap-4 border border-slate-200 h-fit">
          <h2
            className="text-2xl font-extrabold mb-2 tracking-tight"
            style={{ color: 'var(--brand-primary)' }}
          >
            Website Details
          </h2>
          <div className="flex flex-col gap-3">
            <label className="font-semibold">Website Name</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="name"
              value={websiteDetails.name}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Address</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="address"
              value={websiteDetails.address}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Email</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="email"
              value={websiteDetails.email}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Phone</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="phone"
              value={websiteDetails.phone}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Facebook</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="facebook"
              value={websiteDetails.facebook}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Twitter</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="twitter"
              value={websiteDetails.twitter}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Instagram</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="instagram"
              value={websiteDetails.instagram}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">LinkedIn</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="linkedin"
              value={websiteDetails.linkedin}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Map Iframe Link</label>
            <input
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="mapIframe"
              value={websiteDetails.mapIframe}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            />
            <label className="font-semibold">Footer Description</label>
            <textarea
              className="rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2"
              style={{
                background: "#fff",
                color: 'var(--brand-text)',
                borderColor: "#eee",
                transition: "border 0.3s",
              }}
              name="footerDescription"
              value={websiteDetails.footerDescription}
              onChange={handleWebsiteDetailsChange}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
              rows={3}
            />
          </div>
          <button
            className="mt-4 px-6 py-2 rounded-lg font-bold shadow bg-gradient-to-r text-white text-lg hover:scale-105 transition-all"
            style={{
              letterSpacing: 1,
              color: 'var(--brand-primary)',
              background: 'var(--brand-accent)',
              position: "sticky",
              bottom: 0,
              zIndex: 10,
            }}
            onClick={async () => {
              setSaving(true);
              setMessage("");
              try {
                const res = await fetch("/api/admin/brand-settings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(websiteDetails),
                });
                const data = await res.json();
                if (res.ok) {
                  setSettings((prev) => ({ ...prev, ...websiteDetails }));
                  showSuccess("Website details saved!");
                } else {
                  showError(data.msg || "Failed to save website details.");
                }
              } catch {
                showError("Failed to save website details.");
              }
              setSaving(false);
            }}
            type="button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Website Details"}
          </button>
        </section>
        {/* Logo & Hero Banner Section */}
        <div className="flex flex-col gap-8 h-fit">
          <section className="rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 border border-slate-200 bg-white">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--brand-primary)' }}
            >
              Change Website Logo
            </h2>
            <div className="flex flex-col items-center mb-4">
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Current Logo"
                  className="object-contain border rounded shadow bg-white"
                  style={{
                    width: settings.logoWidth || 48,
                    height: settings.logoHeight || 48,
                  }}
                />
              )}
              <span className="text-xs text-gray-500 mt-2">
                Current Size: {settings.logoWidth || 48}px x{" "}
                {settings.logoHeight || 48}px
              </span>
            </div>
            <LogoUploadSection livePrimary='var(--brand-primary)' />
            <div className="flex flex-col gap-2 mt-4 w-full max-w-xs">
              <label className="font-semibold">
                Logo Width (px): {logoWidth}
              </label>
              <input
                type="range"
                min={24}
                max={200}
                value={logoWidth}
                onChange={(e) => {
                  setLogoWidth(Number(e.target.value));
                  setLogoSizeChanged(true);
                }}
              />
              <label className="font-semibold">
                Logo Height (px): {logoHeight}
              </label>
              <input
                type="range"
                min={24}
                max={200}
                value={logoHeight}
                onChange={(e) => {
                  setLogoHeight(Number(e.target.value));
                  setLogoSizeChanged(true);
                }}
              />
              <button
                className={`mt-2 px-6 py-2 rounded-lg font-semibold shadow transition-colors ${
                  logoSizeChanged
                    ? ""
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                style={{
                  background: logoSizeChanged ? 'var(--brand-primary)' : undefined,
                  color: logoSizeChanged ? "#fff" : undefined,
                }}
                onClick={handleLogoSizeSave}
                disabled={!logoSizeChanged || logoSizeSaving}
                type="button"
              >
                {logoSizeSaving ? "Saving..." : "Save Logo Size"}
              </button>
            </div>
          </section>
        </div>
      </div>
      {/* Toast messages handled by react-hot-toast */}
    </div>
  );
};

function LogoUploadSection({ livePrimary }: { livePrimary?: string }) {
  const { setSettings } = useSettings();
  const [logo, setLogo] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Upload to backend
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/brand-settings/upload?type=logo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Upload failed");
      setSettings((prev) => ({ ...prev, logoUrl: data.url }));
      setPreview(data.url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleLogoChange}
        className="mb-2"
        disabled={uploading}
      />
      {preview && (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Logo Preview"
            className="h-20 object-contain mb-2"
          />
          <span className="text-sm text-gray-500">Preview</span>
        </div>
      )}
      <button
        type="button"
        className="px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
        style={{ background: livePrimary, color: "#fff" }}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Change Logo"}
      </button>
    </div>
  );
}

function HeroBannerUploadSection({
  livePrimary,
  setHeroFields,
  setSettings,
}: {
  livePrimary?: string;
  setHeroFields: React.Dispatch<React.SetStateAction<any>>;
  setSettings: any;
}) {
  const { settings } = useSettings();
  const [banner, setBanner] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always show the current (saved) hero banner as the main preview
  const currentBanner = settings.heroBannerUrl || "";

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Upload to backend
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/brand-settings/upload?type=hero", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 413) {
          toast.error(
            data.msg ||
              "Banner image is too large. Please upload an image under 2MB."
          );
        } else {
          toast.error(data.msg || "Upload failed");
        }
        setUploading(false);
        return;
      }
      // Use the correct URL from the upload response
      if (data.url) {
        setHeroFields((prev: any) => ({ ...prev, heroBannerUrl: data.url }));
        await fetchAndUpdateSettings(setSettings);
        toast.success("Hero banner uploaded!");
        setPreview(null); // Clear the local preview after successful upload
      } else {
        toast.error("Upload failed: No URL returned.");
      }
    } catch (err: any) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      {/* If a new file is selected, show its preview below the current banner */}
      {preview && (
        <div className="flex flex-col items-center w-full mb-2">
          <img
            src={preview}
            alt="New Hero Banner Preview"
            className="h-32 w-full object-cover mb-1 rounded border-2 border-dashed border-orange-400"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <span className="text-xs text-orange-500">
            New Banner Preview (not saved yet)
          </span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleBannerChange}
        className="mb-2"
        disabled={uploading}
      />
      <button
        type="button"
        className="px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
        style={{ background: livePrimary, color: "#fff" }}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Change Hero Banner"}
      </button>
    </div>
  );
}

export default AdminBrandSettings;
