import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useBrandColors } from "../../contexts/BrandColorContext";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/auth/admin/users";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2 && parts[1]) return parts.pop()!.split(";").shift()!;
  return null;
}
const getToken = () => getCookie("token");

const AdminUsers = () => {
  const { colors } = useBrandColors();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id: string, isAdmin: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      await fetchUsers();
    } catch (err) {
      // Optionally show toast
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err) {
      // Optionally show toast
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const openDeleteModal = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div
      className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center font-sans bg-[var(--brand-bg,#f4f7fa)]"
    >
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm mb-2 w-full max-w-6xl"
        aria-label="Breadcrumbs"
      >
        <button
          onClick={() => navigate("/admin")}
          className="hover:underline font-medium bg-transparent"
          style={{ color: colors.primary }}
        >
          Dashboard
        </button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="font-semibold" style={{ color: colors.text }}>
          Users
        </span>
      </nav>
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-2 md:p-10 animate-fade-in mt-4">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight" style={{ color: colors.primary, letterSpacing: '-0.02em' }}>
          Manage Users
        </h1>
        <div className="overflow-x-auto rounded-2xl">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2
                className="animate-spin h-10 w-10"
                style={{ color: colors.primary }}
              />
            </div>
          ) : error ? (
            <div
              className="text-center py-12 text-lg font-semibold text-gray-400"
            >
              {error}
            </div>
          ) : (
            <table className="min-w-full text-xs md:text-base rounded-2xl overflow-hidden shadow-lg bg-[var(--brand-bg,#f4f7fa)]">
              <thead>
                <tr style={{ background: colors.accent, color: colors.text }}>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">#</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Name</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Email</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Phone</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Registered at</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Role</th>
                  <th className="py-2 md:py-5 px-2 md:px-6 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr style={{ background: colors.accent }}>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-lg text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any, idx: number) => (
                    <tr
                      key={user._id || user.id}
                      className="transition-all duration-200 hover:bg-[var(--brand-primary-light,#f0f6ff)] group border-b last:border-b-0"
                      style={{
                        background:
                          idx % 2 === 0 ? colors.background : colors.accent,
                      }}
                    >
                      <td className="py-2 md:py-5 px-2 md:px-6 break-words font-bold text-lg text-gray-400 group-hover:text-[var(--brand-primary,#2563eb)]">{idx + 1}</td>
                      <td className="py-2 md:py-5 px-2 md:px-6 font-semibold text-lg flex items-center gap-3" style={{ color: colors.text }}>
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--brand-primary,#2563eb)] to-[var(--brand-primary-light,#f0f6ff)] flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="leading-tight">{user.username || user.name}</span>
                      </td>
                      <td className="py-2 md:py-5 px-2 md:px-6 text-base" style={{ color: colors.text }}>
                        {user.email}
                      </td>
                      <td className="py-2 md:py-5 px-2 md:px-6 text-base" style={{ color: colors.text }}>
                        {user.phoneNumber || user.phone || <span className="text-gray-300">-</span>}
                      </td>
                      <td className="py-2 md:py-5 px-2 md:px-6 text-base" style={{ color: colors.text }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="py-2 md:py-5 px-2 md:px-6">
                        <span
                          className={`px-5 py-1.5 rounded-full text-base font-bold shadow transition-all duration-200 ${user.isAdmin ? 'bg-[var(--brand-primary,#2563eb)] text-white' : 'bg-gray-200 text-gray-700'} group-hover:scale-105`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-2 md:py-5 px-2 md:px-6 flex gap-4 items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.isAdmin}
                            disabled={updatingId === (user._id || user.id)}
                            onChange={() =>
                              handleToggleRole(
                                user._id || user.id,
                                user.isAdmin
                              )
                            }
                          />
                          <div
                            className={`w-14 h-7 rounded-full transition-all duration-200 relative ${user.isAdmin ? 'bg-[var(--brand-primary,#2563eb)]' : 'bg-gray-300'} peer-focus:ring-2 peer-focus:ring-[var(--brand-primary,#2563eb)] shadow-inner`}
                            style={{ border: `1.5px solid ${colors.secondary}` }}
                          >
                            <div
                              className={`absolute left-1 top-1 w-5 h-5 rounded-full shadow transition-all duration-200 ${user.isAdmin ? 'bg-white translate-x-7' : 'bg-white'} border border-gray-300`}
                            ></div>
                          </div>
                          <span
                            className="ml-3 text-xs font-semibold group-hover:text-[var(--brand-primary,#2563eb)]"
                            style={{ color: colors.text }}
                          >
                            {user.isAdmin ? "Set as User" : "Set as Admin"}
                          </span>
                        </label>
                        <button
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-200 transition shadow hover:scale-110 border border-red-100"
                          title="Delete User"
                          disabled={deletingId === (user._id || user.id)}
                          onClick={() => openDeleteModal(user)}
                        >
                          {deletingId === (user._id || user.id) ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeDeleteModal} />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-10 flex flex-col items-center">
            <Trash2 className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">Delete User?</h2>
            <p className="text-gray-500 mb-6 text-center">Are you sure you want to delete <span className="font-semibold text-gray-900">{userToDelete.username || userToDelete.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
                onClick={closeDeleteModal}
                disabled={deletingId === (userToDelete._id || userToDelete.id)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-semibold shadow"
                onClick={() => handleDeleteUser(userToDelete._id || userToDelete.id)}
                disabled={deletingId === (userToDelete._id || userToDelete.id)}
              >
                {deletingId === (userToDelete._id || userToDelete.id) ? <Loader2 className="animate-spin h-5 w-5" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
