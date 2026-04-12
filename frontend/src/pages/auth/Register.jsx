import React, { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "INVESTOR", // Uppercase to match backend
  });
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
      const response = await api.post("/auth/register", formData);
      // Optional: auto-login or just redirect to login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again or check if the backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Account</h1>
        <p className="text-sm text-text mt-1">
          Join as a founder or investor
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-text">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-sm text-text">Register As</label>
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="INVESTOR">Investor</option>
            <option value="FOUNDER">Founder</option>
          </select>
        </div>

        {/* Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center mt-4 text-text">
        Already have an account?{" "}
        <Link to="/" className="text-primary font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;