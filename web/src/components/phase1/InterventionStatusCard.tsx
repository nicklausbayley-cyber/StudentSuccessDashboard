export type InterventionStatus = "none" | "planned" | "in_progress" | "completed";

export type InterventionStatusCardProps = {
  interventionStatus: InterventionStatus;
  interventionOwner: string | null;
  followUpDueDate: string | null;
};

const interventionStyles: Record<InterventionStatus, { label: string; className: string }> = {
  none: {
    label: "None",
    className: "bg-slate-50 text-slate-700 ring-slate-200/80",
  },
  planned: {
    label: "Planned",
    className: "bg-amber-50 text-amber-800 ring-amber-200/80",
  },
  in_progress: {
    label: "In progress",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  },
};

export function InterventionStatusCard({
  interventionStatus,
  interventionOwner,
  followUpDueDate,
}: InterventionStatusCardProps) {
  const status = interventionStyles[interventionStatus];
  const hasIntervention = interventionStatus !== "none";

  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Intervention status</h3>
          <p className="mt-1 text-sm text-slate-500">Staff ownership and next follow-up.</p>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.className}`}>
          {status.label}
        </span>
      </div>

      {hasIntervention ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
            <div className="text-xs font-semibold text-slate-500">Owner</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {interventionOwner ?? "Owner not assigned"}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200/70">
            <div className="text-xs font-semibold text-emerald-700">Follow-up due</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {followUpDueDate ?? "No date set"}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-slate-50/80 px-4 py-5 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
          No active intervention plan. Continue regular monitoring.
        </div>
      )}
    </section>
  );
}
