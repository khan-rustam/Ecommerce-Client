import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
      alert("Error updating user role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center"
      style={{ background: colors.background }}
    >
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm mb-2 w-full max-w-6xl"
        aria-label="Breadcrumbs"
      >
        <button
          onClick={() => navigate("/admin")}
          className="hover:underline font-medium"
          style={{ color: colors.primary, background: "transparent" }}
        >
          Dashboard
        </button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="font-semibold" style={{ color: colors.text }}>
          Users
        </span>
      </nav>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: colors.primary }}
          >
            Manage Users
          </h1>
        </div>
        <div className="overflow-x-auto rounded-xl">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2
                className="animate-spin h-10 w-10"
                style={{ color: colors.primary }}
              />
            </div>
          ) : error ? (
            <div
              className="text-center py-12 text-lg font-semibold"
              style={{ color: colors.secondary }}
            >
              {error}
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: colors.accent, color: colors.text }}>
                  <th className="py-4 px-6 text-left font-bold">Name</th>
                  <th className="py-4 px-6 text-left font-bold">Email</th>
                  <th className="py-4 px-6 text-left font-bold">Role</th>
                  <th className="py-4 px-6 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr style={{ background: colors.accent }}>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-lg"
                      style={{ color: colors.text }}
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any, idx: number) => (
                    <tr
                      key={user._id || user.id}
                      style={{
                        background:
                          idx % 2 === 0 ? colors.background : colors.accent,
                      }}
                    >
                      <td
                        className="py-4 px-6 font-semibold text-lg"
                        style={{ color: colors.text }}
                      >
                        {user.username}
                      </td>
                      <td
                        className="py-4 px-6 text-base"
                        style={{ color: colors.text }}
                      >
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-4 py-1 rounded-full text-sm font-bold shadow"
                          style={{
                            background: user.isAdmin
                              ? colors.secondary
                              : colors.accent,
                            color: user.isAdmin ? colors.primary : colors.text,
                          }}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex gap-2 items-center">
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
                            className="w-14 h-7 rounded-full peer transition-all relative"
                            style={{
                              background: user.isAdmin
                                ? colors.secondary
                                : colors.accent,
                              border: `1px solid ${colors.secondary}`,
                            }}
                          >
                            <div
                              className="absolute left-1 top-1 w-5 h-5 rounded-full shadow transition-all"
                              style={{
                                background: colors.background,
                                transform: user.isAdmin
                                  ? "translateX(28px)"
                                  : "none",
                                border: `1px solid ${colors.secondary}`,
                              }}
                            ></div>
                          </div>
                          <span
                            className="ml-3 text-xs font-semibold"
                            style={{ color: colors.text }}
                          >
                            {user.isAdmin ? "Set as User" : "Set as Admin"}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
