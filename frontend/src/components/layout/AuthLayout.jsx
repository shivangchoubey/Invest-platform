import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;