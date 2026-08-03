import { Navigate } from "react-router-dom";

function CompanyProtectedRoute({ children }) {

  const token = localStorage.getItem("companyToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/company-login" replace />;
  }

  if (role !== "company") {
    return <Navigate to="/" replace />;
  }

  return children;

}

export default CompanyProtectedRoute;