import { useState } from "react";
import PropTypes from "prop-types";
import SearchBar from "../SearchBar";
import DataTable from "../DataTable";
import Pagination from "../Pagination";
import EntityForm from "./EntityForm";
import EntityDeleteModal from "./EntityDeleteModal";
import "../../styles/modal.css";
import "../../styles/pagination.css";

function EntityTable({ title, fields, columns, hook, idField }) {
  const {
    data,
    page,
    totalPages,
    setPage,
    setQuery,
    addEntity,
    updateEntity,
    deleteEntity,
    loading,
    error,
  } = hook;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const rows = data.map((item) => ({
    ...item,
    id: item[idField],
  }));

  const handleAddClick = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    const original = data.find((item) => item[idField] === row.id) || null;
    setEditingItem(original);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmitForm = async (formData) => {
    if (editingItem && editingItem[idField]) {
      await updateEntity({ ...editingItem, ...formData });
    } else {
      await addEntity(formData);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId != null) {
      await deleteEntity(deleteId);
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="page-layout">
      <div className="content">
        <SearchBar
          placeholder={`Filter ${title.toLowerCase()}...`}
          isGlobal={false}
          debounce={300}
          onSearch={setQuery}
        />

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

        <div className="table-container">
          <DataTable
            columns={columns}
            data={rows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

          <div className="table-footer">
            <button className="add-button" onClick={handleAddClick}>
              ➕ Add {title}
            </button>
          </div>
        </div>

        <EntityForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          title={editingItem ? `Edit ${title}` : `Add ${title}`}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSubmitForm}
        />

        <EntityDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
          message={`Êtes-vous sûr de vouloir supprimer cet élément ?`}
        />
      </div>
    </div>
  );
}

EntityTable.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  hook: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    addEntity: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    deleteEntity: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  idField: PropTypes.string.isRequired,
};

export default EntityTable;