import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../utils/api';
import { format } from 'date-fns';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const EMPTY_FORM = {
  company: '', position: '', status: 'Applied', priority: 'Medium',
  jobUrl: '', salary: '', location: '', notes: '', contactName: '', contactEmail: '', resumeVersion: ''
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });

  const loadApps = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await getApplications(params);
      setApps(res.data.data);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadApps(); }, [filters]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingApp(null); setShowModal(true); };
  const openEdit = (app) => { setForm(app); setEditingApp(app._id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingApp(null); };

  const handleSubmit = async () => {
    if (!form.company || !form.position) return toast.error('Company and Position are required');
    try {
      if (editingApp) {
        await updateApplication(editingApp, form);
        toast.success('Application updated!');
      } else {
        await createApplication(form);
        toast.success('Application added!');
      }
      closeModal();
      loadApps();
    } catch { toast.error('Something went wrong'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      toast.success('Deleted!');
      loadApps();
    } catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Applications 📋</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Application</button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          placeholder="🔍 Search company or role..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="empty-state"><div className="emoji">⏳</div><p>Loading...</p></div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📭</div>
            <p>No applications found. Add your first one!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 700 }}>{app.company}</td>
                  <td>{app.position}</td>
                  <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td><span className={`priority-${app.priority}`}>{app.priority}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{app.location || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {format(new Date(app.appliedDate), 'MMM d, yyyy')}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-sm btn-primary" onClick={() => openEdit(app)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(app._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editingApp ? '✏️ Edit Application' : '➕ New Application'}</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Company *</label>
                <input value={form.company} onChange={f('company')} placeholder="e.g. Google" />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <input value={form.position} onChange={f('position')} placeholder="e.g. Software Engineer" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={f('status')}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={f('priority')}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={f('location')} placeholder="City / Remote" />
              </div>
              <div className="form-group">
                <label>Salary Range</label>
                <input value={form.salary} onChange={f('salary')} placeholder="e.g. $80k–$100k" />
              </div>
              <div className="form-group full">
                <label>Job URL</label>
                <input value={form.jobUrl} onChange={f('jobUrl')} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Contact Name</label>
                <input value={form.contactName} onChange={f('contactName')} placeholder="Recruiter name" />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input value={form.contactEmail} onChange={f('contactEmail')} placeholder="recruiter@..." />
              </div>
              <div className="form-group full">
                <label>Notes</label>
                <textarea rows={3} value={form.notes} onChange={f('notes')} placeholder="Any notes about this role..." />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn" style={{ background: 'var(--surface2)' }} onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingApp ? 'Update' : 'Add Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}