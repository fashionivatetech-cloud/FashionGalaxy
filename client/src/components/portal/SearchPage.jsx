import { useState } from 'react';
import { searchProfiles } from '../../api';

export default function SearchPage({ onResults }) {
  const [form, setForm] = useState({ name: '', location: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (form.name.trim()) params.name = form.name.trim();
      if (form.location.trim()) params.location = form.location.trim();
      if (form.department) params.department = form.department;

      const results = await searchProfiles(params);
      onResults(results);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page search-page-story">
      {/* Ambient glow */}
      <div className="story-glow" />

      {/* Top label */}
      <div className="story-eyebrow">✦ Index</div>

      {/* Main sentence */}
      <form
        className="story-form"
        onSubmit={handleSubmit}
        id="search-form"
        onTouchStart={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="story-sentence">

          {/* Line 1: "Take me to the ★ [dept]" */}
          <div className="story-line">
            <span className="story-text">Take me to the star</span>
            <div
              className="story-field-wrap"
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                id="search-department"
                name="department"
                type="text"
                inputMode="text"
                className="story-input"
                placeholder="any field"
                value={form.department}
                onChange={handleChange}
                autoComplete="off"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <span className="story-underline" />
            </div>
          </div>

          {/* Line 2: "from [location]," */}
          <div className="story-line">
            <span className="story-text">from</span>
            <div
              className="story-field-wrap"
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                id="search-location"
                name="location"
                type="text"
                inputMode="text"
                className="story-input"
                placeholder="anywhere"
                value={form.location}
                onChange={handleChange}
                autoComplete="off"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <span className="story-underline" />
            </div>
            <span className="story-comma">,</span>
          </div>

          {/* Line 3: "named [name]." */}
          <div className="story-line">
            <span className="story-text">named</span>
            <div
              className="story-field-wrap"
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                id="search-name"
                name="name"
                type="text"
                inputMode="text"
                className="story-input"
                placeholder="anyone"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <span className="story-underline" />
            </div>
            <span className="story-period">.</span>
          </div>

        </div>

        {/* Hint */}
        <p className="story-hint">Leave any blank to match all</p>

        {/* Error */}
        {error && <p className="story-error">{error}</p>}

        {/* Submit */}
        <button
          id="search-submit-btn"
          type="submit"
          className="story-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="story-loading">
              <span className="story-dot" />
              <span className="story-dot" />
              <span className="story-dot" />
            </span>
          ) : (
            '✦ Search'
          )}
        </button>
      </form>
    </div>
  );
}
