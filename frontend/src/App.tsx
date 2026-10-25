import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KanbanPipeline } from './components/KanbanPipeline';
import { OpportunitiesView } from './components/OpportunitiesView';
import { AccountsView } from './components/AccountsView';
import { ContactsView } from './components/ContactsView';
import { TechSpecsView } from './components/TechSpecsView';
import { SamplesView } from './components/SamplesView';
import { 
  AccountModal, ContactModal, OpportunityModal, TechSpecModal, SampleModal 
} from './components/Modals';
import { BatchImportModal } from './components/BatchImportModal';
import { api } from './services/api';
import { 
  Account, Contact, TechnicalSpec, Opportunity, SampleRequest, DashboardMetrics, OpportunityStage, SampleStatus 
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [techSpecs, setTechSpecs] = useState<TechnicalSpec[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<TechnicalSpec | null>(null);

  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<SampleRequest | null>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importEntityType, setImportEntityType] = useState<'accounts' | 'contacts' | 'tech-specs'>('accounts');
  const [importEntityLabel, setImportEntityLabel] = useState('Accounts');

  const openImport = (type: 'accounts' | 'contacts' | 'tech-specs', label: string) => {
    setImportEntityType(type);
    setImportEntityLabel(label);
    setImportModalOpen(true);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [m, accs, cts, specs, opps, smpls] = await Promise.all([
        api.getMetrics().catch(() => null),
        api.getAccounts().catch(() => []),
        api.getContacts().catch(() => []),
        api.getTechSpecs().catch(() => []),
        api.getOpportunities().catch(() => []),
        api.getSamples().catch(() => [])
      ]);
      setMetrics(m);
      setAccounts(accs);
      setContacts(cts);
      setTechSpecs(specs);
      setOpportunities(opps);
      setSamples(smpls);
    } catch (err: any) {
      console.error("Error loading CRM data:", err);
      setError(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Opportunity Handlers
  const handleStageChange = async (id: number, stage: OpportunityStage) => {
    try {
      await api.patchOpportunityStage(id, stage);
      await loadAllData();
    } catch (err: any) {
      alert(`Failed to update stage: ${err.message}`);
    }
  };

  const handleSaveOpportunity = async (data: Partial<Opportunity>) => {
    if (editingOpp) {
      await api.updateOpportunity(editingOpp.id, data);
    } else {
      await api.createOpportunity(data);
    }
    await loadAllData();
  };

  // Account Handlers
  const handleSaveAccount = async (data: Partial<Account>) => {
    if (editingAccount) {
      await api.updateAccount(editingAccount.id, data);
    } else {
      await api.createAccount(data);
    }
    await loadAllData();
  };

  const handleDeleteAccount = async (id: number) => {
    await api.deleteAccount(id);
    await loadAllData();
  };

  // Contact Handlers
  const handleSaveContact = async (data: Partial<Contact>) => {
    if (editingContact) {
      await api.updateContact(editingContact.id, data);
    } else {
      await api.createContact(data);
    }
    await loadAllData();
  };

  const handleDeleteContact = async (id: number) => {
    await api.deleteContact(id);
    await loadAllData();
  };

  // Tech Spec Handlers
  const handleSaveSpec = async (data: Partial<TechnicalSpec>) => {
    if (editingSpec) {
      await api.updateTechSpec(editingSpec.id, data);
    } else {
      await api.createTechSpec(data);
    }
    await loadAllData();
  };

  const handleDeleteSpec = async (id: number) => {
    await api.deleteTechSpec(id);
    await loadAllData();
  };

  // Sample Handlers
  const handleSaveSample = async (data: Partial<SampleRequest>) => {
    if (editingSample) {
      await api.updateSample(editingSample.id, data);
    } else {
      await api.createSample(data);
    }
    await loadAllData();
  };

  const handleUpdateSampleStatus = async (id: number, status: SampleStatus) => {
    await api.updateSample(id, { status });
    await loadAllData();
  };

  const handleDeleteSample = async (id: number) => {
    await api.deleteSample(id);
    await loadAllData();
  };

  const activeSamples = samples.filter(s => !['passed', 'rejected'].includes(s.status)).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar nasIp="192.168.1.224" />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab} 
          activeSamplesCount={activeSamples}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/95">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
              <div>
                <strong>Connection Error:</strong> {error}
              </div>
              <button 
                onClick={loadAllData}
                className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-white text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {currentTab === 'dashboard' && (
            <DashboardView 
              metrics={metrics} 
              loading={loading} 
              onNavigate={(tab) => setCurrentTab(tab)} 
            />
          )}

          {currentTab === 'pipeline' && (
            <KanbanPipeline
              opportunities={opportunities}
              accounts={accounts}
              techSpecs={techSpecs}
              onStageChange={handleStageChange}
              onOpenCreateModal={() => {
                setEditingOpp(null);
                setOppModalOpen(true);
              }}
              onEditOpportunity={(opp) => {
                setEditingOpp(opp);
                setOppModalOpen(true);
              }}
            />
          )}

          {currentTab === 'opportunities' && (
            <OpportunitiesView
              opportunities={opportunities}
              accounts={accounts}
              techSpecs={techSpecs}
              contacts={contacts}
              onRefresh={loadAllData}
              onAddOpportunity={() => {
                setEditingOpp(null);
                setOppModalOpen(true);
              }}
              onEditOpportunity={(opp) => {
                setEditingOpp(opp);
                setOppModalOpen(true);
              }}
              onDeleteOpportunity={async (id) => {
                if (confirm("Are you sure you want to delete this opportunity?")) {
                  await api.deleteOpportunity(id);
                  await loadAllData();
                }
              }}
            />
          )}

          {currentTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              opportunities={opportunities}
              onOpenCreateModal={() => {
                setEditingAccount(null);
                setAccountModalOpen(true);
              }}
              onOpenImportModal={() => openImport('accounts', 'Accounts')}
              onEditAccount={(acc) => {
                setEditingAccount(acc);
                setAccountModalOpen(true);
              }}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsView
              contacts={contacts}
              accounts={accounts}
              onOpenCreateModal={() => {
                setEditingContact(null);
                setContactModalOpen(true);
              }}
              onOpenImportModal={() => openImport('contacts', 'Contacts')}
              onEditContact={(c) => {
                setEditingContact(c);
                setContactModalOpen(true);
              }}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {currentTab === 'specs' && (
            <TechSpecsView
              specs={techSpecs}
              onOpenCreateModal={() => {
                setEditingSpec(null);
                setSpecModalOpen(true);
              }}
              onOpenImportModal={() => openImport('tech-specs', 'Technical Specifications')}
              onEditSpec={(spec) => {
                setEditingSpec(spec);
                setSpecModalOpen(true);
              }}
              onDeleteSpec={handleDeleteSpec}
            />
          )}

          {currentTab === 'samples' && (
            <SamplesView
              samples={samples}
              opportunities={opportunities}
              techSpecs={techSpecs}
              onOpenCreateModal={() => {
                setEditingSample(null);
                setSampleModalOpen(true);
              }}
              onEditSample={(s) => {
                setEditingSample(s);
                setSampleModalOpen(true);
              }}
              onUpdateStatus={handleUpdateSampleStatus}
              onDeleteSample={handleDeleteSample}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {accountModalOpen && (
        <AccountModal
          initialData={editingAccount}
          onClose={() => setAccountModalOpen(false)}
          onSave={handleSaveAccount}
        />
      )}

      {contactModalOpen && (
        <ContactModal
          initialData={editingContact}
          accounts={accounts}
          onClose={() => setContactModalOpen(false)}
          onSave={handleSaveContact}
        />
      )}

      {oppModalOpen && (
        <OpportunityModal
          initialData={editingOpp}
          accounts={accounts}
          contacts={contacts}
          techSpecs={techSpecs}
          onClose={() => setOppModalOpen(false)}
          onSave={handleSaveOpportunity}
        />
      )}

      {specModalOpen && (
        <TechSpecModal
          initialData={editingSpec}
          onClose={() => setSpecModalOpen(false)}
          onSave={handleSaveSpec}
        />
      )}

      {sampleModalOpen && (
        <SampleModal
          initialData={editingSample}
          opportunities={opportunities}
          techSpecs={techSpecs}
          onClose={() => setSampleModalOpen(false)}
          onSave={handleSaveSample}
        />
      )}

      {importModalOpen && (
        <BatchImportModal
          entityType={importEntityType}
          entityLabel={importEntityLabel}
          onClose={() => setImportModalOpen(false)}
          onSuccess={loadAllData}
        />
      )}
    </div>
  );
};

export default App;
