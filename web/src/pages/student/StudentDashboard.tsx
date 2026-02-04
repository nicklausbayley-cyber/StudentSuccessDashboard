import React from "react";
import {
  Home,
  Search,
  User2,
  ChevronDown,
  Check,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Star,
  ChevronRight,
  CheckSquare,
  Pencil,
  Target,
  BookOpen,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";

function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  icon,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {icon ? <div className="text-slate-500">{icon}</div> : null}
              <div className="text-xl font-semibold text-slate-900">{title}</div>
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
            ) : null}
          </div>
          {right}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function ProgressPill({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-2xl bg-emerald-50/70 ring-1 ring-emerald-200/70 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-slate-700">
          Overall Progress: <span className="font-semibold">{v}%</span>
        </div>
        <div className="h-2 flex-1 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${v}%` }}
          />
        </div>
        <div className="h-2 w-20 rounded-full bg-amber-200" />
      </div>
    </div>
  );
}

function Donut({ percent, label }: { percent: number; label: string }) {
  const p = Math.max(0, Math.min(100, percent));
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;
  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="block">
        <circle
          cx="70"
          cy="70"
          r={r}
          stroke="rgb(226 232 240)"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          stroke="rgb(34 197 94)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold text-slate-900">{label}</div>
      </div>
    </div>
  );
}

function TinyGoalBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="rounded-lg bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200/70">
          Goal: <span className="font-medium">Stay above 95%</span>
        </div>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-500"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function MiniSparkline() {
  return (
    <div className="mt-3 rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-3">
      <svg viewBox="0 0 260 70" className="h-14 w-full">
        <path
          d="M10 52 C40 48, 55 36, 80 40 C105 44, 120 28, 145 30 C170 32, 190 20, 215 24 C235 27, 245 18, 250 14"
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10 52 C40 48, 55 36, 80 40 C105 44, 120 28, 145 30 C170 32, 190 20, 215 24 C235 27, 245 18, 250 14 L250 70 L10 70 Z"
          fill="rgba(59,130,246,0.10)"
        />
      </svg>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={classNames(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
        active
          ? "bg-white shadow-sm ring-1 ring-black/5 text-slate-900"
          : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
      )}
    >
      <div className={classNames("text-slate-500", active && "text-slate-700")}>
        {icon}
      </div>
      <div className="flex-1">{label}</div>
      {active ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
    </button>
  );
}

