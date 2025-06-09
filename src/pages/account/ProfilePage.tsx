import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearUser, setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Profile } from "../../api";
import { useBrandColors } from "../../contexts/BrandColorContext";
import AccountLayout from "../../components/layout/AccountLayout";

const ProfilePage = () => {
  const token = useSelector((state: any) => state.user.token);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(
    "https://ui-avatars.com/api/?name=User&background=orange&color=fff"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [otpLoading, setOtpLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { colors } = useBrandColors();
  const user = useSelector((state: any) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    const res = await fetch(`${Profile}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsername(data.username || "");
      setEmail(data.email || "");
      setPhone(data.phoneNumber || "");
      setAvatar(
        data.avatar && data.avatar.trim() !== ""
          ? data.avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              data.username || "User"
            )}&background=orange&color=fff`
      );
      setOriginalProfile({
        username: data.username || "",
        email: data.email || "",
        phone: data.phoneNumber || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const handleSave = async () => {
    // Only include changed fields
    const updateData: any = {};
    if (username !== originalProfile.username && username.trim() !== "")
      updateData.username = username;
    if (phone !== originalProfile.phone && phone.trim() !== "")
      updateData.phoneNumber = phone;
    if (password && password.trim() !== "") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      updateData.password = password;
    }
    setPendingUpdate(updateData);
    setShowOtpModal(true);
    setOtpLoading(true);
    setOtpBoxes(["", "", "", "", "", ""]);
    setOtp("");
    try {
      const res = await fetch(`${Profile}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, updateData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to send OTP");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err.message);
      setShowOtpModal(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpBoxChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newBoxes = [...otpBoxes];
    newBoxes[idx] = value;
    setOtpBoxes(newBoxes);
    setOtp(newBoxes.join(""));
    // Auto-focus next box
    if (value && idx < otpBoxes.length - 1) {
      const next = document.getElementById(`profile-otp-box-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpConfirm = async () => {
    setOtpLoading(true);
    setProfileUpdating(true);
    try {
      const res = await fetch(`${Profile}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, updateData: pendingUpdate }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Check for duplicate key error (phone number already exists)
        if (
          data.error &&
          data.error.includes("duplicate key") &&
          data.error.includes("phoneNumber")
        ) {
          toast.error("Phone number already in use.");
        } else {
          toast.error(data.msg || "OTP verification failed");
        }
        return;
      }
      toast.success("Profile updated successfully!");
      setShowOtpModal(false);
      setEditing(false);
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setPendingUpdate(null);
      setOtpBoxes(["", "", "", "", "", ""]);
      await fetchProfile(); // Refresh profile after update
      // Update Redux user state with new avatar
      dispatch(setUser({
        user: { ...user, avatar: data.avatar },
        token,
      }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
      setProfileUpdating(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Max file size is 2MB');
      return;
    }
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      } as any);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Upload failed');
      setAvatar(data.avatar);
      // Update Redux user state with new avatar
      dispatch(setUser({
        user: { ...user, avatar: data.avatar },
        token,
      }));
      toast.success('Avatar updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <AccountLayout>
      <div className="relative animate-fade-in">
        <h2
          className="text-2xl font-bold mb-8 tracking-tight"
          style={{ color: colors.primary }}
        >
          Profile Settings
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2
              className="h-10 w-10 animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <img
                src={avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 shadow-md object-cover"
                style={{ borderColor: colors.secondary, background: "#fff" }}
              />
              <div className="flex flex-col items-center md:items-start">
                <label
                  className="text-sm hover:underline font-medium cursor-pointer"
                  style={{ color: colors.primary }}
                >
                  {avatarUploading ? 'Uploading...' : 'Change Avatar'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                </label>
                <span className="text-xs mt-1" style={{ color: colors.text }}>
                  JPG, PNG, max 2MB
                </span>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-base"
                  style={{
                    background: "#fff",
                    color: colors.text,
                    borderColor: colors.secondary,
                    ...({
                      ["--tw-ring-color"]: colors.primary,
                    } as React.CSSProperties),
                  }}
                  disabled={!editing}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-base"
                  style={{
                    background: "#fff",
                    color: colors.text,
                    borderColor: colors.secondary,
                    ...({
                      ["--tw-ring-color"]: colors.primary,
                    } as React.CSSProperties),
                  }}
                  disabled={!editing}
                  placeholder={email ? "" : "Add email"}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-base"
                  style={{
                    background: "#fff",
                    color: colors.text,
                    borderColor: colors.secondary,
                    ...({
                      ["--tw-ring-color"]: colors.primary,
                    } as React.CSSProperties),
                  }}
                  disabled={!editing}
                  placeholder={phone ? "" : "Add phone number"}
                />
              </div>

              {editing && (
                <>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.text }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-base"
                      style={{
                        background: "#fff",
                        color: colors.text,
                        borderColor: colors.secondary,
                        ...({
                          ["--tw-ring-color"]: colors.primary,
                        } as React.CSSProperties),
                      }}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.text }}
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-base"
                      style={{
                        background: "#fff",
                        color: colors.text,
                        borderColor: colors.secondary,
                        ...({
                          ["--tw-ring-color"]: colors.primary,
                        } as React.CSSProperties),
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                {editing ? (
                  <>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold shadow transition-colors"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#fff",
                      }}
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold shadow transition-colors"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.text,
                      }}
                      onClick={() => {
                        setEditing(false);
                        setPassword("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg font-semibold shadow transition-colors"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#fff",
                    }}
                    onClick={() => setEditing(true)}
                    disabled={editing}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
            
            {showOtpModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="rounded-xl shadow-xl p-8 w-full max-w-md relative z-10" style={{ background: colors.accent || "#fff" }}>
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtpBoxes(["", "", "", "", "", ""]);
                      setOtp("");
                    }}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>
                    Verify OTP
                  </h3>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Enter OTP sent to your email
                  </label>
                  
                  {(otpLoading || profileUpdating) ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" style={{ color: colors.primary }} />
                      <span className="font-medium" style={{ color: colors.primary }}>
                        {otpLoading && !profileUpdating
                          ? "Sending OTP to your email..."
                          : "Saving your changes..."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 justify-center mb-4">
                        {otpBoxes.map((val, idx) => (
                          <input
                            key={idx}
                            id={`profile-otp-box-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) =>
                              handleOtpBoxChange(idx, e.target.value)
                            }
                            className="w-10 h-12 text-center border rounded text-lg font-bold focus:ring-2 focus:border-2"
                            style={{
                              background: '#fff',
                              color: colors.text,
                              borderColor: colors.secondary,
                              ...( { ['--tw-ring-color']: colors.primary } as React.CSSProperties )
                            }}
                            autoFocus={idx === 0}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleOtpConfirm}
                        className="w-full py-3 rounded-lg font-semibold mt-4"
                        style={{ backgroundColor: colors.primary, color: '#fff' }}
                        disabled={otp.length !== 6}
                      >
                        Verify & Update
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
