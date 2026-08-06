import PropTypes from "prop-types";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import "../styles/dataTable.css";

// Tableau générique
function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <TableHeader columns={columns} />
      <TableBody columns={columns} data={data} onEdit={onEdit} onDelete={onDelete} />
    </table>
  );
}

DataTable.propTypes = {
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

export default DataTable;
