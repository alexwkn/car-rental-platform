import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/cancel_white.svg";
import "../styles/dataTable.css";
import PropTypes from "prop-types";

function TableData({ columns, data, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.key === "edit" ? (
                  <div className="actions-cell">
                    <button onClick={() => onEdit(row)}>
                      <img src={editIcon} alt="Edit" />
                    </button>
                    <button onClick={() => onDelete(row.id)}>
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="icon"
                      />
                    </button>
                  </div>
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TableData.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TableData;
