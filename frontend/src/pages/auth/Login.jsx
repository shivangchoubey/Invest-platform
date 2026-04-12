import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans tracking-tight px-4">

      {/* Header section */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="flex justify-center mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M3 21h18"></path>
            <path d="M3 10h18"></path>
            <path d="M5 6l7-3 7 3"></path>
            <path d="M4 10v11"></path>
            <path d="M20 10v11"></path>
            <path d="M8 14v3"></path>
            <path d="M12 14v3"></path>
            <path d="M16 14v3"></path>
          </svg>
        </div>
        <h1 className="text-[28px] font-bold text-primary tracking-tight mb-1">
          Dhanex
        </h1>
        <p className="text-[15px] font-semibold text-muted">
          The Digital Ledger Editorial
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative mb-12 overflow-hidden">

        {/* Top Green Border Line */}
        <div className="h-[4px] bg-primary w-full absolute top-0 left-0"></div>

        <div className="px-10 pt-10 pb-8 relative z-10">
          <h2 className="text-[22px] font-bold text-secondary mb-1">
            Welcome back
          </h2>
          <p className="text-[14px] text-muted mb-6 font-medium">
            Please enter your credentials to access your ledger.
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-secondary mb-2">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-input text-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 font-medium text-[15px]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13px] font-bold text-secondary">Password</label>
                <Link to="#" className="text-[13px] font-bold text-primary hover:opacity-80 transition-opacity">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-input text-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg tracking-widest placeholder:tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" x2="22" y1="2" y2="22"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-[15px] hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                )}
              </button>
            </div>

          </form>

          {/* Footer Text */}
          <div className="text-center pt-8 pb-1">
            <p className="text-[13px] font-bold text-muted">
              New to the ledger?{" "}
              <Link to="/register" className="text-primary hover:opacity-80 transition-opacity">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal/Security Text */}
      <div className="mt-2 text-center pb-8 z-10 w-full max-w-[440px]">
        <p className="text-[11px] font-bold text-muted tracking-[0.1em] uppercase">
          Institutional Grade Security
        </p>
      </div>

    </div>
  );
};

export default Login;