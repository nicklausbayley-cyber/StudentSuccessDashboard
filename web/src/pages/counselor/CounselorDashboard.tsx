import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { DEMO_STUDENTS, type Risk } from "../../demo/demoData";
import { FlagReasonsCard, InterventionStatusCard, ParentOutreachCard } from "../../components/phase1";
import {
  Building2,
  Search,
  ChevronDown,
  SlidersHorizontal,
  MoreHorizontal,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

function cx(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function Chip({
  active,
  children,
  onClick,
  tone = "slate",
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "rose" | "amber" | "emerald" | "slate";
}) {
  const tones: Record<string, string> = {
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 transition",
        tones[tone],
        active ? "shadow-sm" : "opacity-80 hover:opacity-100"
      )}
    >
      {children}
    </button>
  );
}

function Card({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur",
        className
      )}
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          {title ? (
            <div className="text-lg font-semibold text-slate-900">{title}</div>
          ) : (
            <div />
          )}
          {right}
        </div>
      )}
      <div className={cx(title || right ? "p-5 pt-4" : "p-5")}>{children}</div>
    </div>
  );
}

type KPIProps = { label: string; value: string; delta?: string; sub?: string };

function KPI({ label, value, delta, sub }: KPIProps) {
  return (
    <div className="h-full rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-medium text-slate-600">{label}</div>

          {delta ? (
            <div className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
              {delta}
            </div>
          ) : (
            <div className="h-7 w-16" />
          )}
        </div>

        <div className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">
          {value}
        </div>

        {sub ? (
          <div className="mt-3 text-sm text-slate-500">{sub}</div>
        ) : (
          <div className="mt-3 h-5" />
        )}
      </div>
    </div>
  );
}

const RISK_META: Record<Risk, { tone: "rose" | "amber" | "emerald" | "slate"; icon: React.ReactNode }> = {
  "High Risk": { tone: "rose", icon: <ShieldAlert className="h-4 w-4" /> },
  "At Risk": { tone: "amber", icon: <AlertTriangle className="h-4 w-4" /> },
  "On Watch": { tone: "slate", icon: <Shield className="h-4 w-4" /> },
  "Low Risk": { tone: "emerald", icon: <ShieldCheck className="h-4 w-4" /> },
};

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct == null) {
    return (
      <span className="inline-flex items-center rounded-lg px-2 py-1 text-xs ring-1 bg-slate-50 text-slate-600 ring-slate-200/70">
        No growth data
      </span>
    );
  }

  const up = pct >= 50;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-lg px-2 py-1 text-xs ring-1",
        up
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
          : "bg-rose-50 text-rose-700 ring-rose-200/70"
      )}
    >
      {up ? "↗" : "↘"} GP {pct}
    </span>
  );
}


function gradeBandLabel(grade: number) {
  if (grade <= 3) return "K–3 Foundations";
  if (grade <= 6) return "Grades 4–6 Growth";
  if (grade <= 8) return "Grades 7–8 Planning";
  if (grade <= 10) return "Grades 9–10 On-Track";
  return "Grades 11–12 Readiness";
}

function priorityIntervention(student: typeof DEMO_STUDENTS[number]) {
  if (student.grade <= 3) return "Attendance + literacy support";
  if (student.elFlag) return "EL progress monitoring";
  if (student.grade >= 9 && student.ninthGradeOnTrack === false) return "Freshman credits recovery";
  if (student.grade >= 11) return "College/career benchmark completion";
  if (student.growthPercentile != null && student.growthPercentile < 50) return "Growth-focused academic support";
  return "Maintain on-track progress";
}

function readinessLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CounselorDashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<Risk | "All">("All");
  const [selected, setSelected] = useState<string>(DEMO_STUDENTS[0].name);
  const [gradeFilter, setGradeFilter] = useState<number | "All">("All");
  const [homeFilter, setHomeFilter] = useState<string | "All">("All");

  const rows = useMemo(() => {
    return DEMO_STUDENTS.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        String(s.grade).includes(q) ||
        s.homeroom.toLowerCase().includes(q.toLowerCase()) ||
        s.readinessStatus.toLowerCase().includes(q.toLowerCase());

      const matchRisk = riskFilter === "All" ? true : s.risk === riskFilter;
      const matchGrade = gradeFilter === "All" ? true : s.grade === gradeFilter;
      const matchHome = homeFilter === "All" ? true : s.homeroom === homeFilter;

      return matchQ && matchRisk && matchGrade && matchHome;
    });
  }, [q, riskFilter, gradeFilter, homeFilter]);

  const selectedRow = useMemo(
    () => DEMO_STUDENTS.find((s) => s.name === selected) ?? DEMO_STUDENTS[0],
    [selected]
  );

  const riskCounts = useMemo(() => {
    const base: Record<Risk, number> = { "High Risk": 0, "At Risk": 0, "On Watch": 0, "Low Risk": 0 };
    for (const s of DEMO_STUDENTS) base[s.risk] += 1;
    const total = DEMO_STUDENTS.length || 1;
    return (Object.keys(base) as Risk[]).map((k) => ({
      name: k,
      value: base[k],
      pct: Math.round((base[k] / total) * 100),
    }));
  }, []);

  const kpis = useMemo(() => {
    const total = DEMO_STUDENTS.length || 1;
    const avg = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / (nums.length || 1);

    const attendanceAvg = avg(DEMO_STUDENTS.map((s) => s.attendance));
    const growthAvg = avg(DEMO_STUDENTS.map((s) => s.growthPercentile ?? 0));
    const atRiskCount = DEMO_STUDENTS.filter((s) => s.risk === "High Risk" || s.risk === "At Risk").length;
    const hsOffTrack = DEMO_STUDENTS.filter((s) => s.grade >= 9 && s.ninthGradeOnTrack === false).length;

    return {
      attendance: `${attendanceAvg.toFixed(1)}%`,
      growth: `${Math.round(growthAvg)}`,
      atRisk: `${atRiskCount}`,
      hsOffTrack: `${hsOffTrack}`,
      total: `${total}`,
    };
  }, []);

  const spark = [
    { x: "W1", y: selectedRow.newaReading - 12 },
    { x: "W2", y: selectedRow.newaReading - 8 },
    { x: "W3", y: selectedRow.newaReading - 4 },
    { x: "W4", y: selectedRow.newaReading - 2 },
    { x: "W5", y: selectedRow.newaReading },
  ];

  const pieCells = {
    "High Risk": "rgba(244,63,94,0.75)",
    "At Risk": "rgba(245,158,11,0.75)",
    "On Watch": "rgba(100,116,139,0.70)",
    "Low Risk": "rgba(34,197,94,0.70)",
  } as const;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.06)_0%,_rgba(255,255,255,0)_55%),radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.08)_0%,_rgba(255,255,255,0)_45%)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
              <Building2 className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">
                Student Achievement Dashboard
              </div>
              <div className="text-sm text-slate-500">Wabash Demo District</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden md:block rounded-2xl bg-white px-4 py-2 text-xs text-slate-600 shadow-sm ring-1 ring-black/5">
                <div className="font-semibold text-slate-800">{currentUser.email}</div>
                <div>Role: {currentUser.role} • District: {currentUser.district_id}</div>
              </div>
            )}
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Demo Data
            </div>
            <button
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5 hover:bg-slate-50"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </button>
            <button className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
                Grade
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
                Homerooms
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
                Indiana Grade Bands
                <span className="text-slate-500">Demo</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/80 px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-600">
                  <path d="M12 3v10m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200/70" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPI label="Attendance (avg)" value={kpis.attendance} sub={`Across ${kpis.total} demo students`} />
          <KPI label="Growth Percentile (avg)" value={kpis.growth} sub="Indiana-aligned progress signal" />
          <KPI label="At Risk" value={kpis.atRisk} sub="High Risk + At Risk students" />
          <KPI label="HS Off Track" value={kpis.hsOffTrack} sub="Grades 9–12 milestone watch" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card
            className="lg:col-span-2"
            title=""
            right={
              <button className="rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200/70 shadow-sm">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200/70">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Filter students..."
                />
              </div>

              <button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/70">
                All Levels <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/70">
                All Subjects <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              <button className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/70">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Chip active={riskFilter === "All"} onClick={() => setRiskFilter("All")} tone="slate">
                All
              </Chip>
              <Chip active={riskFilter === "High Risk"} onClick={() => setRiskFilter("High Risk")} tone="rose">
                High Risk
              </Chip>
              <Chip active={riskFilter === "At Risk"} onClick={() => setRiskFilter("At Risk")} tone="amber">
                At Risk
              </Chip>
              <Chip active={riskFilter === "On Watch"} onClick={() => setRiskFilter("On Watch")} tone="slate">
                On Watch
              </Chip>
              <Chip active={riskFilter === "Low Risk"} onClick={() => setRiskFilter("Low Risk")} tone="emerald">
                Low Risk
              </Chip>
            </div>

            <div className="mb-2 mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{rows.length}</span> students
              </div>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setRiskFilter("All");
                  setGradeFilter("All");
                  setHomeFilter("All");
                }}
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>

            <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl ring-1 ring-slate-200/70">
              <div className="sticky top-0 z-10 grid grid-cols-[1.6fr_0.5fr_0.9fr_0.8fr_0.9fr_1.1fr] bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
                <div>Student</div>
                <div>Grade</div>
                <div>Homeroom</div>
                <div>Attendance</div>
                <div>Growth</div>
                <div>Readiness</div>
              </div>

              <div className="divide-y divide-slate-200/70 bg-white">
                {rows.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <div className="text-base font-semibold text-slate-900">No students match your filters</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Try adjusting Grade, Homeroom, Risk, or clearing the search.
                    </div>
                  </div>
                ) : (
                  rows.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelected(s.name)}
                      className={cx(
                        "grid w-full grid-cols-[1.6fr_0.5fr_0.9fr_0.8fr_0.9fr_1.1fr] items-center px-4 py-3 text-left text-sm transition-colors",
                        selected === s.name ? "bg-slate-50" : "hover:bg-slate-50 hover:shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 ring-1 ring-slate-200/70" />
                        <div>
                          <div className="font-medium text-slate-900">{s.name}</div>
                          <div className="text-xs text-slate-500">{gradeBandLabel(s.grade)} • {s.counselorNote}</div>
                        </div>
                      </div>

                      <div className="text-slate-700">{s.grade}</div>
                      <div className="text-slate-700">{s.homeroom}</div>
                      <div className="text-slate-700">{s.attendance}%</div>
                      <div><TrendBadge pct={s.growthPercentile} /></div>
                      <div>
                        <span
                          className={cx(
                            "inline-flex items-center gap-2 rounded-xl px-2 py-1 text-xs ring-1",
                            RISK_META[s.risk].tone === "rose"
                              ? "bg-rose-50 text-rose-700 ring-rose-200/70"
                              : RISK_META[s.risk].tone === "amber"
                              ? "bg-amber-50 text-amber-800 ring-amber-200/70"
                              : RISK_META[s.risk].tone === "emerald"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
                              : "bg-slate-50 text-slate-700 ring-slate-200/70"
                          )}
                        >
                          {RISK_META[s.risk].icon} {readinessLabel(s.readinessStatus)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Risk Distribution">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskCounts}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {riskCounts.map((d) => (
                          <Cell key={d.name} fill={pieCells[d.name as Risk]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {riskCounts.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieCells[d.name as Risk] }} />
                        {d.name}
                      </div>
                      <div className="text-slate-600">{d.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Actionable Alerts">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{selectedRow.name}</div>
                    <div className="mt-0.5 text-sm text-slate-500">
                      Grade {selectedRow.grade} • {selectedRow.homeroom}
                    </div>
                  </div>

                  <Chip tone={RISK_META[selectedRow.risk].tone}>
                    {RISK_META[selectedRow.risk].icon} {selectedRow.risk}
                  </Chip>
                </div>

                <div className="mt-4 text-sm font-medium text-slate-800">
                  {priorityIntervention(selectedRow)}
                </div>

                <div className="mt-2 text-sm text-slate-600">
                  {gradeBandLabel(selectedRow.grade)} • {selectedRow.counselorNote}
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold text-slate-900">
                      {selectedRow.growthPercentile ?? "—"}
                    </div>
                    <div className="mt-1 text-sm text-emerald-700">Growth Percentile</div>
                  </div>

                  <div className="h-20 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={spark}>
                        <XAxis dataKey="x" hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="y" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200/70">
                    Attendance: {selectedRow.attendance}%
                  </span>
                  <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200/70">
                    Days Absent: {selectedRow.daysAbsent}
                  </span>
                  {selectedRow.elFlag && (
                    <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200/70">
                      WIDA: {selectedRow.wida}
                    </span>
                  )}
                </div>

                <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/70">
                  View details <span className="text-slate-400">›</span>
                </button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/70 ring-1 ring-black/5">
          <div className="px-6 pt-6 text-lg font-semibold text-slate-900">Student Detail</div>
          <div className="mt-3 flex flex-wrap gap-4 border-b border-slate-200/70 px-6 pb-3 text-sm text-slate-600">
            <button className="border-b-2 border-slate-900 pb-2 text-slate-900">Overview</button>
            <button className="pb-2 hover:text-slate-900">Attendance</button>
            <button className="pb-2 hover:text-slate-900">Tests</button>
            <button className="pb-2 hover:text-slate-900">Plans & Notes</button>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 ring-1 ring-slate-200/70" />
                  <div>
                    <div className="font-semibold text-slate-900">{selectedRow.name}</div>
                    <div className="text-sm text-slate-500">
                      Grade {selectedRow.grade} • {selectedRow.homeroom}
                    </div>
                  </div>
                </div>
                <Chip tone={RISK_META[selectedRow.risk].tone}>{selectedRow.risk}</Chip>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                  <div className="text-xs text-slate-600">Attendance</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {selectedRow.attendance}%
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{selectedRow.daysAbsent} missed days</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                  <div className="text-xs text-slate-600">Growth Percentile</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {selectedRow.growthPercentile ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Indiana growth view</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                  <div className="text-xs text-slate-600">
                    {selectedRow.grade >= 9 ? "Credits Earned" : selectedRow.elFlag ? "WIDA" : "ILEARN ELA"}
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {selectedRow.grade >= 9
                      ? (selectedRow.creditsEarned ?? "—")
                      : selectedRow.elFlag
                      ? (selectedRow.wida ?? "—")
                      : selectedRow.iLearn.ela}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {selectedRow.grade >= 9
                      ? `Expected: ${selectedRow.creditsExpected ?? "—"}`
                      : selectedRow.elFlag
                      ? (selectedRow.widaGoalMet ? "WIDA goal met" : "WIDA goal not yet met")
                      : "Latest available benchmark"}
                  </div>
                </div>
              </div>

              <div className="mt-5 h-28 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spark}>
                    <XAxis dataKey="x" hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-4">
              <Card title="Suggested Steps">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                    <span className="mt-0.5">☑️</span>
                    <div>{selectedRow.counselorNote}</div>
                  </div>

                  {selectedRow.attendance < 90 && (
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                      <span className="mt-0.5">☑️</span>
                      <div>Schedule an attendance intervention check-in.</div>
                    </div>
                  )}

                  {selectedRow.growthPercentile != null && selectedRow.growthPercentile < 40 && (
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                      <span className="mt-0.5">☑️</span>
                      <div>Provide targeted academic support for weak growth.</div>
                    </div>
                  )}

                  {selectedRow.elFlag && selectedRow.widaGoalMet === false && (
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                      <span className="mt-0.5">☑️</span>
                      <div>Review language-growth supports and EL goals.</div>
                    </div>
                  )}

                  {selectedRow.grade >= 9 && selectedRow.ninthGradeOnTrack === false && (
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                      <span className="mt-0.5">☑️</span>
                      <div>Meet about credits and 9th-grade-on-track recovery plan.</div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200/70 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900">Key Accountability Signals</div>
                      <div className="flex items-center gap-2">
                        <Chip tone={RISK_META[selectedRow.risk].tone}>{selectedRow.risk}</Chip>
                      </div>
                    </div>
                    <div className="mt-3 text-slate-700">
                      • {priorityIntervention(selectedRow)}
                    </div>
                    <div className="mt-1 text-slate-500 text-xs">
                      {selectedRow.grade <= 3 && "K–3 focus: literacy/math foundations and attendance."}
                      {selectedRow.grade >= 4 && selectedRow.grade <= 6 && "Grades 4–6 focus: growth, attendance, and EL progress where applicable."}
                      {selectedRow.grade >= 7 && selectedRow.grade <= 8 && "Grades 7–8 focus: growth, attendance, and planning milestones."}
                      {selectedRow.grade >= 9 && selectedRow.grade <= 10 && "Grades 9–10 focus: credits, on-track, and coursework milestones."}
                      {selectedRow.grade >= 11 && "Grades 11–12 focus: diploma, credentials, coursework, and college/career readiness."}
                    </div>
                  </div>
                </div>
              </Card>

              <FlagReasonsCard flagReasons={selectedRow.flagReasons} risk={selectedRow.risk} />

              <InterventionStatusCard
                interventionStatus={selectedRow.interventionStatus}
                interventionOwner={selectedRow.interventionOwner}
                followUpDueDate={selectedRow.followUpDueDate}
              />

              <ParentOutreachCard
                parentOutreachNeeded={selectedRow.parentOutreachNeeded}
                parentContacted={selectedRow.parentContacted}
                followUpDueDate={selectedRow.followUpDueDate}
                contactNotes={selectedRow.contactNotes}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
