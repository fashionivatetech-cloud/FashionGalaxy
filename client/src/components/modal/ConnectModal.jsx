import { useState } from 'react';
import { postConnection } from '../../api';

export default function ConnectModal({ profileId, profileName, onClose }) {
  const [form, setForm] = useState({ visitorName: '', visitorEmail: '', visitorPhone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.visitorName.trim() || !form.visitorEmail.trim() || !form.visitorPhone.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await postConnection({ profileId, ...form });
      setSuccess(true);
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Connect request"
      onClick={handleOverlayClick}
    >
      <div className="modal-sheet">
        <div className="modal-handle" />

        {success ? (
          <div className="modal-success">
            <div className="check">✨</div>
            <h3>Request Sent!</h3>
            <p>
              Your details have been shared with <strong>{profileName}</strong>.
              They will reach out to you soon.
            </p>
            <button
              className="modal-close-btn"
              id="modal-done-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-title">Connect</div>
            <div className="modal-subtitle">
              Leave your details for <em>{profileName}</em>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} id="connect-form">
              <div className="input-group">
                <label htmlFor="visitor-name">Your Name</label>
                <input
                  id="visitor-name"
                  name="visitorName"
                  type="text"
                  placeholder="Full name"
                  value={form.visitorName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="visitor-email">Email</label>
                <input
                  id="visitor-email"
                  name="visitorEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={form.visitorEmail}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <label htmlFor="visitor-phone">Mobile Number</label>
                <input
                  id="visitor-phone"
                  name="visitorPhone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.visitorPhone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>

              {error && (
                <p style={{ color: '#e07070', fontSize: '0.78rem', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <button
                id="connect-submit-btn"
                type="submit"
                className="modal-submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending…' : '✦ Send Request'}
              </button>

              <button
                type="button"
                className="modal-close-btn"
                id="modal-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
