import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getInterviews, createInterview, updateInterview, deleteInterview, getApplications } from '../utils/api';
import { format, isPast, isToday, differenceInHours } from 'date-fns';

const TYPES = ['Phone Screen', 'Technical', 'HR Round', 'Manager Round', 'Final Round', 'Group Interview', 'Other'];
const STATUSES = ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'];
const EMPTY_FORM = {
  applicationId: '', company: '', position: '', interviewType: 'Phone Screen',
  scheduledDate: '', duration: 60, location: '', interviewerName: '',
  interviewerEmail: '', notes: '', status: 'Upcoming', feedback: ''
};

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    try {
      const [ivRes, appsRes] = await Promise.all([getInterviews(), getApplications()]);
      setInterviews(ivRes.data.data);
      setApps(appsRes.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (iv) => {
    setForm({
      ...iv,
      applicationId: iv.applicationId?._id || iv.applicationId || '',
      scheduledDate: iv.scheduledDate ? format(new Date(iv.scheduledDate), "yyyy-MM-dd'T'HH:mm") : ''
    });
    setEditingId(iv._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); };

  const handleAppChange = (e) => {
    const app = apps.find(a => a._id === e.target.value);
    setForm({ ...form, applicationId: e.target.value, company: app?.company || '', position: app?.position || '' });
  };

  const handleSubmit = async () => {
    if (!form.applicationId || !form.scheduledDate) return toast.error('Application and date are required');
    try {
      if (editingId) {
        await updateInterview(editingId, form);
        toast.success('Interview updated!');
      } else {
        await createInterview(form);
        toast.success('Interview scheduled! 🎉');
      }
      closeModal();
      load();
    } catch { toast.error('Something went wrong'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    try { await deleteInterview(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const getTimeTag = (date) => {
    if (isToday(new Date(date))) return (
      <span style={{ color: '#f7b731', fontWeight: 600, fontSize: '0.75rem' }}>TODAY</span>
    );
    if (isPast(new Date(date))) return null;
    const hrs = differenceInHours(new Date(date), new Date());
    if (hrs <= 24) return (
      <span style={{ color: '#ff6584', fontWeight: 600, fontSize: '0.75rem' }}>SOON</span>
    );
    return null;
  };

  const filtered = filterStatus ? interviews.filter(iv => iv.status === filterStatus) : interviews;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Interviews 📅</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Schedule Interview</button>
      </div>

      <div className="filters-bar">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="empty-state"><div className="emoji">⏳</div><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📅</div>
            <p>No interviews yet. Schedule your first one!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(iv => (
                <tr key={iv._id}>
                  <td style={{ fontWeight: 700 }}>{iv.company}</td>
                  <td>{iv.position}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{iv.interviewType}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {format(new Date(iv.scheduledDate), 'MMM d, h:mm a')}
                      {getTimeTag(iv.scheduledDate)}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{iv.duration} min</td>
                  <td><span className={`badge badge-${iv.status}`}>{iv.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-sm btn-primary" onClick={() => openEdit(iv)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(iv._id)}>Del</button>
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
            <div className="modal-title">{editingId ? '✏️ Edit Interview' : '📅 Schedule Interview'}</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Link to Application *</label>
                <select value={form.applicationId} onChange={handleAppChange}>
                  <option value="">Select application...</option>
                  {apps.map(a => <option key={a._id} value={a._id}>{a.company} — {a.position}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Interview Type</label>
                <select value={form.interviewType} onChange={f('interviewType')}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={f('status')}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time *</label>
                <input type="datetime-local" value={form.scheduledDate} onChange={f('scheduledDate')} />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" value={form.duration} onChange={f('duration')} min={15} step={15} />
              </div>
              <div className="form-group full">
                <label>Meeting Link / Location</label>
                <input value={form.location} onChange={f('location')} placeholder="Zoom link or office address" />
              </div>
              <div className="form-group">
                <label>Interviewer Name</label>
                <input value={form.interviewerName} onChange={f('interviewerName')} placeholder="Name" />
              </div>
              <div className="form-group">
                <label>Interviewer Email</label>
                <input value={form.interviewerEmail} onChange={f('interviewerEmail')} placeholder="email@..." />
              </div>
              <div className="form-group full">
                <label>Notes / Prep</label>
                <textarea rows={3} value={form.notes} onChange={f('notes')} placeholder="Interview prep notes, questions to ask..." />
              </div>
              {editingId && (
                <div className="form-group full">
                  <label>Feedback (after interview)</label>
                  <textarea rows={2} value={form.feedback} onChange={f('feedback')} placeholder="How did it go?" />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn" style={{ background: 'var(--surface2)' }} onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingId ? 'Update' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}