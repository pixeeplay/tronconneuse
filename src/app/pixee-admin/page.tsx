"use client";

import { useState, useEffect, useCallback } from "react";

interface DashboardData {
  period: { days: number; since: string };
  totalEvents: number;
  uniqueVisitors: number;
  pageviews: number;
  topEvents: { event: string; count: number }[];
  topPages: { page: string; count: number }[];
  perDay: { date: string; count: number; visitors: number }[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [days, setDays] = useState(7);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Persist secret in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("pixee-admin-secret");
    if (stored) {
      setSecret(stored);
      setAuthed(true);
    }
  }, []);

  const fetchData = useCallback(async (s: string, d: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics/dashboard?days=${d}`, {
        headers: { "x-analytics-secret": s },
      });
      if (res.status === 401) {
        setError("Cle invalide");
        setAuthed(false);
        sessionStorage.removeItem("pixee-admin-secret");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Erreur serveur");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
      sessionStorage.setItem("pixee-admin-secret", s);
    } catch {
      setError("Erreur reseau");
    }
    setLoading(false);
  }, []);

  // Auto-fetch on mount if already authed
  useEffect(() => {
    if (authed && secret) {
      fetchData(secret, days);
    }
  }, [authed, days]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(secret, days);
  };

  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <h1 className="text-xl font-bold text-center">Admin Analytics</h1>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Cle d'acces"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {error && <p className="text-danger text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !secret}
            className="px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-50"
          >
            {loading ? "..." : "Acceder"}
          </button>
        </form>
      </div>
    );
  }

  const maxEvents = data ? Math.max(...data.perDay.map((d) => d.count), 1) : 1;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2 bg-background/90 backdrop-blur-md border-b border-border">
        <h1 className="text-lg font-bold">Analytics</h1>
        <div className="flex gap-1">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                days === d ? "bg-primary text-white" : "bg-card text-muted-foreground"
              }`}
            >
              {d}j
            </button>
          ))}
        </div>
      </header>

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      )}

      {error && <p className="text-danger text-xs text-center py-4">{error}</p>}

      {data && (
        <div className="p-4 flex flex-col gap-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Visiteurs" value={data.uniqueVisitors} />
            <KpiCard label="Pages vues" value={data.pageviews} />
            <KpiCard label="Events" value={data.totalEvents} />
          </div>

          {/* Chart */}
          {data.perDay.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase mb-3">
                Activite par jour
              </h2>
              <div className="flex items-end gap-1 h-28">
                {data.perDay.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary/80 rounded-t-sm min-h-[2px] transition-all"
                      style={{ height: `${(d.count / maxEvents) * 100}%` }}
                      title={`${d.date}: ${d.count} events, ${d.visitors} visiteurs`}
                    />
                    <span className="text-[8px] text-muted-foreground">
                      {d.date.slice(8)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Events */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase mb-3">
              Top events
            </h2>
            <div className="flex flex-col gap-2">
              {data.topEvents.map((e) => (
                <div key={e.event} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs truncate flex-1">{e.event}</span>
                  <span className="font-bold text-primary ml-2">{e.count}</span>
                </div>
              ))}
              {data.topEvents.length === 0 && (
                <p className="text-xs text-muted-foreground">Aucun event</p>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase mb-3">
              Top pages
            </h2>
            <div className="flex flex-col gap-2">
              {data.topPages.map((p) => (
                <div key={p.page} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs truncate flex-1">{p.page}</span>
                  <span className="font-bold text-primary ml-2">{p.count}</span>
                </div>
              ))}
              {data.topPages.length === 0 && (
                <p className="text-xs text-muted-foreground">Aucune page</p>
              )}
            </div>
          </div>

          {/* Period info */}
          <p className="text-[10px] text-muted-foreground text-center">
            Periode : {days} derniers jours (depuis {new Date(data.period.since).toLocaleDateString("fr-FR")})
          </p>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className="text-xl font-mono font-bold text-primary">
        {value.toLocaleString("fr-FR")}
      </p>
      <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
        {label}
      </p>
    </div>
  );
}
