import PropTypes from "prop-types";
import '../../styles/modal.css';

function EntityDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this item?",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#e53935" }}>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>✅ Yes</button>
          <button onClick={onCancel}>❌ No</button>
        </div>
      </div>
    </div>
  );
}

EntityDeleteModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  message: PropTypes.string,
};

export default EntityDeleteModal;
