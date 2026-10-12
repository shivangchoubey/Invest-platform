import React, { useState, useMemo } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { checkPasswordCriteria } from "../../utils/passwordValidator";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "INVESTOR",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordEvaluation = useMemo(() => {
    return checkPasswordCriteria(formData.password, formData.email);
  }, [formData.password, formData.email]);

  const passwordsMatch = useMemo(() => {
    if (!formData.confirmPassword) return null;
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation checks
    if (!passwordEvaluation.isValid) {
      if (!passwordEvaluation.criteria.length) {
        setError("Password must be at least 8 characters long.");
      } else if (!passwordEvaluation.criteria.lowercase || !passwordEvaluation.criteria.uppercase) {
        setError("Password must contain both uppercase and lowercase letters.");
      } else if (!passwordEvaluation.criteria.number) {
        setError("Password must contain at least one number.");
      } else if (!passwordEvaluation.criteria.special) {
        setError("Password must contain at least one special character (!@#$%^&*...).");
      } else if (!passwordEvaluation.criteria.notCommon) {
        setError("This password is too common or easily guessable. Please choose a stronger password.");
      } else if (!passwordEvaluation.criteria.noEmailMatch) {
        setError("Password cannot contain your email username.");
      } else {
        setError("Please satisfy all password security requirements.");
      }
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please ensure both fields match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Redirect to login page on success
      navigate("/");
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]) ||
        "Registration failed. Please check your details or backend connection.";
      setError(serverMessage);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-[22px] font-bold text-secondary mb-1">Create Account</h2>
        <p className="text-[14px] text-muted font-medium">
          Join Dhanex as a verified founder or investor
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-secondary mb-1.5">Full Name</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input text-secondary border border-transparent focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 font-medium text-[14px]"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-secondary mb-1.5">Email Address</label>
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
              placeholder="alex@company.com"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input text-secondary border border-transparent focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 font-medium text-[14px]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[13px] font-bold text-secondary">Password</label>
            {formData.password && (
              <span className={`text-[12px] font-bold ${passwordEvaluation.strengthColor} flex items-center gap-1`}>
                Strength: {passwordEvaluation.strengthLabel}
              </span>
            )}
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
              onFocus={() => setIsPasswordFocused(true)}
              placeholder="Create strong password"
              required
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-input text-secondary border border-transparent focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
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

          {/* Password Strength Progress Bar */}
          {formData.password && (
            <div className="mt-2">
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                <div className={`rounded-full transition-colors duration-300 ${passwordEvaluation.score >= 1 ? passwordEvaluation.barColor : "bg-gray-200"}`}></div>
                <div className={`rounded-full transition-colors duration-300 ${passwordEvaluation.score >= 2 ? passwordEvaluation.barColor : "bg-gray-200"}`}></div>
                <div className={`rounded-full transition-colors duration-300 ${passwordEvaluation.score >= 3 ? passwordEvaluation.barColor : "bg-gray-200"}`}></div>
                <div className={`rounded-full transition-colors duration-300 ${passwordEvaluation.score >= 4 ? passwordEvaluation.barColor : "bg-gray-200"}`}></div>
              </div>
            </div>
          )}

          {/* Password Requirements Checklist */}
          {(isPasswordFocused || formData.password) && (
            <div className="mt-2.5 p-3 bg-gray-50/80 border border-gray-100 rounded-xl space-y-1.5 text-[12px] text-muted">
              <p className="font-semibold text-secondary text-[11px] uppercase tracking-wider mb-1">
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div className={`flex items-center gap-1.5 ${passwordEvaluation.criteria.length ? "text-emerald-700 font-medium" : "text-gray-500"}`}>
                  {passwordEvaluation.criteria.length ? (
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"></span>
                  )}
                  <span>At least 8 characters</span>
                </div>

                <div className={`flex items-center gap-1.5 ${passwordEvaluation.criteria.uppercase && passwordEvaluation.criteria.lowercase ? "text-emerald-700 font-medium" : "text-gray-500"}`}>
                  {passwordEvaluation.criteria.uppercase && passwordEvaluation.criteria.lowercase ? (
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"></span>
                  )}
                  <span>Upper & lowercase</span>
                </div>

                <div className={`flex items-center gap-1.5 ${passwordEvaluation.criteria.number ? "text-emerald-700 font-medium" : "text-gray-500"}`}>
                  {passwordEvaluation.criteria.number ? (
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"></span>
                  )}
                  <span>At least one number</span>
                </div>

                <div className={`flex items-center gap-1.5 ${passwordEvaluation.criteria.special ? "text-emerald-700 font-medium" : "text-gray-500"}`}>
                  {passwordEvaluation.criteria.special ? (
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"></span>
                  )}
                  <span>Special symbol (!@#$)</span>
                </div>
              </div>

              {!passwordEvaluation.criteria.notCommon && (
                <div className="text-red-500 text-[11px] pt-1">
                  ⚠️ This password is too common/predictable.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[13px] font-bold text-secondary">Confirm Password</label>
            {formData.confirmPassword && (
              <span
                className={`text-[12px] font-bold flex items-center gap-1 ${
                  passwordsMatch ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className={`w-full pl-11 pr-11 py-3 rounded-xl bg-input text-secondary border transition-all text-[14px] ${
                formData.confirmPassword
                  ? passwordsMatch
                    ? "border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    : "border-red-300 focus:ring-2 focus:ring-red-200"
                  : "border-transparent focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showConfirmPassword ? (
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

        {/* Role Selection */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-secondary mb-1.5">Register As</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-11 pr-8 py-3 rounded-xl bg-input text-secondary border border-transparent focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-[14px] appearance-none"
            >
              <option value="INVESTOR">Investor</option>
              <option value="FOUNDER">Founder</option>
            </select>
            <div className="absolute right-4 pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || (formData.password && !passwordEvaluation.isValid) || (formData.confirmPassword && !passwordsMatch)}
            className="w-full bg-primary text-white py-3.5 rounded-full font-bold text-[15px] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <>
                Create Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pt-5">
        <p className="text-[13px] font-bold text-muted">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:opacity-80 transition-opacity">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;