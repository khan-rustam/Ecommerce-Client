import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useBrandColors } from "../../contexts/BrandColorContext";

interface AccountLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const user = useSelector((state: any) => state.user.user);
  const { colors } = useBrandColors();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (requireAuth && !user) {
      navigate("/auth/login", { 
        replace: true,
        state: { from: window.location.pathname }
      });
    }
  }, [user, navigate, requireAuth]);

  // If authentication is required and user is not logged in, redirect
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" state={{ from: window.location.pathname }} />;
  }

  return (
    <div 
      className="min-h-screen pt-20 pb-12 px-4 md:px-8"
      style={{ background: colors.background || "#f5f5f5" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
         
          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white rounded-md shadow-sm p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout; 