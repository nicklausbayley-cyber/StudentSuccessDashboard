import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const { login, currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
      <h2>Student Success Dashboard</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Sign in</p>

      {currentUser && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600 }}>Currently signed in</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{currentUser.email}</div>
          <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>
            Role: {currentUser.role} • District: {currentUser.district_id}
          </div>
          <button
            style={{ marginTop: 10, padding: "8px 12px" }}
            onClick={() => {
              logout();
            }}
          >
            Log out
          </button>
        </div>
      )}

      <label>Email</label>
      <input
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

      <button
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
        disabled={busy}
        onClick={async () => {
          setErr(null);
          setBusy(true);
          try {
            await login(email, password);
            nav("/students");
          } catch (e: any) {
            setErr(e?.message || "Login failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Signing in..." : "Sign in"}
      </button>

      <button
        style={{ width: "100%", padding: 10 }}
        onClick={() => {
          if (!API_BASE) {
            alert("VITE_API_BASE_URL is not configured");
            return;
          }
          window.location.href = `${API_BASE}/api/auth/sso/google/start`;
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
