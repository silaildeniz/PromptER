import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string} props.requiredRole - Required role ('user', 'admin', etc.)
 * @param {string} props.redirectTo - Where to redirect if unauthorized (default: '/')
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      // Wait for auth to initialize
      if (authLoading) {
        return;
      }

      // If no user and authentication is required, redirect to login
      if (!user) {
        setChecking(false);
        setAuthorized(false);
        return;
      }

      // If no specific role is required, user just needs to be logged in
      if (!requiredRole) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // Check user's role from database
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Role check error:', error);
          toast.error('Failed to verify permissions');
          setAuthorized(false);
          setChecking(false);
          return;
        }

        // Check if user has required role
        if (data.role === requiredRole) {
          setAuthorized(true);
        } else {
          toast.error(`Access Denied: ${requiredRole} privileges required`);
          setAuthorized(false);
        }
      } catch (err) {
        console.error('Permission check error:', err);
        toast.error('Failed to verify permissions');
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkPermissions();
  }, [user, authLoading, requiredRole]);

  // Show loading spinner while checking permissions
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // If not authorized and no user, redirect to login (preserve intended destination)
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If not authorized (role mismatch), redirect to specified page
  if (!authorized) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authorized, render the protected content
  return children;
};

export default ProtectedRoute;

