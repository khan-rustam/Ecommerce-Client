import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { Login, UserLogin } from "../../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp+newpass
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false);
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${Login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Invalid email or password");
      dispatch(setUser({ user: data.user, token: data.token }));
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    try {
      // Send OTP to email
      const res = await fetch("http://localhost:9000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, updateData: {} }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.msg ||
            (res.status === 404 ? "User not found" : "Failed to send OTP")
        );
      toast.success("OTP sent to your email");
      setForgotStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOtpBoxChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newBoxes = [...otpBoxes];
    newBoxes[idx] = value;
    setOtpBoxes(newBoxes);
    setForgotOtp(newBoxes.join(""));
    // Auto-focus next box
    if (value && idx < otpBoxes.length - 1) {
      const next = document.getElementById(`otp-box-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleForgotReset = async () => {
    setForgotLoading(true);
    try {
      // First, verify OTP only
      if (!forgotOtpVerified) {
        const res = await fetch(`${UserLogin}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
        });
        const data = await res.json();
        if (!res.ok || !data.otpValid)
          throw new Error(data.msg || "Invalid OTP");
        setForgotOtpVerified(true);
        toast.success("OTP verified! Now set your new password.");
        setForgotLoading(false);
        return;
      }
      // Now, set new password
      if (!forgotNewPassword || forgotNewPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        setForgotLoading(false);
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        toast.error("Passwords do not match");
        setForgotLoading(false);
        return;
      }
      const res = await fetch(`${UserLogin}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp: forgotOtp,
          updateData: { password: forgotNewPassword },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to reset password");
      toast.success("Password reset successfully!");
      setShowForgot(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setOtpBoxes(["", "", "", "", "", ""]);
      setForgotOtpVerified(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center">
          {/* <Link to="/" className="inline-block">
            <img
              src="https://via.placeholder.com/200x60?text=Ecommerce"
              alt="Ecommerce"
              className="h-12 transition-transform hover:scale-105"
            />
          </Link> */}
          <h2 className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
            Welcome back
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--brand-text)' }}>
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-5  flex items-center text-gray-400 focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                className="font-medium"
                style={{ color: 'var(--brand-primary)' }}
                onClick={() => setShowForgot(true)}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium hover:underline transition-colors"
              style={{ color: 'var(--brand-primary)' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative z-10">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-[var(--brand-primary)] text-xl"
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotOtp("");
                setForgotNewPassword("");
                setForgotConfirmPassword("");
                setOtpBoxes(["", "", "", "", "", ""]);
                setForgotOtpVerified(false);
              }}
            >
              &times;
            </button>
            <h3
              className="text-xl font-bold mb-4 text-center"
              style={{ color: 'var(--brand-primary)' }}
            >
              Reset Password
            </h3>
            {forgotStep === 1 ? (
              <>
                <label className="block text-sm font-medium mb-2">
                  Enter your email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-4"
                  placeholder="Email address"
                />
                <button
                  className="w-full"
                  style={{ background: 'var(--brand-primary)', color: '#fff' }}
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            ) : !forgotOtpVerified ? (
              <>
                <label className="block text-sm font-medium mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center mb-4">
                  {otpBoxes.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-box-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                      className="w-10 h-12 text-center border rounded text-lg font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                <button
                  className="w-full"
                  style={{ background: 'var(--brand-primary)', color: '#fff' }}
                  onClick={handleForgotReset}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative mb-4">
                  <input
                    type={showForgotPassword ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowForgotPassword((prev) => !prev)}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    {showForgotPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative mb-4">
                  <input
                    type={showForgotConfirmPassword ? "text" : "password"}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 focus:outline-none"
                    tabIndex={-1}
                    onClick={() =>
                      setShowForgotConfirmPassword((prev) => !prev)
                    }
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    {showForgotConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  className="w-full"
                  style={{ background: 'var(--brand-primary)', color: '#fff' }}
                  onClick={handleForgotReset}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
