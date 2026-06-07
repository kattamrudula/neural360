"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  Briefcase,
  Building2,
  Cloud,
  Cpu,
  Database,
  DollarSign,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  Radar,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tabs = [
  { id: 'overview', label: 'Overview', icon: Radar },
  { id: 'recommendations', label: 'Recommendations', icon: Target },
  { id: 'agent-swarm', label: 'Agent Swarm', icon: Bot },
  { id: 'data-fabric', label: 'Data Fabric', icon: Database },
  { id: 'finops', label: 'FinOps', icon: DollarSign },
  { id: 'trust', label: 'Trust & Ops', icon: ShieldCheck },
] as const;

type TabKey = typeof tabs[number]['id'];

type Customer = {
  name: string;
  segment: string;
  region: string;
  health: number;
  annualValueM: number;
  growthScore: number;
  savingsScore: number;
  churnScore: number;
};

const customers: Customer[] = [
  { name: 'Northwind Retail', segment: 'Enterprise', region: 'US', health: 78, annualValueM: 2.4, growthScore: 84, savingsScore: 72, churnScore: 29 },
  { name: 'Alpine Manufacturing', segment: 'Strategic', region: 'EMEA', health: 71, annualValueM: 1.7, growthScore: 73, savingsScore: 81, churnScore: 36 },
  { name: 'Contoso Health', segment: 'Strategic', region: 'APAC', health: 86, annualValueM: 3.1, growthScore: 91, savingsScore: 68, churnScore: 18 },
];

const trend = [
  { month: 'Jan', growth: 56, savings: 18, health: 68, tokens: 22 },
  { month: 'Feb', growth: 59, savings: 19, health: 70, tokens: 26 },
  { month: 'Mar', growth: 63, savings: 22, health: 73, tokens: 31 },
  { month: 'Apr', growth: 69, savings: 24, health: 74, tokens: 37 },
  { month: 'May', growth: 75, savings: 27, health: 79, tokens: 45 },
  { month: 'Jun', growth: 82, savings: 31, health: 83, tokens: 52 },
];

const recommendationCards = [
  {
    title: 'Target E3 to E5 upgrade cluster',
    type: 'Revenue Growth',
    confidence: 92,
    impact: '$380K ARR uplift',
    owner: 'Account Executive',
    summary: 'Installed-base, risk posture, support patterns, and feature readiness indicate strong security monetization potential.',
  },
  {
    title: 'Right-size underutilized cloud workloads',
    type: 'Cost Optimization',
    confidence: 89,
    impact: '$240K annual savings',
    owner: 'FinOps Lead',
    summary: 'Idle compute and low reservation coverage indicate immediate savings without service degradation.',
  },
  {
    title: 'Scale Copilot adoption to eligible personas',
    type: 'Adoption Expansion',
    confidence: 84,
    impact: 'Protect $110K and expand usage',
    owner: 'Customer Success Manager',
    summary: 'Usage telemetry and stakeholder engagement suggest role-based activation can accelerate realized value.',
  },
  {
    title: 'Package renewal defense with value proof',
    type: 'Renewal & Retention',
    confidence: 87,
    impact: '$910K revenue at stake',
    owner: 'Renewal Desk',
    summary: 'Approaching renewal window supported by optimization wins and adoption proof points can increase retention confidence.',
  },
];

const swarm = [
  { lane: 'Contracts Agent', value: 82 },
  { lane: 'Telemetry Agent', value: 96 },
  { lane: 'Billing Agent', value: 88 },
  { lane: 'Support Agent', value: 74 },
  { lane: 'Contact Graph Agent', value: 67 },
  { lane: 'Security Signal Agent', value: 79 },
];

const mix = [
  { name: 'Cloud', value: 41 },
  { name: 'Licensing', value: 19 },
  { name: 'Support', value: 12 },
  { name: 'Telemetry', value: 18 },
  { name: 'Engagement', value: 10 },
];

