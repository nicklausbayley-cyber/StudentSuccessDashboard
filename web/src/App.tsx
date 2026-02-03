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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Tailwind is working ✅</h1>
        <p className="mt-2 text-slate-600">Next: Student Dashboard UI</p>
      </div>
    </div>
  );
}

