import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  Eye,
  ArrowLeft,
  Tag,
  Share2,
  Pencil,
} from "lucide-react";
import BlogService, { Blog } from "../utils/BlogService";
import { useBrandColors } from "../contexts/BrandColorContext";
import { useSelector } from "react-redux";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const { colors } = useBrandColors();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await BlogService.getBlogByIdOrSlug(slug, true);
        setBlog(data);
        fetchRelatedBlogs(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch blog");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const fetchRelatedBlogs = async (currentBlog: Blog) => {
    try {
      // Get all blogs and filter for related ones (same tags, not the current blog)
      const allBlogs = await BlogService.getPublishedBlogs();

      const related = allBlogs
        .filter(
          (b) =>
            b._id !== currentBlog._id &&
            b.tags?.some((tag) => currentBlog.tags?.includes(tag))
        )
        .slice(0, 3); // Limit to 3 related blogs

      setRelatedBlogs(related);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Estimate read time (1 min per 200 words)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime === 1 ? "1 min read" : `${readTime} mins read`;
  };

  // Share functionality
  const shareBlog = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title || "Blog Post",
          text: `Check out this blog: ${blog?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  // Edit blog (for admin or author)
  const handleEditBlog = () => {
    if (blog) {
      navigate(`/admin/blogs/edit/${blog._id}`);
    }
  };

  const isAuthorOrAdmin =
    user && blog && (user.isAdmin || user._id === blog.author._id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <div className="bg-red-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Blog not found"}
          </h2>
          <p className="mb-6">
            Sorry, we couldn't find the blog you're looking for.
          </p>
          <Link
            to="/blogs"
            className="px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--brand-primary,#2563eb)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
        {/* Hero image */}
        <div className="w-full h-64 md:h-96 relative">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/1200x600?text=Blog+Image";
            }}
          />

          {/* Admin edit button */}
          {isAuthorOrAdmin && (
            <button
              onClick={handleEditBlog}
              className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-[var(--brand-primary,#2563eb)] hover:text-white p-2 rounded-full shadow-md transition-colors"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        <div className="p-6 md:p-10">
          {/* Blog header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{calculateReadTime(blog.content)}</span>
              </div>
            </div>
          </div>

          {/* Blog content */}
          <div
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags and share */}
          <div className="flex flex-wrap justify-between items-center py-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              {blog.tags && blog.tags.length > 0 && (
                <>
                  <Tag size={18} className="text-gray-400" />
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blogs?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </>
              )}
            </div>

            <button
              onClick={shareBlog}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Related blogs section */}
      {relatedBlogs.length > 0 && (
        <div className="mt-16">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ color: colors.primary }}
          >
            Related Blogs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <Link
                key={relatedBlog._id}
                to={`/blog/${relatedBlog.slug}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={relatedBlog.image}
                    alt={relatedBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Blog+Image";
                    }}
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(relatedBlog.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{relatedBlog.views} views</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 group-hover:text-[var(--brand-primary,#2563eb)] transition-colors">
                    {relatedBlog.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedBlog.content
                      .replace(/<[^>]*>?/gm, "")
                      .slice(0, 100)}
                    ...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
