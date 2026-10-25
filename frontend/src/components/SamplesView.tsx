import React, { useState } from 'react';
import { 
  PackageCheck, 
  Plus, 
  Search, 
  Truck, 
  FlaskConical, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Edit2, 
  Trash2,
  Building2,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';
import { SampleRequest, Opportunity, TechnicalSpec, SampleStatus } from '../types';
import { api } from '../services/api';

interface SamplesViewProps {
  samples: SampleRequest[];
  opportunities: Opportunity[];
  techSpecs: TechnicalSpec[];
  onOpenCreateModal: () => void;
  onEditSample: (s: SampleRequest) => void;
  onUpdateStatus: (id: number, status: SampleStatus) => Promise<void>;
  onDeleteSample: (id: number) => Promise<void>;
}

const STATUS_CONFIG: Record<SampleStatus, { label: string; bg: string; text: string; border: string }> = {
  requested: { label: 'Requested', bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  preparing: { label: 'In Lab Prep', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  dispatched: { label: 'Dispatched', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  delivered: { label: 'Delivered', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  testing: { label: 'Customer Testing', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  passed: { label: 'DVT/EVT Passed', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  revision_needed: { label: 'Revision Needed', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  rejected: { label: 'Rejected', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

export const SamplesView: React.FC<SamplesViewProps> = ({
  samples,
  onOpenCreateModal,
  onEditSample,
  onUpdateStatus,
  onDeleteSample
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filtered = samples.filter(s => {
    const matchesSearch = s.sample_batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.account_name && s.account_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.part_number && s.part_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.tracking_number && s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    const matchesPhase = selectedPhase === 'all' || s.test_phase === selectedPhase;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const statuses: SampleStatus[] = [
    'requested', 'preparing', 'dispatched', 'delivered', 'testing', 'passed', 'revision_needed', 'rejected'
  ];

  const handleQuickStatus = async (id: number, status: SampleStatus) => {
    try {
      setUpdatingId(id);
      await onUpdateStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sample Evaluation & Lab Tracker</h2>
          <p className="text-sm text-slate-400">
            Monitor engineering samples sent for customer EVT/DVT bench testing, environmental chamber tests, and holdover verifications.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={api.getExportUrl('samples', 'excel')}
            download
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </a>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Sample Batch</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search batch code, tracking #, account, part..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Test Phases</option>
            <option value="EVT">EVT</option>
            <option value="DVT">DVT</option>
            <option value="PVT">PVT</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Samples Table / List */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Sample Batch</th>
              <th className="py-3.5 px-4">Opportunity & Customer</th>
              <th className="py-3.5 px-4">Component</th>
              <th className="py-3.5 px-4">Carrier & Logistics</th>
              <th className="py-3.5 px-4">Evaluation Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                  No sample evaluation records found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const statusStyle = STATUS_CONFIG[s.status] || STATUS_CONFIG.requested;
                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-white text-sm">{s.sample_batch_code}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {s.test_phase}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-medium">Qty: {s.quantity} pcs</div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5 max-w-[240px]">
                        <div className="font-semibold text-white truncate">{s.opportunity_title}</div>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{s.account_name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs font-bold">
                        {s.part_number || 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.carrier}</span>
                        </div>
                        {s.tracking_number && (
                          <div className="font-mono text-blue-400 text-[11px] truncate max-w-[150px]">
                            {s.tracking_number}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <select
                          disabled={updatingId === s.id}
                          value={s.status}
                          onChange={(e) => handleQuickStatus(s.id, e.target.value as SampleStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statuses.map(st => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {STATUS_CONFIG[st].label}
                            </option>
                          ))}
                        </select>
                        {s.customer_feedback && (
                          <div className="text-[11px] text-slate-400 italic line-clamp-1 max-w-[220px]" title={s.customer_feedback}>
                            "{s.customer_feedback}"
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditSample(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit Sample Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete sample batch ${s.sample_batch_code}?`)) {
                              onDeleteSample(s.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete Sample"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
