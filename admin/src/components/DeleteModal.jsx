export default function DeleteModal({ profile, onConfirm, onCancel, isDeleting }) {
  if (!profile) return null;

  return (
    <div className="adm-modal-overlay" onClick={onCancel}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-icon">⚠️</div>
        <h2 className="adm-modal-title">Delete Profile</h2>
        <p className="adm-modal-body">
          Are you sure you want to delete <strong>{profile.name}</strong>?
          <br />
          This action cannot be undone and will permanently remove this profile from Fashion Galaxy.
        </p>
        <div className="adm-modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(profile._id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
