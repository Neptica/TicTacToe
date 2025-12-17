import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from "react-bootstrap";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
