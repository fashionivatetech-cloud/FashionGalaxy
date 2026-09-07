import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileCard({ profile, onDeleteRequest }) {
  const [imgError, setImgError] = useState(false);

  const isRight = profile.layout_style === 'right';

  return (
    <div className="adm-card">
      <div className="adm-card-img-wrap">
        <span
          className={`adm-layout-badge ${
            isRight ? 'adm-layout-badge--right' : 'adm-layout-badge--left'
          }`}
        >
          {isRight ? 'Layout Right' : 'Layout Left'}
        </span>

        {profile.photo && !imgError ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="adm-card-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="adm-card-img-placeholder">
            <span>👤</span>
            <p>No Photo Provided</p>
          </div>
        )}
        <div className="adm-card-img-fade" />
      </div>

      <div className="adm-card-body">
        <h3 className="adm-card-name">{profile.name}</h3>
        <div className="adm-card-meta">
          {[profile.profession, profile.department].filter(Boolean).join(' · ') || 'Unspecified'}
        </div>
        {profile.location && (
          <div className="adm-card-location">📍 {profile.location}</div>
        )}
        {profile.bio && (
          <p className="adm-card-bio">{profile.bio}</p>
        )}
      </div>

      <div className="adm-card-footer">
        <Link to={`/edit/${profile._id}`} className="btn btn-outline btn-sm">
          ✏️ Edit
        </Link>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDeleteRequest(profile)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
