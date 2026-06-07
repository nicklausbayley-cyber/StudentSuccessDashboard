export type PortfolioPreview = {
  goals: string[];
  workSamples: string[];
  credentials: string[];
  reflections: string[];
  futurePlans: string[];
};

export type HighSchoolReadinessCardProps = {
  grade: number;
  creditsEarned: number | null;
  creditsExpected: number | null;
  creditsNeeded: number | null;
  graduationPlanComplete: boolean | null;
  ninthGradeOnTrack: boolean | null;
  graduationMilestones: string[];
  nextReadinessStep: string | null;
  portfolioPreview: PortfolioPreview | null;
};

function valueOrDash(value: number | null) {
  return value == null ? "-" : String(value);
}

function completionLabel(value: boolean | null) {
  if (value == null) return "Not set";
  return value ? "Complete" : "Incomplete";
}

function onTrackLabel(value: boolean | null) {
  if (value == null) return "Not set";
  return value ? "On track" : "Off track";
}

function statusClass(value: boolean | null) {
  if (value == null) return "bg-slate-50 text-slate-700 ring-slate-200/80";
  return value
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
    : "bg-amber-50 text-amber-800 ring-amber-200/80";
}

function PortfolioPreviewList({ portfolioPreview }: { portfolioPreview: PortfolioPreview | null }) {
  const sections = portfolioPreview
    ? [
        { label: "Goals", items: portfolioPreview.goals },
        { label: "Work samples", items: portfolioPreview.workSamples },
        { label: "Credentials", items: portfolioPreview.credentials },
        { label: "Reflections", items: portfolioPreview.reflections },
        { label: "Future plans", items: portfolioPreview.futurePlans },
      ].filter((section) => section.items.length > 0)
    : [];

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200/70">
        No portfolio artifacts added yet.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {sections.map((section) => (
        <div key={section.label} className="rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-200/70">
          <div className="text-xs font-semibold text-slate-500">{section.label}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {section.items.map((item, index) => (
              <span
                key={`${section.label}-${item}-${index}`}
                className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-black/5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HighSchoolReadinessCard({
  grade,
  creditsEarned,
  creditsExpected,
  creditsNeeded,
  graduationPlanComplete,
  ninthGradeOnTrack,
  graduationMilestones,
  nextReadinessStep,
  portfolioPreview,
}: HighSchoolReadinessCardProps) {
  const isHighSchool = grade >= 9;

  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">High school readiness</h3>
          <p className="mt-1 text-sm text-slate-500">
            {isHighSchool ? "Credits, plan status, and portfolio evidence." : "High school readiness preview."}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
          Grade {grade}
        </span>
      </div>

      {!isHighSchool ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-800 ring-1 ring-emerald-200/70">
            High school readiness preview: keep building attendance, growth, and planning habits before Grade 9.
          </div>

          {graduationMilestones.length > 0 ? (
            <div>
              <div className="text-xs font-semibold text-slate-500">Planning milestones</div>
              <ul className="mt-2 grid gap-2">
                {graduationMilestones.map((milestone, index) => (
                  <li
                    key={`${milestone}-${index}`}
                    className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/70"
                  >
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {nextReadinessStep ? (
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
              <div className="text-xs font-semibold text-slate-500">Next readiness step</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{nextReadinessStep}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
              <div className="text-xs font-semibold text-slate-500">Credits earned</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{valueOrDash(creditsEarned)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
              <div className="text-xs font-semibold text-slate-500">Credits expected</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{valueOrDash(creditsExpected)}</div>
            </div>
            <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200/70">
              <div className="text-xs font-semibold text-emerald-700">Credits needed</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{valueOrDash(creditsNeeded)}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(graduationPlanComplete)}`}>
              Graduation plan: {completionLabel(graduationPlanComplete)}
            </span>
            {ninthGradeOnTrack != null ? (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(ninthGradeOnTrack)}`}>
                Ninth grade: {onTrackLabel(ninthGradeOnTrack)}
              </span>
            ) : null}
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500">Graduation milestones</div>
            {graduationMilestones.length > 0 ? (
              <ul className="mt-2 grid gap-2">
                {graduationMilestones.map((milestone, index) => (
                  <li
                    key={`${milestone}-${index}`}
                    className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/70"
                  >
                    {milestone}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200/70">
                No milestones recorded yet.
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
            <div className="text-xs font-semibold text-slate-500">Next readiness step</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {nextReadinessStep ?? "No next step recorded yet."}
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold text-slate-500">Portfolio preview</div>
            <PortfolioPreviewList portfolioPreview={portfolioPreview} />
          </div>
        </div>
      )}
    </section>
  );
}
