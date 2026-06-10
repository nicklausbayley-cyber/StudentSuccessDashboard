import { CalendarCheck, CheckCircle2, LogOut, Medal, Sparkles, Star, Target, Trophy, User2 } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { DEMO_STUDENTS, type StudentRow } from "../../demo/demoData";

type K4CurrentUser = {
  email: string;
  role: string;
  district_id: number;
} | null;

type K4StudentDashboardProps = {
  demoStudent: StudentRow;
  currentUser: K4CurrentUser;
  logout: () => void;
  navigate: NavigateFunction;
  onChangeStudent: (name: string) => void;
  demoStudentName: string;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreToBubblePercent(score: number) {
  return clampPercent(((score - 150) / 90) * 100);
}

function statusLabel(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "Goal complete";
  if (status === "in_progress") return "In progress";
  return "Ready to start";
}

function statusClass(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (status === "in_progress") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function BubbleProgress({
  label,
  value,
  percent,
  tone,
}: {
  label: string;
  value: string;
  percent: number;
  tone: "emerald" | "sky" | "amber";
}) {
  const tones = {
    emerald: {
      wrap: "bg-emerald-50 ring-emerald-200/70",
      bubble: "bg-emerald-400/80",
      text: "text-emerald-700",
    },
    sky: {
      wrap: "bg-sky-50 ring-sky-200/70",
      bubble: "bg-sky-400/80",
      text: "text-sky-700",
    },
    amber: {
      wrap: "bg-amber-50 ring-amber-200/70",
      bubble: "bg-amber-400/80",
      text: "text-amber-700",
    },
  }[tone];

  const size = 58 + clampPercent(percent) * 0.52;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 shadow-sm ring-1 ${tones.wrap}`}>
      <div className="relative z-10">
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        <div className={`mt-2 text-3xl font-semibold ${tones.text}`}>{value}</div>
        <div className="mt-1 text-xs font-medium text-slate-500">{clampPercent(percent)}% bubble power</div>
      </div>
      <div
        className={`absolute -bottom-8 -right-6 rounded-full opacity-70 ${tones.bubble}`}
        style={{ height: `${size}px`, width: `${size}px` }}
      />
      <div className="absolute right-7 top-7 h-5 w-5 rounded-full bg-white/70" />
    </div>
  );
}

export default function K4StudentDashboard({
  demoStudent,
  currentUser,
  logout,
  navigate,
  onChangeStudent,
  demoStudentName,
}: K4StudentDashboardProps) {
  const firstName = demoStudent.name.split(" ")[0];
  const attendancePercent = clampPercent(demoStudent.attendance);
  const readingPercent = scoreToBubblePercent(demoStudent.newaReading);
  const mathPercent = scoreToBubblePercent(demoStudent.newaMath);
  const goalComplete = demoStudent.weeklyGoalStatus === "complete";

  const missions = [
    demoStudent.studentWeeklyGoal,
    demoStudent.teacherWeeklyGoal,
    demoStudent.attendanceStreak >= 5
      ? "Keep your attendance streak going today."
      : "Start the day strong and add to your attendance streak.",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_36%)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200/70">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">Student Dashboard</div>
              <div className="text-sm text-slate-500">K-4 mode</div>
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

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 ring-1 ring-sky-200/70">
              <User2 className="h-4 w-4" />
              Grade {demoStudent.grade}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Hi {firstName}, ready for today?
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              {demoStudent.encouragementMessage}
            </p>

            {goalComplete ? (
              <div className="mt-6 flex items-start gap-3 rounded-3xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200/80">
                <Trophy className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Weekly goal complete!</div>
                  <div className="mt-1 text-sm leading-6">Amazing focus this week. Keep the momentum going.</div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-emerald-50/80 p-5 shadow-sm ring-1 ring-emerald-200/70">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
                  <Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-700">Stars this week</div>
                  <div className="text-4xl font-semibold text-slate-900">{demoStudent.starsEarnedThisWeek}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-sky-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-600">Attendance streak</div>
                  <div className="text-2xl font-semibold text-slate-900">{demoStudent.attendanceStreak} days</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <Medal className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-600">Reward badge</div>
                  <div className="text-xl font-semibold text-slate-900">{demoStudent.rewardBadge ?? "Keep going"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Weekly goal</h2>
              <p className="mt-1 text-sm text-slate-500">A teacher goal and a student goal for the week.</p>
            </div>
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(demoStudent.weeklyGoalStatus)}`}>
              {statusLabel(demoStudent.weeklyGoalStatus)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Target className="h-4 w-4" />
                Teacher goal
              </div>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">{demoStudent.teacherWeeklyGoal}</p>
            </div>

            <div className="rounded-3xl bg-emerald-50/80 p-5 ring-1 ring-emerald-200/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                My goal
              </div>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">{demoStudent.studentWeeklyGoal}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <BubbleProgress
            label="Attendance"
            value={`${demoStudent.attendance.toFixed(1)}%`}
            percent={attendancePercent}
            tone="emerald"
          />
          <BubbleProgress
            label="Reading"
            value={String(demoStudent.newaReading)}
            percent={readingPercent}
            tone="sky"
          />
          <BubbleProgress
            label="Math"
            value={String(demoStudent.newaMath)}
            percent={mathPercent}
            tone="amber"
          />
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-900">Today's Mission</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {missions.map((mission, index) => (
              <div key={`${mission}-${index}`} className="rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200/70">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-2xl bg-white text-sm font-semibold text-slate-700 ring-1 ring-black/5">
                  {index + 1}
                </div>
                <div className="text-sm font-semibold leading-6 text-slate-800">{mission}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
