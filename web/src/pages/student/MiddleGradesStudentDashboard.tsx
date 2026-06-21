import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Compass,
  GraduationCap,
  Languages,
  LogOut,
  Medal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User2,
} from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { DEMO_STUDENTS, type StudentRow } from "../../demo/demoData";

type MiddleGradesCurrentUser = {
  email: string;
  role: string;
  district_id: number;
} | null;

type MiddleGradesStudentDashboardProps = {
  demoStudent: StudentRow;
  currentUser: MiddleGradesCurrentUser;
  logout: () => void;
  navigate: NavigateFunction;
  onChangeStudent: (name: string) => void;
  demoStudentName: string;
};

type BarTone = "emerald" | "sky" | "amber" | "indigo";
type FocusKey = "attendance" | "reading" | "math" | "growth" | "planning" | "englishLearner";

type FocusDetail = {
  label: string;
  currentValue: string;
  explanation: string;
  whyItMatters: string;
  nextAction: string;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function benchmarkPercent(score: number) {
  return clampPercent(((score - 170) / 70) * 100);
}

function ilearnPercent(score: number) {
  return clampPercent(((score - 180) / 60) * 100);
}

function statusLabel(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "Complete";
  if (status === "in_progress") return "In progress";
  return "Ready to start";
}

function statusClass(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (status === "in_progress") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function barClass(tone: BarTone) {
  const classes: Record<BarTone, string> = {
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-400",
    indigo: "bg-indigo-500",
  };

  return classes[tone];
}

function ProgressBar({
  focusKey,
  label,
  value,
  percent,
  tone,
  note,
  selected,
  onSelect,
}: {
  focusKey: FocusKey;
  label: string;
  value: string;
  percent: number;
  tone: BarTone;
  note: string;
  selected: boolean;
  onSelect: (focusKey: FocusKey) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(focusKey)}
      className={`rounded-2xl bg-white/80 p-4 text-left ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
        selected ? "ring-2 ring-indigo-300 shadow-sm" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          <div className="mt-1 text-xs text-slate-500">{note}</div>
        </div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barClass(tone)}`} style={{ width: `${clampPercent(percent)}%` }} />
      </div>
    </button>
  );
}

function InfoTile({
  icon,
  label,
  value,
  note,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5 ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/70">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-500">{label}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
      </div>
      {note ? <div className="mt-4 text-sm leading-6 text-slate-600">{note}</div> : null}
    </div>
  );
}

export default function MiddleGradesStudentDashboard({
  demoStudent,
  currentUser,
  logout,
  navigate,
  onChangeStudent,
  demoStudentName,
}: MiddleGradesStudentDashboardProps) {
  const firstName = demoStudent.name.split(" ")[0];
  const attendanceTarget = demoStudent.grade >= 7 ? 94 : 95;
  const attendanceGap = Math.max(0, attendanceTarget - demoStudent.attendance);
  const rewardLabel = demoStudent.rewardBadge ?? "Progress Builder";
  const nextStep = demoStudent.nextReadinessStep ?? "Keep your weekly goal visible and check progress with your advisor.";
  const hasEnglishLearnerData = demoStudent.elFlag || demoStudent.wida != null;
  const widaPercent = demoStudent.wida != null ? clampPercent((demoStudent.wida / 6) * 100) : 0;
  const [selectedFocus, setSelectedFocus] = useState<FocusKey>(hasEnglishLearnerData ? "englishLearner" : "planning");

  useEffect(() => {
    if (hasEnglishLearnerData && selectedFocus === "planning") {
      setSelectedFocus("englishLearner");
    }

    if (!hasEnglishLearnerData && selectedFocus === "englishLearner") {
      setSelectedFocus("planning");
    }
  }, [hasEnglishLearnerData, selectedFocus]);

  const selectedFocusDetail: Record<FocusKey, FocusDetail> = {
    attendance: {
      label: "Attendance",
      currentValue: `${demoStudent.attendance.toFixed(1)}% attendance - ${demoStudent.attendanceStreak} day streak`,
      explanation: "Showing up consistently keeps your weekly progress on track.",
      whyItMatters: "Every class day gives you another chance to practice, ask questions, and stay connected to your goals.",
      nextAction: attendanceGap > 0
        ? `Aim for the next full week present to move closer to the ${attendanceTarget}% target.`
        : "Protect your current streak by planning tomorrow morning before the day starts.",
    },
    reading: {
      label: "Reading",
      currentValue: `NEWA Reading ${demoStudent.newaReading}`,
      explanation: "Reading growth helps unlock confidence across all classes.",
      whyItMatters: "Stronger reading makes directions, projects, science texts, and social studies sources easier to handle.",
      nextAction: "Choose one class text and write a two-sentence summary before your next check-in.",
    },
    math: {
      label: "Math",
      currentValue: `NEWA Math ${demoStudent.newaMath}`,
      explanation: "Math practice builds problem-solving strength one skill at a time.",
      whyItMatters: "A steady math routine helps you spot patterns, explain your thinking, and prepare for harder coursework.",
      nextAction: "Pick one missed problem, correct it, and explain the strategy you used.",
    },
    growth: {
      label: "Growth",
      currentValue: demoStudent.growthPercentile != null ? `${demoStudent.growthPercentile}th percentile` : "Growth data pending",
      explanation: "Growth percentile shows how much progress you are making compared with similar students.",
      whyItMatters: "Growth helps show effort and improvement even when a benchmark score is still catching up.",
      nextAction: "Name one skill that improved recently and one skill to practice next.",
    },
    planning: {
      label: "Planning and readiness",
      currentValue: demoStudent.graduationMilestones[0] ?? "Planning milestone active",
      explanation: "Your graduation plan helps connect today's choices to future options.",
      whyItMatters: "Middle school planning keeps course choices, habits, and career interests visible before high school.",
      nextAction: nextStep,
    },
    englishLearner: {
      label: "English learner progress",
      currentValue: demoStudent.wida != null
        ? `WIDA ${demoStudent.wida.toFixed(1)} - ${demoStudent.widaGoalMet ? "goal met" : "goal in progress"}`
        : "WIDA progress pending",
      explanation: "WIDA progress helps track English language growth across reading, writing, speaking, and listening.",
      whyItMatters: "Language growth supports confidence in class discussions, written responses, projects, and tests.",
      nextAction: "Use two academic vocabulary words in one class discussion or written response this week.",
    },
  };

  const activeFocus = selectedFocusDetail[selectedFocus];
  const goalComplete = demoStudent.weeklyGoalStatus === "complete";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.13),_transparent_36%)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200/70">
              <Compass className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">Student Dashboard</div>
              <div className="text-sm text-slate-500">Grades 5-8 mode</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-2 text-xs text-slate-600 ring-1 ring-slate-200/70">
                <div className="font-semibold text-slate-800">{currentUser.email}</div>
                <div>Role: {currentUser.role} - District: {currentUser.district_id}</div>
              </div>
            ) : null}

            <label className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-black/5">
              <span className="mr-2 font-medium text-slate-500">Demo</span>
              <select
                className="bg-transparent font-semibold text-slate-800 outline-none"
                value={demoStudentName}
                onChange={(e) => onChangeStudent(e.target.value)}
              >
                {DEMO_STUDENTS.map((student) => (
                  <option key={student.id} value={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5 hover:bg-slate-50"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 ring-1 ring-sky-200/70">
              <User2 className="h-4 w-4" />
              Grade {demoStudent.grade} - {demoStudent.homeroom}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Track the habits, class progress, and planning steps that keep you ready for high school.
            </p>
          </div>

          <div className="grid gap-4">
            <InfoTile
              icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
              label="Stars this week"
              value={String(demoStudent.starsEarnedThisWeek)}
              note={demoStudent.encouragementMessage}
              className="bg-amber-50/70 ring-amber-200/70"
            />
            <InfoTile
              icon={<Medal className="h-5 w-5 text-indigo-600" />}
              label="Current badge"
              value={rewardLabel}
              note="Milestones recognize steady effort, not just perfect scores."
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <Medal className="h-4 w-4" />
                Milestone check-in
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {goalComplete ? "Goal finished. Keep the streak alive." : "Progress is adding up."}
              </h2>
            </div>
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(demoStudent.weeklyGoalStatus)}`}>
              {statusLabel(demoStudent.weeklyGoalStatus)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-amber-50/80 p-4 ring-1 ring-amber-200/70">
              <div className="text-xs font-semibold text-amber-700">Reward badge</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{rewardLabel}</div>
            </div>
            <div className="rounded-2xl bg-emerald-50/80 p-4 ring-1 ring-emerald-200/70">
              <div className="text-xs font-semibold text-emerald-700">Stars earned</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{demoStudent.starsEarnedThisWeek}</div>
            </div>
            <div className="rounded-2xl bg-sky-50/80 p-4 ring-1 ring-sky-200/70">
              <div className="text-xs font-semibold text-sky-700">Attendance streak</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{demoStudent.attendanceStreak} days</div>
            </div>
            <div className="rounded-2xl bg-indigo-50/80 p-4 ring-1 ring-indigo-200/70">
              <div className="text-xs font-semibold text-indigo-700">Weekly goal</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{statusLabel(demoStudent.weeklyGoalStatus)}</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <Target className="h-4 w-4" />
                Weekly goal
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">What we are working on this week</h2>
            </div>
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(demoStudent.weeklyGoalStatus)}`}>
              {statusLabel(demoStudent.weeklyGoalStatus)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70">
              <div className="text-sm font-semibold text-slate-500">Teacher goal</div>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">{demoStudent.teacherWeeklyGoal}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50/80 p-5 ring-1 ring-emerald-200/70">
              <div className="text-sm font-semibold text-emerald-700">My goal</div>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">{demoStudent.studentWeeklyGoal}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <button
            type="button"
            aria-pressed={selectedFocus === "attendance"}
            onClick={() => setSelectedFocus("attendance")}
            className={`rounded-3xl bg-white/85 p-6 text-left shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 lg:col-span-1 ${
              selectedFocus === "attendance" ? "ring-2 ring-emerald-300 shadow-md" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200/70">
                <CalendarCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500">Attendance target</div>
                <div className="text-3xl font-semibold text-slate-900">{demoStudent.attendance.toFixed(1)}%</div>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${clampPercent(demoStudent.attendance)}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <div className="text-xs font-semibold text-slate-500">Days absent</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{demoStudent.daysAbsent}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <div className="text-xs font-semibold text-slate-500">Streak</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{demoStudent.attendanceStreak} days</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {attendanceGap > 0
                ? `You are ${attendanceGap.toFixed(1)} points from the ${attendanceTarget}% target.`
                : `You are meeting the ${attendanceTarget}% target. Keep protecting that streak.`}
            </p>
          </button>

          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
              <TrendingUp className="h-4 w-4" />
              Academic progress
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Progress bars</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <ProgressBar
                focusKey="reading"
                label="Reading benchmark"
                value={String(demoStudent.newaReading)}
                percent={benchmarkPercent(demoStudent.newaReading)}
                tone="sky"
                note="NEWA Reading"
                selected={selectedFocus === "reading"}
                onSelect={setSelectedFocus}
              />
              <ProgressBar
                focusKey="math"
                label="Math benchmark"
                value={String(demoStudent.newaMath)}
                percent={benchmarkPercent(demoStudent.newaMath)}
                tone="emerald"
                note="NEWA Math"
                selected={selectedFocus === "math"}
                onSelect={setSelectedFocus}
              />
              <ProgressBar
                focusKey="growth"
                label="Growth percentile"
                value={demoStudent.growthPercentile != null ? String(demoStudent.growthPercentile) : "N/A"}
                percent={demoStudent.growthPercentile ?? 0}
                tone="indigo"
                note="Recent academic growth"
                selected={selectedFocus === "growth"}
                onSelect={setSelectedFocus}
              />
              <ProgressBar
                focusKey="growth"
                label="ILEARN average"
                value={String(Math.round((demoStudent.iLearn.ela + demoStudent.iLearn.math) / 2))}
                percent={ilearnPercent((demoStudent.iLearn.ela + demoStudent.iLearn.math) / 2)}
                tone="amber"
                note={`ELA ${demoStudent.iLearn.ela} - Math ${demoStudent.iLearn.math}`}
                selected={selectedFocus === "growth"}
                onSelect={setSelectedFocus}
              />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-500">Selected focus</div>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{activeFocus.label}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{activeFocus.explanation}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200/70 lg:min-w-64">
              <div className="text-xs font-semibold text-slate-500">Current value</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{activeFocus.currentValue}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-3xl bg-indigo-50/80 p-5 ring-1 ring-indigo-200/70">
              <div className="text-xs font-semibold text-indigo-700">Why it matters</div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{activeFocus.whyItMatters}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50/80 p-5 ring-1 ring-emerald-200/70">
              <div className="text-xs font-semibold text-emerald-700">Next best action</div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{activeFocus.nextAction}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Focus for this week
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Next best step</h2>
            <div className="mt-5 rounded-3xl bg-emerald-50/80 p-5 ring-1 ring-emerald-200/70">
              <div className="text-sm font-semibold text-emerald-700">Do next</div>
              <p className="mt-2 text-base font-semibold leading-7 text-slate-900">{nextStep}</p>
            </div>
            <div className="mt-4 rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70">
              <div className="text-sm font-semibold text-slate-500">Counselor note</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{demoStudent.counselorNote}</p>
            </div>
          </div>

          {hasEnglishLearnerData ? (
            <button
              type="button"
              aria-pressed={selectedFocus === "englishLearner"}
              onClick={() => setSelectedFocus("englishLearner")}
              className={`rounded-3xl bg-white/85 p-6 text-left shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                selectedFocus === "englishLearner" ? "ring-2 ring-indigo-300 shadow-md" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <Languages className="h-4 w-4" />
                English learner progress
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">WIDA language growth</h2>
              <div className="mt-5 rounded-3xl bg-indigo-50/80 p-5 ring-1 ring-indigo-200/70">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-indigo-700">Current WIDA level</div>
                    <div className="mt-1 text-4xl font-semibold text-slate-900">
                      {demoStudent.wida != null ? demoStudent.wida.toFixed(1) : "Pending"}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                    demoStudent.widaGoalMet
                      ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                      : "bg-amber-50 text-amber-800 ring-amber-200"
                  }`}>
                    {demoStudent.widaGoalMet ? "Goal met" : "Monitoring"}
                  </span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/80">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${widaPercent}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-indigo-200/60">
                    <div className="text-xs font-semibold text-indigo-700">Goal status</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">
                      {demoStudent.widaGoalMet ? "WIDA goal met" : "WIDA goal still in progress"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-indigo-200/60">
                    <div className="text-xs font-semibold text-indigo-700">Next language step</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">Use academic vocabulary out loud this week.</div>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              aria-pressed={selectedFocus === "planning"}
              onClick={() => setSelectedFocus("planning")}
              className={`rounded-3xl bg-white/85 p-6 text-left shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                selectedFocus === "planning" ? "ring-2 ring-indigo-300 shadow-md" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <GraduationCap className="h-4 w-4" />
                Planning and readiness
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">High school preview</h2>
              <div className="mt-5 rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70">
                <div className="text-sm font-semibold text-slate-500">Next readiness step</div>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{nextStep}</p>
              </div>
              <div className="mt-3 rounded-3xl bg-emerald-50/80 p-5 ring-1 ring-emerald-200/70">
                <div className="text-sm font-semibold text-emerald-700">Counselor note</div>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{demoStudent.counselorNote}</p>
              </div>
              <div className="mt-5 grid gap-3">
                {demoStudent.graduationMilestones.length > 0 ? (
                  demoStudent.graduationMilestones.map((milestone) => (
                    <div key={milestone} className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 ring-1 ring-indigo-200/70">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                      <div className="text-sm font-semibold leading-6 text-slate-800">{milestone}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/70">
                    Keep building strong habits for course planning.
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-3xl bg-sky-50/80 p-5 ring-1 ring-sky-200/70">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                <p className="text-sm leading-6 text-slate-700">
                  Use advisory time to connect today&apos;s classwork with future pathway choices.
                </p>
              </div>
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
