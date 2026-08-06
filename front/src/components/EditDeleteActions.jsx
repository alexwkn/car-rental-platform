import PropTypes from "prop-types";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/cancel_white.svg";

function EditDeleteActions({ row, onEdit, onDelete }) {
  return (
    <div className="actions-cell">
      <button onClick={() => onEdit(row)}>
        <img src={editIcon} alt="Edit" />
      </button>
      <button onClick={() => onDelete(row.id)}>
        <img src={deleteIcon} alt="Delete" className="icon" />
      </button>
    </div>
  );
}

EditDeleteActions.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditDeleteActions;
