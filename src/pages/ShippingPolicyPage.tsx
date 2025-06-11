import React from 'react';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div
      className="container mx-auto px-4 py-12 min-h-screen"
      style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)' }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Shipping Policy</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Shipping Information</h2>
        <p className="text-gray-600 leading-relaxed">
          We aim to process and ship all orders within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Shipping Rates and Delivery Estimates</h2>
        <p className="text-gray-600 leading-relaxed">
          Shipping charges for your order will be calculated and displayed at checkout. Delivery estimates are based on your location and the shipping method selected.
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2 leading-relaxed">
          <li>Standard Shipping: 3-7 business days</li>
          <li>Express Shipping: 1-3 business days</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          Please note that delivery estimates are approximate and may vary due to factors outside of our control (e.g., weather delays, carrier issues).
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Shipment Confirmation and Order Tracking</h2>
        <p className="text-gray-600 leading-relaxed">
          You will receive a Shipment Confirmation email with your tracking number once your order has shipped. The tracking number will be active within 24 hours.
        </p>
      </div>
       {/* Add more sections as needed */}
    </div>
  );
};

export default ShippingPolicyPage; 