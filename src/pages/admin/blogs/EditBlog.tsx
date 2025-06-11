import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UploadCloud, X, Plus, Tag, Loader2, ArrowLeft, Save, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import BlogService, { Blog } from '../../../utils/BlogService';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        setIsFetching(true);
        const data = await BlogService.getBlogByIdOrSlug(id);
        setBlog(data);
        
        // Populate form fields
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags || []);
        setUploadImage(data.image);
        setIsPublished(data.isPublished);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch blog');
        navigate('/admin/blogs');
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Check if user is authenticated and has permission
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Check permission when blog is loaded
    if (blog && !user.isAdmin && blog.author._id !== user._id) {
      toast.error('You do not have permission to edit this blog');
      navigate('/admin/blogs');
    }
  }, [blog, user, navigate]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === 'image/jpeg' || file.type === 'image/png') &&
      file.size <= 20 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        // If there was a previous upload during this edit session that wasn't saved yet,
        // we don't need to track it since it will be replaced
        setUploadImage(ev.target?.result as string);
        setUploadFile(file);
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a JPEG or PNG image up to 20MB in size');
      setErrors(prev => ({ ...prev, image: 'Please upload a JPEG or PNG image up to 20MB in size' }));
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keypress (enter)
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      content: '',
      image: ''
    };

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Blog title is required';
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = 'Title should be less than 100 characters';
      isValid = false;
    }

    // Content validation
    if (!content.trim() || content === '<p><br></p>') {
      newErrors.content = 'Blog content is required';
      isValid = false;
    }

    // Image validation
    if (!uploadImage) {
      newErrors.image = 'Featured image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !blog || !id) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = blog.image;
      let imagePublicId = blog.imagePublicId;

      // Upload new image if changed
      if (uploadFile) {
        try {
          const uploadResult = await BlogService.uploadImage(uploadFile);
          imageUrl = uploadResult.image;
          imagePublicId = uploadResult.imagePublicId;
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Update blog
      await BlogService.updateBlog(id, {
        title,
        content,
        image: imageUrl,
        imagePublicId,
        isPublished,
        tags
      });

      toast.success('Blog updated successfully!');
      navigate(isPublished ? `/blog/${blog.slug}` : '/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (blog && blog.slug) {
      window.open(`/blog/${blog.slug}`, '_blank');
    }
  };

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--brand-primary)' }}></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <div className="bg-red-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Blog not found</h2>
          <p className="mb-6">The blog you're trying to edit could not be found.</p>
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
            Edit Blog
          </h1>
        </div>
        
        {blog.isPublished && (
          <button 
            onClick={handlePreview}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Eye size={18} />
            Preview Blog
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, title: '' }));
              }
            }}
            placeholder="Enter a descriptive title for your blog"
            disabled={loading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Featured Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image <span className="text-red-500">*</span>
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              errors.image 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-blue-400 bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              disabled={loading}
            />
            
            {uploadImage ? (
              <div className="relative w-full">
                <img
                  src={uploadImage}
                  alt="Preview"
                  className="max-h-64 mx-auto object-contain rounded"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadImage(null);
                    setUploadFile(null);
                  }}
                  disabled={loading}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud size={40} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 mb-1">Click to upload your featured image</p>
                <p className="text-xs text-gray-400">JPG, PNG (Max size: 20MB)</p>
              </div>
            )}
          </div>
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
        </div>

        {/* Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Content <span className="text-red-500">*</span>
          </label>
          <div className={errors.content ? 'border border-red-500 rounded' : ''}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => {
                setContent(value);
                if (value.trim() && value !== '<p><br></p>') {
                  setErrors(prev => ({ ...prev, content: '' }));
                }
              }}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here..."
              className="bg-white rounded-md mb-2"
              style={{ height: '300px', marginBottom: '40px' }}
            />
          </div>
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-gray-400">(Optional)</span>
          </label>
          
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={loading}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add a tag (press Enter)"
              disabled={loading}
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
              onClick={handleAddTag}
              disabled={!currentTag.trim() || loading}
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add relevant tags to help readers discover your blog
          </p>
        </div>

        {/* Publishing Options */}
        <div className="mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="publishNow"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
              disabled={loading}
            />
            <label htmlFor="publishNow" className="ml-2 text-sm font-medium text-gray-700">
              {blog.isPublished ? 'Keep published' : 'Publish now'}
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {isPublished 
              ? 'Your blog will be visible to all users'
              : 'Your blog will be saved as a draft and can be published later'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => navigate('/admin/blogs')}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--brand-primary,#2563eb)] text-white rounded-md hover:bg-[var(--brand-primary-hover,#1d4ed8)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog; 