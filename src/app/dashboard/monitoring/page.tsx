import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';

// Initialize Supabase with service role for admin dashboard
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0; // Disable cache for live monitoring

export default async function MonitoringDashboard() {
  // 1. Fetch Agent Metrics (from the view)
  const { data: metrics } = await supabase
    .from('agent_metrics')
    .select('*')
    .order('total_calls', { ascending: false });

  // 2. Fetch Pending HITL Approvals
  const { data: pendingApprovals } = await supabase
    .from('hitl_approvals')
    .select('*')
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('requested_at', { ascending: false });

  // 3. Fetch Recent Traces (Waterfall)
  const { data: traces } = await supabase
    .from('agent_traces')
    .select('agent_id, session_id, event_type, duration_ms, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Agentic Infrastructure</h1>
          <p>Live Monitoring & Observability</p>
        </div>
        <div className={styles.statusBadge}>
          <span className={styles.pulse}></span> System Operational
        </div>
      </header>

      <main className={styles.grid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          
          <section className={styles.glassCard}>
            <h2>Active Agent Metrics</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Calls</th>
                    <th>Errors</th>
                    <th>Avg Latency</th>
                    <th>Avg Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.map((m: any) => (
                    <tr key={m.agent_id}>
                      <td className={styles.highlight}>{m.agent_id}</td>
                      <td>{m.total_calls}</td>
                      <td className={m.total_errors > 0 ? styles.errorText : ''}>
                        {m.total_errors}
                      </td>
                      <td>{Math.round(m.avg_duration_ms || 0)}ms</td>
                      <td>{Math.round(m.avg_tokens || 0)}</td>
                    </tr>
                  ))}
                  {(!metrics || metrics.length === 0) && (
                    <tr><td colSpan={5} className={styles.empty}>No metrics recorded yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.glassCard}>
            <h2>HITL Action Queue</h2>
            {pendingApprovals && pendingApprovals.length > 0 ? (
              <div className={styles.hitlGrid}>
                {pendingApprovals.map((h: any) => (
                  <div key={h.id} className={styles.hitlCard}>
                    <div className={styles.hitlHeader}>
                      <span className={styles.hitlAgent}>{h.agent_id}</span>
                      <span className={styles.hitlTime}>
                        {new Date(h.requested_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.hitlAction}>
                      <strong>{h.tool_name}</strong> • {h.action}
                    </div>
                    <div className={styles.hitlStatus}>Awaiting Slack Approval</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.checkIcon}>✓</span>
                <p>No actions pending human approval</p>
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          <section className={styles.glassCard}>
            <h2>Live Trace Waterfall</h2>
            <div className={styles.traceStream}>
              {traces?.map((t: any, i: number) => {
                const isError = t.event_type.includes('error') || t.event_type.includes('block') || t.event_type.includes('denied');
                return (
                  <div key={i} className={`${styles.traceItem} ${isError ? styles.traceError : ''}`}>
                    <div className={styles.traceTime}>
                      {new Date(t.created_at).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}
                    </div>
                    <div className={styles.traceDetails}>
                      <span className={styles.traceAgent}>{t.agent_id}</span>
                      <span className={styles.traceType}>{t.event_type}</span>
                    </div>
                    <div className={styles.traceMetric}>
                      {t.duration_ms ? `${t.duration_ms}ms` : '—'}
                    </div>
                  </div>
                );
              })}
              {(!traces || traces.length === 0) && (
                <div className={styles.empty}>No recent events</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
