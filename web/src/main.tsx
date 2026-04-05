import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo/student" element={<StudentDashboard />} />
        <Route path="/demo/counselor" element={<CounselorDashboard />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/counselor" element={<CounselorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route path="/students" element={<Students />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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
