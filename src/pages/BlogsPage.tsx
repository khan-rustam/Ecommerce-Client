import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Clock, Tag, Search } from "lucide-react";
import BlogService, { Blog } from "../utils/BlogService";
import { useBrandColors } from "../contexts/BrandColorContext";

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { colors } = useBrandColors();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getPublishedBlogs();
        setBlogs(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Extract all unique tags from blogs
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags || []))
  ).filter((tag) => tag.trim() !== "");

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

  // Filter blogs based on search term and selected tag
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      !selectedTag || (blog.tags && blog.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-12 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: colors.primary }}
        >
          Our Blog
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest trends, tips, and insights about our
          products and industry news.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Search and filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-24">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTag === tag
                          ? "bg-[var(--brand-primary,#2563eb)] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setSelectedTag(selectedTag === tag ? null : tag)
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blog list */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                style={{ borderColor: colors.primary }}
              ></div>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-50 rounded-lg">
              <p className="text-red-500">{error}</p>
              <button
                className="mt-4 px-5 py-2 bg-red-500 text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No blogs found</p>
              {searchTerm && (
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTag(null);
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-transform hover:shadow-lg group"
                >
                  <Link to={`/blog/${blog.slug}`} className="block">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/800x450?text=Blog+Image";
                        }}
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{calculateReadTime(blog.content)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{blog.views} views</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold mb-3 group-hover:text-[var(--brand-primary,#2563eb)] transition-colors">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {blog.content.replace(/<[^>]*>?/gm, "").slice(0, 150)}
                        ...
                      </p>

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mt-4">
                          <Tag size={14} className="text-gray-400" />
                          {blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
