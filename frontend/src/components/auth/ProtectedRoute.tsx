import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles allowed to access this route */
  requiredRoles?: Array<'admin' | 'superadmin'>;
  /** At least one of these permissions is required (superadmin bypasses) */
  requiredPermission?: string | string[];
  /** Where to redirect unauthenticated users */
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermission,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasAnyPermission, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role check
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Permission check — superadmin always passes
  if (requiredPermission && !isSuperAdmin) {
    const perms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    if (!hasAnyPermission(perms)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
