import React from 'react';

const TermsAndAgreementPage: React.FC = () => {
  return (
    <div
      className="container mx-auto px-4 py-12 min-h-screen"
      style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)' }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Terms and Agreement</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Acceptance of Terms</h2>
        <p className="text-gray-600 leading-relaxed">
          By accessing or using our website, you agree to be bound by these Terms and Agreement and all terms incorporated by reference. If you do not agree to these terms, do not use our website.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Changes to Terms</h2>
        <p className="text-gray-600 leading-relaxed">
          We reserve the right to change or modify these Terms at any time and in our sole discretion. If we make changes to these Terms, we will provide notice of such changes, such as by sending an email notification, providing notice through the our website, or updating the "Last Updated" date at the beginning of these Terms.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Conduct</h2>
        <p className="text-gray-600 leading-relaxed">
          You agree that you will not violate any law, contract, intellectual property or other third-party right or commit a tort, and that you are solely responsible for your conduct while on our website. You agree that you will abide by these Terms and will not:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2 leading-relaxed">
          <li>Use our website for any illegal or unauthorized purpose.</li>
          <li>Use our website to harass, abuse, or harm another person.</li>
          <li>Interfere with or disrupt our website.</li>
        </ul>
      </div>
       {/* Add more sections as needed */}
    </div>
  );
};

export default TermsAndAgreementPage; 