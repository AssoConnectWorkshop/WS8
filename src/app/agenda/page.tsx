import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
};

const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});
const DAY_LABEL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});
const TIME_LABEL = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function monthBounds(month: string) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return { start: start.toISOString(), end: end.toISOString() };
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" });
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const { month: monthParam } = await searchParams;

  let month: string;
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    month = monthParam;
  } else {
    const { data } = await supabase
      .from("events")
      .select("starts_at")
      .order("starts_at", { ascending: true })
      .limit(1);
    month = data?.[0]?.starts_at?.slice(0, 7) ?? "2026-06";
  }

  const { start, end } = monthBounds(month);
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, description, location, starts_at, ends_at")
    .gte("starts_at", start)
    .lt("starts_at", end)
    .order("starts_at", { ascending: true })
    .returns<EventRow[]>();

  const byDay = new Map<string, EventRow[]>();
  for (const ev of events ?? []) {
    const key = dayKey(ev.starts_at);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(ev);
  }
  const days = [...byDay.entries()];

  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const monthTitle = MONTH_LABEL.format(new Date(`${month}-01T00:00:00`));

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between gap-4">
        <Link
          href={`/agenda?month=${prev}`}
          className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          aria-label="Mois précédent"
        >
          ← Précédent
        </Link>
        <h1 className="text-2xl font-bold capitalize">{monthTitle}</h1>
        <Link
          href={`/agenda?month=${next}`}
          className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          aria-label="Mois suivant"
        >
          Suivant →
        </Link>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error.message}</p>
      )}

      {!error && days.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
          Aucun événement ce mois-ci.
        </p>
      )}

      <div className="flex flex-col gap-8">
        {days.map(([key, dayEvents]) => (
          <section key={key} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 capitalize">
              {DAY_LABEL.format(new Date(`${key}T12:00:00`))}
            </h2>
            <ul className="flex flex-col gap-3">
              {dayEvents.map((ev) => (
                <li
                  key={ev.id}
                  className="flex gap-4 rounded-xl border p-4 transition hover:shadow-md"
                >
                  <div className="flex min-w-[5.5rem] flex-col items-start text-sm font-medium text-blue-600">
                    <span>{TIME_LABEL.format(new Date(ev.starts_at))}</span>
                    {ev.ends_at && (
                      <span className="text-gray-400">
                        {TIME_LABEL.format(new Date(ev.ends_at))}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{ev.title}</h3>
                    {ev.description && (
                      <p className="text-sm text-gray-600">{ev.description}</p>
                    )}
                    {ev.location && (
                      <p className="text-xs text-gray-400">📍 {ev.location}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
