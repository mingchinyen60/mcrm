import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Users, 
  Video, 
  FlaskConical, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle,
  Clock,
  Sparkles,
  Paperclip,
  Download,
  UploadCloud
} from 'lucide-react';
import { Activity, Contact } from '../types';
import { api } from '../services/api';

interface ActivityTimelineProps {
  opportunityId: number;
  opportunityTitle: string;
  accountName?: string;
  contacts: Contact[];
}

const TYPE_ICONS: Record<string, any> = {
  'Phone Call': Phone,
  'Email': Mail,
  'Meeting (F2F)': Users,
  'Video Conference': Video,
  'Lab Visit': FlaskConical,
  'Tech Review': FileText,
  'Quote/RFP': FileText,
};

const TYPE_COLORS: Record<string, string> = {
  'Phone Call': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Email': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Meeting (F2F)': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Video Conference': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Lab Visit': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Tech Review': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  opportunityId,
  opportunityTitle,
  accountName,
  contacts
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New activity form state
  const [activityType, setActivityType] = useState('Meeting (F2F)');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [contactId, setContactId] = useState<number | undefined>(contacts[0]?.id);
  const [attendees, setAttendees] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingForActId, setUploadingForActId] = useState<number | null>(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await api.getActivities(opportunityId);
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [opportunityId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    try {
      setSubmitting(true);
      const newAct = await api.createActivity({
        opportunity_id: opportunityId,
        contact_id: contactId,
        activity_type: activityType,
        activity_date: activityDate,
        title,
        attendees,
        summary,
        action_items: actionItems || undefined,
        follow_up_date: followUpDate || undefined
      });

      // If attachment file was selected, upload it
      if (attachmentFile && newAct.id) {
        try {
          await api.uploadActivityAttachment(newAct.id, attachmentFile);
        } catch (uploadErr) {
          console.error("Failed to upload attachment:", uploadErr);
        }
      }

      // Reset form
      setTitle('');
      setAttendees('');
      setSummary('');
      setActionItems('');
      setFollowUpDate('');
      setAttachmentFile(null);
      setShowAddForm(false);
      await loadActivities();
    } catch (err: any) {
      alert(`Failed to save activity: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadAttachmentForExisting = async (actId: number, file: File) => {
    try {
      setUploadingForActId(actId);
      await api.uploadActivityAttachment(actId, file);
      await loadActivities();
    } catch (err: any) {
      alert(`Failed to upload attachment: ${err.message}`);
    } finally {
      setUploadingForActId(null);
    }
  };

  const handleDeleteAttachment = async (actId: number) => {
    if (!confirm("Are you sure you want to remove this attachment?")) return;
    try {
      await api.deleteActivityAttachment(actId);
      await loadActivities();
    } catch (err: any) {
      alert(`Failed to remove attachment: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this interaction log?")) return;
    try {
      await api.deleteActivity(id);
      await loadActivities();
    } catch (err: any) {
      alert(`Failed to delete activity: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Project Interaction History</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {activities.length} logs
            </span>
          </h4>
          <p className="text-xs text-slate-400">
            Audit trail of phone calls, lab visits, technical meetings, and follow-up deliverables.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Log Interaction'}</span>
        </button>
      </div>

      {/* Add New Activity Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Record Meeting / Interaction Details
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Interaction Type *</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              >
                <option value="Meeting (F2F)">Meeting (Face-to-Face)</option>
                <option value="Lab Visit">Lab On-site Visit</option>
                <option value="Video Conference">Video Conference (Teams/Zoom)</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email Exchange</option>
                <option value="Tech Review">Tech Review / Spec Sync</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Interaction Date *</label>
              <input
                type="date"
                required
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Lead Contact</label>
              <select
                value={contactId || ''}
                onChange={(e) => setContactId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              >
                <option value="">-- Select Contact --</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-slate-400 mb-1">Title / Discussion Topic *</label>
              <input
                type="text"
                required
                placeholder="e.g. Thermal Chamber Holdover Test Review at Kista Lab"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-medium"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-slate-400 mb-1">Attendees / Participants</label>
              <input
                type="text"
                placeholder="e.g. Lars Lindqvist (Customer Lead), Carl (Arrow FAE), Ming (Sales)"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-slate-400 mb-1">Meeting Minutes & Key Discussions *</label>
              <textarea
                rows={3}
                required
                placeholder="Detailed notes: technical findings, customer feedback, socket constraints, price discussions..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-400 mb-1">Action Items & Deliverables</label>
              <input
                type="text"
                placeholder="e.g. Provide Allan deviation plot for -40C to +85C"
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Follow-up Due Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-slate-400 mb-1 flex items-center space-x-1.5">
                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                <span>PDF Document / Meeting Minutes / Spec File Attachment</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/50"
                />
                {attachmentFile && (
                  <span className="text-xs text-emerald-400 flex items-center space-x-1 font-mono">
                    <CheckCircle className="w-3 h-3" />
                    <span>{attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              {submitting ? 'Saving...' : 'Save Interaction'}
            </button>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      {loading ? (
        <div className="py-6 text-center text-xs text-slate-500">Loading timeline...</div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No interactions logged for this program yet. Click "+ Log Interaction" to record meetings, calls, or test reviews.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.map((act) => {
            const Icon = TYPE_ICONS[act.activity_type] || FileText;
            const colorClass = TYPE_COLORS[act.activity_type] || 'bg-slate-800 text-slate-300 border-slate-700';

            return (
              <div key={act.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                </div>

                {/* Activity Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center space-x-1 ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                          <span>{act.activity_type}</span>
                        </span>
                        <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{act.activity_date}</span>
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-white group-hover:text-blue-400 transition">
                        {act.title}
                      </h5>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(act.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                      title="Delete Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {act.attendees && (
                    <div className="text-xs text-slate-400 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate"><strong>Attendees:</strong> {act.attendees}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                    {act.summary}
                  </p>

                  {/* Attachment Box */}
                  {act.attachment_name ? (
                    <div className="flex items-center justify-between text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="font-medium text-slate-200 truncate">{act.attachment_name}</span>
                        {act.attachment_size && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            ({(act.attachment_size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <a
                          href={api.getActivityAttachmentUrl(act.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-semibold flex items-center space-x-1 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>View PDF</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(act.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
                          title="Remove attachment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <label className="inline-flex items-center space-x-1.5 text-[11px] text-slate-400 hover:text-blue-400 cursor-pointer transition">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingForActId === act.id ? 'Uploading...' : 'Attach PDF / Document'}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          disabled={uploadingForActId === act.id}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleUploadAttachmentForExisting(act.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {act.action_items && (
                    <div className="pt-1 flex items-center justify-between text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span><strong>Action Item:</strong> {act.action_items}</span>
                      </div>
                      {act.follow_up_date && (
                        <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>Due: {act.follow_up_date}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
