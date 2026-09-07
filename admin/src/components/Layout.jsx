import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') {
      return (
        <span className="adm-breadcrumb">
          <span className="adm-breadcrumb-current">Dashboard / Profiles</span>
        </span>
      );
    }
    if (path === '/new') {
      return (
        <span className="adm-breadcrumb">
          <Link to="/">Profiles</Link>
          <span className="adm-breadcrumb-sep">/</span>
          <span className="adm-breadcrumb-current">Create Profile</span>
        </span>
      );
    }
    if (path === '/requests') {
      return (
        <span className="adm-breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="adm-breadcrumb-sep">/</span>
          <span className="adm-breadcrumb-current">Connect Requests</span>
        </span>
      );
    }
    if (path.startsWith('/edit')) {
      return (
        <span className="adm-breadcrumb">
          <Link to="/">Profiles</Link>
          <span className="adm-breadcrumb-sep">/</span>
          <span className="adm-breadcrumb-current">Edit Profile</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="adm-shell">
      <Sidebar />
      <main className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            {getBreadcrumbs()}
          </div>
          <div>
            {location.pathname === '/' ? (
              <Link to="/new" className="btn btn-gold btn-sm">
                <span>＋</span> Add Profile
              </Link>
            ) : (
              <Link to="/" className="btn btn-outline btn-sm">
                ← Back to List
              </Link>
            )}
          </div>
        </header>

        <div className="adm-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
