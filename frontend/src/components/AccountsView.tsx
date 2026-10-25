import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  Users, 
  GitBranch, 
  Upload, 
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Calendar,
  Share2,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { Account, Opportunity } from '../types';
import { api } from '../services/api';

interface AccountsViewProps {
  accounts: Account[];
  opportunities?: Opportunity[];
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onEditAccount: (acc: Account) => void;
  onDeleteAccount: (id: number) => Promise<void>;
  onSelectOpportunity?: (opp: Opportunity) => void;
  onAddOpportunityForAccount?: (accountId: number) => void;
}

const STAGE_BADGES: Record<string, { label: string; color: string; isOpen: boolean }> = {
  '1_lead': { label: '1. Lead', color: 'bg-slate-700 text-slate-200 border-slate-600', isOpen: true },
  '2_tech_discovery': { label: '2. Tech Discovery', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', isOpen: true },
  '3_sample_evaluation': { label: '3. Sample Eval', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', isOpen: true },
  '4_design_win': { label: '4. Design Win', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', isOpen: true },
  '5_mass_production': { label: '5. Mass Production', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', isOpen: true },
  'closed_lost': { label: 'Closed / Lost', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', isOpen: false },
};

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  opportunities = [],
  onOpenCreateModal,
  onOpenImportModal,
  onEditAccount,
  onDeleteAccount,
  onSelectOpportunity,
  onAddOpportunityForAccount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  
  // Expanded account accordion state
  const [expandedAccountId, setExpandedAccountId] = useState<number | null>(null);
  // Status filter state per account: open, close, or both
  const [statusFilter, setStatusFilter] = useState<{ showOpen: boolean; showClosed: boolean }>({
    showOpen: true,
    showClosed: true
  });

  const filtered = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.notes && acc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || acc.industry === selectedIndustry;
    const matchesTier = selectedTier === 'all' || acc.tier === selectedTier;
    return matchesSearch && matchesIndustry && matchesTier;
  });

  const industries = Array.from(new Set(accounts.map(a => a.industry).filter(Boolean)));
  const tiers = ['Strategic', 'Tier 1', 'Tier 2'];

  const toggleExpand = (accountId: number) => {
    setExpandedAccountId(prev => prev === accountId ? null : accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Accounts & Global OEMs</h2>
          <p className="text-sm text-slate-400">
            Manage Tier-1 telecommunication equipment manufacturers, ODMs, aerospace contractors, and distributor networks.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={api.getExportUrl('accounts', 'excel')}
            download
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </a>
          <button
            onClick={onOpenImportModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Batch Upload</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Account</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search accounts, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Tiers</option>
            {tiers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4">Classification</th>
              <th className="py-3.5 px-4">Region & Location</th>
              <th className="py-3.5 px-4 text-center">Contacts</th>
              <th className="py-3.5 px-4 text-center">Opportunities</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                  No accounts found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((acc) => {
                const isExpanded = expandedAccountId === acc.id;
                // Filter opportunities for this account
                const accountOpps = opportunities.filter(o => o.account_id === acc.id);
                const openCount = accountOpps.filter(o => o.stage !== 'closed_lost').length;
                const closedCount = accountOpps.filter(o => o.stage === 'closed_lost').length;

                const displayedOpps = accountOpps.filter(o => {
                  const isOpen = o.stage !== 'closed_lost';
                  if (isOpen && statusFilter.showOpen) return true;
                  if (!isOpen && statusFilter.showClosed) return true;
                  return false;
                });

                return (
                  <React.Fragment key={acc.id}>
                    <tr className={`hover:bg-slate-800/40 transition group ${isExpanded ? 'bg-slate-800/30' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                            {acc.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-blue-400 transition flex items-center space-x-2">
                              <span>{acc.name}</span>
                              {acc.website && (
                                <a 
                                  href={acc.website} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-slate-500 hover:text-slate-300"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">{acc.type}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            acc.tier === 'Strategic' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            acc.tier === 'Tier 1' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {acc.tier}
                          </span>
                          <div className="text-xs text-slate-400">{acc.industry}</div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-300 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{acc.address || acc.region}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 pl-4">{acc.region}</div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{acc.contacts_count ?? 0}</span>
                        </span>
                      </td>

                      {/* Expand Opportunities Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(acc.id)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            isExpanded 
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                              : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                          title="Expand related opportunities"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Opps ({accountOpps.length})</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEditAccount(acc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Edit Account"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${acc.name}? All linked contacts and opportunities will be removed.`)) {
                                onDeleteAccount(acc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Opportunities Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-950/80">
                        <td colSpan={6} className="p-4 border-y border-blue-500/30">
                          <div className="space-y-4">
                            {/* Accordion Controls Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                  Programs for {acc.name}
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({displayedOpps.length} of {accountOpps.length} displayed)
                                </span>
                              </div>

                              {/* Open / Closed Checkbox Filters */}
                              <div className="flex items-center space-x-4 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                                <span className="text-slate-400 font-medium">Status Filter:</span>
                                
                                <label className="flex items-center space-x-1.5 text-slate-200 cursor-pointer hover:text-white">
                                  <input
                                    type="checkbox"
                                    checked={statusFilter.showOpen}
                                    onChange={(e) => setStatusFilter(prev => ({ ...prev, showOpen: e.target.checked }))}
                                    className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-800"
                                  />
                                  <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    <span>Open ({openCount})</span>
                                  </span>
                                </label>

                                <label className="flex items-center space-x-1.5 text-slate-200 cursor-pointer hover:text-white">
                                  <input
                                    type="checkbox"
                                    checked={statusFilter.showClosed}
                                    onChange={(e) => setStatusFilter(prev => ({ ...prev, showClosed: e.target.checked }))}
                                    className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-800"
                                  />
                                  <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                    <span>Closed / Lost ({closedCount})</span>
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Opportunities List Table */}
                            {displayedOpps.length === 0 ? (
                              <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                                No opportunities match the selected status filter (Open / Closed).
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayedOpps.map(opp => {
                                  const stageInfo = STAGE_BADGES[opp.stage] || { label: opp.stage, color: 'bg-slate-800 text-slate-300', isOpen: true };

                                  return (
                                    <div 
                                      key={opp.id}
                                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                          <div className="flex items-center space-x-2">
                                            {opp.project_code && (
                                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                {opp.project_code}
                                              </span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${stageInfo.color}`}>
                                              {stageInfo.label}
                                            </span>
                                          </div>
                                          <h4 className="text-sm font-semibold text-white leading-tight">
                                            {opp.title}
                                          </h4>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                          <div className="text-sm font-bold text-emerald-400 font-mono">
                                            ${opp.estimated_revenue.toLocaleString()}
                                          </div>
                                          <div className="text-[10px] text-slate-400 font-mono">
                                            {opp.annual_volume_units.toLocaleString()} pcs/yr
                                          </div>
                                        </div>
                                      </div>

                                      {/* Channel Partner & Meta info */}
                                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                                        <div className="flex items-center space-x-3">
                                          {opp.partner_account_name ? (
                                            <span className="flex items-center space-x-1 text-amber-300">
                                              <Share2 className="w-3 h-3 text-amber-400" />
                                              <span>Disti: {opp.partner_account_name}</span>
                                            </span>
                                          ) : (
                                            <span className="text-slate-500">Direct Route</span>
                                          )}

                                          {opp.target_mp_date && (
                                            <span className="flex items-center space-x-1 font-mono text-slate-400">
                                              <Calendar className="w-3 h-3 text-slate-500" />
                                              <span>MP: {opp.target_mp_date}</span>
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center space-x-1 text-[11px] text-blue-400 font-medium">
                                          <MessageSquare className="w-3 h-3" />
                                          <span>{opp.activities_count || 0} activities</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};