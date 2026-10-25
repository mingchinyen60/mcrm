import React from 'react';
import { 
  LayoutDashboard, 
  GitBranch, 
  Target,
  Building2, 
  Users, 
  Cpu, 
  PackageCheck,
  Server
} from 'lucide-react';
import { NavTab } from '../types';

export type { NavTab };

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeSamplesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, activeSamplesCount = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Design-Win Pipeline', icon: GitBranch },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'accounts', label: 'Accounts & OEMs', icon: Building2 },
    { id: 'contacts', label: 'Contacts & Engineers', icon: Users },
    { id: 'specs', label: 'Technical Specs', icon: Cpu },
    { id: 'samples', label: 'Sample Tracker', icon: PackageCheck, badge: activeSamplesCount > 0 ? activeSamplesCount : undefined },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-3 mb-2">
            CRM Modules
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-800 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* NAS Operational Status Box */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Container Status</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>FastAPI:</span>
            <span className="text-emerald-400 font-medium">Active (8000)</span>
          </div>
          <div className="flex justify-between">
            <span>PostgreSQL:</span>
            <span className="text-emerald-400 font-medium">Port 5432</span>
          </div>
          <div className="flex justify-between">
            <span>Volume:</span>
            <span className="text-slate-300 font-mono">/docker/crm/data</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
