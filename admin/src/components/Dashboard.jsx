import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllProfiles, deleteProfile } from '../api';
import ProfileCard from './ProfileCard';
import DeleteModal from './DeleteModal';

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLayout, setFilterLayout] = useState('all');
  const [filterDept, setFilterDept] = useState('all');

  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      setFeedbackMessage('Profile deleted successfully.');
      setProfileToDelete(null);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete profile');
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculation
  const totalCount = profiles.length;
  const leftCount = profiles.filter((p) => (p.layout_style || 'left') === 'left').length;
  const rightCount = profiles.filter((p) => p.layout_style === 'right').length;
  const departments = useMemo(() => {
    const set = new Set();
    profiles.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    return Array.from(set);
  }, [profiles]);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.profession?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchLayout =
        filterLayout === 'all' ||
        (filterLayout === 'left' && (p.layout_style || 'left') === 'left') ||
        (filterLayout === 'right' && p.layout_style === 'right');

      const matchDept =
        filterDept === 'all' ||
        p.department?.toLowerCase() === filterDept.toLowerCase();

      return matchSearch && matchLayout && matchDept;
    });
  }, [profiles, search, filterLayout, filterDept]);

  return (
    <div>
      <div className="adm-page-header">
        <div className="adm-page-title">
          <h1>Profiles Overview</h1>
          <p>Manage talent profiles, editorial layouts, and metadata</p>
        </div>
        <Link to="/new" className="btn btn-gold">
          <span>＋</span> Add New Profile
        </Link>
      </div>

      {feedbackMessage && (
        <div className="adm-success-toast">
          ✓ {feedbackMessage}
        </div>
      )}

      {error && (
        <div className="adm-error">
          ⚠️ {error} — <button className="btn btn-ghost btn-sm" onClick={fetchProfiles}>Retry</button>
        </div>
      )}

      {/* Stats row */}
      <div className="adm-stats-row">
        <div className="adm-stat-card">
          <div className="adm-stat-value">{totalCount}</div>
          <div className="adm-stat-label">Total Profiles</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value">{leftCount}</div>
          <div className="adm-stat-label">Layout A (Left)</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value">{rightCount}</div>
          <div className="adm-stat-label">Layout B (Right)</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-value">{departments.length}</div>
          <div className="adm-stat-label">Departments</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <input
            type="text"
            className="adm-input"
            placeholder="Search by name, profession, location, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ width: '160px' }}>
          <select
            className="adm-select"
            value={filterLayout}
            onChange={(e) => setFilterLayout(e.target.value)}
          >
            <option value="all">All Layouts</option>
            <option value="left">Left Layout</option>
            <option value="right">Right Layout</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="adm-select"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {(search || filterLayout !== 'all' || filterDept !== 'all') && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearch('');
              setFilterLayout('all');
              setFilterDept('all');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="adm-loading">
          <div className="adm-spinner" />
          <span>Loading profiles...</span>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📂</div>
          <h2>No Profiles Found</h2>
          <p>
            {search || filterLayout !== 'all' || filterDept !== 'all'
              ? 'Try changing your search keywords or filter criteria.'
              : 'There are no profiles in the database yet.'}
          </p>
          <Link to="/new" className="btn btn-gold btn-sm">
            Add Your First Profile
          </Link>
        </div>
      ) : (
        <div className="adm-profile-grid">
          {filteredProfiles.map((p) => (
            <ProfileCard
              key={p._id}
              profile={p}
              onDeleteRequest={(prof) => setProfileToDelete(prof)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        profile={profileToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProfileToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
