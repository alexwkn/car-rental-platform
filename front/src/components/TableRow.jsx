import PropTypes from "prop-types";
import EditDeleteActions from "./EditDeleteActions";

// Décide quoi afficher dans une cellule
function renderCellContent(col, row, onEdit, onDelete) {
  if (col.key === "edit") {
    return <EditDeleteActions row={row} onEdit={onEdit} onDelete={onDelete} />;
  }
  //pour profilTable
  if (col.render) {
    return col.render(row[col.key], row);
  }

  return String(row[col.key] ?? "");
}

// Chaque cellule est rendue en fonction de la colonne correspondante
function TableRow({ row, columns, onEdit, onDelete }) {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col.key}>{renderCellContent(col, row, onEdit, onDelete)}</td>
      ))}
    </tr>
  );
}

TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TableRow;
