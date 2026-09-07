import { useState } from 'react';
import ConnectModal from '../modal/ConnectModal';

/**
 * ImageLeft — Editorial Layout A
 * Mobile-only, single page.
 * Left column: portrait image + factual strip below
 * Right column: category label, large name, editorial bio (main space), socials, connect
 */
export default function ImageLeft({ profile }) {
  const [showModal, setShowModal] = useState(false);

  const {
    _id,
    name,
    photo,
    location,
    department,
    profession,
    editorial_content,
    bio,
    tags = [],
    socialLinks = {},
  } = profile;

  const FALLBACK = 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=400&q=80';

  const bodyText = editorial_content || bio || '';
  const categoryLabel = [department, profession].filter(Boolean).join(' · ').toUpperCase();

  return (
    <div className="page eml-page">

      {/* ── HEADER ── */}
      <header className="eml-header">
        <span className="eml-header-brand">Fashion Galaxy</span>
        <span className="eml-header-divider" />

      </header>

      {/* ── MAIN GRID ── */}
      <div className="eml-grid">

        {/* LEFT — image + facts */}
        <div className="eml-col eml-col--image">
          <div className="eml-portrait-frame">
            <img
              src={photo || FALLBACK}
              alt={name}
              className="eml-portrait-img"
              onError={(e) => { e.currentTarget.src = FALLBACK; }}
            />
            <div className="eml-portrait-overlay" />
          </div>

          {/* Facts strip below image */}
          <div className="eml-facts">
            {department && (
              <div className="eml-fact">
                <span className="eml-fact-label">Field</span>
                <span className="eml-fact-value">{department}</span>
              </div>
            )}
            {profession && (
              <div className="eml-fact">
                <span className="eml-fact-label">Role</span>
                <span className="eml-fact-value">{profession}</span>
              </div>
            )}
            {location && (
              <div className="eml-fact">
                <span className="eml-fact-label">Based</span>
                <span className="eml-fact-value">{location}</span>
              </div>
            )}
            {tags.length > 0 && (
              <div className="eml-fact">
                <span className="eml-fact-label">Tags</span>
                <span className="eml-fact-value eml-fact-tags">
                  {tags.slice(0, 3).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — editorial content */}
        <div className="eml-col eml-col--text">

          {/* Category label */}
          {categoryLabel && (
            <p className="eml-category">{categoryLabel}</p>
          )}

          {/* Name headline */}
          <h1 className="eml-name">{name}</h1>

          {/* Gold rule */}
          <div className="eml-rule" />

          {/* Bio — main content, fills space */}
          <div className="eml-bio-wrap">
            <p className="eml-bio">{bodyText}</p>
          </div>

          {/* Social links */}
          {(socialLinks.instagram || socialLinks.linkedin || socialLinks.website) && (
            <div className="eml-socials">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                  className="eml-social-link" id={`ig-${_id}`}>
                  Instagram
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer"
                  className="eml-social-link" id={`li-${_id}`}>
                  LinkedIn
                </a>
              )}
              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noreferrer"
                  className="eml-social-link" id={`web-${_id}`}>
                  Website
                </a>
              )}
            </div>
          )}

          {/* Connect CTA */}
          {/* <button
            className="eml-connect-btn"
            id={`connect-btn-${_id}`}
            onClick={() => setShowModal(true)}
          >
            Connect ✦
          </button> */}

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="eml-footer">
        <span className="eml-footer-item">fashiongalaxy.cv</span>

        <span className="eml-footer-item">{department || 'Archive'}</span>
      </footer>

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
