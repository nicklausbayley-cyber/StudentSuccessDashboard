export type WeeklyGoalStatus = "not_started" | "in_progress" | "complete";

export type WeeklyGoalCardProps = {
  teacherWeeklyGoal: string;
  studentWeeklyGoal: string;
  weeklyGoalStatus: WeeklyGoalStatus;
  starsEarnedThisWeek: number;
  encouragementMessage: string;
};

const statusStyles: Record<WeeklyGoalStatus, { label: string; className: string }> = {
  not_started: {
    label: "Not started",
    className: "bg-slate-50 text-slate-700 ring-slate-200/80",
  },
  in_progress: {
    label: "In progress",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  },
  complete: {
    label: "Complete",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  },
};

export function WeeklyGoalCard({
  teacherWeeklyGoal,
  studentWeeklyGoal,
  weeklyGoalStatus,
  starsEarnedThisWeek,
  encouragementMessage,
}: WeeklyGoalCardProps) {
  const status = statusStyles[weeklyGoalStatus];

  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Weekly goals</h3>
          <p className="mt-1 text-sm text-slate-500">Teacher guidance and student ownership for this week.</p>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
          <div className="text-xs font-semibold text-slate-500">Teacher-set goal</div>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{teacherWeeklyGoal}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200/70">
          <div className="text-xs font-semibold text-emerald-700">Student-selected goal</div>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{studentWeeklyGoal}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{starsEarnedThisWeek} stars earned</div>
          <div className="mt-1 text-xs text-slate-500">This week</div>
        </div>
        <p className="text-sm leading-6 text-slate-600 sm:max-w-sm">{encouragementMessage}</p>
      </div>
    </section>
  );
}
