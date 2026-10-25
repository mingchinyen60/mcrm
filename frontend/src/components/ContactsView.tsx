import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Star, 
  Edit2, 
  Trash2, 
  Briefcase,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { Contact, Account } from '../types';
import { api } from '../services/api';

interface ContactsViewProps {
  contacts: Contact[];
  accounts: Account[];
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onEditContact: (c: Contact) => void;
  onDeleteContact: (id: number) => Promise<void>;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  accounts,
  onOpenCreateModal,
  onOpenImportModal,
  onEditContact,
  onDeleteContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filtered = contacts.filter(c => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.account_name && c.account_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || c.role_category === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = ['Engineering Lead', 'Procurement', 'Executive', 'FAE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Contacts & Engineering Leads</h2>
          <p className="text-sm text-slate-400">
            Directory of key customer hardware architects, RF engineers, sourcing buyers, and decision makers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
            <span>New Contact</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search contacts, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Contacts Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Account / Company</th>
              <th className="py-3.5 px-4">Role & Specialization</th>
              <th className="py-3.5 px-4">Direct Contact</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500 text-sm">
                  No contacts found matching your query.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition group">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-700">
                        {c.first_name[0]}{c.last_name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition flex items-center space-x-2">
                          <span>{c.first_name} {c.last_name}</span>
                          {c.is_primary && (
                            <span className="p-0.5 rounded bg-amber-500/10 text-amber-400" title="Primary Key Contact">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{c.title || 'Technical Specialist'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-medium">{c.account_name || 'Unassigned'}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      c.role_category === 'Engineering Lead' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      c.role_category === 'Procurement' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      c.role_category === 'Executive' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {c.role_category}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1 text-xs">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center space-x-1.5 text-slate-300 hover:text-blue-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.email}</span>
                        </a>
                      )}
                      {c.phone && (
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditContact(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit Contact"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete contact ${c.first_name} ${c.last_name}?`)) {
                            onDeleteContact(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
