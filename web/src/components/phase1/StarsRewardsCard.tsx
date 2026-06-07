export type StarsRewardsCardProps = {
  starsEarnedThisWeek: number;
  attendanceStreak: number;
  rewardBadge: string | null;
};

export function StarsRewardsCard({
  starsEarnedThisWeek,
  attendanceStreak,
  rewardBadge,
}: StarsRewardsCardProps) {
  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Stars and rewards</h3>
          <p className="mt-1 text-sm text-slate-500">Progress students can see and celebrate.</p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
          This week
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200/70">
          <div className="text-3xl font-semibold text-emerald-700">{starsEarnedThisWeek}</div>
          <div className="mt-1 text-sm font-medium text-slate-700">Stars earned</div>
        </div>

        <div className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
          <div className="text-3xl font-semibold text-slate-900">{attendanceStreak}</div>
          <div className="mt-1 text-sm font-medium text-slate-700">Day attendance streak</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
        {rewardBadge ? (
          <>
            <div className="text-xs font-semibold text-emerald-700">Reward badge</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{rewardBadge}</div>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-900">Keep going</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Another strong week can unlock the next badge.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
