import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { apiFetch } from "../../lib/api";
import { DEMO_STUDENTS, getDefaultStudent, getStudentByName, type StudentRow } from "../../demo/demoData";
import { HighSchoolReadinessCard, StarsRewardsCard, WeeklyGoalCard } from "../../components/phase1";
import K4StudentDashboard from "./K4StudentDashboard";
import {
  Home,
  Search,
  User2,
  ChevronDown,
  Check,
  TrendingUp,
  AlertTriangle,
  Star,
  ChevronRight,
  CheckSquare,
  Pencil,
} from "lucide-react";

type StudentMe = {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  student_email: string | null;
  district_id: number;
  school_id: number | null;
  enrollment_status: string | null;
  attendance: {
    days_enrolled: number | null;
    days_absent: number | null;
    attendance_rate: number | null;
  };
  academic: {
    credits_earned: number | null;
    credits_expected: number | null;
    growth_percentile: number | null;
  };
  readiness: {
    status: string | null;
    risk_score: number | null;
    reasons: string | null;
  };
};

function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function ShellCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
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
    <ShellCard className={className}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {icon ? <div className="text-slate-500">{icon}</div> : null}
              <div className="text-xl font-semibold text-slate-900">{title}</div>
              <div className="text-sm text-slate-500">Wabash Demo District</div>
            </div>
            {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
          </div>
          {right}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </ShellCard>
  );
}

