import React from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <AuthLayout>
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Account</h1>
        <p className="text-sm text-text mt-1">
          Join as a founder or investor
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="text-sm text-text">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-sm text-text">Register As</label>
          <select className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="investor">Investor</option>
            <option value="founder">Founder</option>
          </select>
        </div>

        {/* Button */}
        <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
          Create Account
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