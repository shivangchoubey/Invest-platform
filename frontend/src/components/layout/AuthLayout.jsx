import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative font-sans tracking-tight"
      style={{ backgroundImage: `url('/finance_login_bg.png')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Header section */}
      <div className="flex flex-col items-center text-center mb-6 relative z-10">
        <div className="flex justify-center mb-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-lg">
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
        <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-1 drop-shadow-md">
          Dhanex
        </h1>
        <p className="text-[15px] font-medium text-white/80 tracking-wide drop-shadow-sm">
          A Fundraising Platform
        </p>
      </div>

      <div className="w-full max-w-[480px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-3xl p-8 sm:p-9 relative z-10 overflow-hidden mb-4">
        {/* Top Green Border Line */}
        <div className="h-[4px] bg-primary w-full absolute top-0 left-0"></div>
        {children}
      </div>

      {/* Bottom Legal/Security Text */}
      <div className="text-center pb-6 z-10 w-full max-w-[480px]">
        <p className="text-[11px] font-bold text-white/70 tracking-[0.1em] uppercase drop-shadow-sm">
          Institutional Grade Security
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;