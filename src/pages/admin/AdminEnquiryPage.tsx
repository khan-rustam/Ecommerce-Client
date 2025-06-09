import React, { useEffect, useState } from 'react';
import { useBrandColors } from '../../contexts/BrandColorContext';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductModal from '../../components/ProductManager/ProductModal';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  responded: boolean;
  createdAt: string;
  response?: string;
}

const AdminEnquiryPage: React.FC = () => {
  const { colors } = useBrandColors();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseLoading, setResponseLoading] = useState<string | null>(null); // Stores the ID of the enquiry being responded to
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({}); // Stores response text per enquiry
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  // Fetch enquiries from backend
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/enquiries');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch enquiries');
      }
      const data: Enquiry[] = await response.json();
      setEnquiries(data);
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      toast.error(error.message || 'Failed to fetch enquiries.');
    } finally {
      setLoading(false);
    }
  };

  // Send response via backend
  const sendResponse = async (enquiryId: string) => {
    setResponseLoading(enquiryId);
    try {
      const responseTextToSend = responseText[enquiryId] || '';
      if (!responseTextToSend.trim()) {
        toast.error('Response cannot be empty.');
        setResponseLoading(null);
        return;
      }

      const response = await fetch(`/api/admin/enquiries/${enquiryId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, include authentication headers here (e.g., JWT)
        },
        body: JSON.stringify({ responseText: responseTextToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send response. Email may not have been sent.');
        throw new Error(errorData.message || 'Failed to send response');
      }

      // Update the specific enquiry in the state
      setEnquiries(enquiries.map(enq => enq._id === enquiryId ? { ...enq, responded: true, response: responseTextToSend } : enq));
      // Clear the response text for this enquiry
      setResponseText(prev => { const newState = { ...prev }; delete newState[enquiryId]; return newState; });
      toast.success('Response sent successfully!');
      await fetchEnquiries(); // Refresh the list after responding
    } catch (error: any) {
      console.error('Error sending response:', error);
      // toast.error(error.message || 'Failed to send response.');
    } finally {
      setResponseLoading(null);
    }
  };

  // Delete enquiry
  const handleDeleteClick = (enquiryId: string) => {
    setEnquiryToDelete(enquiryId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiryToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete enquiry');
      }
      toast.success('Enquiry deleted successfully!');
      setEnquiries(enquiries.filter(enq => enq._id !== enquiryToDelete));
    } catch (error: any) {
      console.error('Error deleting enquiry:', error);
      toast.error(error.message || 'Failed to delete enquiry.');
    } finally {
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div
      className="container mx-auto px-4 py-12 min-h-screen"
      style={{ background: colors.background, color: colors.text }}
    >
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>Admin Enquiries</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center text-gray-600">No enquiries found.</div>
      ) : (
        <div className="space-y-6">
          {enquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-white shadow-lg rounded-lg p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Enquiry from {enquiry.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${enquiry.responded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {enquiry.responded ? 'Responded' : 'Pending'}
                </span>
                <button
                  onClick={() => handleDeleteClick(enquiry._id)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  title="Delete Enquiry"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {enquiry.email}</p>
              <p className="text-gray-700 mb-4"><strong>Message:</strong> {enquiry.message}</p>
              <div className="text-sm text-gray-500">Received: {new Date(enquiry.createdAt).toLocaleString()}</div>

              {!enquiry.responded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Send Response</h3>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out focus:border-transparent"
                    placeholder="Type your response here..."
                    value={responseText[enquiry._id] || ''}
                    onChange={(e) => setResponseText({ ...responseText, [enquiry._id]: e.target.value })}
                  />
                  <button
                    onClick={() => sendResponse(enquiry._id)}
                    disabled={responseLoading === enquiry._id}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responseLoading === enquiry._id ? (
                      'Sending...'
                    ) : (
                      <>Send <Send size={14} className="ml-2" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteEnquiry}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </div>
  );
};

export default AdminEnquiryPage; 