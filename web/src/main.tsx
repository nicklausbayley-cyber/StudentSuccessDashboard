import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./index.css";

import { AuthProvider, useAuth } from "./lib/AuthContext";

import Login from "./pages/Login";
import Students from "./pages/Students";
import StudentDashboard from "./pages/student/StudentDashboard";
import CounselorDashboard from "./pages/counselor/CounselorDashboard";

function AuthCallbackPage() {
  const { setTokenFromSSO } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const role = params.get("role");

    if (!token || !role) {
      navigate("/login", { replace: true });
      return;
    }

    setTokenFromSSO(token);

    if (role === "student") {
      navigate("/student", { replace: true });
    } else {
      navigate("/counselor", { replace: true });
    }
  }, [params, navigate, setTokenFromSSO]);

  return <div style={{ padding: 24, fontFamily: "system-ui" }}>Signing you in...</div>;
}

function LoginRoute() {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === "student") {
      return <Navigate to="/student" replace />;
    }
    return <Navigate to="/counselor" replace />;
  }

  return <Login />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

function StudentOnly({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  if (role !== "student") {
    return <Navigate to="/counselor" replace />;
  }

  return <>{children}</>;
}

function StaffOnly({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  if (role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
}

function HomeRoute() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/counselor" replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo/student" element={<StudentDashboard />} />
        <Route path="/demo/counselor" element={<CounselorDashboard />} />

        <Route path="/login" element={<LoginRoute />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route
          path="/student"
          element={
            <RequireAuth>
              <StudentOnly>
                <StudentDashboard />
              </StudentOnly>
            </RequireAuth>
          }
        />

        <Route
          path="/counselor"
          element={
            <RequireAuth>
              <StaffOnly>
                <CounselorDashboard />
              </StaffOnly>
            </RequireAuth>
          }
        />

        <Route
          path="/students"
          element={
            <RequireAuth>
              <StaffOnly>
                <Students />
              </StaffOnly>
            </RequireAuth>
          }
        />

        <Route path="/" element={<HomeRoute />} />
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
