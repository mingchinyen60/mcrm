import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Building2, 
  Share2, 
  Calendar, 
  DollarSign, 
  Cpu, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  MessageSquare,
  FileSpreadsheet,
  Edit,
  Trash2
} from 'lucide-react';
import { Opportunity, Account, TechnicalSpec, Contact, OpportunityStage } from '../types';
import { api } from '../services/api';
import { ActivityTimeline } from './ActivityTimeline';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  accounts: Account[];
  techSpecs: TechnicalSpec[];
  contacts: Contact[];
  onRefresh: () => void;
  onEditOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: number) => void;
  onAddOpportunity: () => void;
}

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  '1_lead': { label: '1. Lead / Prospect', color: 'bg-slate-700 text-slate-200 border-slate-600' },
  '2_tech_discovery': { label: '2. Tech Discovery', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  '3_sample_evaluation': { label: '3. Sample Eval (EVT/DVT)', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  '4_design_win': { label: '4. Design Win (BOM Lock)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  '5_mass_production': { label: '5. Mass Production (MP)', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  'closed_lost': { label: 'Closed / Disqualified', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  accounts,
  techSpecs,
  contacts,
  onRefresh,
  onEditOpportunity,
  onDeleteOpportunity,
  onAddOpportunity
}) => {
  // Filters state
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('revenue_desc');
  
  // Expanded row state for inline activities
  const [expandedOppId, setExpandedOppId] = useState<number | null>(null);

  // Distributors / Partners list (accounts with type 'Distributor' or linked as partner)
  const partners = useMemo(() => {
    return accounts.filter(a => a.type === 'Distributor' || a.name.toLowerCase().includes('distri') || a.name.toLowerCase().includes('arrow') || a.name.toLowerCase().includes('avnet'));
  }, [accounts]);

  // OEMs / Customer accounts list
  const customerAccounts = useMemo(() => {
    return accounts.filter(a => a.type !== 'Distributor');
  }, [accounts]);

  // Filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Stage filter
      if (selectedStage !== 'ALL' && opp.stage !== selectedStage) {
        return false;
      }
      // Account filter
      if (selectedAccountId !== 'ALL' && opp.account_id !== Number(selectedAccountId)) {
        return false;
      }
      // Partner filter
      if (selectedPartnerId !== 'ALL') {
        if (selectedPartnerId === 'DIRECT' && opp.partner_account_id) return false;
        if (selectedPartnerId !== 'DIRECT' && opp.partner_account_id !== Number(selectedPartnerId)) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = opp.title.toLowerCase().includes(q);
        const codeMatch = opp.project_code?.toLowerCase().includes(q);
        const accountMatch = opp.account_name?.toLowerCase().includes(q);
        const partnerMatch = opp.partner_account_name?.toLowerCase().includes(q);
        const partMatch = opp.part_number?.toLowerCase().includes(q);
        const appMatch = opp.target_application?.toLowerCase().includes(q);
        if (!titleMatch && !codeMatch && !accountMatch && !partnerMatch && !partMatch && !appMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'revenue_desc') return b.estimated_revenue - a.estimated_revenue;
      if (sortBy === 'revenue_asc') return a.estimated_revenue - b.estimated_revenue;
      if (sortBy === 'volume_desc') return b.annual_volume_units - a.annual_volume_units;
      if (sortBy === 'confidence_desc') return b.confidence_percentage - a.confidence_percentage;
      if (sortBy === 'date_desc') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return 0;
    });
  }, [opportunities, selectedStage, selectedAccountId, selectedPartnerId, searchQuery, sortBy]);

  // Aggregated summary metrics for filtered view
  const summaryStats = useMemo(() => {
    const totalValue = filteredOpportunities.reduce((acc, curr) => acc + curr.estimated_revenue, 0);
    const weightedValue = filteredOpportunities.reduce((acc, curr) => acc + (curr.estimated_revenue * curr.confidence_percentage / 100), 0);
    const totalUnits = filteredOpportunities.reduce((acc, curr) => acc + curr.annual_volume_units, 0);
    return {
      count: filteredOpportunities.length,
      totalValue,
      weightedValue,
      totalUnits
    };
  }, [filteredOpportunities]);

  const toggleExpand = (id: number) => {
    setExpandedOppId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <Target className="w-6 h-6 text-blue-500" />
            <span>Opportunity Management & Filter View</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed tabular opportunity pipeline sorted by design-win stage, customer OEMs, and channel partners.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <a
            href={api.getExportUrl('opportunities', 'excel')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
            title="Download formatted Excel workbook (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel</span>
          </a>

          <a
            href={api.getExportUrl('opportunities', 'csv')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
            title="Download CSV table"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={onAddOpportunity}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, project, PN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Stage Dropdown */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Stages ({opportunities.length})</option>
              <option value="1_lead">1. Lead / Prospect</option>
              <option value="2_tech_discovery">2. Tech Discovery</option>
              <option value="3_sample_evaluation">3. Sample Evaluation (EVT/DVT)</option>
              <option value="4_design_win">4. Design Win (Approved BOM)</option>
              <option value="5_mass_production">5. Mass Production (MP)</option>
              <option value="closed_lost">Closed / Lost</option>
            </select>
          </div>

          {/* Customer OEM Account Dropdown */}
          <div>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All End Accounts / OEMs</option>
              {customerAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.tier})</option>
              ))}
            </select>
          </div>

          {/* Channel Partner / Disti Dropdown */}
          <div>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Sales Channels</option>
              <option value="DIRECT">Direct (No Distributor)</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>Channel: {p.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="revenue_desc">Revenue: High to Low</option>
              <option value="revenue_asc">Revenue: Low to High</option>
              <option value="volume_desc">Volume: High to Low</option>
              <option value="confidence_desc">Confidence: High to Low</option>
              <option value="date_desc">Last Updated</option>
            </select>
          </div>
        </div>

        {/* View Statistics Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{summaryStats.count}</strong> programs</span>
          <span>•</span>
          <span>Total Pipeline: <strong className="text-emerald-400">${(summaryStats.totalValue / 1000).toFixed(1)}k</strong></span>
          <span>•</span>
          <span>Weighted Pipeline: <strong className="text-blue-400">${(summaryStats.weightedValue / 1000).toFixed(1)}k</strong></span>
          <span>•</span>
          <span>Annual Demand: <strong className="text-purple-400">{summaryStats.totalUnits.toLocaleString()} units/yr</strong></span>
          
          {(selectedStage !== 'ALL' || selectedAccountId !== 'ALL' || selectedPartnerId !== 'ALL' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedStage('ALL');
                setSelectedAccountId('ALL');
                setSelectedPartnerId('ALL');
                setSearchQuery('');
              }}
              className="ml-auto text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Table */}
      {filteredOpportunities.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-sm">
          No opportunities match your filter criteria. Try resetting your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => {
            const isExpanded = expandedOppId === opp.id;
            const stageConfig = STAGE_LABELS[opp.stage] || { label: opp.stage, color: 'bg-slate-800 text-slate-300' };

            return (
              <div 
                key={opp.id} 
                className="rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden"
              >
                {/* Main Card Header / Summary Row */}
                <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {opp.project_code && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {opp.project_code}
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${stageConfig.color}`}>
                        {stageConfig.label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>MP: {opp.target_mp_date || 'TBD'}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight hover:text-blue-400 transition cursor-pointer" onClick={() => toggleExpand(opp.id)}>
                      {opp.title}
                    </h3>

                    {/* Meta info row: Customer OEM + Partner + Technical Part */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-200 font-medium">{opp.account_name || 'OEM Account'}</span>
                      </div>

                      {opp.partner_account_name && (
                        <div className="flex items-center space-x-1.5 text-amber-300">
                          <Share2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Disti: <strong>{opp.partner_account_name}</strong></span>
                        </div>
                      )}

                      {opp.part_number && (
                        <div className="flex items-center space-x-1.5 text-slate-300 font-mono">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{opp.part_number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial & Volume Metrics */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-slate-800/80 lg:pl-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        ${opp.estimated_revenue.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {opp.annual_volume_units.toLocaleString()} pcs/yr • {opp.confidence_percentage}%
                      </div>
                    </div>

                    {/* Action & Toggle Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpand(opp.id)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isExpanded 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="View and log interaction history"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        <span>Activities ({opp.activities_count || 0})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onEditOpportunity(opp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                        title="Edit Opportunity"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteOpportunity(opp.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Latest activity preview pill if collapsed */}
                {!isExpanded && opp.latest_activity && (
                  <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 text-xs text-slate-400 flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">Latest Activity:</span>
                    <span className="truncate text-slate-300">{opp.latest_activity}</span>
                  </div>
                )}

                {/* Expanded Activities Drawer */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950/70 border-t border-blue-500/30">
                    <ActivityTimeline 
                      opportunityId={opp.id} 
                      opportunityTitle={opp.title} 
                      accountName={opp.account_name} 
                      contacts={contacts.filter(c => c.account_id === opp.account_id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};