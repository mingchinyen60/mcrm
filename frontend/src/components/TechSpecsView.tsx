import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  Activity, 
  FileText, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  Radio,
  Sliders,
  Sparkles,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { TechnicalSpec } from '../types';
import { api } from '../services/api';

interface TechSpecsViewProps {
  specs: TechnicalSpec[];
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onEditSpec: (spec: TechnicalSpec) => void;
  onDeleteSpec: (id: number) => Promise<void>;
}

export const TechSpecsView: React.FC<TechSpecsViewProps> = ({
  specs,
  onOpenCreateModal,
  onOpenImportModal,
  onEditSpec,
  onDeleteSpec
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');

  const filtered = specs.filter(s => {
    const matchesSearch = s.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nominal_frequency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.target_application && s.target_application.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesPackage = selectedPackage === 'all' || s.package_type === selectedPackage;
    return matchesSearch && matchesCategory && matchesPackage;
  });

  const categories = ['OCXO', 'TCXO', 'CSAC / Atomic', 'VCXO', 'Crystal Resonator'];
  const packages = Array.from(new Set(specs.map(s => s.package_type).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Technical Parameters Tracker</h2>
          <p className="text-sm text-slate-400">
            Specialized catalog of high-precision oscillators, phase noise profiles, jitter specs, and target applications.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={api.getExportUrl('tech-specs', 'excel')}
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
            <span>New Specification</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search part number, frequency (10MHz), app..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Oscillator Types</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Packages</option>
            {packages.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Specialized Spec Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-xl">
            No technical specifications match your search criteria.
          </div>
        ) : (
          filtered.map((spec) => (
            <div 
              key={spec.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 transition space-y-4"
            >
              {/* Part Title and Badges */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-white">{spec.part_number}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {spec.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">{spec.description}</div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditSpec(spec)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Spec"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete specification ${spec.part_number}?`)) {
                        onDeleteSpec(spec.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Spec"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Key Frequency Specs Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Nominal Freq</div>
                  <div className="font-bold text-emerald-400 font-mono text-sm">{spec.nominal_frequency}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Stability</div>
                  <div className="font-bold text-amber-400 font-mono text-sm">{spec.frequency_stability}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Package</div>
                  <div className="font-semibold text-slate-200">{spec.package_type}</div>
                </div>
              </div>

              {/* Detailed Phase Noise Profile Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Phase Noise Profile (dBc/Hz)</span>
                  </span>
                  {spec.jitter_spec && (
                    <span className="text-purple-400 font-mono font-medium lowercase">
                      {spec.jitter_spec}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">10Hz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_10hz ? `${spec.phase_noise_10hz}` : '-'}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">100Hz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_100hz ? `${spec.phase_noise_100hz}` : '-'}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">1kHz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_1khz ? `${spec.phase_noise_1khz}` : '-'}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">10kHz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_10khz ? `${spec.phase_noise_10khz}` : '-'}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">100kHz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_100khz ? `${spec.phase_noise_100khz}` : '-'}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400">1MHz</div>
                    <div className="font-bold text-slate-200">{spec.phase_noise_1mhz ? `${spec.phase_noise_1mhz}` : '-'}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Target Application */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {spec.target_application}
                  </span>
                  <span>•</span>
                  <span>{spec.output_logic} ({spec.supply_voltage})</span>
                </div>

                {spec.datasheet_url && (
                  <a
                    href={spec.datasheet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Datasheet</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
