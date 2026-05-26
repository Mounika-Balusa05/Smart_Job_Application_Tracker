import React, { useEffect, useState } from 'react';
import { getApplications, getUpcomingInterviews } from '../utils/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [appsRes, interviewsRes] = await Promise.all([
          getApplications(),
          getUpcomingInterviews()
        ]);
        setApps(appsRes.data.data);
        setUpcoming(interviewsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusCounts = apps.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total Applications', value: apps.length, color: '#6c63ff' },
    { label: 'Interviews', value: statusCounts['Interview'] || 0, color: '#43e97b' },
    { label: 'Offers', value: statusCounts['Offer'] || 0, color: '#f7b731' },
    { label: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#ff6584' },
    { label: 'Screening', value: statusCounts['Screening'] || 0, color: '#38bdf8' },
  ];

  if (loading) return <div className="empty-state"><div className="emoji">⏳</div><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard 📊</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {format(new Date(), 'EEEE, MMMM d yyyy')}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Applications */}
        <div>
          <div className="section-title">Recent Applications</div>
          <div className="table-container">
            {apps.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">📭</div>
                <p>No applications yet</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 6).map(app => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: 600 }}>{app.company}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{app.position}</td>
                      <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <div className="section-title">Upcoming Interviews 📅</div>
          {upcoming.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="emoji">🗓️</div>
                <p>No upcoming interviews</p>
              </div>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcoming.map(iv => (
                <div className="upcoming-item" key={iv._id}>
                  <div className="upcoming-date">
                    <div className="upcoming-day">{format(new Date(iv.scheduledDate), 'd')}</div>
                    <div className="upcoming-month">{format(new Date(iv.scheduledDate), 'MMM')}</div>
                  </div>
                  <div className="upcoming-info">
                    <div className="upcoming-company">{iv.company}</div>
                    <div className="upcoming-type">{iv.interviewType} · {format(new Date(iv.scheduledDate), 'h:mm a')}</div>
                  </div>
                  <span className={`badge badge-${iv.status}`}>{iv.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}