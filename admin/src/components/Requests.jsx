import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllConnections, deleteConnection } from '../api';

export default function Requests() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllConnections();
      setConnections(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load connection requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Dismiss this connection request? You should only do this after manually connecting both parties.')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteConnection(id);
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove connection request');
    } finally {
      setDeletingId(null);
    }
  };

  // Stats
  const totalCount = connections.length;
  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return connections.filter((c) => new Date(c.createdAt).toDateString() === today).length;
  }, [connections]);
  const uniqueRequesters = useMemo(() => {
    return new Set(connections.map((c) => c.visitorEmail?.toLowerCase()).filter(Boolean)).size;
  }, [connections]);

  // Filtered
  const filtered = useMemo(() => {
    if (!search.trim()) return connections;
    const q = search.toLowerCase();
    return connections.filter((c) => {
      const vName = c.visitorName?.toLowerCase() || '';
      const vEmail = c.visitorEmail?.toLowerCase() || '';
      const vPhone = c.visitorPhone?.toLowerCase() || '';
      const pName = c.profileId?.name?.toLowerCase() || '';
      return vName.includes(q) || vEmail.includes(q) || vPhone.includes(q) || pName.includes(q);
    });
  }, [connections, search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="adm-page-header">
        <div className="adm-page-title">
          <h1>Connect Requests</h1>
          <p>Review visitor inquiries and manually introduce repective parties</p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={fetchConnections}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="adm-error">
          ⚠️ {error} — <button className="btn btn-ghost btn-sm" onClick={fetchConnections}>Retry</button>
        </div>
      )}

      {/* Stats row */}
      <div className="adm-stats-row">
        <div className="adm-stat-card">
          <div className="adm-stat-value">{totalCount}</div>
          <div className="adm-stat-label">Total Requests</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value">{todayCount}</div>
          <div className="adm-stat-label">Received Today</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value">{uniqueRequesters}</div>
          <div className="adm-stat-label">Unique Requesters</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value" style={{ color: '#5ea87e' }}>Manual</div>
          <div className="adm-stat-label">Connection Mode</div>
        </div>
      </div>

      {/* Search filter */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          className="adm-input"
          placeholder="Search by requester name, email, phone, or talent name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content list */}
      {loading ? (
        <div className="adm-loading">
          <div className="adm-spinner" />
          <span>Loading connect requests...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">✉️</div>
          <h2>No Connection Requests Found</h2>
          <p>
            {search
              ? 'No requests matched your search query.'
              : 'There are currently no pending connection inquiries.'}
          </p>
        </div>
      ) : (
        <div className="adm-requests-list">
          {filtered.map((item) => {
            const profile = item.profileId;
            const introSubject = encodeURIComponent(
              `Fashion Galaxy Introduction: ${item.visitorName} & ${profile?.name || 'Talent'}`
            );
            const introBody = encodeURIComponent(
              `Hello ${item.visitorName} and ${profile?.name || 'there'},\n\nConnecting you both regarding your Fashion Galaxy inquiry.\n\nBest regards,\nFashion Galaxy Team`
            );
            const mailtoUrl = profile?.email
              ? `mailto:${item.visitorEmail}?cc=${profile.email}&subject=${introSubject}&body=${introBody}`
              : `mailto:${item.visitorEmail}?subject=${introSubject}&body=${introBody}`;

            return (
              <div key={item._id} className="adm-request-card">
                <div className="adm-request-header">
                  <div className="adm-request-date">
                    <span>🗓️ Received:</span>
                    <strong>{formatDate(item.createdAt)}</strong>
                  </div>
                  <span
                    className="adm-layout-badge adm-layout-badge--left"
                    style={{ position: 'static' }}
                  >
                    ✦ Manual Connection Pending
                  </span>
                </div>

                <div className="adm-request-grid">
                  {/* Party 1: The Visitor Requester */}
                  <div className="adm-request-party">
                    <div className="adm-request-party-title">
                      <span>👤 Requester Details</span>
                    </div>
                    <div className="adm-request-party-name">
                      {item.visitorName}
                    </div>

                    <div className="adm-request-party-details">
                      <div className="adm-request-detail-row">
                        <span>Email:</span>
                        <div className="adm-request-detail-val">
                          <a
                            href={`mailto:${item.visitorEmail}`}
                            style={{ color: 'var(--gold)' }}
                          >
                            {item.visitorEmail}
                          </a>
                          <button
                            type="button"
                            className="adm-copy-btn"
                            onClick={() => handleCopy(item.visitorEmail, `email-${item._id}`)}
                          >
                            {copiedField === `email-${item._id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="adm-request-detail-row">
                        <span>Phone:</span>
                        <div className="adm-request-detail-val">
                          <a
                            href={`tel:${item.visitorPhone}`}
                            style={{ color: 'var(--white)' }}
                          >
                            {item.visitorPhone}
                          </a>
                          <button
                            type="button"
                            className="adm-copy-btn"
                            onClick={() => handleCopy(item.visitorPhone, `phone-${item._id}`)}
                          >
                            {copiedField === `phone-${item._id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Bridge */}
                  <div className="adm-request-bridge">
                    <div className="adm-request-bridge-icon">⇄</div>
                    <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Connect
                    </span>
                  </div>

                  {/* Party 2: Requested Talent */}
                  <div className="adm-request-party">
                    <div className="adm-request-party-title" style={{ justifyContent: 'space-between' }}>
                      <span>✦ Target Talent Profile</span>
                      {(profile?._id || item.rawProfileId) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--white-muted)', fontFamily: 'monospace' }}>
                            ID: {profile?._id || item.rawProfileId}
                          </span>
                          <button
                            type="button"
                            className="adm-copy-btn"
                            onClick={() => handleCopy(profile?._id || item.rawProfileId, `pid-${item._id}`)}
                          >
                            {copiedField === `pid-${item._id}` ? '✓' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </div>

                    {profile ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {profile.photo ? (
                            <img
                              src={profile.photo}
                              alt={profile.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1px solid var(--gold-dim)',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--black-elev)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--gold-dim)',
                              }}
                            >
                              👤
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div className="adm-request-party-name">
                              {profile.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                              {[profile.profession, profile.department].filter(Boolean).join(' · ')}
                            </div>
                            {profile.location && (
                              <div style={{ fontSize: '0.65rem', color: 'var(--white-muted)', marginTop: '2px' }}>
                                📍 {profile.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="adm-request-party-details">
                          {profile.email && (
                            <div className="adm-request-detail-row">
                              <span>Talent Email:</span>
                              <div className="adm-request-detail-val">
                                <a
                                  href={`mailto:${profile.email}`}
                                  style={{ color: 'var(--gold)' }}
                                >
                                  {profile.email}
                                </a>
                                <button
                                  type="button"
                                  className="adm-copy-btn"
                                  onClick={() => handleCopy(profile.email, `pemail-${item._id}`)}
                                >
                                  {copiedField === `pemail-${item._id}` ? '✓ Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                          )}

                          {profile.phone && (
                            <div className="adm-request-detail-row">
                              <span>Talent Phone:</span>
                              <div className="adm-request-detail-val">
                                <a
                                  href={`tel:${profile.phone}`}
                                  style={{ color: 'var(--white)' }}
                                >
                                  {profile.phone}
                                </a>
                                <button
                                  type="button"
                                  className="adm-copy-btn"
                                  onClick={() => handleCopy(profile.phone, `pphone-${item._id}`)}
                                >
                                  {copiedField === `pphone-${item._id}` ? '✓ Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                          )}

                          <div style={{ marginTop: '6px' }}>
                            <Link
                              to={`/edit/${profile._id}`}
                              className="btn btn-outline btn-sm"
                              style={{ width: '100%', justifyContent: 'center' }}
                            >
                              ✏️ View & Edit Talent Profile
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ color: 'var(--white-muted)', fontSize: '0.82rem', padding: '10px 0' }}>
                        <div>Profile not found in database.</div>
                        <div style={{ marginTop: '4px', fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--gold)' }}>
                          Requested ID: {item.rawProfileId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action to support manual connect */}
                <div className="adm-request-footer">
                  <div style={{ fontSize: '0.72rem', color: 'var(--white-muted)' }}>
                    <span>💡 Tip: Contact both parties manually via email or WhatsApp/phone to introduce them.</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={mailtoUrl}
                      className="btn btn-gold btn-sm"
                    >
                      ✉ Open Email Intro
                    </a>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? 'Dismissing...' : 'Mark Done / Dismiss'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