export default function StudentDashboard() {
  const studentName = "Jordan!";
  const overallProgress = 78;

  const attendancePct = 94.2;
  const missedDays = 12;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar (matches mock structure) */}
          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-3xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                    <Home className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">Dashboard</div>
                    <div className="text-sm text-slate-500">Student View</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white/70 ring-1 ring-black/5 p-3">
                <div className="space-y-2">
                  <NavItem active icon={<Home className="h-5 w-5" />} label="Overview" />
                  <NavItem icon={<Target className="h-5 w-5" />} label="Goals" />
                  <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
                </div>
              </div>

              <div className="rounded-3xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    <User2 className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-slate-900">
                      Jordan Parker
                    </div>
                    <div className="text-sm text-slate-500">Grade 7 • Homeroom B</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Top bar (search + profile) */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Student Dashboard</div>
                <div className="text-2xl font-semibold text-slate-900">Overview</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="Search…"
                  />
                </div>

                <button className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
                  <User2 className="h-5 w-5 text-slate-700" />
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Greeting + progress */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="text-5xl font-semibold tracking-tight text-slate-900">
                  Hi {studentName} 👋
                </div>
                <div className="mt-2 text-2xl text-slate-700">You’re currently:</div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5">
                  <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                        <Check className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-semibold">On Track Overall</div>
                    </div>
                  </div>
                  <div className="px-6 py-4 text-lg text-slate-700">
                    <span className="font-medium">Grade 7</span> •{" "}
                    <span className="font-medium">Homeroom B</span>
                  </div>
                </div>
              </div>

              <div className="lg:pt-12">
                <ProgressPill value={overallProgress} />
              </div>
            </div>

            {/* Cards grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Attendance */}
              <Card title="Attendance">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
                  <div className="flex justify-center md:justify-start">
                    <Donut percent={attendancePct} label={`${Math.round(attendancePct)}%`} />
                  </div>

                  <div>
                    <div className="text-4xl font-semibold text-slate-900">
                      {attendancePct.toFixed(1)}%
                    </div>
                    <div className="mt-2 text-slate-600">
                      You’ve missed{" "}
                      <span className="font-semibold">{missedDays} days</span> this year.
                    </div>

                    <TinyGoalBar value={82} />

                    <div className="mt-3 text-sm text-slate-500">
                      Missing fewer than <span className="font-medium">8 days</span> keeps you on track.
                    </div>
                  </div>
                </div>
              </Card>

              {/* Testing Overview */}
              <Card title="Testing Overview" subtitle="Latest available scores">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                    <div className="text-sm text-slate-600">iLearn Test</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-900">412</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200/70">
                      <TrendingUp className="h-4 w-4" /> 9%
                    </div>
                  </div>

                  <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                    <div className="text-sm text-slate-600">WIDA Composite</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-900">4.2</div>
                    <div className="mt-2 inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-emerald-200/70">
                      Scale: 1.0–6.0
                    </div>
                  </div>

                  <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                    <div className="text-sm text-slate-600">ELA</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-900">211</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200/70">
                      <TrendingUp className="h-4 w-4" /> 9%
                    </div>
                  </div>

                  <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                    <div className="text-sm text-slate-600">SAT</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-400">N/A</div>
                    <div className="mt-2 inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200/70">
                      Grade 11 only
                    </div>
                  </div>
                </div>
              </Card>

              {/* Academics */}
              <Card
                title="Academics"
                subtitle="Subject standing"
                right={
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200/70">
                    Updated weekly
                  </div>
                }
              >
                <div className="space-y-3">
                  {[
                    { label: "Math", status: "On track", icon: <TrendingUp className="h-4 w-4 text-emerald-600" /> },
                    { label: "Reading", status: "Needs attention", icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> },
                    { label: "ELA", status: "On track", icon: <TrendingUp className="h-4 w-4 text-emerald-600" /> },
                    { label: "Science", status: "No score yet", icon: <div className="h-4 w-4 rounded-full bg-slate-200" /> },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-slate-200/70 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/70">
                          <BookOpen className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{s.label}</div>
                          <div className="text-sm text-slate-500">{s.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.icon}
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Testing Progress */}
              <Card
                title="Testing Progress"
                subtitle="Trend line"
                right={
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200/70">
                    <Star className="h-4 w-4" /> On Track
                  </div>
                }
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-4xl font-semibold text-slate-900">412</div>
                    <div className="mt-2 text-slate-600">
                      You’re above benchmark for this point in the year.
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="h-4 w-4 text-slate-500" />
                      <span>Goal: keep improving each quarter</span>
                    </div>
                  </div>

                  <div className="min-w-[240px]">
                    <MiniSparkline />
                    <div className="mt-2 text-xs text-slate-500 text-right">
                      Last 6 checkpoints
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Bottom section (mock-style “tasks/goals” feel) */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card
                title="This Week"
                subtitle="Quick actions to stay on track"
                icon={<CheckSquare className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {[
                    { t: "Finish Math iLearn practice set", s: "Due Friday", icon: <ClipboardList className="h-4 w-4" /> },
                    { t: "Reading log: 90 minutes", s: "Due Thursday", icon: <BookOpen className="h-4 w-4" /> },
                    { t: "Check missing assignments", s: "5 minutes", icon: <Pencil className="h-4 w-4" /> },
                  ].map((x) => (
                    <div
                      key={x.t}
                      className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-slate-200/70 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 text-slate-600">
                          {x.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{x.t}</div>
                          <div className="text-sm text-slate-500">{x.s}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Goals"
                subtitle="Focus areas"
                icon={<Target className="h-5 w-5" />}
                right={
                  <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                    View all
                  </button>
                }
              >
                <div className="space-y-3">
                  {[
                    { t: "Attendance", d: "Stay above 95%", pct: 82 },
                    { t: "Reading", d: "Increase by 1 level", pct: 55 },
                    { t: "Math", d: "Improve checkpoint trend", pct: 68 },
                  ].map((g) => (
                    <div
                      key={g.t}
                      className="rounded-2xl bg-white ring-1 ring-slate-200/70 px-4 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">{g.t}</div>
                          <div className="text-sm text-slate-500">{g.d}</div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{g.pct}%</div>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${g.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
