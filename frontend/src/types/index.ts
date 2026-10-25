export type NavTab = 'dashboard' | 'pipeline' | 'opportunities' | 'accounts' | 'contacts' | 'specs' | 'samples';

export interface Account {
  id: number;
  name: string;
  type: string;
  industry: string;
  tier: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  region: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  contacts_count?: number;
  opportunities_count?: number;
}

export interface Contact {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  title?: string;
  role_category: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  account_name?: string;
}

export interface TechnicalSpec {
  id: number;
  part_number: string;
  category: string;
  description?: string;
  nominal_frequency: string;
  frequency_stability: string;
  phase_noise_10hz?: number;
  phase_noise_100hz?: number;
  phase_noise_1khz?: number;
  phase_noise_10khz?: number;
  phase_noise_100khz?: number;
  phase_noise_1mhz?: number;
  jitter_spec?: string;
  supply_voltage?: string;
  output_logic?: string;
  package_type?: string;
  operating_temp_range?: string;
  target_application?: string;
  datasheet_url?: string;
  created_at: string;
  updated_at: string;
}

export type OpportunityStage = 
  | '1_lead'
  | '2_tech_discovery'
  | '3_sample_evaluation'
  | '4_design_win'
  | '5_mass_production'
  | 'closed_lost';

export interface Opportunity {
  id: number;
  title: string;
  project_code?: string;
  account_id: number;
  partner_account_id?: number;
  primary_contact_id?: number;
  tech_spec_id?: number;
  stage: OpportunityStage;
  estimated_revenue: number;
  annual_volume_units: number;
  currency: string;
  confidence_percentage: number;
  target_mp_date?: string;
  target_application: string;
  description?: string;
  competitor_notes?: string;
  created_at: string;
  updated_at: string;
  account_name?: string;
  partner_account_name?: string;
  contact_name?: string;
  part_number?: string;
  active_samples_count?: number;
  activities_count?: number;
  latest_activity?: string;
}

export interface Activity {
  id: number;
  opportunity_id: number;
  account_id?: number;
  contact_id?: number;
  activity_type: string;
  activity_date: string;
  title: string;
  attendees?: string;
  summary: string;
  action_items?: string;
  follow_up_date?: string;
  attachment_path?: string;
  attachment_name?: string;
  attachment_size?: number;
  created_at: string;
  updated_at: string;
  contact_name?: string;
  account_name?: string;
}

export type SampleStatus = 
  | 'requested'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'testing'
  | 'passed'
  | 'revision_needed'
  | 'rejected';

export interface SampleRequest {
  id: number;
  opportunity_id: number;
  tech_spec_id?: number;
  sample_batch_code: string;
  quantity: number;
  status: SampleStatus;
  carrier: string;
  tracking_number?: string;
  dispatch_date?: string;
  delivery_date?: string;
  test_phase: string;
  lab_test_results?: string;
  customer_feedback?: string;
  next_action?: string;
  created_at: string;
  updated_at: string;
  opportunity_title?: string;
  account_name?: string;
  part_number?: string;
}

export interface PipelineStageCount {
  stage: string;
  count: number;
  total_value: number;
}

export interface DashboardMetrics {
  total_accounts: number;
  total_opportunities: number;
  total_pipeline_value: number;
  total_weighted_value: number;
  design_wins_count: number;
  mass_production_count: number;
  active_samples_count: number;
  stage_breakdown: PipelineStageCount[];
  recent_opportunities: {
    id: number;
    title: string;
    account_name: string;
    stage: OpportunityStage;
    estimated_revenue: number;
    confidence_percentage: number;
    updated_at: string;
  }[];
  recent_samples: {
    id: number;
    sample_batch_code: string;
    status: SampleStatus;
    quantity: number;
    account_name: string;
    part_number: string;
    created_at: string;
  }[];
}
