import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <div className="adm-sidebar-logo">
          Fashion <span>Galaxy</span>
        </div>
        <div className="adm-sidebar-sub">Admin Control</div>
      </div>

      <nav className="adm-sidebar-nav">
        <div className="adm-nav-section">Management</div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `adm-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="adm-nav-icon">✦</span>
          <span>All Profiles</span>
        </NavLink>

        <NavLink
          to="/new"
          className={({ isActive }) =>
            `adm-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="adm-nav-icon">＋</span>
          <span>New Profile</span>
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            `adm-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="adm-nav-icon">✉</span>
          <span>Connect Requests</span>
        </NavLink>

        <div className="adm-nav-section" style={{ marginTop: '16px' }}>External</div>

        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="adm-nav-link"
        >
          <span className="adm-nav-icon">↗</span>
          <span>Client App</span>
        </a>
      </nav>

      <div className="adm-sidebar-footer">
        <div>v1.0.0 · Fashion Galaxy</div>
        <div style={{ marginTop: '4px', opacity: 0.7 }}>Connected to API</div>
      </div>
    </aside>
  );
}
