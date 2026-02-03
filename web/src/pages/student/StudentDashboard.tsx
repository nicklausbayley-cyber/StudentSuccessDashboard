import React from "react";
import {
  Home,
  Search,
  User2,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  BookOpenCheck,
  GraduationCap,
  Star,
  ClipboardList,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Card({
  title,
  icon,
  right,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {icon ? <span className="text-slate-700">{icon}</span> : null}
            <div className="text-xl font-semibold text-slate-900">{title}</div>
          </div>
          {right}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function PillProgress({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="text-sm font-medium text-slate-700">{label}: {clamped}%</div>
      <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-emerald-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function Donut({
  value,
  size = 160,
  stroke = 16,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;

  return (
    <svg width={size} height={size} className="shrink-0">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle
          r={r}
          fill="transparent"
          stroke="rgb(226 232 240)" // slate-200
          strokeWidth={stroke}
        />
        <circle
          r={r}
          fill="transparent"
          stroke="rgb(16 185 129)" // emerald-500
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90)"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-900"
          style={{ fontSize: 36, fontWeight: 700 }}
        >
          {Math.round(clamped)}%
        </text>
      </g>
    </svg>
  );
}

const trendData = [
  { m: "Sep", v: 380 },
  { m: "Oct", v: 392 },
  { m: "Nov", v: 401 },
  { m: "Dec", v: 408 },
  { m: "Jan", v: 412 },
  { m: "Feb", v: 415 },
];

export default function StudentDashboard() {
  const studentName = "Jordan";
  const overall = 78;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <Home className="h-5 w-5 text-slate-700" />
            </div>
            <div className="text-xl font-semibold text-slate-900">Student Dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search student…"
              />
            </div>

            <button className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
              <User2 className="h-5 w-5 text-slate-700" />
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Greeting row */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-5xl font-semibold tracking-tight text-slate-900">
              Hi {studentName}! <span className="align-middle">👋</span>
            </div>
            <div className="mt-2 text-lg text-slate-600">You’re currently:</div>

            <div className="mt-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-3xl font-semibold">On Track Overall</div>
              </div>
              <div className="mt-3 text-white/90">Grade 7 &nbsp;•&nbsp; Homeroom B</div>
            </div>
          </div>

          <div className="flex items-start justify-end lg:justify-start">
            <PillProgress label="Overall Progress" value={overall} />
          </div>
        </div>

        {/* Middle grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Attendance */}
          <Card title="Attendance" icon={<ClipboardList className="h-5 w-5" />}>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
              <Donut value={94} />
              <div className="flex-1">
                <div className="text-4xl font-semibold text-slate-900">94.2%</div>
                <div className="mt-2 text-slate-600">You’ve missed <span className="font-medium text-slate-900">12 days</span> this year.</div>

                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                  <div className="text-sm font-medium text-emerald-900">Goal: Stay above 95%</div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: "94%" }} />
                  </div>
                  <div className="mt-2 text-sm text-emerald-800/90">
                    Missing fewer than <span className="font-medium">8 days</span> keeps you on track.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Testing Overview */}
          <Card title="Testing Overview" icon={<GraduationCap className="h-5 w-5" />}>
            <div className="text-sm text-slate-500">Latest available scores</div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                <div className="text-sm font-medium text-slate-600">iLearn Test</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-3xl font-semibold text-slate-900">412</div>
                  <div className="flex items-center gap-1 rounded-xl bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700">
                    <ArrowUpRight className="h-4 w-4" /> 9%
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                <div className="text-sm font-medium text-slate-600">WIDA Composite</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-3xl font-semibold text-slate-900">4.2</div>
                  <div className="rounded-xl bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                    Scale: 1.0–6.0
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                <div className="text-sm font-medium text-slate-600">ELA</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-3xl font-semibold text-slate-900">211</div>
                  <div className="flex items-center gap-1 rounded-xl bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700">
                    <ArrowUpRight className="h-4 w-4" /> 9%
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                <div className="text-sm font-medium text-slate-600">SAT</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-3xl font-semibold text-slate-900">N/A</div>
                  <div className="rounded-xl bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                    Grade 11 only
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-black/5 hover:bg-slate-50">
              <span>iLearn Checkpoints</span>
              <span className="flex items-center gap-2 text-slate-500">
                388 &nbsp; 4.02 &nbsp; 415 &nbsp; 500 <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </Card>

          {/* Academics */}
          <Card title="Academics" icon={<BookOpenCheck className="h-5 w-5" />}>
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl ring-1 ring-black/5">
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div className="text-slate-800">Math</div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <TrendingUp className="h-4 w-4" /> Improving
                </div>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div className="text-slate-800">Reading</div>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                  <AlertTriangle className="h-4 w-4" /> Needs Attention
                </div>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div className="text-slate-800">ELA</div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <TrendingUp className="h-4 w-4" /> Improving
                </div>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div className="text-slate-800">Science</div>
                <div className="text-sm font-medium text-slate-500">Steady</div>
              </div>
            </div>
          </Card>

          {/* Testing Progress */}
          <Card
            title="Testing Progress"
            icon={<Star className="h-5 w-5" />}
            right={
              <span className="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
                On Track ↗
              </span>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-slate-500">Latest iLearn</div>
                  <div className="mt-1 text-4xl font-semibold text-emerald-700">412</div>
                </div>
                <div className="text-sm text-slate-600">
                  PSAT: <span className="font-medium text-slate-900">920</span> &nbsp;•&nbsp; SAT: <span className="text-slate-500">Not yet (Grade 11)</span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="m" tickLine={false} axisLine={false} />
                    <YAxis hide domain={["dataMin-10", "dataMax+10"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="v" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-sm text-slate-600">You’re above this year’s benchmark. 🎉</div>
            </div>
          </Card>
        </div>

        {/* Subject Progress strip */}
        <div className="mt-8 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="text-xl font-semibold text-slate-900">Subject Progress</div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
              <div className="font-medium text-slate-900">Math</div>
              <div className="mt-2 text-sm text-slate-600">Up since last test ↗</div>
              <div className="mt-3 h-2 rounded-full bg-emerald-100">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
              <div className="font-medium text-slate-900">Reading</div>
              <div className="mt-2 text-sm text-slate-600">Dropped slightly 💧</div>
              <div className="mt-3 h-2 rounded-full bg-rose-100">
                <div className="h-2 rounded-full bg-rose-500" style={{ width: "45%" }} />
              </div>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <div className="font-medium text-slate-900">ELA</div>
              <div className="mt-2 text-sm text-slate-600">Improving 👍</div>
              <div className="mt-3 h-2 rounded-full bg-sky-100">
                <div className="h-2 rounded-full bg-sky-500" style={{ width: "60%" }} />
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <div className="font-medium text-slate-900">Science</div>
              <div className="mt-2 text-sm text-slate-600">Holding steady —</div>
              <div className="mt-3 h-2 rounded-full bg-amber-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: "55%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* What you can do this week */}
        <div className="mt-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="text-xl font-semibold text-slate-900">What You Can Do This Week</div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded" defaultChecked />
              <div>
                <div className="font-medium text-slate-900">Practice reading <span className="font-semibold">15 minutes daily</span> 📖</div>
                <div className="mt-1 text-sm text-slate-600">Small daily effort makes a big impact.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded" />
              <div>
                <div className="font-medium text-slate-900">Writing support session Thursday ✍️</div>
                <div className="mt-1 text-sm text-slate-600">Ask for feedback on one paragraph.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded" />
              <div>
                <div className="font-medium text-slate-900">Aim for perfect attendance this week ✅</div>
                <div className="mt-1 text-sm text-slate-600">Stay above the 95% goal.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded" />
              <div>
                <div className="font-medium text-slate-900">Complete 2 math practice sets 🧠</div>
                <div className="mt-1 text-sm text-slate-600">Focus on missed question types.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
