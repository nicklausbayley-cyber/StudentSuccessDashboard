import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://turbo-orbit-pjvrrx65xqgv26q6q-8000.app.github.dev";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
      <h2>Student Success Dashboard</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Sign in</p>

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
          window.location.href = `${API_BASE}/api/auth/sso/google/start`;
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
