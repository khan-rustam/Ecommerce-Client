import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useBrandColors } from "../contexts/BrandColorContext";
import { useSettings } from "../contexts/SettingsContext";

const ContactPage = () => {
  const { colors } = useBrandColors();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form", formData);
    setLoading(true);

    try {
      console.log("About to POST to /api/enquiries", formData);
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON (e.g., HTML error page)
        throw new Error('Could not connect to the server. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit enquiry');
      }

      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: colors.background, color: colors.text }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center mb-10">
        {/* {settings.logoUrl && (
          <img
            src={settings.logoUrl}
            alt={settings.name || "Brand Logo"}
            style={{
              width: settings.logoWidth ? Math.max(settings.logoWidth, 80) : 80,
              height: settings.logoHeight
                ? Math.max(settings.logoHeight, 80)
                : 80,
              objectFit: "contain",
            }}
            className="mb-3 rounded-lg shadow bg-white p-2"
          />
        )} */}
        <h1
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          style={{ color: colors.primary }}
        >
          Reach Out to Us!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We're here to help! Reach out to us using the information below.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information & Map */}
        <div className="flex flex-col gap-8">
          <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-6 border border-slate-100">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: colors.primary }}
            >
              Get in Touch
            </h2>
            <div className="space-y-4">
              {settings.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6" style={{ color: colors.primary }} />
                  <span className="font-medium">
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </span>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-3">
                  <Phone
                    className="w-6 h-6"
                    style={{ color: colors.primary }}
                  />
                  <span className="font-medium">
                    <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                  </span>
                </div>
              )}
              {settings.address && (
                <div className="flex items-center gap-3">
                  <MapPin
                    className="w-6 h-6"
                    style={{ color: colors.primary }}
                  />
                  <span className="font-medium">{settings.address}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  className="rounded-full p-2 bg-blue-100 hover:bg-blue-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#1877F3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.734-.592-1.326-1.325-1.326z" />
                  </svg>
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  className="rounded-full p-2 bg-blue-100 hover:bg-blue-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#1DA1F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  className="rounded-full p-2 bg-pink-100 hover:bg-pink-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#E4405F"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308 1.266-.058 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.637.334-3.608 1.308-.974.974-1.25 2.334-1.308 3.608-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.274.334 2.634 1.308 3.608.974.974 2.334 1.25 3.608 1.308 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.274-.058 2.634-.334 3.608-1.308.974-.974 1.25-2.334 1.308-3.608.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.85c-.058-1.366-.334-2.634-1.308-3.608-.974-.974-2.334-1.25-3.608-1.308-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  className="rounded-full p-2 bg-blue-100 hover:bg-blue-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#0A66C2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.034 0 3.594 1.997 3.594 4.594v5.602z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          {/* Map */}
          <div className="bg-white p-3 rounded-xl shadow border border-slate-100 mt-2">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={
                  settings.mapIframe ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.697403442292485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564756836!5m2!1sen!2s"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <div>
          <div className="bg-white p-8 rounded-xl shadow border border-slate-100">
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: colors.primary }}
            >
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                style={{ backgroundColor: colors.primary }}
                className="mt-6 w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
