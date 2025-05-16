import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBrandColors } from '../contexts/BrandColorContext';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How can I track my order?',
        answer: 'Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website or the carrier\'s website.'
      },
      {
        question: 'What are the shipping options available?',
        answer: 'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and next-day delivery for select locations. Shipping costs vary based on your location and chosen delivery method.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary by location. You can see the exact shipping costs during checkout.'
      }
    ]
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Some items, like personalized products or intimate wear, are not eligible for return.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'Log into your account, go to your orders, select the item you want to return, and follow the return instructions. You\'ll receive a return shipping label via email.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive your return. The money will be credited back to your original payment method.'
      }
    ]
  },
  {
    title: 'Payment & Security',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. Some regions also support local payment methods.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.'
      }
    ]
  },
  {
    title: 'Account Management',
    items: [
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.'
      },
      {
        question: 'Can I change my email address?',
        answer: 'Yes, you can update your email address in your account settings. You\'ll need to verify the new email address before the change takes effect.'
      }
    ]
  }
];

const FAQPage = () => {
  const { colors } = useBrandColors();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ background: colors.background, color: colors.text }} className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => {
                const isOpen = openItems[`${categoryIndex}-${itemIndex}`];
                return (
                  <div 
                    key={itemIndex}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(categoryIndex, itemIndex)}
                      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50"
                    >
                      <span className="font-medium">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Still Have Questions?</h2>
        <p className="mb-6" style={{ color: colors.text }}>
          Can't find the answer you're looking for? Please chat to our friendly team.
        </p>
        <a
          href="/contact"
          style={{ background: colors.primary, color: '#fff' }}
          className="inline-block font-medium py-2 px-6 rounded-md transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQPage;