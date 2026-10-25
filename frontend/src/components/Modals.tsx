import React, { useState, useEffect } from 'react';
import { X, Calendar, Activity as ActivityIcon, Info, Users, Briefcase } from 'lucide-react';
import { 
  Account, Contact, TechnicalSpec, Opportunity, SampleRequest, OpportunityStage, SampleStatus, Activity 
} from '../types';
import { ActivityTimeline } from './ActivityTimeline';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40">
        <h3 className="font-bold text-white text-base">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 max-h-[calc(85vh-5rem)] overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

/* ------------------- Account Modal ------------------- */
export const AccountModal: React.FC<{
  initialData?: Account | null;
  onClose: () => void;
  onSave: (data: Partial<Account>) => Promise<void>;
}> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    type: 'OEM',
    industry: 'Telecommunications',
    tier: 'Tier 1',
    website: '',
    phone: '',
    email: '',
    address: '',
    region: 'North America',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper title={initialData ? "Edit Account" : "Add New Account / OEM"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Name *</label>
            <input
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Type</label>
            <select
              value={formData.type || 'OEM'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="OEM">OEM (Equipment Manufacturer)</option>
              <option value="ODM">ODM / Contract Manufacturer</option>
              <option value="Distributor">Distributor / Rep</option>
              <option value="R&D Partner">R&D / Research Lab</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Tier</label>
            <select
              value={formData.tier || 'Tier 1'}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Strategic">Strategic Global Account</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Industry</label>
            <input
              type="text"
              value={formData.industry || ''}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g. Telecommunications, AI Datacenter"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Region</label>
            <select
              value={formData.region || 'North America'}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="North America">North America</option>
              <option value="EMEA">EMEA (Europe/Middle East)</option>
              <option value="APAC">APAC (Asia-Pacific)</option>
              <option value="Domestic">Domestic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Headquarters</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Strategy & Notes</label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Saving...' : 'Save Account'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ------------------- Contact Modal ------------------- */
export const ContactModal: React.FC<{
  initialData?: Contact | null;
  accounts: Account[];
  onClose: () => void;
  onSave: (data: Partial<Contact>) => Promise<void>;
}> = ({ initialData, accounts, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    account_id: accounts[0]?.id || 0,
    first_name: '',
    last_name: '',
    title: '',
    role_category: 'Engineering Lead',
    email: '',
    phone: '',
    is_primary: false,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper title={initialData ? "Edit Contact" : "Add New Contact"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Associated Account *</label>
            <select
              required
              value={formData.account_id || ''}
              onChange={(e) => setFormData({ ...formData, account_id: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
            <input
              required
              type="text"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
            <input
              required
              type="text"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Lead RF Architect"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role Category</label>
            <select
              value={formData.role_category || 'Engineering Lead'}
              onChange={(e) => setFormData({ ...formData, role_category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Engineering Lead">Engineering Lead</option>
              <option value="Procurement">Procurement Buyer</option>
              <option value="Executive">Executive Decision Maker</option>
              <option value="FAE">FAE / Field Application</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary || false}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="is_primary" className="text-xs font-medium text-slate-300">
              Set as primary account contact
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ------------------- Opportunity Modal ------------------- */
export const OpportunityModal: React.FC<{
  initialData?: Opportunity | null;
  accounts: Account[];
  contacts: Contact[];
  techSpecs: TechnicalSpec[];
  onClose: () => void;
  onSave: (data: Partial<Opportunity>) => Promise<void>;
}> = ({ initialData, accounts, contacts, techSpecs, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activities'>('details');
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    project_code: '',
    account_id: accounts[0]?.id || 0,
    partner_account_id: undefined,
    primary_contact_id: contacts[0]?.id || undefined,
    tech_spec_id: techSpecs[0]?.id || undefined,
    stage: '1_lead',
    estimated_revenue: 100000,
    annual_volume_units: 10000,
    currency: 'USD',
    confidence_percentage: 25,
    target_mp_date: '2026-Q1',
    target_application: 'IEEE 1588 PTP',
    description: '',
    competitor_notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const accountContacts = contacts.filter(c => c.account_id === formData.account_id);
  const distributorAccounts = accounts.filter(a => ['Distributor', 'ODM', 'R&D Partner'].includes(a.type));

  return (
    <ModalWrapper title={initialData ? `Program: ${initialData.title}` : "New High-Tech Design Program"} onClose={onClose}>
      {initialData?.id && (
        <div className="flex border-b border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center space-x-2 py-2 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Program Specifications</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex items-center space-x-2 py-2 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'activities'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ActivityIcon className="w-3.5 h-3.5" />
            <span>Interaction History & Meeting Notes</span>
            {initialData.activities_count !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {initialData.activities_count}
              </span>
            )}
          </button>
        </div>
      )}

      {activeTab === 'activities' && initialData?.id ? (
        <ActivityTimeline
          opportunityId={initialData.id}
          opportunityTitle={initialData.title}
          accountName={initialData.account_name}
          contacts={contacts}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Opportunity Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Next-Gen 5G O-RAN DU Reference Clock"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Code</label>
              <input
                type="text"
                placeholder="e.g. PRJ-5G-DU-01"
                value={formData.project_code || ''}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Customer OEM *</label>
              <select
                required
                value={formData.account_id || ''}
                onChange={(e) => setFormData({ ...formData, account_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Partner / Distributor / Rep</label>
              <select
                value={formData.partner_account_id || ''}
                onChange={(e) => setFormData({ ...formData, partner_account_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Direct / No Channel Partner --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Engineering Contact</label>
              <select
                value={formData.primary_contact_id || ''}
                onChange={(e) => setFormData({ ...formData, primary_contact_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Contact --</option>
                {accountContacts.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.title || c.role_category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Design-Win Phase Stage</label>
              <select
                value={formData.stage || '1_lead'}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as OpportunityStage })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="1_lead">1. Lead / Ingestion</option>
                <option value="2_tech_discovery">2. Tech Discovery (RFP)</option>
                <option value="3_sample_evaluation">3. Sample Eval (EVT/DVT)</option>
                <option value="4_design_win">4. Design-Win (PVT BOM Lock)</option>
                <option value="5_mass_production">5. Mass Production (MP)</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Technical Spec / Part</label>
              <select
                value={formData.tech_spec_id || ''}
                onChange={(e) => setFormData({ ...formData, tech_spec_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Spec --</option>
                {techSpecs.map(s => (
                  <option key={s.id} value={s.id}>{s.part_number} ({s.nominal_frequency} - {s.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Program Value ($ USD)</label>
              <input
                type="number"
                value={formData.estimated_revenue || 0}
                onChange={(e) => setFormData({ ...formData, estimated_revenue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confidence Probability (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.confidence_percentage || 20}
                onChange={(e) => setFormData({ ...formData, confidence_percentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target MP Date (Quarter / Month)</label>
              <input
                type="text"
                placeholder="e.g. 2026-Q1"
                value={formData.target_mp_date || ''}
                onChange={(e) => setFormData({ ...formData, target_mp_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Application</label>
              <input
                type="text"
                placeholder="e.g. IEEE 1588 PTP, 5G Baseband"
                value={formData.target_application || ''}
                onChange={(e) => setFormData({ ...formData, target_application: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Description & Scope</label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competitor & Socket Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Incumbent competitor part, socket footprint differences"
                value={formData.competitor_notes || ''}
                onChange={(e) => setFormData({ ...formData, competitor_notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
            >
              {submitting ? 'Saving...' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
};

/* ------------------- Tech Spec Modal ------------------- */
export const TechSpecModal: React.FC<{
  initialData?: TechnicalSpec | null;
  onClose: () => void;
  onSave: (data: Partial<TechnicalSpec>) => Promise<void>;
}> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<TechnicalSpec>>({
    part_number: '',
    category: 'OCXO',
    nominal_frequency: '10.000 MHz',
    frequency_stability: '±0.1 ppb',
    package_type: 'HC40',
    supply_voltage: '3.3V',
    output_logic: 'CMOS',
    operating_temp_range: '-40°C to +85°C',
    target_application: 'IEEE 1588 PTP',
    jitter_spec: '< 50 fs RMS',
    phase_noise_10hz: -115.0,
    phase_noise_100hz: -140.0,
    phase_noise_1khz: -158.0,
    phase_noise_10khz: -165.0,
    phase_noise_100khz: -168.0,
    phase_noise_1mhz: -170.0,
    description: '',
    datasheet_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper title={initialData ? "Edit Technical Specification" : "Add New Frequency Component Spec"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Part Number *</label>
            <input
              required
              type="text"
              placeholder="e.g. OCXO-10M-HC40-LP"
              value={formData.part_number || ''}
              onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={formData.category || 'OCXO'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="OCXO">OCXO (Oven Controlled)</option>
              <option value="TCXO">TCXO (Temp Compensated)</option>
              <option value="CSAC / Atomic">CSAC / Atomic Clock</option>
              <option value="VCXO">VCXO (Voltage Controlled)</option>
              <option value="Crystal Resonator">Crystal Resonator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal Frequency *</label>
            <input
              required
              type="text"
              placeholder="e.g. 10.000 MHz"
              value={formData.nominal_frequency || ''}
              onChange={(e) => setFormData({ ...formData, nominal_frequency: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Frequency Stability *</label>
            <input
              required
              type="text"
              placeholder="e.g. ±0.1 ppb"
              value={formData.frequency_stability || ''}
              onChange={(e) => setFormData({ ...formData, frequency_stability: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Package Type</label>
            <input
              type="text"
              placeholder="e.g. HC40, CSAC, SMD 7050"
              value={formData.package_type || ''}
              onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Supply Voltage</label>
            <input
              type="text"
              placeholder="e.g. 3.3V"
              value={formData.supply_voltage || ''}
              onChange={(e) => setFormData({ ...formData, supply_voltage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Output Logic</label>
            <input
              type="text"
              placeholder="e.g. CMOS, LVPECL, Sine"
              value={formData.output_logic || ''}
              onChange={(e) => setFormData({ ...formData, output_logic: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Jitter Spec</label>
            <input
              type="text"
              placeholder="e.g. < 35 fs RMS"
              value={formData.jitter_spec || ''}
              onChange={(e) => setFormData({ ...formData, jitter_spec: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phase Noise Profile Section */}
          <div className="col-span-3 pt-2 border-t border-slate-800">
            <span className="block text-xs font-semibold text-slate-300 mb-2">Phase Noise Profile (dBc/Hz)</span>
            <div className="grid grid-cols-6 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 10Hz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_10hz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_10hz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 100Hz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_100hz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_100hz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 1kHz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_1khz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_1khz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 10kHz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_10khz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_10khz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 100kHz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_100khz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_100khz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">@ 1MHz</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.phase_noise_1mhz ?? ''}
                  onChange={(e) => setFormData({ ...formData, phase_noise_1mhz: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Application & Datasheet URL</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="e.g. IEEE 1588 PTP Grandmaster"
                value={formData.target_application || ''}
                onChange={(e) => setFormData({ ...formData, target_application: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="https://datasheet-link.pdf"
                value={formData.datasheet_url || ''}
                onChange={(e) => setFormData({ ...formData, datasheet_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Saving...' : 'Save Spec'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ------------------- Sample Modal ------------------- */
export const SampleModal: React.FC<{
  initialData?: SampleRequest | null;
  opportunities: Opportunity[];
  techSpecs: TechnicalSpec[];
  onClose: () => void;
  onSave: (data: Partial<SampleRequest>) => Promise<void>;
}> = ({ initialData, opportunities, techSpecs, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<SampleRequest>>({
    opportunity_id: opportunities[0]?.id || 0,
    tech_spec_id: techSpecs[0]?.id || undefined,
    sample_batch_code: `SMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    quantity: 5,
    status: 'requested',
    carrier: 'DHL Express',
    tracking_number: '',
    dispatch_date: new Date().toISOString().split('T')[0],
    test_phase: 'EVT',
    lab_test_results: '',
    customer_feedback: '',
    next_action: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper title={initialData ? "Edit Sample Evaluation" : "New Sample Request & Evaluation"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Design Opportunity *</label>
            <select
              required
              value={formData.opportunity_id || ''}
              onChange={(e) => setFormData({ ...formData, opportunity_id: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              {opportunities.map(o => (
                <option key={o.id} value={o.id}>{o.title} ({o.account_name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sample Batch Code *</label>
            <input
              required
              type="text"
              value={formData.sample_batch_code || ''}
              onChange={(e) => setFormData({ ...formData, sample_batch_code: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Test Phase</label>
            <select
              value={formData.test_phase || 'EVT'}
              onChange={(e) => setFormData({ ...formData, test_phase: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="EVT">EVT (Engineering Verification)</option>
              <option value="DVT">DVT (Design Verification)</option>
              <option value="PVT">PVT (Production Verification)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity (pcs)</label>
            <input
              type="number"
              min={1}
              value={formData.quantity || 5}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
            <select
              value={formData.status || 'requested'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as SampleStatus })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="requested">Requested</option>
              <option value="preparing">In Lab Prep</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="testing">Customer Testing</option>
              <option value="passed">DVT/EVT Passed</option>
              <option value="revision_needed">Revision Needed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Carrier</label>
            <input
              type="text"
              placeholder="e.g. DHL Express, FedEx"
              value={formData.carrier || ''}
              onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tracking Number</label>
            <input
              type="text"
              placeholder="e.g. DHL-9842187391"
              value={formData.tracking_number || ''}
              onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Lab Test Results & Validation Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Allan deviation test, phase noise floor measured at -145 dBc/Hz"
              value={formData.lab_test_results || ''}
              onChange={(e) => setFormData({ ...formData, lab_test_results: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Engineer Feedback</label>
            <textarea
              rows={2}
              placeholder="Feedback from customer hardware team"
              value={formData.customer_feedback || ''}
              onChange={(e) => setFormData({ ...formData, customer_feedback: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Saving...' : 'Save Sample'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
