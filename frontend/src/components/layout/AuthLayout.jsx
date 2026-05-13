import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative font-sans tracking-tight"
      style={{ backgroundImage: `url('/finance_login_bg.png')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      <div className="w-full max-w-md bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-3xl p-8 relative z-10 overflow-hidden">
        {/* Top Green Border Line */}
        <div className="h-[4px] bg-primary w-full absolute top-0 left-0"></div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;