import { 
  Account, Contact, TechnicalSpec, Opportunity, SampleRequest, DashboardMetrics, OpportunityStage, SampleStatus, Activity 
} from '../types';

const API_BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let msg = `Request failed (${res.status})`;
    try {
      const parsed = JSON.parse(errorText);
      msg = parsed.detail || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  // Dashboard
  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    return handleResponse<DashboardMetrics>(res);
  },

  // Accounts
  async getAccounts(params?: { search?: string; industry?: string; tier?: string }): Promise<Account[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.industry) searchParams.append('industry', params.industry);
    if (params?.tier) searchParams.append('tier', params.tier);
    const res = await fetch(`${API_BASE}/accounts?${searchParams.toString()}`);
    return handleResponse<Account[]>(res);
  },

  async createAccount(data: Partial<Account>): Promise<Account> {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Account>(res);
  },

  async updateAccount(id: number, data: Partial<Account>): Promise<Account> {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Account>(res);
  },

  async deleteAccount(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/accounts/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Contacts
  async getContacts(params?: { search?: string; account_id?: number }): Promise<Contact[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.account_id) searchParams.append('account_id', params.account_id.toString());
    const res = await fetch(`${API_BASE}/contacts?${searchParams.toString()}`);
    return handleResponse<Contact[]>(res);
  },

  async createContact(data: Partial<Contact>): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Contact>(res);
  },

  async updateContact(id: number, data: Partial<Contact>): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Contact>(res);
  },

  async deleteContact(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Technical Specs
  async getTechSpecs(params?: { search?: string; category?: string; package_type?: string }): Promise<TechnicalSpec[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.package_type) searchParams.append('package_type', params.package_type);
    const res = await fetch(`${API_BASE}/tech-specs?${searchParams.toString()}`);
    return handleResponse<TechnicalSpec[]>(res);
  },

  async createTechSpec(data: Partial<TechnicalSpec>): Promise<TechnicalSpec> {
    const res = await fetch(`${API_BASE}/tech-specs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<TechnicalSpec>(res);
  },

  async updateTechSpec(id: number, data: Partial<TechnicalSpec>): Promise<TechnicalSpec> {
    const res = await fetch(`${API_BASE}/tech-specs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<TechnicalSpec>(res);
  },

  async deleteTechSpec(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tech-specs/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Opportunities
  async getOpportunities(params?: { search?: string; stage?: OpportunityStage; account_id?: number }): Promise<Opportunity[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.stage) searchParams.append('stage', params.stage);
    if (params?.account_id) searchParams.append('account_id', params.account_id.toString());
    const res = await fetch(`${API_BASE}/opportunities?${searchParams.toString()}`);
    return handleResponse<Opportunity[]>(res);
  },

  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Opportunity>(res);
  },

  async updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Opportunity>(res);
  },

  async patchOpportunityStage(id: number, stage: OpportunityStage): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities/${id}/stage?stage=${stage}`, {
      method: 'PATCH'
    });
    return handleResponse<Opportunity>(res);
  },

  async deleteOpportunity(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/opportunities/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Samples
  async getSamples(params?: { search?: string; status?: SampleStatus; test_phase?: string }): Promise<SampleRequest[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.test_phase) searchParams.append('test_phase', params.test_phase);
    const res = await fetch(`${API_BASE}/samples?${searchParams.toString()}`);
    return handleResponse<SampleRequest[]>(res);
  },

  async createSample(data: Partial<SampleRequest>): Promise<SampleRequest> {
    const res = await fetch(`${API_BASE}/samples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<SampleRequest>(res);
  },

  async updateSample(id: number, data: Partial<SampleRequest>): Promise<SampleRequest> {
    const res = await fetch(`${API_BASE}/samples/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<SampleRequest>(res);
  },

  async deleteSample(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/samples/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Activities & Interaction History
  async getActivities(opportunityId?: number): Promise<Activity[]> {
    const url = opportunityId ? `${API_BASE}/activities?opportunity_id=${opportunityId}` : `${API_BASE}/activities`;
    const res = await fetch(url);
    return handleResponse<Activity[]>(res);
  },

  async createActivity(data: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Activity>(res);
  },

  async deleteActivity(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/activities/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Activity Attachments
  async uploadActivityAttachment(activityId: number, file: File): Promise<Activity> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/activities/${activityId}/attachment`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<Activity>(res);
  },

  getActivityAttachmentUrl(activityId: number): string {
    return `${API_BASE}/activities/${activityId}/attachment`;
  },

  async deleteActivityAttachment(activityId: number): Promise<Activity> {
    const res = await fetch(`${API_BASE}/activities/${activityId}/attachment`, {
      method: 'DELETE'
    });
    return handleResponse<Activity>(res);
  },

  // Batch Imports
  async importData(entityType: 'accounts' | 'contacts' | 'tech-specs', file: File): Promise<{ success: boolean; created_count: number; total_rows: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/imports/${entityType}`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(res);
  },

  getTemplateUrl(entityType: 'accounts' | 'contacts' | 'tech_specs', format: 'csv' | 'excel' = 'csv'): string {
    return `${API_BASE}/imports/template/${entityType}?format=${format}`;
  },

  // Excel / CSV Exports
  getExportUrl(entityType: 'opportunities' | 'accounts' | 'tech-specs' | 'samples', format: 'excel' | 'csv' = 'excel'): string {
    return `${API_BASE}/exports/${entityType}?format=${format}`;
  }
};
