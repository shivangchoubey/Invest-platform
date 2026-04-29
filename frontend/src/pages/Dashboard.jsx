import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FounderDashboard from "../components/FounderDashboard";
import InvestorDashboard from "../components/InvestorDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-secondary">
      {/* Navbar */}
      <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/home" className="text-xl font-bold text-primary tracking-tight">
            Dhanex
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">Startups</Link>
            <div className="flex flex-col items-center pt-[6px]">
              <span className="text-sm font-bold text-primary">Dashboard</span>
              <div className="h-0.5 w-full bg-primary mt-1 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right side nav */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-gray-500">Hi, {user.name}</span>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
             {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">
            Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {user.role === "FOUNDER" ? (
          <FounderDashboard user={user} />
        ) : user.role === "INVESTOR" ? (
          <InvestorDashboard user={user} />
        ) : user.role === "ADMIN" ? (
          <AdminDashboard user={user} />
        ) : (
          <div className="text-center font-bold font-xl text-red-500 mt-20">No dashboard assigned.</div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
