import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CompanyRegister from "./pages/CompanyRegister";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import CompanySettings from "./pages/CompanySettings";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import Applicants from "./pages/Applicants";
import EditJob from "./pages/EditJob";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import Resume from "./pages/Resume";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import RecommendedJobs from "./pages/RecommendedJobs";
import Notifications from "./pages/Notifications";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCompanies from "./pages/AdminCompanies";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import Analytics from "./pages/Analytics";

import ProtectedRoute from "./components/ProtectedRoute";
import CompanyProtectedRoute from "./components/CompanyProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>

      {/* ================= HOME ================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* ================= STUDENT AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= COMPANY AUTH ================= */}

      <Route
        path="/company-register"
        element={<CompanyRegister />}
      />

      <Route
        path="/company-login"
        element={<CompanyLogin />}
      />

      {/* ================= ADMIN AUTH ================= */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <Analytics />
          </AdminProtectedRoute>
        }
      />

      {/* ================= STUDENT ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recommended-jobs"
        element={
          <ProtectedRoute>
            <RecommendedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* ================= COMPANY ================= */}

      <Route
        path="/company-dashboard"
        element={
          <CompanyProtectedRoute>
            <CompanyDashboard />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/create-job"
        element={
          <CompanyProtectedRoute>
            <CreateJob />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <CompanyProtectedRoute>
            <EditJob />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/my-jobs"
        element={
          <CompanyProtectedRoute>
            <MyJobs />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/company-profile"
        element={
          <CompanyProtectedRoute>
            <CompanyProfile />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/company-settings"
        element={
          <CompanyProtectedRoute>
            <CompanySettings />
          </CompanyProtectedRoute>
        }
      />

      <Route
        path="/applicants"
        element={
          <CompanyProtectedRoute>
            <Applicants />
          </CompanyProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <AdminProtectedRoute>
            <AdminStudents />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <AdminProtectedRoute>
            <AdminCompanies />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <AdminProtectedRoute>
            <AdminJobs />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <AdminProtectedRoute>
            <AdminApplications />
          </AdminProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;