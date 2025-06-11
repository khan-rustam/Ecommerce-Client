import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Plus, Image as ImageIcon, Edit, Trash2, UploadCloud, X, Loader2, Search, AlertCircle, Calendar, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { get, post, put, del, patch } from '../../utils/authFetch'; // Import fetch helpers

interface SmartBanner {
  _id: string;
  title: string;
  content: string;
  image: string;
  imagePublicId?: string;
  url: string;
  isActive: boolean;
  displayType: 'popup' | 'banner' | 'sidebar';
  startDate: string;
  endDate?: string;
  showOnPages: string[];
  frequency: 'always' | 'once' | 'daily' | 'weekly';
  createdAt: string;
}

type SmartBannerForm = {
  title: string;
  content: string;
  url: string;
  isActive: boolean;
  displayType: 'popup' | 'banner' | 'sidebar';
  startDate: string;
  endDate: string;
  showOnPages: string[];
  frequency: 'always' | 'once' | 'daily' | 'weekly';
};

const AdminSmartBanners: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [banners, setBanners] = useState<SmartBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editBannerId, setEditBannerId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<SmartBannerForm>({
    title: '',
    content: '',
    url: '',
    isActive: true,
    displayType: 'popup',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    showOnPages: ['home'],
    frequency: 'always'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      // Use get from authFetch
      const responseData = await get('/smart-banners');
      setBanners(Array.isArray(responseData) ? responseData : []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch smart banners');
      console.error('Error fetching smart banners:', err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      url: '',
      isActive: true,
      displayType: 'popup',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      showOnPages: ['home'],
      frequency: 'always'
    });
    setUploadImage(null);
    setUploadFile(null);
    setEditMode(false);
    setEditBannerId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (banner: SmartBanner) => {
    setForm({
      title: banner.title,
      content: banner.content || '',
      url: banner.url || '',
      isActive: banner.isActive,
      displayType: banner.displayType || 'popup',
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      showOnPages: banner.showOnPages || ['home'],
      frequency: banner.frequency || 'always'
    });
    setUploadImage(banner.image || null);
    setEditMode(true);
    setEditBannerId(banner._id);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === 'image/jpeg' || file.type === 'image/png') &&
      file.size <= 20 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadImage(ev.target?.result as string);
        setUploadFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Upload jpg, png images with a maximum size of 20 MB');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handlePageSelection = (page: string) => {
    setForm(prev => {
      const newPages = prev.showOnPages.includes(page)
        ? prev.showOnPages.filter(p => p !== page)
        : [...prev.showOnPages, page];
      return { ...prev, showOnPages: newPages };
    });
  };

  const handleSaveBanner = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a banner title');
      return;
    }

    if (!uploadImage && !editMode) {
      toast.error('Please upload an image');
      return;
    }
    
    setUploading(true);

    try {
      let imageUrl = '';
      let imagePublicId = '';
      
      // Upload image if a new one is selected
      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        
        // Use post from authFetch for FormData
        const uploadResponseData = await post(
          '/smart-banners/upload',
          formData
          // authFetch handles Content-Type for FormData
        );
        
        imageUrl = uploadResponseData.image;
        imagePublicId = uploadResponseData.imagePublicId;
      }
      
      if (editMode && editBannerId) {
        // Update existing banner
        const updateData: any = {
          ...form,
          // Only include end date if it's set
          endDate: form.endDate || undefined
        };
        
        // Only include image data if a new image was uploaded
        if (imageUrl) {
          updateData.image = imageUrl;
          updateData.imagePublicId = imagePublicId;
        }
        
        // Use put from authFetch
        const responseData = await put(
          `/smart-banners/${editBannerId}`,
          updateData
        );
        
        // Update banners list with the updated banner
        setBanners(prevBanners => {
          if (!Array.isArray(prevBanners)) return [responseData];
          return prevBanners.map((b) => (b._id === editBannerId ? responseData : b));
        });
        
        toast.success('Smart banner updated successfully!');
      } else {
        // Create new banner
        // Use post from authFetch
        const responseData = await post(
          '/smart-banners',
          { 
            ...form,
            image: imageUrl,
            imagePublicId: imagePublicId,
            endDate: form.endDate || undefined
          }
        );
        
        // Add the new banner to the list
        setBanners(prevBanners => Array.isArray(prevBanners) ? [responseData, ...prevBanners] : [responseData]);
        
        toast.success('Smart banner created successfully!');
      }
      
      // Reset form and close modal
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || (editMode ? 'Failed to update banner' : 'Failed to create banner'));
      console.error(editMode ? 'Error updating banner:' : 'Error creating banner:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      // Use patch from authFetch
      const responseData = await patch(`/smart-banners/${id}/toggle-active`, {});

      // Update banners list with the updated banner
      setBanners(prevBanners => {
        if (!Array.isArray(prevBanners)) return [responseData];
        return prevBanners.map((b) => (b._id === id ? responseData : b));
      });
      
      toast.success('Smart banner status updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle banner status');
      console.error('Error toggling banner status:', err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this smart banner?')) return;

    try {
      // Use del from authFetch
      await del(`/smart-banners/${id}`);

      // Remove the deleted banner from the list
      setBanners(prevBanners => Array.isArray(prevBanners) ? prevBanners.filter(b => b._id !== id) : []);
      
      toast.success('Smart banner deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete smart banner');
      console.error('Error deleting banner:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter banners based on search term
  const filteredBanners = banners.filter(banner => 
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (banner.content && banner.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--brand-primary)' }}>Smart Banners</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search banners..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary/80)] transition"
            onClick={handleOpenCreateModal}
          >
            <Plus size={18} />
            Add Smart Banner
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={36} className="mb-6 text-gray-400 animate-spin" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                Loading smart banners...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle size={36} className="mb-6 text-red-500" />
              <div className="text-xl font-semibold mb-2">
                Error loading smart banners
              </div>
              <div className="mb-6">{error}</div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                onClick={fetchBanners}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={56} className="mb-6 text-gray-400" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                No smart banners found
              </div>
              <div className="text-gray-400 mb-6">
                {searchTerm 
                  ? "Try adjusting your search to find what you're looking for."
                  : "Add your first smart banner by clicking the 'Add Smart Banner' button."}
              </div>
              {searchTerm && (
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="px-4 py-2 text-left font-semibold">Banner</th>
                  <th className="px-4 py-2 text-left font-semibold">Display Type</th>
                  <th className="px-4 py-2 text-left font-semibold">Schedule</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner) => (
                  <tr key={banner._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      <div className="flex items-center gap-2">
                        {banner.image ? (
                          <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="w-12 h-12 rounded object-cover border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{banner.title}</div>
                          {banner.url && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Link2 size={10} />
                              <span className="truncate max-w-[200px]">{banner.url}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {banner.displayType || 'popup'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(banner.startDate)}</span>
                        {banner.endDate && (
                          <>
                            <span className="mx-1">-</span>
                            <span>{formatDate(banner.endDate)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={banner.isActive}
                          onChange={() => handleToggleActive(banner._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        onClick={() => handleOpenEditModal(banner)}
                        title="Edit Banner"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 rounded bg-red-100 text-red-500 hover:bg-red-200 transition"
                        onClick={() => handleDeleteBanner(banner._id)}
                        title="Delete Banner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Banner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleCloseModal}
              aria-label="Close"
              disabled={uploading}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editMode ? "Edit Smart Banner" : "Create Smart Banner"}
            </h2>

            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Enter banner title"
                disabled={uploading}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="content"
                name="content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.content}
                onChange={handleFormChange}
                placeholder="Content for the banner"
                rows={3}
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="url"
                name="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.url}
                onChange={handleFormChange}
                placeholder="Link to redirect (e.g., /category/sale)"
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image {!editMode && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-primary,#2563eb)] transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  id="banner-image-upload"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="banner-image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {uploadImage ? (
                    <img
                      src={uploadImage}
                      alt="Banner Preview"
                      className="max-h-40 object-contain rounded mb-2 border"
                    />
                  ) : (
                    <>
                      <UploadCloud size={36} className="mb-2 text-gray-400" />
                      <span className="text-gray-400 text-sm text-center">
                        Upload jpg, png images with a maximum size of 20 MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="displayType" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Type
                </label>
                <select
                  id="displayType"
                  name="displayType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.displayType}
                  onChange={handleFormChange}
                  disabled={uploading}
                >
                  <option value="popup">Popup</option>
                  <option value="banner">Top Banner</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.frequency}
                  onChange={handleFormChange}
                  disabled={uploading}
                >
                  <option value="always">Always</option>
                  <option value="once">Once per user</option>
                  <option value="daily">Once per day</option>
                  <option value="weekly">Once per week</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.startDate}
                  onChange={handleFormChange}
                  disabled={uploading}
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.endDate}
                  onChange={handleFormChange}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Show On Pages
              </label>
              <div className="flex flex-wrap gap-2">
                {['home', 'category', 'product', 'cart', 'checkout'].map(page => (
                  <button
                    key={page}
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm ${
                      form.showOnPages.includes(page)
                        ? 'bg-[var(--brand-primary,#2563eb)] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handlePageSelection(page)}
                    disabled={uploading}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={form.isActive}
                  onChange={handleCheckboxChange}
                  disabled={uploading}
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active (will be displayed to users)
                </label>
              </div>
            </div>

            <button
              className="w-full py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSaveBanner}
              disabled={!form.title.trim() || (!uploadImage && !editMode) || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                editMode ? "Update" : "Create"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSmartBanners; 