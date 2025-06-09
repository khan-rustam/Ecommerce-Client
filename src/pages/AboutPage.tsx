import { Target, Heart, Shield, Users, Award, Star } from "lucide-react";
import { useBrandColors } from "../contexts/BrandColorContext";
import { SettingsProvider, useSettings } from "../contexts/SettingsContext";

const AboutPage = () => {
  const { colors } = useBrandColors();
  const { settings } = useSettings();
  return (
    <div style={{ background: colors.background, color: colors.text }}>
      {/* Hero Section for About Page */}
      <section className="relative w-full h-96 bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(${settings.aboutPageHeroImageUrl || 'https://images.unsplash.com/photo-1507679799938-3c31a8522a63?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">{settings.aboutPageHeroTitle || 'Our Story'}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-300">{settings.aboutPageHeroSubtitle || 'Learn more about our journey, values, and commitment to excellence.'}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Brand Logo, Name, and Description - Repositioned and enhanced */}
        <div className="flex flex-col items-center justify-center mb-12 mt-[-6rem] relative z-20">
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt={settings.name || 'Brand Logo'}
              style={{ width: settings.logoWidth ? Math.max(settings.logoWidth, 120) : 120, height: settings.logoHeight ? Math.max(settings.logoHeight, 120) : 120, objectFit: 'contain' }}
              className="mb-4 rounded-full shadow-xl bg-white p-4 border-4 border-white"
            />
          )}
          <h2 className="text-3xl font-bold mb-2 mt-4" style={{ color: colors.primary }}>
            {settings.name || "About Us"}
          </h2>
          <div className="text-center max-w-3xl">
            <p className="text-lg text-gray-700">
              {settings.aboutPageDescription || "Where Tradition Meets Innovation in Retail. We are dedicated to bringing you quality products with exceptional customer service."}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow border border-slate-100 flex flex-col gap-4 transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <div className="flex items-center mb-2">
              <Target
                className="w-10 h-10 mr-4"
                style={{ color: colors.primary }}
              />
              <h3
                className="text-2xl font-semibold"
                style={{ color: colors.primary }}
              >
                Our Mission
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {settings.missionText || "To provide customers with a trusted and convenient online shopping platform that offers quality products at competitive prices while maintaining the highest standards of customer service and satisfaction."}
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow border border-slate-100 flex flex-col gap-4 transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <Heart className="w-10 h-10 mr-4" style={{ color: colors.primary }} />
            <h3
              className="text-2xl font-semibold"
              style={{ color: colors.primary }}
            >
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {settings.visionText || "To become the world\'s most customer-centric e-commerce platform, where customers can find and discover anything they might want to buy online, and endeavors to offer its customers the lowest possible prices."}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.primary }}>
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl shadow border text-center flex flex-col items-center transition-transform transform hover:scale-105 duration-300 ease-in-out" style={{ background: colors.background, borderColor: colors.accent }}>
              <Shield className="w-16 h-16 mb-4" style={{ color: colors.primary }} />
              <h3 className="text-xl font-medium mb-3" style={{ color: colors.primary }}>
                Trust & Security
              </h3>
              <p className="text-gray-700">
                {settings.trustValueText || "We prioritize the security of our customers' data and maintain transparency in all our operations."}
              </p>
            </div>
            <div className="p-8 rounded-2xl shadow border text-center flex flex-col items-center transition-transform transform hover:scale-105 duration-300 ease-in-out" style={{ background: colors.background, borderColor: colors.accent }}>
              <Users className="w-16 h-16 mb-4" style={{ color: colors.secondary }} />
              <h3 className="text-xl font-medium mb-3" style={{ color: colors.secondary }}>
                Customer First
              </h3>
              <p className="text-gray-700">
                {settings.customerValueText || "Our decisions and actions are driven by what's best for our customers, always striving to exceed their expectations."}
              </p>
            </div>
            <div className="p-8 rounded-2xl shadow border text-center flex flex-col items-center transition-transform transform hover:scale-105 duration-300 ease-in-out" style={{ background: colors.background, borderColor: colors.accent }}>
              <Star className="w-16 h-16 mb-4" style={{ color: colors.accent }} />
              <h3 className="text-xl font-medium mb-3" style={{ color: colors.accent }}>
                Excellence
              </h3>
              <p className="text-gray-700">
                {settings.excellenceValueText || "We maintain high standards in everything we do, from product quality to customer service."}
              </p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.primary }}>
            Our Milestones
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-2 border-gray-200 space-y-12 pl-8">
              {settings.milestones && settings.milestones.length > 0 ? (
                settings.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="absolute w-4 h-4 rounded-full bg-[var(--brand-primary,#2563eb)] -left-2 border border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 transition-transform transform hover:translate-x-2 duration-300 ease-in-out">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>{milestone.year}</h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative">
                   <div className="absolute w-4 h-4 rounded-full bg-[var(--brand-primary,#2563eb)] -left-2 border border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>2021</h3>
                      <p className="text-gray-700">Started operations and established partnerships with leading brands</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2
            className="text-3xl font-semibold text-center mb-8"
            style={{ color: colors.primary }}
          >
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {settings.teamMembers && settings.teamMembers.length > 0 ? (
              settings.teamMembers.map((member: any, index: number) => (
                 <div key={index} className="bg-white p-6 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center transition-transform transform hover:scale-105 duration-300 ease-in-out">
                  <img
                    src={member.imageUrl || 'https://via.placeholder.com/150'}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
                  />
                  <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.title}</p>
                </div>
              ))
            ) : (
              // Placeholder team members
              <>
                 <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium">John Smith</h3>
                  <p className="text-gray-600">CEO & Founder</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium">Sarah Johnson</h3>
                  <p className="text-gray-600">COO</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium">Michael Brown</h3>
                  <p className="text-gray-600">CTO</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
       {/* Add animation keyframes */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default AboutPage;
