import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer className="bg-primary text-white rounded-t-3xl shadow-2xl mt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3>
              <div>
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="object-contain rounded-xl bg-background shadow-md border-2 border-accent/30 mb-4"
                    style={{
                      width: settings.logoWidth || 56,
                      height: settings.logoHeight || 56,
                    }}
                  />
                )}
              </div>
            </h3>
            <p className="my-4 text-lg font-medium text-background/90">
              {settings.footerDescription ||
                "Our e-commerce brings authentic craftsmanship to global customers."}
            </p>
            <div className="flex space-x-4 mt-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  className="text-background hover:text-accent transition-colors bg-background/10 p-2 rounded-full shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={22} />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  className="text-background hover:text-accent transition-colors bg-background/10 p-2 rounded-full shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={22} />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  className="text-background hover:text-accent transition-colors bg-background/10 p-2 rounded-full shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={22} />
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  className="text-background hover:text-accent transition-colors bg-background/10 p-2 rounded-full shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="22"
                    height="22"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.034 0 3.594 1.997 3.594 4.594v5.602z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-background">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-accent transition-colors font-medium">Home</Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-background">Our Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-agreement"
                  className="hover:text-accent transition-colors font-medium"
                >
                  Terms and Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-background">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={22} className="mr-3 mt-1 flex-shrink-0 text-background/80" />
                <span className="text-background/90 font-medium">
                  {settings.address ||
                    "123 Crafts Street, Artisan District, New Delhi, India"}
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={22} className="mr-3 flex-shrink-0 text-background/80" />
                <span className="text-background/90 font-medium">{settings.phone || "+91 98765 43210"}</span>
              </li>
              <li className="flex items-center">
                <Mail size={22} className="mr-3 flex-shrink-0 text-background/80" />
                <span className="text-background/90 font-medium">{settings.email || "info@indiancultura.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/30 mt-12 pt-6 text-center">
          <p className="text-background/80 font-medium">
            &copy; {new Date().getFullYear()} {settings.name || "E-Commerce"}.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
