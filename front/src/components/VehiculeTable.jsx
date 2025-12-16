import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllVehicules,
  addVehicule,
  updateVehicule,
  deleteVehicule,
} from "../API/controller/vehicules";

const VehiculeController = {
  getAll: getAllVehicules,
  add: addVehicule,
  update: updateVehicule,
  remove: deleteVehicule,
};

function VehiculeTable() {
  const fields = [
    { name: "model", label: "Model", type: "text", minLength: 1, maxLength: 100 },
    { name: "licence_plate", label: "Licence Plate", type: "text", minLength: 1, maxLength: 20 },
    { name: "description", label: "Description", type: "text", required: false, maxLength: 500 },
    { name: "owner_id", label: "Owner ID", type: "number", min: 1, step: 1 },
  ];

  const columns = [
    { key: "vehicule_id", label: "Vehicule ID" },
    { key: "model", label: "Model" },
    { key: "licence_plate", label: "Licence Plate" },
    { key: "description", label: "Description" },
    { key: "owner_id", label: "Owner ID" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(VehiculeController);

  return (
    <EntityTable
      title="Vehicule"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="vehicule_id"
    />
  );
}

export default VehiculeTable;
