import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import * as VehiculeController from "../API/controller/vehicules";

function VehiculeTable() {
  const fields = [
    { name: "model", label: "Model", type: "text" },
    { name: "licence_plate", label: "Licence Plate", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "owner_id", label: "Owner ID", type: "number" },
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
