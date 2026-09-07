import { useState } from 'react';
import ConnectModal from './ConnectModal';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=400&q=70';

export default function ProfilePage({ profile }) {
  const [showModal, setShowModal] = useState(false);

  const {
    _id,
    name,
    photo,
    location,
    department,
    bio,
    tags = [],
    socialLinks = {},
    phone,
    email,
  } = profile;

  return (
    <div className="page profile-page">
      {/* Photo section */}
      <div className="profile-photo-wrap">
        <img
          src={photo || FALLBACK_PHOTO}
          alt={`${name} profile`}
          onError={(e) => { e.currentTarget.src = FALLBACK_PHOTO; }}
        />
        {department && (
          <span className="profile-dept-badge">{department}</span>
        )}
      </div>

      {/* Details section */}
      <div className="profile-details">
        <h2 className="profile-name">{name}</h2>

        {location && (
          <div className="profile-location">
            <span>📍</span>
            <span>{location}</span>
          </div>
        )}

        {bio && <p className="profile-bio">{bio}</p>}

        {tags.length > 0 && (
          <div className="profile-tags">
            {tags.map((tag, i) => (
              <span key={i} className="profile-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social links */}
        {(socialLinks.instagram || socialLinks.linkedin || socialLinks.website) && (
          <div className="profile-socials">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                id={`instagram-${_id}`}
              >
                Instagram
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                id={`linkedin-${_id}`}
              >
                LinkedIn
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                id={`website-${_id}`}
              >
                Website
              </a>
            )}
          </div>
        )}

        {/* Connect CTA */}
        <button
          className="connect-btn"
          id={`connect-btn-${_id}`}
          onClick={() => setShowModal(true)}
        >
          ✦ Connect
        </button>
      </div>

      {/* Connect modal */}
      {showModal && (
        <ConnectModal
          profileId={_id}
          profileName={name}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
