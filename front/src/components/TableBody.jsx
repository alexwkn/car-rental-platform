import PropTypes from "prop-types";
import TableRow from "./TableRow";

// Affiche une TableRow par élément
function TableBody({ columns, data, onEdit, onDelete }) {
  return (
    <tbody>
      {data.map((row) => (
        <TableRow
          key={row.id}
          row={row}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
}

TableBody.propTypes = {
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

export default TableBody;
