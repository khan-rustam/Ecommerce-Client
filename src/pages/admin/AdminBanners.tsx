import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Image as ImageIcon,
  X,
  UploadCloud,
  Trash2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { get, post, del, patch } from "../../utils/authFetch";

interface Banner {
  _id: string;
  path: string;
  name: string;
  show: boolean;
  createdAt: string;
}

// Helper function to format dates safely
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const AdminBanners: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const token = useSelector((state: any) => state.user.token);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [bannerName, setBannerName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await get('/banners');
      console.log("Fetched banners:", res); // Log the backend response
      let bannersArray = [];
      if (Array.isArray(res)) {
        bannersArray = res;
      } else if (Array.isArray(res?.data)) {
        bannersArray = res.data;
      } else if (Array.isArray(res?.banners)) {
        bannersArray = res.banners;
      }
      // Filter out invalid entries
      bannersArray = bannersArray.filter(b => b && typeof b === 'object' && typeof b.show !== 'undefined');
      setBanners(bannersArray);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch banners");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size <= 20 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadImage(ev.target?.result as string);
        setUploadFile(file);
        // Set default banner name from file name
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setBannerName(fileName);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Upload jpg, png images with a maximum size of 20 MB");
    }
  };

  const handleSaveBanner = async () => {
    if (!uploadFile || !bannerName.trim()) {
      if (!bannerName.trim()) {
        toast.error("Please enter a banner name");
      }
      return;
    }

    // Check if we have a token
    if (!token) {
      toast.error("You need to be logged in to upload banners");
      return;
    }

    setUploading(true);

    try {
      // Create a FormData object for the file
      const formData = new FormData();
      formData.append("file", uploadFile);

      // Use our axios instance with interceptors
      const uploadResponse = await post("/banners/upload", formData);

      // Get the image URL from your backend response
      const imageUrl = uploadResponse.data.imageUrl;

      // Save the banner with the Cloudinary URL to your backend
      const response = await post("/banners", {
        path: imageUrl,
        name: bannerName,
        show: false,
      });

      // Ensure we're working with an array
      setBanners((prevBanners) =>
        Array.isArray(prevBanners)
          ? [response.data, ...prevBanners]
          : [response.data]
      );
      setShowUploadModal(false);
      setUploadImage(null);
      setUploadFile(null);
      setBannerName("");
      toast.success("Banner uploaded successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload banner");
      console.error("Error uploading banner:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleBanner = async (id: string) => {
    try {
      await patch(`/banners/${id}/toggle`, {});
      await fetchBanners(); // Refetch the banners list from the backend
      toast.success("Banner visibility updated");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to toggle banner visibility"
      );
      console.error("Error toggling banner:", err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await del(`/banners/${id}`);

      // Use functional update to ensure we're working with the latest state
      setBanners((prevBanners) => {
        if (!Array.isArray(prevBanners)) return [];
        return prevBanners.filter((banner) => banner._id !== id);
      });
      toast.success("Banner deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete banner");
      console.error("Error deleting banner:", err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Banners</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-end mb-4">
          <button
            className="w-10 h-10 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
            onClick={() => setShowUploadModal(true)}
            aria-label="Add Banner"
          >
            <Plus size={22} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xl font-semibold text-gray-500 mb-2">
                Loading banners...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xl font-semibold mb-2">
                Error loading banners
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
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={56} className="mb-6 text-gray-400" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                No banners uploaded yet
              </div>
              <div className="text-gray-400 mb-6">
                Upload your first banner by clicking the plus button in the top
                right corner.
              </div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                onClick={() => setShowUploadModal(true)}
              >
                <Plus size={18} /> Upload Banner
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-gray-500 text-xs uppercase">
                <th className="px-4 py-2 text-left font-semibold">Image</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Date Created
                </th>
                <th className="px-4 py-2 text-left font-semibold">Show</th>
                <th className="px-4 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(banners) && banners
                .filter(banner => banner && typeof banner === 'object' && typeof banner.show !== 'undefined')
                .map((banner) => (
                  <tr
                    key={banner._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-gray-800 font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={banner.path} 
                          alt="Banner thumbnail" 
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                          }}
                        />
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                          {banner.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {banner.name || "Unnamed Banner"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatDate(banner.createdAt)}
                    </td>
                    <td className="px-4 py-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={!!banner.show}
                          onChange={() => handleToggleBanner(banner._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteBanner(banner._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Banner Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowUploadModal(false);
                setUploadImage(null);
                setUploadFile(null);
                setBannerName("");
              }}
              aria-label="Close"
              disabled={uploading}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Upload Banner
            </h2>

            <div className="mb-4">
              <label
                htmlFor="banner-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Banner Name
              </label>
              <input
                type="text"
                id="banner-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Enter banner name"
                disabled={uploading}
              />
            </div>

            <div className="mb-6">
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
                      className="w-full h-auto max-h-64 object-contain rounded mb-2 border"
                    />
                  ) : (
                    <>
                      <UploadCloud size={36} className="mb-2 text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        Upload jpg, png images with a maximum size of 20 MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              className="w-full py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSaveBanner}
              disabled={!uploadFile || uploading || !bannerName.trim()}
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
