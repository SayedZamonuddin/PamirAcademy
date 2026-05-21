import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTokens } from "../utils/api";

const ROLE_HOME = {
  admin: "/dashboard",
  student: "/student",
  teacher: "/teacher",
};

export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();
  const tokens = getTokens();

  if (!tokens?.access || !currentUser) {
    return <Navigate to="/" replace />;
  }

  const role = currentUser.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctHome = ROLE_HOME[role] || "/";
    return <Navigate to={correctHome} replace />;
  }

  return children;
}