function cls(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

function StatCard({ title, value, hint, icon: Icon, accent }: { title: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }>; accent: string }) {
  return (
    <div className="glass rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
          <div className="mt-2 text-xs text-slate-400">{hint}</div>
        </div>
        <div className={cls('rounded-2xl border border-white/10 p-3', accent)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>('recommendations');
  const [selectedCustomerName, setSelectedCustomerName] = useState(customers[0].name);
  const [search, setSearch] = useState('');

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.name === selectedCustomerName) ?? customers[0],
    [selectedCustomerName]
  );

  const filteredRecs = useMemo(() => {
    return recommendationCards.filter((item) => {
      const q = `${item.title} ${item.type} ${item.summary}`.toLowerCase();
      return !search || q.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <main className="grid-bg min-h-screen px-4 py-6 text-white lg:px-6 xl:px-10">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="glass overflow-hidden rounded-[34px] p-6 lg:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-xs font-medium text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Neural 360 • Agentic Customer Intelligence Platform
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                Neural 360
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Purpose-built for enterprise-scale sales growth, cost optimization, and real-time intelligence.
                AI agents collect, reconcile, and enrich high-volume data in parallel and in batch, turning customer signals into governed recommendations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10">
                  Open recommendations
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                  View agent swarm design
                </button>
              </div>
            </div>

            <div className="grid min-w-[320px] grid-cols-1 gap-4 sm:grid-cols-2 xl:w-[520px]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Recommended default tab</div>
                <div className="mt-3 text-lg font-semibold text-white">Recommendations</div>
                <div className="mt-1 text-sm text-slate-300">Highlighted for fastest decision support</div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">AI Ingestion Mode</div>
                <div className="mt-3 text-lg font-semibold text-white">Parallel + Batch</div>
                <div className="mt-1 text-sm text-slate-300">Swarm agents for high-volume collection</div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Selected customer</div>
                    <select
                      value={selectedCustomerName}
                      onChange={(e) => setSelectedCustomerName(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    >
                      {customers.map((customer) => (
                        <option key={customer.name} value={customer.name} className="text-slate-950">
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden h-28 w-28 rounded-full border border-cyan-400/10 p-2 md:block">
                    <div className="hero-ring h-full w-full rounded-full p-[2px]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-center">
                        <div>
                          <div className="text-xs text-slate-400">Customer health</div>
                          <div className="mt-1 text-2xl font-semibold text-white">{selectedCustomer.health}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass rounded-[28px] p-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              const recommended = id === 'recommendations';
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cls(
                    'relative inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                    active ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/10' : 'bg-white/5 text-slate-300 hover:bg-white/10',
                    recommended && !active && 'border border-cyan-400/20 text-cyan-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {recommended && (
                    <span className={cls('rounded-full px-2 py-0.5 text-[10px] font-semibold', active ? 'bg-slate-950/10 text-slate-700' : 'bg-cyan-400/10 text-cyan-200')}>
                      recommended
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        

        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-white">Business signal trend</div>
                  <div className="mt-1 text-sm text-slate-400">Growth, savings, health, and AI workload expansion across the last six months.</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Live semantic overview</div>
              </div>
              <div className="mt-6 h-[330px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="growth" stroke="#18d8ff" strokeWidth={3} name="Growth" />
                    <Line type="monotone" dataKey="savings" stroke="#fbbf24" strokeWidth={3} name="Savings" />
                    <Line type="monotone" dataKey="health" stroke="#1bc77b" strokeWidth={3} name="Health" />
                    <Line type="monotone" dataKey="tokens" stroke="#7b5cff" strokeWidth={3} name="AI tokens" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Data domain mix</div>
                <div className="mt-1 text-sm text-slate-400">Unified estate feeding the recommendation fabric.</div>
                <div className="mt-6 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mix} dataKey="value" nameKey="name" innerRadius={64} outerRadius={98} paddingAngle={3}>
                        {mix.map((_, index) => (
                          <Cell key={index} fill={["#2b7fff", "#18d8ff", "#7b5cff", "#1bc77b", "#fbbf24"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Neural 360 design principles</div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {[
                    ['Tab-first UX', 'Faster visibility and navigation across all workspaces'],
                    ['Agentic data fabric', 'Parallel and batch collection for high-volume domains'],
                    ['Real-time decisions', 'Recommendations linked to measurable owner actions'],
                    ['Governed intelligence', 'Operational trust, observability, and enterprise controls'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-medium text-white">{title}</div>
                      <div className="mt-1 text-sm text-slate-400">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'recommendations' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">Recommendation command center</div>
                  <div className="mt-1 text-sm text-slate-400">Default tab for fastest decisioning across growth, retention, and optimization plays.</div>
                </div>
                <div className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recommendations" className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {filteredRecs.map((rec) => (
                  <div key={rec.title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">{rec.type}</span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">Confidence {rec.confidence}%</span>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">{rec.owner}</span>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="text-xl font-semibold text-white">{rec.title}</div>
                        <div className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">{rec.summary}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-right">
                        <div className="text-xs text-slate-500">Expected impact</div>
                        <div className="mt-1 text-lg font-semibold text-white">{rec.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Owner routing</div>
                <div className="mt-1 text-sm text-slate-400">Recommendation delivery mapped to accountable personas.</div>
                <div className="mt-5 grid grid-cols-1 gap-3">
                  {[
                    ['Account Executive', 'Revenue growth and strategic upsell'],
                    ['FinOps Lead', 'Cloud cost and reservation coverage actions'],
                    ['Customer Success Manager', 'Adoption, value realization, and expansion'],
                    ['Renewal Desk', 'Defense, proof points, and attached growth'],
                  ].map(([name, desc]) => (
                    <div key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-medium text-white">{name}</div>
                      <div className="mt-1 text-sm text-slate-400">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Why this tab is highlighted</div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 p-4">It is the highest-value workspace for business users because it converts integrated signals into actionable decisions.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Growth, savings, retention, and AI expansion motions are prioritized here first.</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'agent-swarm' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-white">Agent swarm orchestration</div>
                  <div className="mt-1 text-sm text-slate-400">
                    Microsoft Agent Framework-inspired swarm pattern for parallel, batch, and near-real-time collection across high-volume domains.
                  </div>
                </div>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">Agentic AI ingest fabric</span>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 lg:col-span-1">
                  <div className="flex items-center gap-3 text-white"><BrainCircuit className="h-5 w-5 text-cyan-300" /> Coordinator Agent</div>
                  <div className="mt-3 text-sm leading-7 text-slate-400">Dispatches domain agents, manages retries, schedules batch windows, and merges outputs into the semantic intelligence layer.</div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 lg:col-span-2">
                  <div className="flex items-center gap-3 text-white"><Network className="h-5 w-5 text-violet-300" /> Domain agent swarm</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {['Contracts', 'Billing', 'Telemetry', 'Support', 'Contact Graph', 'Security Signals'].map((domain) => (
                      <div key={domain} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">{domain} agent</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={swarm} layout="vertical" margin={{ left: 28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                    <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                    <YAxis type="category" dataKey="lane" width={140} stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                      {swarm.map((_, index) => (
                        <Cell key={index} fill={["#2b7fff", "#18d8ff", "#7b5cff", "#1bc77b", "#fbbf24", "#fb7185"][index % 6]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Execution modes</div>
                <div className="mt-4 space-y-3">
                  {[
                    ['Parallel ingest', 'Swarm agents collect data concurrently by domain for higher throughput.'],
                    ['Batch windows', 'Historical backfills and scheduled consolidation jobs for large-volume sources.'],
                    ['Near-real-time updates', 'Event-driven refresh for telemetry, billing deltas, and support changes.'],
                    ['Semantic merge', 'Agent outputs are normalized, mastered, and promoted to customer intelligence views.'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-medium text-white">{title}</div>
                      <div className="mt-1 text-sm text-slate-400">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Why agentic AI matters here</div>
                <div className="mt-4 text-sm leading-7 text-slate-400">
                  The data estate is too large and heterogeneous for linear collection. Agent swarms reduce collection bottlenecks, isolate domain-specific logic, and improve freshness for analytics and recommendations.
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'data-fabric' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="text-lg font-semibold text-white">Customer 360 intelligence fabric</div>
              <div className="mt-1 text-sm text-slate-400">Operational, analytical, and recommendation layers stitched into one governed architecture.</div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ['Source estate', 'CRM, contracts, licensing, billing, telemetry, support, and security'],
                  ['Swarm ingestion', 'Parallel agent collection and orchestration'],
                  ['Golden profile', 'Customer mastering, graph linking, and stakeholder hierarchy'],
                  ['Semantic layer', 'Reusable business entities, metrics, and feature views'],
                  ['Recommendation engine', 'Rule, analytics, and AI-ranked actions'],
                  ['Experience layer', 'Tabs-first workbench for sellers, FinOps, and customer teams'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                    <div className="font-medium text-white">{title}</div>
                    <div className="mt-2 text-sm text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-[30px] p-6">
              <div className="text-lg font-semibold text-white">Fabric principles</div>
              <div className="mt-4 space-y-3">
                {[
                  ['High-volume readiness', 'Designed for enormous telemetry and billing scale'],
                  ['Composable agents', 'Domain-specific collection and transformation'],
                  ['Low-latency insights', 'Faster analytics by narrowing the path to semantic consumption'],
                  ['Governance first', 'Controlled lineage, observability, and secure extensibility'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium text-white">{title}</div>
                    <div className="mt-1 text-sm text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'finops' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="text-lg font-semibold text-white">Savings and optimization trend</div>
              <div className="mt-1 text-sm text-slate-400">Cloud, licensing, and infrastructure efficiency surfaced through a single operational tab.</div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="finopsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.65} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="savings" stroke="#fbbf24" fillOpacity={1} fill="url(#finopsFill)" name="Savings" />
                    <Line type="monotone" dataKey="tokens" stroke="#7b5cff" strokeWidth={3} name="AI tokens" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass rounded-[30px] p-6">
                <div className="text-lg font-semibold text-white">Optimization focus areas</div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {[
                    ['Idle resources', 'Detect and eliminate waste across steady-state workloads'],
                    ['Reservation coverage', 'Lift commitment efficiency with usage-matched reservations'],
                    ['License utilization', 'Reclaim underused licenses and reduce over-assignment'],
                    ['Token governance', 'Control AI workload cost while safely scaling adoption'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-medium text-white">{title}</div>
                      <div className="mt-1 text-sm text-slate-400">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'trust' && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="glass rounded-[30px] p-6">
              <div className="text-lg font-semibold text-white">Trust, operations, and delivery posture</div>
              <div className="mt-1 text-sm text-slate-400">A production-grade platform needs operational discipline as much as visual polish.</div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ['Observability', 'Agent orchestration telemetry, lineage tracking, failures, and freshness'],
                  ['Security', 'Role-based access, data segmentation, and recommendation traceability'],
                  ['Governance', 'Controlled metrics, reusable semantic models, and policy-backed operations'],
                  ['Scalability', 'Elastic collection using parallelized agents and workload isolation'],
                  ['Reliability', 'Retry, replay, and batch recovery strategies'],
                  ['Experience', 'Consistent tab-first UI optimized for enterprise decision makers'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                    <div className="font-medium text-white">{title}</div>
                    <div className="mt-2 text-sm text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-[30px] p-6">
              <div className="text-lg font-semibold text-white">Recommended delivery stack</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="text-white">Frontend:</strong> Next.js App Router + React + TypeScript + Tailwind</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="text-white">Experience:</strong> tab-first workbench with glassmorphism, charts, and role-ready views</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="text-white">AI orchestration:</strong> Microsoft Agent Framework-based swarm model for high-volume parallel collection</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="text-white">Back-end evolution:</strong> semantic APIs, recommendation services, workflow integration, and audit telemetry</div>
              </div>
            </div>
          </section>
        )}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <StatCard title="Annual customer value" value={`$${selectedCustomer.annualValueM.toFixed(1)}M`} hint={`${selectedCustomer.segment} • ${selectedCustomer.region}`} icon={Building2} accent="bg-blue-500/20" />
          <StatCard title="Growth score" value={`${selectedCustomer.growthScore}/100`} hint="Upsell, cross-sell, and adoption readiness" icon={TrendingUp} accent="bg-emerald-500/20" />
          <StatCard title="Savings score" value={`${selectedCustomer.savingsScore}/100`} hint="Cloud, infra, licensing, and token optimization" icon={Cloud} accent="bg-amber-500/20" />
          <StatCard title="Churn risk" value={`${selectedCustomer.churnScore}/100`} hint="Support, security, and engagement signals" icon={ShieldCheck} accent="bg-rose-500/20" />
        </section>
      </div>
      
    </main>
  );
}
