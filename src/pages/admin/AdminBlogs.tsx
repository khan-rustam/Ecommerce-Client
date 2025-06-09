import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  FileText,
  MoreVertical,
  Check,
  X as XIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import BlogService, { Blog } from '../../utils/BlogService';
import { useBrandColors } from '../../contexts/BrandColorContext';

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const { colors } = useBrandColors();
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await BlogService.getAllBlogs();
      setBlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await BlogService.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog._id !== id));
      toast.success('Blog deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete blog');
      console.error('Error deleting blog:', err);
    }
  };

  // Toggle blog published status
  const handleTogglePublished = async (id: string) => {
    try {
      const updatedBlog = await BlogService.toggleBlogPublished(id);
      setBlogs(blogs.map(blog => blog._id === id ? updatedBlog : blog));
      toast.success(`Blog ${updatedBlog.isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update blog status');
      console.error('Error toggling blog status:', err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Estimate read time (1 min per 200 words)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime === 1 ? '1 min read' : `${readTime} mins read`;
  };

  // Filter and search blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'published' && blog.isPublished) ||
      (filterStatus === 'draft' && !blog.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Manage Blogs
          </h1>
          
          <Link 
            to="/admin/blogs/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary,#2563eb)] text-white rounded-md hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition-colors"
          >
            <Plus size={18} />
            Create New Blog
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                className="py-2 px-3 border border-gray-300 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              >
                <option value="all">All Blogs</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
              <p className="mt-4 text-gray-500">Loading blogs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading blogs</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={fetchBlogs}
              className="px-6 py-2 bg-[var(--brand-primary,#2563eb)] text-white rounded-md hover:bg-[var(--brand-primary-hover,#1d4ed8)]"
            >
              Try Again
            </button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No matching blogs found' : 'No blogs yet'}
            </h2>
            <p className="mb-6 text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first blog to get started'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-4"
              >
                Clear Filters
              </button>
            )}
            <Link 
              to="/admin/blogs/create"
              className="px-6 py-2 bg-[var(--brand-primary,#2563eb)] text-white rounded-md hover:bg-[var(--brand-primary-hover,#1d4ed8)]"
            >
              Create Blog
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            <img 
                              className="h-10 w-10 object-cover"
                              src={blog.image} 
                              alt={blog.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Blog';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[250px]">
                              {blog.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {calculateReadTime(blog.content)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={14} className="mr-1 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {blog.author?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            blog.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1 text-gray-400" />
                          {blog.views || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublished(blog._id)}
                            className={`p-1 rounded ${
                              blog.isPublished 
                                ? 'text-yellow-500 hover:bg-yellow-100' 
                                : 'text-green-500 hover:bg-green-100'
                            }`}
                            title={blog.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {blog.isPublished ? <XIcon size={18} /> : <Check size={18} />}
                          </button>
                          
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          
                          <Link
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="p-1 text-indigo-500 hover:bg-indigo-100 rounded"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  </div>
);
};

export default AdminBlogs; 