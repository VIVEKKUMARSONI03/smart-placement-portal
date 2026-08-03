import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtectedRoute;