import React from 'react';
import { Server, Activity, ShieldCheck, Database, HardDrive } from 'lucide-react';

interface NavbarProps {
  nasIp?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ nasIp = "192.168.1.224" }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Platform */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white">Precision CRM</h1>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Synology DSM
            </span>
          </div>
          <p className="text-xs text-slate-400">Frequency Control & Timing Design Wins</p>
        </div>
      </div>

      {/* NAS Host & Infrastructure Badges */}
      <div className="flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>Host: <strong className="text-white font-mono">{nasIp}</strong></span>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Hyper Backup Ready</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>LAN Security Zone</span>
        </div>
      </div>
    </header>
  );
};
