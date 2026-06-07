export type ParentOutreachCardProps = {
  parentOutreachNeeded: boolean;
  parentContacted: boolean;
  followUpDueDate: string | null;
  contactNotes: string | null;
};

function statusBadge(label: string, positive: boolean) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        positive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
          : "bg-amber-50 text-amber-800 ring-amber-200/80"
      }`}
    >
      {label}
    </span>
  );
}

export function ParentOutreachCard({
  parentOutreachNeeded,
  parentContacted,
  followUpDueDate,
  contactNotes,
}: ParentOutreachCardProps) {
  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Parent outreach</h3>
          <p className="mt-1 text-sm text-slate-500">Family contact workflow and notes.</p>
        </div>
        {statusBadge(parentOutreachNeeded ? "Outreach needed" : "No outreach needed", !parentOutreachNeeded)}
      </div>

      {parentOutreachNeeded ? (
        <div className="mt-5 grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {statusBadge(parentContacted ? "Parent contacted" : "Contact pending", parentContacted)}
            {followUpDueDate ? (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                Follow-up due {followUpDueDate}
              </span>
            ) : null}
          </div>

          {contactNotes ? (
            <div className="rounded-2xl bg-slate-50/80 p-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200/70">
              {contactNotes}
            </div>
          ) : (
            <div className="rounded-2xl bg-amber-50/70 p-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200/70">
              Add notes after the next family contact.
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-emerald-50/70 px-4 py-5 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200/70">
          No parent outreach needed right now.
        </div>
      )}
    </section>
  );
}