function ProgressPill({
  value,
  demoStudentName,
  onChangeStudent,
}: {
  value: number;
  demoStudentName: string;
  onChangeStudent: (name: string) => void;
}) {
  const v = Math.max(0, Math.min(100, value));
  const green = Math.max(0, Math.min(100, v));
  const yellow = Math.max(0, Math.min(100, 100 - green));

  return (
    <div className="rounded-2xl bg-emerald-50/70 px-5 py-4 ring-1 ring-emerald-200/60">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
          <label className="mr-2 text-sm text-slate-500">Demo:</label>
          <select
            className="bg-transparent text-sm font-semibold text-slate-800 outline-none"
            value={demoStudentName}
            onChange={(e) => onChangeStudent(e.target.value)}
          >
            {DEMO_STUDENTS.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm font-medium text-slate-700">
          Overall Progress: <span className="font-semibold">{v}%</span>
        </div>

        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="flex h-full w-full">
            <div className="h-full bg-emerald-500" style={{ width: `${green}%` }} />
            <div className="h-full bg-amber-300" style={{ width: `${yellow}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Donut({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;

  return (
    <div className="relative grid place-items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} stroke="rgb(226 232 240)" strokeWidth="16" fill="none" />
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke="rgb(34 197 94)"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-semibold text-slate-900">{Math.round(p)}%</div>
      </div>
    </div>
  );
}

function GoalSlider({ demoStudent }: { demoStudent: StudentRow }) {
  const targetText =
    demoStudent.grade >= 9
      ? "Stay above 92%"
      : "Stay above 95%";

  return (
    <div className="mt-5">
      <div className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1 text-sm text-slate-700 ring-1 ring-emerald-200/60">
        <span className="font-medium">Goal:</span>&nbsp;{targetText}
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-500"
          style={{ width: `${Math.max(0, Math.min(100, demoStudent.attendance))}%` }}
        />
      </div>

      <div className="mt-3 text-sm text-slate-500">
        {demoStudent.attendance >= 95
          ? "Attendance is a strength right now."
          : "Improving attendance is one of the fastest ways to get back on track."}
      </div>
    </div>
  );
}

function TinySparkline({ positive = true }: { positive?: boolean }) {
  const line = positive
    ? "M10 52 C40 48, 55 36, 80 40 C105 44, 120 28, 145 30 C170 32, 190 20, 215 24 C235 27, 245 18, 250 14"
    : "M10 14 C40 18, 55 30, 80 28 C105 26, 120 38, 145 40 C170 42, 190 48, 215 50 C235 52, 245 56, 250 58";

  return (
    <div className="mt-3 rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-3">
      <svg viewBox="0 0 260 70" className="h-14 w-full">
        <path
          d={line}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SubjectMini({
  title,
  note,
  barClass,
  bgClass,
  width,
}: {
  title: string;
  note: string;
  barClass: string;
  bgClass: string;
  width: number;
}) {
  return (
    <ShellCard className={classNames("p-5", bgClass)}>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-3 text-sm text-slate-600">{note}</div>
      <div className="mt-4 h-2 w-full rounded-full bg-white/60 ring-1 ring-black/5 overflow-hidden">
        <div className={classNames("h-full rounded-full", barClass)} style={{ width: `${width}%` }} />
      </div>
    </ShellCard>
  );
}

function normalizeStatus(status: string | null | undefined) {
  if (!status) return "On Track";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDemoProgress(demoStudent: StudentRow) {
  if (demoStudent.risk === "Low Risk") return 86;
  if (demoStudent.risk === "On Watch") return 71;
  if (demoStudent.risk === "At Risk") return 54;
  return 38;
}

function getActionItems(demoStudent: StudentRow) {
  const items: string[] = [];

  if (demoStudent.attendance < 90) {
    items.push("Focus on improving attendance this week.");
  }

  if (demoStudent.growthPercentile != null && demoStudent.growthPercentile < 40) {
    items.push("Ask for extra support in your lowest-growth subject.");
  }

  if (demoStudent.elFlag && demoStudent.widaGoalMet === false) {
    items.push("Practice language-development goals and check in with your EL teacher.");
  }

  if (demoStudent.grade >= 7 && demoStudent.graduationPlanComplete === false) {
    items.push("Complete your graduation plan milestone.");
  }

  if (demoStudent.grade >= 9 && demoStudent.ninthGradeOnTrack === false) {
    items.push("Meet with your counselor about credits and on-track progress.");
  }

  if (items.length === 0) {
    items.push("Keep your strong attendance and academic progress going.");
    items.push("Stay consistent with classwork and benchmark preparation.");
  }

  return items.slice(0, 4);
}

function getAttendanceTone(attendance: number) {
  if (attendance >= 95) return "excellent";
  if (attendance >= 90) return "good";
  if (attendance >= 85) return "watch";
  return "risk";
}

export default function StudentDashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [demoStudentName, setDemoStudentName] = useState(getDefaultStudent().name);

  useEffect(() => {
    let active = true;

    async function loadStudent() {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await apiFetch("/api/students/me");
        if (active) setStudent(data as StudentMe);
      } catch (e: any) {
        if (active) setLoadError(e?.message || "Failed to load student");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadStudent();

    return () => {
      active = false;
    };
  }, []);

  const demoStudent = useMemo(() => getStudentByName(demoStudentName), [demoStudentName]);

  if (demoStudent.grade <= 4) {
    return (
      <K4StudentDashboard
        demoStudent={demoStudent}
        currentUser={currentUser}
        logout={logout}
        navigate={navigate}
        onChangeStudent={setDemoStudentName}
        demoStudentName={demoStudentName}
      />
    );
  }

  const studentName = `${demoStudent.name.split(" ")[0]}!`;
  const gradeLabel = String(demoStudent.grade);
  const readinessLabel = normalizeStatus(demoStudent.readinessStatus);
  const readinessReason = demoStudent.counselorNote;

  const overallProgress = student?.readiness?.risk_score != null
    ? Math.max(0, Math.min(100, 100 - student.readiness.risk_score))
    : getDemoProgress(demoStudent);

  const attendancePct = demoStudent.attendance;
  const missedDays = demoStudent.daysAbsent;
  const attendanceTone = getAttendanceTone(attendancePct);

  const actionItems = getActionItems(demoStudent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
              <Home className="h-5 w-5 text-slate-700" />
            </div>
            <div className="text-xl font-semibold text-slate-800">Student Dashboard</div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Demo Data
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden md:block rounded-2xl bg-white px-4 py-2 text-xs text-slate-600 shadow-sm ring-1 ring-black/5">
                <div className="font-semibold text-slate-800">{currentUser.email}</div>
                <div>Role: {currentUser.role} • District: {currentUser.district_id}</div>
              </div>
            )}
            <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search student..."
              />
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
              <User2 className="h-5 w-5 text-slate-700" />
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-black/5">
            Loading your student record...
          </div>
        )}

        {loadError && (
          <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm ring-1 ring-rose-200">
            {loadError}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-5xl font-semibold tracking-tight text-slate-900">
              Hi {studentName} 👋
            </div>
            <div className="mt-2 text-2xl text-slate-700">You’re currently:</div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-semibold">{readinessLabel}</div>
                </div>
              </div>
              <div className="px-6 py-4 text-lg text-slate-700">
                <span className="font-medium">Grade {gradeLabel}</span> •{" "}
                <span className="font-medium">{demoStudent.id}</span>
              </div>
            </div>
          </div>

          <div className="lg:pt-12">
            <ProgressPill
              value={overallProgress}
              demoStudentName={demoStudent.name}
              onChangeStudent={setDemoStudentName}
            />
          </div>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          Demo story currently selected: <span className="font-semibold text-slate-700">{demoStudent.name}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeeklyGoalCard
            teacherWeeklyGoal={demoStudent.teacherWeeklyGoal}
            studentWeeklyGoal={demoStudent.studentWeeklyGoal}
            weeklyGoalStatus={demoStudent.weeklyGoalStatus}
            starsEarnedThisWeek={demoStudent.starsEarnedThisWeek}
            encouragementMessage={demoStudent.encouragementMessage}
          />

          <StarsRewardsCard
            starsEarnedThisWeek={demoStudent.starsEarnedThisWeek}
            attendanceStreak={demoStudent.attendanceStreak}
            rewardBadge={demoStudent.rewardBadge}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Attendance">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
              <div className="flex justify-center md:justify-start">
                <Donut percent={attendancePct} />
              </div>

              <div>
                <div className="text-4xl font-semibold text-slate-900">
                  {attendancePct.toFixed(1)}%
                </div>
                <div className="mt-2 text-slate-600">
                  You’ve missed <span className="font-semibold">{missedDays} days</span> this year.
                </div>

                <GoalSlider demoStudent={demoStudent} />

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200/70">
                  {attendanceTone === "excellent" && "Attendance is a clear strength for this student."}
                  {attendanceTone === "good" && "Attendance is solid, but should stay steady."}
                  {attendanceTone === "watch" && "Attendance should be watched closely over the next grading period."}
                  {attendanceTone === "risk" && "Attendance is a major driver of this student's risk level."}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Testing Overview" subtitle="Available academic indicators">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                <div className="text-sm text-slate-600">Growth Percentile</div>
                <div className="mt-1 text-3xl font-semibold text-slate-900">
                  {demoStudent.growthPercentile ?? "—"}
                </div>
                <div className="mt-2 inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200/70">
                  Academic growth
                </div>
              </div>

              <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                <div className="text-sm text-slate-600">NEWA Math</div>
                <div className="mt-1 text-3xl font-semibold text-slate-900">
                  {demoStudent.newaMath}
                </div>
                <div className="mt-2 inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200/70">
                  Benchmark snapshot
                </div>
              </div>

              <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                <div className="text-sm text-slate-600">NEWA Reading</div>
                <div className="mt-1 text-3xl font-semibold text-slate-900">
                  {demoStudent.newaReading}
                </div>
                <div className="mt-2 inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200/70">
                  Benchmark snapshot
                </div>
              </div>

              <div className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4">
                <div className="text-sm text-slate-600">
                  {demoStudent.elFlag ? "WIDA Composite" : "State Test Data"}
                </div>
                <div className="mt-1 text-3xl font-semibold text-slate-900">
                  {demoStudent.elFlag && demoStudent.wida != null ? demoStudent.wida : "N/A"}
                </div>
                <div className="mt-2 inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200/70">
                  {demoStudent.elFlag ? "English-language progress" : "Not connected yet"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-white ring-1 ring-slate-200/70 px-4 py-3">
              <div className="text-sm font-semibold text-slate-800">Academic Summary</div>
              <div className="text-sm text-slate-600">{demoStudent.counselorNote}</div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </Card>

          <Card
            title="Academics"
            icon={<Home className="h-5 w-5" />}
            right={
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200/60">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
              </div>
            }
          >
            <div className="overflow-hidden rounded-xl ring-1 ring-slate-200/70">
              <Row
                label="ELA"
                status={String(demoStudent.iLearn.ela)}
                kind={demoStudent.iLearn.ela >= 210 ? "good" : "warn"}
              />
              <Row
                label="Math"
                status={String(demoStudent.iLearn.math)}
                kind={demoStudent.iLearn.math >= 210 ? "good" : "warn"}
              />
              <Row
                label="Growth Percentile"
                status={demoStudent.growthPercentile != null ? String(demoStudent.growthPercentile) : "—"}
                kind={demoStudent.growthPercentile != null && demoStudent.growthPercentile >= 50 ? "good" : "warn"}
              />
              <Row
                label="Readiness"
                status={normalizeStatus(demoStudent.readinessStatus)}
                kind={demoStudent.risk === "Low Risk" ? "good" : demoStudent.risk === "On Watch" ? "neutral" : "warn"}
              />
            </div>
          </Card>

          <Card title="Testing Progress" icon={<Star className="h-5 w-5" />}>
            <div className="rounded-xl bg-emerald-50/60 ring-1 ring-emerald-200/60 p-4">
              <div className="text-lg text-slate-800">
                Latest Growth Percentile: <span className="font-semibold text-emerald-700">{demoStudent.growthPercentile ?? "—"}</span>
              </div>
              <div className="mt-1 text-lg text-slate-800">
                {demoStudent.growthPercentile != null && demoStudent.growthPercentile >= 50 ? "Growth Trend Positive" : "Growth Needs Support"}
              </div>

              <TinySparkline positive={demoStudent.growthPercentile != null && demoStudent.growthPercentile >= 50} />

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-800">NEWA Reading:</span> {demoStudent.newaReading}
                </div>
                <div className="text-slate-500">NEWA Math: {demoStudent.newaMath}</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-500">
              {readinessReason}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <HighSchoolReadinessCard
            grade={demoStudent.grade}
            creditsEarned={demoStudent.creditsEarned}
            creditsExpected={demoStudent.creditsExpected}
            creditsNeeded={demoStudent.creditsNeeded}
            graduationPlanComplete={demoStudent.graduationPlanComplete}
            ninthGradeOnTrack={demoStudent.ninthGradeOnTrack}
            graduationMilestones={demoStudent.graduationMilestones}
            nextReadinessStep={demoStudent.nextReadinessStep}
            portfolioPreview={demoStudent.portfolioPreview}
          />
        </div>

        <div className="mt-6">
          <ShellCard>
            <div className="p-6">
              <div className="text-xl font-semibold text-slate-900">Subject Progress</div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
                <SubjectMini
                  title="Math"
                  note={demoStudent.iLearn.math >= 210 ? "Meeting benchmark" : "Needs support"}
                  bgClass="bg-emerald-50/60"
                  barClass="bg-emerald-500"
                  width={Math.max(35, Math.min(100, demoStudent.iLearn.math / 5))}
                />
                <SubjectMini
                  title="Reading"
                  note={demoStudent.iLearn.ela >= 210 ? "Steady progress" : "Focus area"}
                  bgClass="bg-rose-50/60"
                  barClass="bg-rose-400"
                  width={Math.max(35, Math.min(100, demoStudent.iLearn.ela / 5))}
                />
                <SubjectMini
                  title="Growth"
                  note={demoStudent.growthPercentile != null && demoStudent.growthPercentile >= 50 ? "Improving" : "Needs intervention"}
                  bgClass="bg-sky-50/60"
                  barClass="bg-sky-500"
                  width={Math.max(25, Math.min(100, demoStudent.growthPercentile ?? 25))}
                />
                <SubjectMini
                  title={demoStudent.elFlag ? "WIDA" : "Readiness"}
                  note={
                    demoStudent.elFlag
                      ? (demoStudent.widaGoalMet ? "Goal met" : "Goal not yet met")
                      : normalizeStatus(demoStudent.readinessStatus)
                  }
                  bgClass="bg-amber-50/60"
                  barClass="bg-amber-400"
                  width={
                    demoStudent.elFlag
                      ? Math.max(20, Math.min(100, (demoStudent.wida ?? 0) * 18))
                      : Math.max(35, getDemoProgress(demoStudent))
                  }
                />
              </div>
            </div>
          </ShellCard>
        </div>

        <div className="mt-6">
          <ShellCard>
            <div className="p-6">
              <div className="text-xl font-semibold text-slate-900">What You Can Do This Week</div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {actionItems.map((item, idx) => (
                  <TodoItem
                    key={idx}
                    icon={
                      idx % 2 === 0
                        ? <CheckSquare className="h-5 w-5 text-blue-600" />
                        : <Pencil className="h-5 w-5 text-amber-600" />
                    }
                    text={<>{item}</>}
                  />
                ))}
              </div>
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function TodoItem({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 ring-1 ring-slate-200/70">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 ring-1 ring-slate-200/70">
        {icon}
      </div>
      <div className="text-sm text-slate-700">{text}</div>
      <div className="ml-auto text-slate-300">›</div>
    </div>
  );
}

function Row({
  label,
  status,
  kind,
}: {
  label: string;
  status: string;
  kind: "good" | "warn" | "neutral";
}) {
  const icon =
    kind === "good" ? (
      <TrendingUp className="h-4 w-4 text-emerald-500" />
    ) : kind === "warn" ? (
      <AlertTriangle className="h-4 w-4 text-amber-500" />
    ) : (
      <span className="text-slate-400">—</span>
    );

  return (
    <div className="flex items-center justify-between bg-white/70 px-4 py-3">
      <div className="text-base text-slate-800">{label}</div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {icon}
        <span className="font-medium">{status}</span>
      </div>
    </div>
  );
}
