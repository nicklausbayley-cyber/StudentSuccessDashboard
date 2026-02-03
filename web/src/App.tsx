import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import Login from "./pages/Login";
import Students from "./pages/Students";

function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/students" element={<Protected><Students /></Protected>} />
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
}
