import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Privacy Policy</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Introduction</h2>
        <p className="text-gray-600 leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Collection of Your Information</h2>
        <p className="text-gray-600 leading-relaxed">
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2 leading-relaxed">
          <li><span className="font-semibold">Personal Data:</span> Demographics and other personally identifiable information (such as your name and email address) that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</li>
          <li><span className="font-semibold">Derivative Data:</span> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          <li><span className="font-semibold">Financial Data:</span> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Use of Your Information</h2>
        <p className="text-gray-600 leading-relaxed">
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
         <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2 leading-relaxed">
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
          <li>Enable user-to-user communications.</li>
          <li>Request feedback and contact you about your use of the Site.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
        </ul>
      </div>
       {/* Add more sections as needed */}
    </div>
  );
};

export default PrivacyPolicyPage;