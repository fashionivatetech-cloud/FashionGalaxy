import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProfile, createProfile, updateProfile } from '../api';

const initialFormData = {
  name: '',
  photo: '',
  location: '',
  department: '',
  profession: '',
  bio: '',
  editorial_content: '',
  phone: '',
  email: '',
  socialLinks: {
    instagram: '',
    linkedin: '',
    website: '',
  },
  tags: '',
  layout_style: 'left',
};

export default function ProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;
    getProfile(id)
      .then((data) => {
        if (!mounted) return;
        setFormData({
          name: data.name || '',
          photo: data.photo || '',
          location: data.location || '',
          department: data.department || '',
          profession: data.profession || '',
          bio: data.bio || '',
          editorial_content: data.editorial_content || '',
          phone: data.phone || '',
          email: data.email || '',
          socialLinks: {
            instagram: data.socialLinks?.instagram || '',
            linkedin: data.socialLinks?.linkedin || '',
            website: data.socialLinks?.website || '',
          },
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          layout_style: data.layout_style || 'left',
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.error || 'Failed to fetch profile details');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLayoutSelect = (style) => {
    setFormData((prev) => ({ ...prev, layout_style: style }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await updateProfile(id, payload);
        setSuccess('Profile successfully updated!');
      } else {
        const created = await createProfile(payload);
        setSuccess('Profile successfully created!');
        setTimeout(() => {
          navigate(`/edit/${created._id}`);
        }, 800);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
        <span>Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="adm-form-page">
      <div className="adm-page-header">
        <div className="adm-page-title">
          <h1>{isEdit ? `Edit: ${formData.name || 'Profile'}` : 'Create New Profile'}</h1>
          <p>
            {isEdit
              ? 'Update profile details, bio, photo URL, and choose editorial layout'
              : 'Add a new talent profile to Fashion Galaxy catalogue'}
          </p>
        </div>
        <Link to="/" className="btn btn-outline btn-sm">
          ← Cancel & Return
        </Link>
      </div>

      {error && <div className="adm-error">⚠️ {error}</div>}
      {success && <div className="adm-success-toast">✓ {success}</div>}

      <div className="adm-form-grid">
        {/* Main form */}
        <form onSubmit={handleSubmit} className="adm-form-fields">
          {/* Section 1: Basic Identity */}
          <div className="adm-form-section">
            <div className="adm-form-section-title">01 · Basic Identity</div>
            <div className="adm-field-row">
              <div className="adm-field adm-field--full">
                <label className="adm-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Maya Lin"
                  className="adm-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Department / Industry</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Fashion, Fine Art, Architecture"
                  className="adm-input"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Profession / Role</label>
                <input
                  type="text"
                  name="profession"
                  placeholder="e.g. Haute Couture Couturier"
                  className="adm-input"
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field adm-field--full">
                <label className="adm-label">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Mumbai · Maharashtra"
                  className="adm-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Photo & Layout */}
          <div className="adm-form-section">
            <div className="adm-form-section-title">02 · Photography & Editorial Layout</div>
            <div className="adm-field adm-field--full" style={{ marginBottom: '16px' }}>
              <label className="adm-label">Portrait / Image URL</label>
              <input
                type="url"
                name="photo"
                placeholder="https://images.unsplash.com/..."
                className="adm-input"
                value={formData.photo}
                onChange={handleChange}
              />
              <span className="adm-field-hint">
                Provide a full or half body high-resolution portrait photograph.
              </span>
            </div>

            <div className="adm-field adm-field--full">
              <label className="adm-label">Select Editorial Layout Style</label>
              <div className="adm-layout-picker">
                {/* Layout Left */}
                <div
                  className={`adm-layout-option ${formData.layout_style === 'left' ? 'selected' : ''}`}
                  onClick={() => handleLayoutSelect('left')}
                >
                  <div className="adm-layout-diagram">
                    <div className="adm-layout-diagram-img" style={{ width: '40%' }} />
                    <div className="adm-layout-diagram-text">
                      <div className="adm-layout-diagram-line" />
                      <div className="adm-layout-diagram-line" />
                      <div className="adm-layout-diagram-line" />
                    </div>
                  </div>
                  <span className="adm-layout-option-label">
                    {formData.layout_style === 'left' ? '● ' : ''}Layout A (Image Left)
                  </span>
                </div>

                {/* Layout Right */}
                <div
                  className={`adm-layout-option ${formData.layout_style === 'right' ? 'selected' : ''}`}
                  onClick={() => handleLayoutSelect('right')}
                >
                  <div className="adm-layout-diagram">
                    <div className="adm-layout-diagram-text">
                      <div className="adm-layout-diagram-line" />
                      <div className="adm-layout-diagram-line" />
                      <div className="adm-layout-diagram-line" />
                    </div>
                    <div className="adm-layout-diagram-img" style={{ width: '40%' }} />
                  </div>
                  <span className="adm-layout-option-label">
                    {formData.layout_style === 'right' ? '● ' : ''}Layout B (Image Right)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Biography & Editorial Writeup */}
          <div className="adm-form-section">
            <div className="adm-form-section-title">03 · Editorial Content & Bio</div>
            <div className="adm-field adm-field--full" style={{ marginBottom: '14px' }}>
              <label className="adm-label">Short Bio (Preview Summary)</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="A brief 1-2 sentence overview of the talent..."
                className="adm-textarea"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="adm-field adm-field--full">
              <label className="adm-label">Full Editorial Content</label>
              <textarea
                name="editorial_content"
                rows={8}
                placeholder="In-depth editorial narrative, career trajectory, philosophy, and artistic achievements..."
                className="adm-textarea adm-textarea--lg"
                value={formData.editorial_content}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 4: Contact & Social Presence */}
          <div className="adm-form-section">
            <div className="adm-form-section-title">04 · Contact & Social Media</div>
            <div className="adm-field-row">
              <div className="adm-field">
                <label className="adm-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@studio.com"
                  className="adm-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 98765 43210"
                  className="adm-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Instagram URL</label>
                <input
                  type="text"
                  name="social_instagram"
                  placeholder="https://instagram.com/handle"
                  className="adm-input"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">LinkedIn URL</label>
                <input
                  type="text"
                  name="social_linkedin"
                  placeholder="https://linkedin.com/in/handle"
                  className="adm-input"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="adm-field adm-field--full">
                <label className="adm-label">Portfolio Website URL</label>
                <input
                  type="text"
                  name="social_website"
                  placeholder="https://www.example.com"
                  className="adm-input"
                  value={formData.socialLinks.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Search Tags */}
          <div className="adm-form-section">
            <div className="adm-form-section-title">05 · Search Tags</div>
            <div className="adm-field adm-field--full">
              <label className="adm-label">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="sustainable, couturier, lakme fashion week, silk"
                className="adm-input"
                value={formData.tags}
                onChange={handleChange}
              />
              <span className="adm-field-hint">
                Separate keywords with commas. These empower the client search engine.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="adm-form-actions">
            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Profile' : 'Publish Profile'}
            </button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <aside className="adm-preview-panel">
          <div className="adm-preview-header">Live Card Preview</div>
          <div className="adm-preview-img-wrap">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Preview"
                className="adm-preview-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="adm-preview-img-placeholder">
                <span>🖼️</span>
                <p>Paste image URL</p>
              </div>
            )}
          </div>
          <div className="adm-preview-body">
            <div className="adm-preview-category">
              {[formData.profession, formData.department].filter(Boolean).join(' · ') || 'Profession · Department'}
            </div>
            <div className="adm-preview-name">{formData.name || 'TALENT NAME'}</div>
            {formData.location && (
              <div className="adm-preview-location">📍 {formData.location}</div>
            )}
            <div className="adm-preview-rule" />
            <p className="adm-preview-bio">
              {formData.bio ||
                'The bio summary snippet will appear here as you type in the form.'}
            </p>
            <div className="adm-preview-layout-tag">
              <span>✦ Layout:</span>
              <strong>{formData.layout_style === 'right' ? 'Right (Layout B)' : 'Left (Layout A)'}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
