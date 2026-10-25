import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  FlaskConical, 
  ArrowUpRight, 
  Building2, 
  Clock, 
  Tag
} from 'lucide-react';
import { DashboardMetrics, NavTab } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onNavigate: (tab: NavTab) => void;
}

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  '1_lead': { label: '1. Lead / Ingestion', color: 'bg-slate-500' },
  '2_tech_discovery': { label: '2. Tech Discovery (RFP)', color: 'bg-indigo-500' },
  '3_sample_evaluation': { label: '3. Sample Eval (EVT/DVT)', color: 'bg-amber-500' },
  '4_design_win': { label: '4. Design-Win (PVT BOM)', color: 'bg-emerald-500' },
  '5_mass_production': { label: '5. Mass Production (MP)', color: 'bg-blue-500' },
  'closed_lost': { label: 'Closed Lost', color: 'bg-rose-500' },
};

export const DashboardView: React.FC<DashboardViewProps> = ({ metrics, loading, onNavigate }) => {
  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400">Loading Synology CRM metrics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Executive Design-Win Overview</h2>
          <p className="text-sm text-slate-400">
            Real-time pipeline analytics, engineering qualification milestones, and volume shipment tracking.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onNavigate('pipeline')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            <span>View Kanban Pipeline</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Pipeline Value</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(metrics.total_pipeline_value)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all unclosed design programs</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Weighted Forecast</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {formatCurrency(metrics.total_weighted_value)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Risk-adjusted by confidence %</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Design-Wins & MP</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-baseline space-x-2">
            <span>{metrics.design_wins_count} <span className="text-xs font-normal text-slate-400">Wins</span></span>
            <span className="text-slate-600">/</span>
            <span className="text-blue-400">{metrics.mass_production_count} <span className="text-xs font-normal text-slate-400">MP</span></span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Locked on customer BOM / In production</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Samples in Lab</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">
            {metrics.active_samples_count} <span className="text-xs font-normal text-slate-400">Batches</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">EVT/DVT testing at customer labs</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
      </div>

      {/* Stage Breakdown Progress */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-semibold text-white">Pipeline Distribution by Design-Win Phase</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.stage_breakdown.map((item) => {
            const stageConfig = STAGE_LABELS[item.stage] || { label: item.stage, color: 'bg-slate-600' };
            const percentage = metrics.total_pipeline_value > 0 
              ? Math.min(100, Math.round((item.total_value / metrics.total_pipeline_value) * 100))
              : 0;

            return (
              <div key={item.stage} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stageConfig.color}`}></span>
                    <span className="font-medium text-slate-200">{stageConfig.label}</span>
                  </div>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800">
                    {item.count} opps
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-white">{formatCurrency(item.total_value)}</span>
                  <span className="text-xs text-slate-400">{percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${stageConfig.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Opportunities & Active Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">High-Priority Design Programs</h3>
            <button 
              onClick={() => onNavigate('pipeline')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {metrics.recent_opportunities.map((opp) => (
              <div 
                key={opp.id} 
                className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
              >
                <div className="space-y-1 max-w-[65%]">
                  <h4 className="text-sm font-semibold text-white truncate">{opp.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{opp.account_name}</span>
                    </span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[11px] text-slate-300">
                      {STAGE_LABELS[opp.stage]?.label || opp.stage}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{formatCurrency(opp.estimated_revenue)}</div>
                  <div className="text-xs text-emerald-400 font-medium">{opp.confidence_percentage}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Samples */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Sample Evaluations</h3>
            <button 
              onClick={() => onNavigate('samples')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {metrics.recent_samples.map((s) => (
              <div 
                key={s.id} 
                className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{s.sample_batch_code}</span>
                    <span className="text-xs text-slate-400">({s.quantity} pcs)</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {s.account_name} - <span className="text-amber-400 font-mono">{s.part_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                    s.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    s.status === 'testing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
