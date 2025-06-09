import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Question } from '../../../types'; // Assuming Question interface is in types
import { Link } from 'react-router-dom';
import { get, put, del } from '../../../utils/authFetch'; // Import fetch helpers

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for answering a question
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Use get from authFetch
        const responseData = await get('/questions');
        // authFetch returns the parsed data directly
        setQuestions(responseData);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.response?.data?.message || 'Failed to fetch questions.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array means this runs once on mount

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        // Use del from authFetch
        await del(`/questions/${id}`);
        toast.success('Question deleted successfully.');
        // Remove the deleted question from state
        setQuestions(questions.filter(q => q._id !== id));
      } catch (err: any) {
        console.error('Error deleting question:', err);
        toast.error(err.response?.data?.message || 'Failed to delete question.');
      }
    }
  };

  const handleApproveToggle = async (question: Question) => {
    try {
      // Use put from authFetch
      const responseData = await put(`/questions/${question._id}/approve`, {
        isApproved: !question.isApproved
      });
      toast.success(`Question ${responseData.isApproved ? 'approved' : 'unapproved'} successfully.`);
      // Update the question in state
      setQuestions(questions.map(q => q._id === responseData._id ? responseData : q));
    } catch (err: any) {
      console.error('Error toggling approval:', err);
      toast.error(err.response?.data?.message || 'Failed to toggle approval.');
    }
  };

    // TODO: Implement Answer functionality (e.g., modal or inline form)
    const handleAnswer = (questionId: string) => {
        // console.log('Answer functionality not implemented yet for question:', questionId);
        // Placeholder for opening a modal or showing an inline form to add an answer
        setCurrentQuestionId(questionId);
        setIsAnswering(true);
        // Find the question to pre-fill answer if already exists
        const questionToAnswer = questions.find(q => q._id === questionId);
        setAnswerText(questionToAnswer?.answer || '');
    };

    const handleAnswerSubmit = async () => {
        if (!currentQuestionId || !answerText.trim()) return;

        try {
            // Use put from authFetch
            const responseData = await put(`/questions/${currentQuestionId}/answer`, {
                answer: answerText
            });
            toast.success('Answer submitted successfully.');
            // Update the question in state with the new answer and set to approved by default
            setQuestions(questions.map(q => q._id === responseData._id ? { ...responseData, isApproved: true } : q)); // Auto-approve on answer
            setIsAnswering(false);
            setCurrentQuestionId(null);
            setAnswerText('');
        } catch (err: any) {
            console.error('Error submitting answer:', err);
            toast.error(err.response?.data?.message || 'Failed to submit answer.');
        }
    };

    const handleCloseAnswerModal = () => {
        setIsAnswering(false);
        setCurrentQuestionId(null);
        setAnswerText('');
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Product Questions</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading questions...</p>
      ) : (questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(question.user as any)?.username || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(question.product as any)?.name || 'N/A'}
                    <br />
                    {/* Optional: Link to product page */}
                    {(question.product as any)?._id && (
                        <Link to={`/product/${(question.product as any)._id}`} className="text-blue-600 hover:underline">View Product</Link>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.answer || 'Not Answered'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleApproveToggle(question)}
                      className={`px-3 py-1 rounded-full text-white ${question.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}
                    >
                      {question.isApproved ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                        onClick={() => handleAnswer(question._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                        Answer
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Answer Modal/Form */}
      {isAnswering && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4">Answer Question</h2>
                  <textarea
                      className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Type your answer here..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                      <button
                          onClick={handleCloseAnswerModal}
                          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 mr-2"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleAnswerSubmit}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                          disabled={!answerText.trim()}
                      >
                          Submit Answer
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminQuestionsPage; 