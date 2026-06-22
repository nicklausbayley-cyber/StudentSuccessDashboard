import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LogOut,
  Medal,
  Route,
  Star,
  Target,
  Trophy,
  User2,
} from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { DEMO_STUDENTS, type StudentRow } from "../../demo/demoData";

type HighSchoolCurrentUser = {
  email: string;
  role: string;
  district_id: number;
} | null;

type HighSchoolStudentDashboardProps = {
  demoStudent: StudentRow;
  currentUser: HighSchoolCurrentUser;
  logout: () => void;
  navigate: NavigateFunction;
  onChangeStudent: (name: string) => void;
  demoStudentName: string;
};

type Tone = "emerald" | "sky" | "amber" | "rose" | "indigo" | "slate";

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeStatus(status: string | null | undefined) {
  if (!status) return "On Track";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function goalStatusLabel(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "Complete";
  if (status === "in_progress") return "In progress";
  return "Ready to start";
}

function goalStatusClass(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (status === "in_progress") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function onTrackLabel(value: boolean | null) {
  if (value == null) return "Not applicable";
  return value ? "On track" : "Needs action";
}

function graduationPlanLabel(value: boolean | null) {
  if (value == null) return "Not started";
  return value ? "Complete" : "Needs update";
}

function toneClasses(tone: Tone) {
  const tones: Record<Tone, { wrap: string; icon: string; bar: string }> = {
    emerald: {
      wrap: "bg-emerald-50/80 ring-emerald-200/70",
      icon: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      bar: "bg-emerald-500",
    },
    sky: {
      wrap: "bg-sky-50/80 ring-sky-200/70",
      icon: "bg-sky-100 text-sky-700 ring-sky-200",
      bar: "bg-sky-500",
    },
    amber: {
      wrap: "bg-amber-50/80 ring-amber-200/70",
      icon: "bg-amber-100 text-amber-700 ring-amber-200",
      bar: "bg-amber-400",
    },
    rose: {
      wrap: "bg-rose-50/80 ring-rose-200/70",
      icon: "bg-rose-100 text-rose-700 ring-rose-200",
      bar: "bg-rose-500",
    },
    indigo: {
      wrap: "bg-indigo-50/80 ring-indigo-200/70",
      icon: "bg-indigo-100 text-indigo-700 ring-indigo-200",
      bar: "bg-indigo-500",
    },
    slate: {
      wrap: "bg-slate-50/90 ring-slate-200/70",
      icon: "bg-slate-100 text-slate-700 ring-slate-200",
      bar: "bg-slate-500",
    },
  };

  return tones[tone];
}

function MetricCard({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  tone: Tone;
}) {
  const classes = toneClasses(tone);

  return (
    <div className={`rounded-3xl p-5 shadow-sm ring-1 ${classes.wrap}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ${classes.icon}`}>{icon}</div>
        <div>
          <div className="text-sm font-semibold text-slate-500">{label}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
  percent,
  tone,
  note,
}: {
  label: string;
  value: string;
  percent: number;
  tone: Tone;
  note: string;
}) {
  const classes = toneClasses(tone);

  return (
    <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          <div className="mt-1 text-xs text-slate-500">{note}</div>
        </div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${classes.bar}`} style={{ width: `${clampPercent(percent)}%` }} />
      </div>
    </div>
  );
}

function ChecklistItem({
  label,
  detail,
  complete,
}: {
  label: string;
  detail: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/75 p-4 ring-1 ring-slate-200/70">
      <div
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1 ${
          complete
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-amber-50 text-amber-700 ring-amber-200"
        }`}
      >
        {complete ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="mt-1 text-sm leading-6 text-slate-600">{detail}</div>
      </div>
    </div>
  );
}

function PortfolioColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-white/75 p-4 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <div className="mt-3 space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} className="text-sm font-medium leading-6 text-slate-800">
              {item}
            </div>
          ))
        ) : (
          <div className="text-sm leading-6 text-slate-500">Evidence pending</div>
        )}
      </div>
    </div>
  );
}

