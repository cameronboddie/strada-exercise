import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ReactElement } from 'react';
import { useAuth } from '../ context/AuthContext.tsx';

interface ProtectedRouteProps {
  permissions?: string[];
}

function ProtectedRoute({ permissions = [] }: ProtectedRouteProps): ReactElement {
  const { user, loading, permissions: userPermissions } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = permissions.every((perm) => userPermissions?.includes(perm));

  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

ProtectedRoute.defaultProps = {
  permissions: undefined,
};
