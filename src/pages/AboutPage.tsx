import React from 'react';
import { Target, Heart, Shield, Users, Award, Star } from 'lucide-react';
import { useBrandColors } from '../contexts/BrandColorContext';

const AboutPage = () => {
  const { colors } = useBrandColors();

  return (
    <div style={{ background: colors.background, color: colors.text }} className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About E-Commerce</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to revolutionize online shopping by providing a seamless, 
          secure, and enjoyable experience for our customers.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-gray-600">
            To provide customers with a trusted and convenient online shopping platform 
            that offers quality products at competitive prices while maintaining the 
            highest standards of customer service and satisfaction.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold">Our Vision</h2>
          </div>
          <p className="text-gray-600">
            To become the world's most customer-centric e-commerce platform, where 
            customers can find and discover anything they might want to buy online, 
            and endeavors to offer its customers the lowest possible prices.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: colors.primary }}>Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: colors.primary }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: colors.primary }}>Trust & Security</h3>
            <p style={{ color: colors.text }}>
              We prioritize the security of our customers' data and maintain 
              transparency in all our operations.
            </p>
          </div>

          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: colors.secondary }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: colors.secondary }}>Customer First</h3>
            <p style={{ color: colors.text }}>
              Our decisions and actions are driven by what's best for our customers, 
              always striving to exceed their expectations.
            </p>
          </div>

          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-4" style={{ color: colors.accent }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: colors.accent }}>Excellence</h3>
            <p style={{ color: colors.text }}>
              We maintain high standards in everything we do, from product quality 
              to customer service.
            </p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Our Milestones</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start">
              <Award className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-1">2023</h3>
                <p className="text-gray-600">
                  Launched our mobile app and expanded to international markets
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Award className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-1">2022</h3>
                <p className="text-gray-600">
                  Reached 1 million active customers and introduced same-day delivery
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Award className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-1">2021</h3>
                <p className="text-gray-600">
                  Started operations and established partnerships with leading brands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-8">Our Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">John Smith</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Sarah Johnson</h3>
            <p className="text-gray-600">COO</p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Michael Brown</h3>
            <p className="text-gray-600">CTO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;