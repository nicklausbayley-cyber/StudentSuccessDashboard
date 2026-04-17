import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function Login() {
  const { login, currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.10)_0%,_rgba(255,255,255,0)_45%),radial-gradient(ellipse_at_bottom_right,_rgba(15,23,42,0.08)_0%,_rgba(255,255,255,0)_45%)] bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:px-10 lg:py-12">
        <div className="flex items-center">
          <div className="w-full">
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
              Indiana-aligned student success demo
            </div>

            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-slate-900 lg:text-6xl">
              Student Success Dashboard
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Track attendance, academic growth, readiness, and key grade-band
              milestones in one place. Built to help schools see where students
              are thriving and where support is needed next.
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <StatPill label="Attendance" value="Early visibility" />
              <StatPill label="Growth" value="Progress signals" />
              <StatPill label="Readiness" value="Actionable alerts" />
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <div className="text-sm font-semibold text-slate-900">Attendance</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  Spot attendance-driven risk before it becomes chronic.
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <div className="text-sm font-semibold text-slate-900">Academic Growth</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  Monitor progress, growth signals, and readiness indicators.
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <div className="text-sm font-semibold text-slate-900">Grade-Band Milestones</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  Show different expectations from K–3 foundations through 11–12 readiness.
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <div className="text-sm font-semibold text-slate-900">Student Readiness</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  Turn multiple student indicators into a clear on-track story.
                </div>
              </div>
            </div>

            <div className="mt-10 max-w-2xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-slate-800">
              <div className="border-b border-white/10 px-6 py-4">
                <div className="text-sm font-semibold text-emerald-300">Why this matters</div>
              </div>
              <div className="px-6 py-5 text-sm leading-7 text-slate-200">
                Schools are being asked to track more than just test scores. This dashboard
                is designed to help students, counselors, and school leaders see the full
                picture around knowledge, skills, experiences, and on-track progress.
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[28px] bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.14)] ring-1 ring-black/5 backdrop-blur">
            <div>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                Sign in
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access the student and counselor demo experience.
              </p>
            </div>

            {currentUser && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                <div className="text-sm font-semibold text-slate-900">Currently signed in</div>
                <div className="mt-2 text-sm text-slate-700">{currentUser.email}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Role: {currentUser.role} • District: {currentUser.district_id}
                </div>
                <button
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  onClick={() => logout()}
                >
                  Log out
                </button>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
              <div className="text-sm font-semibold text-slate-900">Jump into the demo</div>
              <div className="mt-1 text-xs text-slate-500">
                Use these for the hosted showcase without signing in.
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  onClick={() => nav("/demo/student")}
                >
                  View Student Demo
                </button>
                <button
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  onClick={() => nav("/demo/counselor")}
                >
                  View Counselor Demo
                </button>
              </div>
            </div>

            <div className="mt-7">
              <button
                className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                onClick={() => {
                  if (!API_BASE) {
                    alert("VITE_API_BASE_URL is not configured");
                    return;
                  }
                  window.location.href = `${API_BASE}/api/auth/sso/google/start`;
                }}
              >
                Continue with Google
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Dev / Admin Access
              </div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-300"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {err && (
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                  {err}
                </div>
              )}

              <button
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
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
                {busy ? "Signing in..." : "Use email login"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500 ring-1 ring-slate-200/70">
              Demo access supports student and counselor experiences with Indiana-aligned
              readiness and grade-band scenarios.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