export default function HighSchoolStudentDashboard({
  demoStudent,
  currentUser,
  logout,
  navigate,
  onChangeStudent,
  demoStudentName,
}: HighSchoolStudentDashboardProps) {
  const firstName = demoStudent.name.split(" ")[0];
  const isSenior = demoStudent.grade >= 12;
  const creditsEarned = demoStudent.creditsEarned ?? demoStudent.highSchoolCredits ?? 0;
  const creditsExpected = demoStudent.creditsExpected ?? 0;
  const creditsNeeded = demoStudent.creditsNeeded ?? Math.max(0, creditsExpected - creditsEarned);
  const creditProgress = creditsExpected > 0 ? (creditsEarned / creditsExpected) * 100 : 0;
  const readinessLabel = normalizeStatus(demoStudent.readinessStatus);
  const onTrackTone: Tone = demoStudent.ninthGradeOnTrack === false ? "rose" : "emerald";
  const creditTone: Tone = creditsNeeded > 0 ? "amber" : "emerald";
  const attendanceTone: Tone = demoStudent.attendance >= 92 ? "emerald" : "amber";
  const heroMessage = isSenior
    ? "Finish strong by confirming credits, portfolio evidence, and college or career readiness."
    : "Keep freshman progress visible with credits, attendance, and recovery steps in one place.";
  const nextReadinessStep =
    demoStudent.nextReadinessStep ?? "Meet with your counselor to confirm the next readiness milestone.";

  const checklistItems = isSenior
    ? [
        {
          label: "Graduation plan",
          detail: graduationPlanLabel(demoStudent.graduationPlanComplete),
          complete: demoStudent.graduationPlanComplete === true,
        },
        {
          label: "Senior credit check",
          detail: creditsNeeded > 0 ? `${creditsNeeded} credits still need confirmation.` : "Credits are on pace.",
          complete: creditsNeeded === 0,
        },
        {
          label: "Credential or benchmark evidence",
          detail: demoStudent.flagReasons.includes("Credential evidence incomplete")
            ? "Credential evidence still needs to be uploaded."
            : "Evidence is ready for review.",
          complete: !demoStudent.flagReasons.includes("Credential evidence incomplete"),
        },
        {
          label: "Portfolio review",
          detail: demoStudent.graduationMilestones.includes("Portfolio review pending")
            ? "Portfolio review is still pending."
            : "Portfolio milestone is ready.",
          complete: !demoStudent.graduationMilestones.includes("Portfolio review pending"),
        },
      ]
    : [
        {
          label: "9th Grade On Track",
          detail: onTrackLabel(demoStudent.ninthGradeOnTrack),
          complete: demoStudent.ninthGradeOnTrack === true,
        },
        {
          label: "Credits earned vs expected",
          detail: `${creditsEarned} earned of ${creditsExpected || "expected credits pending"}`,
          complete: creditsExpected > 0 && creditsEarned >= creditsExpected,
        },
        {
          label: "Credit recovery",
          detail: creditsNeeded > 0 ? `${creditsNeeded} credits need recovery or confirmation.` : "No credit gap showing.",
          complete: creditsNeeded === 0,
        },
        {
          label: "Attendance habit",
          detail: `${demoStudent.attendance.toFixed(1)}% attendance with a ${demoStudent.attendanceStreak} day streak.`,
          complete: demoStudent.attendance >= 92,
        },
      ];

  const portfolio = demoStudent.portfolioPreview;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_36%)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200/70">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">Student Dashboard</div>
              <div className="text-sm text-slate-500">High school mode</div>
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
                onChange={(event) => onChangeStudent(event.target.value)}
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200/70">
                <User2 className="h-4 w-4" />
                Grade {demoStudent.grade} - {demoStudent.homeroom}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/70">
                {readinessLabel}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {firstName}, keep your readiness plan moving
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{heroMessage}</p>
          </div>

          <div className="grid gap-4">
            <MetricCard
              icon={<Trophy className="h-5 w-5" />}
              label={isSenior ? "Senior focus" : "Freshman focus"}
              value={isSenior ? "Evidence check" : "Credit recovery"}
              note={demoStudent.encouragementMessage}
              tone={isSenior ? "indigo" : "amber"}
            />
            <MetricCard
              icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
              label="Stars and badge"
              value={`${demoStudent.starsEarnedThisWeek} stars`}
              note={demoStudent.rewardBadge ?? "Keep building toward the next reward badge."}
              tone="sky"
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <MetricCard
            icon={<CalendarCheck className="h-5 w-5" />}
            label="Attendance"
            value={`${demoStudent.attendance.toFixed(1)}%`}
            note={`${demoStudent.daysAbsent} days absent with a ${demoStudent.attendanceStreak} day streak.`}
            tone={attendanceTone}
          />
          <MetricCard
            icon={<BookOpenCheck className="h-5 w-5" />}
            label="Credits"
            value={`${creditsEarned}/${creditsExpected || "TBD"}`}
            note={`${creditsNeeded} credits need recovery or confirmation. High school credits recorded: ${demoStudent.highSchoolCredits ?? "TBD"}.`}
            tone={creditTone}
          />
          <MetricCard
            icon={<Route className="h-5 w-5" />}
            label={isSenior ? "Graduation plan" : "9th Grade On Track"}
            value={isSenior ? graduationPlanLabel(demoStudent.graduationPlanComplete) : onTrackLabel(demoStudent.ninthGradeOnTrack)}
            note={isSenior ? "Senior readiness depends on final plan, evidence, and credits." : "Freshman on-track status combines credits, attendance, and core course progress."}
            tone={isSenior ? (demoStudent.graduationPlanComplete ? "emerald" : "amber") : onTrackTone}
          />
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <Target className="h-4 w-4" />
                Weekly goal
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">This week&apos;s readiness work</h2>
            </div>
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${goalStatusClass(demoStudent.weeklyGoalStatus)}`}>
              {goalStatusLabel(demoStudent.weeklyGoalStatus)}
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

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
              <BarChart3 className="h-4 w-4" />
              Credits progress
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {isSenior ? "Graduation credit check" : "Freshman credit pace"}
            </h2>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${toneClasses(creditTone).bar}`} style={{ width: `${clampPercent(creditProgress)}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <div className="text-xs font-semibold text-slate-500">Earned</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{creditsEarned}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <div className="text-xs font-semibold text-slate-500">Expected</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{creditsExpected || "TBD"}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <div className="text-xs font-semibold text-slate-500">Needed</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{creditsNeeded}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
              <ClipboardCheck className="h-4 w-4" />
              Milestone checklist
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {isSenior ? "Final readiness evidence" : "9th-grade recovery plan"}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {checklistItems.map((item) => (
                <ChecklistItem key={item.label} label={item.label} detail={item.detail} complete={item.complete} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <GraduationCap className="h-4 w-4" />
              Graduation readiness
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Milestones and next step</h2>
            <div className="mt-5 grid gap-3">
              {demoStudent.graduationMilestones.map((milestone) => (
                <div key={milestone} className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200/70">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <div className="text-sm font-semibold leading-6 text-slate-800">{milestone}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-3xl bg-sky-50/80 p-5 ring-1 ring-sky-200/70">
              <div className="text-sm font-semibold text-sky-700">Next readiness step</div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{nextReadinessStep}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
              <FileText className="h-4 w-4" />
              Counselor note
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">What to watch</h2>
            <p className="mt-5 rounded-3xl bg-rose-50/80 p-5 text-sm font-semibold leading-7 text-slate-800 ring-1 ring-rose-200/70">
              {demoStudent.counselorNote}
            </p>
            <div className="mt-4 rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70">
              <div className="text-sm font-semibold text-slate-500">Current flags</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {demoStudent.flagReasons.length > 0 ? (
                  demoStudent.flagReasons.map((reason) => (
                    <span key={reason} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {reason}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    No active flags
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
            <BarChart3 className="h-4 w-4" />
            Academic and testing snapshot
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Benchmark signals</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ProgressMetric
              label="NEWA Reading"
              value={String(demoStudent.newaReading)}
              percent={clampPercent(((demoStudent.newaReading - 180) / 100) * 100)}
              tone="sky"
              note="Reading benchmark"
            />
            <ProgressMetric
              label="NEWA Math"
              value={String(demoStudent.newaMath)}
              percent={clampPercent(((demoStudent.newaMath - 180) / 100) * 100)}
              tone="emerald"
              note="Math benchmark"
            />
            <ProgressMetric
              label="ILEARN average"
              value={String(Math.round((demoStudent.iLearn.ela + demoStudent.iLearn.math) / 2))}
              percent={clampPercent(((demoStudent.iLearn.ela + demoStudent.iLearn.math) / 2 / 500) * 100)}
              tone="amber"
              note={`ELA ${demoStudent.iLearn.ela} - Math ${demoStudent.iLearn.math}`}
            />
            <ProgressMetric
              label="Growth percentile"
              value={demoStudent.growthPercentile != null ? String(demoStudent.growthPercentile) : "N/A"}
              percent={demoStudent.growthPercentile ?? 0}
              tone="indigo"
              note="Academic growth"
            />
          </div>
        </section>

        {portfolio ? (
          <section className="mt-6 rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <Medal className="h-4 w-4" />
              Portfolio preview
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {isSenior ? "Evidence for graduation readiness" : "Pathway planning evidence"}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <PortfolioColumn title="Goals" items={portfolio.goals} />
              <PortfolioColumn title="Work samples" items={portfolio.workSamples} />
              <PortfolioColumn title="Credentials" items={portfolio.credentials} />
              <PortfolioColumn title="Reflections" items={portfolio.reflections} />
              <PortfolioColumn title="Future plans" items={portfolio.futurePlans} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
