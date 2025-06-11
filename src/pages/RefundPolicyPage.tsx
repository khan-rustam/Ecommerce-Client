import React from 'react';

const RefundPolicyPage: React.FC = () => {
  return (
    <div
      className="container mx-auto px-4 py-12 min-h-screen"
      style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)' }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Refund Policy</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Returns and Refunds</h2>
        <p className="text-gray-600 leading-relaxed">
          We want you to be completely satisfied with your purchase. If you are not entirely happy with your order, we're here to help.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Eligibility for Refund</h2>
        <p className="text-gray-600 leading-relaxed">
          To be eligible for a refund, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can't offer you a refund or exchange.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">How to Initiate a Return</h2>
        <p className="text-gray-600 leading-relaxed">
          To initiate a return, please contact our customer service team with your order number and the reason for the return. We will provide you with instructions on how to proceed.
        </p>
      </div>
       {/* Add more sections as needed */}
    </div>
  );
};

export default RefundPolicyPage; 