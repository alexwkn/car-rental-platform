import PropTypes from "prop-types";
import "../../styles/modal.css";
import React from "react";

function EntityForm({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
}) {
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    if (isOpen) {
      const base = fields.reduce((acc, field) => {
        let value = initialData?.[field.name] ?? "";

        // formatage minimal pour les dates
        if (field.type === "date" && value) {
          value = String(value).substring(0, 10);
        }

        if (field.type === "checkbox") {
          value = Boolean(initialData?.[field.name]);
        }

        return { ...acc, [field.name]: value };
      }, {});
      setFormData(base);
    }
  }, [isOpen, initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (e, field) => {
    const { name, value, checked, type } = e.target;

    let finalValue = value;
    if (field.type === "checkbox" || type === "checkbox") {
      finalValue = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <form className="entity-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "checkbox" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(e, field)}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name] ?? ""}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required !== false}
                />
              )}
            </div>
          ))}

          <div className="modal-actions">
            <button type="submit">✅ Save</button>
            <button type="button" onClick={onClose}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EntityForm.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
    })
  ).isRequired,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default EntityForm;
