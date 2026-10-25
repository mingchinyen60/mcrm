import React, { useState } from 'react';
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Cpu, 
  Calendar, 
  DollarSign, 
  Percent, 
  FlaskConical,
  XCircle,
  CheckCircle2,
  Filter,
  Download,
  FileSpreadsheet,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Opportunity, OpportunityStage, Account, TechnicalSpec } from '../types';
import { api } from '../services/api';

interface KanbanPipelineProps {
  opportunities: Opportunity[];
  accounts: Account[];
  techSpecs: TechnicalSpec[];
  onStageChange: (id: number, stage: OpportunityStage) => Promise<void>;
  onOpenCreateModal: () => void;
  onEditOpportunity: (opp: Opportunity) => void;
}

const STAGES: { id: OpportunityStage; label: string; color: string; border: string }[] = [
  { id: '1_lead', label: '1. Lead / Ingestion', color: 'bg-slate-700', border: 'border-slate-700' },
  { id: '2_tech_discovery', label: '2. Tech Discovery', color: 'bg-indigo-600', border: 'border-indigo-600' },
  { id: '3_sample_evaluation', label: '3. Sample Eval (EVT/DVT)', color: 'bg-amber-600', border: 'border-amber-600' },
  { id: '4_design_win', label: '4. Design-Win (PVT)', color: 'bg-emerald-600', border: 'border-emerald-600' },
  { id: '5_mass_production', label: '5. Mass Production', color: 'bg-blue-600', border: 'border-blue-600' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'bg-rose-700', border: 'border-rose-700' },
];

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  opportunities,
  onStageChange,
  onOpenCreateModal,
  onEditOpportunity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredOpps = opportunities.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.account_name && o.account_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.part_number && o.part_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStageMove = async (id: number, currentStage: OpportunityStage, direction: 'next' | 'prev' | 'lost') => {
    const stageFlow: OpportunityStage[] = ['1_lead', '2_tech_discovery', '3_sample_evaluation', '4_design_win', '5_mass_production'];
    let targetStage: OpportunityStage;

    if (direction === 'lost') {
      targetStage = 'closed_lost';
    } else {
      const currentIndex = stageFlow.indexOf(currentStage);
      if (direction === 'next' && currentIndex < stageFlow.length - 1) {
        targetStage = stageFlow[currentIndex + 1];
      } else if (direction === 'prev' && currentIndex > 0) {
        targetStage = stageFlow[currentIndex - 1];
      } else {
        return;
      }
    }

    try {
      setUpdatingId(id);
      await onStageChange(id, targetStage);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">High-Tech Design-Win Pipeline</h2>
          <p className="text-sm text-slate-400">
            Track precision components from initial R&D alignment through EVT/DVT qualification to full Mass Production.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search account, part, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52"
          />
          <a
            href={api.getExportUrl('opportunities', 'excel')}
            download
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            title="Download pipeline report to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </a>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex space-x-4 overflow-x-auto pb-6 min-h-[calc(100vh-16rem)]">
        {STAGES.map((col) => {
          const colOpps = filteredOpps.filter(o => o.stage === col.id);
          const colTotalValue = colOpps.reduce((sum, o) => sum + (o.estimated_revenue || 0), 0);

          return (
            <div 
              key={col.id} 
              className="flex-shrink-0 w-80 flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                    <h3 className="font-semibold text-xs text-white uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {colOpps.length}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Total: <span className="text-white font-semibold">{formatCurrency(colTotalValue)}</span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-22rem)]">
                {colOpps.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800/80 rounded-lg">
                    No opportunities in this stage
                  </div>
                ) : (
                  colOpps.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => onEditOpportunity(opp)}
                      className="group p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 shadow-sm transition cursor-pointer space-y-3 relative"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 max-w-[70%] truncate">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <strong className="text-slate-200 truncate">{opp.account_name}</strong>
                          {opp.project_code && (
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                              {opp.project_code}
                            </span>
                          )}
                        </div>
                        {opp.part_number && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {opp.part_number}
                          </span>
                        )}
                      </div>

                      {/* Title & Channel Rep/Disti */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition leading-snug">
                          {opp.title}
                        </h4>
                        {opp.partner_account_name && (
                          <div className="flex items-center space-x-1 text-[11px] text-cyan-300">
                            <Share2 className="w-3 h-3 text-cyan-400" />
                            <span>Via Disti/Rep: <strong>{opp.partner_account_name}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Application & Sample Badge */}
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {opp.target_application}
                        </span>
                        {(opp.active_samples_count ?? 0) > 0 && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                            <FlaskConical className="w-3 h-3" />
                            <span>{opp.active_samples_count} sample(s) in lab</span>
                          </span>
                        )}
                      </div>

                      {/* Interaction History Summary */}
                      {(opp.activities_count ?? 0) > 0 && (
                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="flex items-center space-x-1 text-blue-400 font-semibold">
                              <MessageSquare className="w-3 h-3" />
                              <span>{opp.activities_count} interaction(s)</span>
                            </span>
                          </div>
                          {opp.latest_activity && (
                            <div className="text-slate-300 truncate text-[10px]" title={opp.latest_activity}>
                              {opp.latest_activity}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Value & Confidence */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="text-xs text-slate-400">Program Value</div>
                          <div className="font-bold text-white text-sm">{formatCurrency(opp.estimated_revenue)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Confidence</div>
                          <div className="font-semibold text-emerald-400">{opp.confidence_percentage}%</div>
                        </div>
                      </div>

                      {/* Target MP Date */}
                      {opp.target_mp_date && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Target MP: <strong className="text-slate-300">{opp.target_mp_date}</strong></span>
                        </div>
                      )}

                      {/* Stage Shift Action Buttons */}
                      <div 
                        className="pt-2 flex items-center justify-between border-t border-slate-800/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex space-x-1">
                          {col.id !== '1_lead' && col.id !== 'closed_lost' && (
                            <button
                              disabled={updatingId === opp.id}
                              onClick={() => handleStageMove(opp.id, opp.stage, 'prev')}
                              title="Move to previous stage"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id !== '5_mass_production' && col.id !== 'closed_lost' && (
                            <button
                              disabled={updatingId === opp.id}
                              onClick={() => handleStageMove(opp.id, opp.stage, 'next')}
                              title="Advance to next stage"
                              className="px-2 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium flex items-center space-x-1 transition"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {col.id !== 'closed_lost' && (
                          <button
                            disabled={updatingId === opp.id}
                            onClick={() => handleStageMove(opp.id, opp.stage, 'lost')}
                            title="Mark Closed Lost"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
