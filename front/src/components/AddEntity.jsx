import PropTypes from "prop-types";
import { useState } from "react";

function AddEntity({ fields, onSubmit, title = "Add Entity" }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(
      fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );
  };

  return (
    <form className="add-entity-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      {fields.map(({ name, label, type = "text" }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Add</button>
    </form>
  );
}

AddEntity.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default AddEntity;
