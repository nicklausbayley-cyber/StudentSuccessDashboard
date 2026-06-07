export type Risk = "High Risk" | "At Risk" | "On Watch" | "Low Risk";

export type FlagReasonsCardProps = {
  flagReasons: string[];
  risk: Risk;
};

const riskStyles: Record<Risk, { label: string; cardClass: string; badgeClass: string; itemClass: string }> = {
  "High Risk": {
    label: "High Risk",
    cardClass: "bg-rose-50/80 ring-rose-200/80",
    badgeClass: "bg-rose-100 text-rose-700 ring-rose-200",
    itemClass: "bg-white/80 text-rose-800 ring-rose-200/70",
  },
  "At Risk": {
    label: "At Risk",
    cardClass: "bg-amber-50/80 ring-amber-200/80",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    itemClass: "bg-white/80 text-amber-900 ring-amber-200/70",
  },
  "On Watch": {
    label: "On Watch",
    cardClass: "bg-slate-50/80 ring-slate-200/80",
    badgeClass: "bg-slate-100 text-slate-700 ring-slate-200",
    itemClass: "bg-white/80 text-slate-700 ring-slate-200/70",
  },
  "Low Risk": {
    label: "Low Risk",
    cardClass: "bg-emerald-50/80 ring-emerald-200/80",
    badgeClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    itemClass: "bg-white/80 text-emerald-800 ring-emerald-200/70",
  },
};

export function FlagReasonsCard({ flagReasons, risk }: FlagReasonsCardProps) {
  const styles = riskStyles[risk];

  return (
    <section className={`rounded-2xl p-5 shadow-sm ring-1 backdrop-blur ${styles.cardClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Flag reasons</h3>
          <p className="mt-1 text-sm text-slate-600">Current signals driving student support.</p>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles.badgeClass}`}>
          {styles.label}
        </span>
      </div>

      {flagReasons.length > 0 ? (
        <ul className="mt-5 grid gap-2">
          {flagReasons.map((reason, index) => (
            <li
              key={`${reason}-${index}`}
              className={`rounded-2xl px-4 py-3 text-sm font-medium leading-6 ring-1 ${styles.itemClass}`}
            >
              {reason}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl bg-white/80 px-4 py-5 text-sm font-medium text-slate-600 ring-1 ring-black/5">
          No active flags
        </div>
      )}
    </section>
  );
}
