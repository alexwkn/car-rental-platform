import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import * as FavoriteController from "../API/controller/favorite";

function FavoriteTable() {
  const fields = [
    { name: "profile_id", label: "Profile ID", type: "number" },
    { name: "vehicule_id", label: "Vehicule ID", type: "number" },
  ];

  const columns = [
    { key: "favorite_id", label: "Favorite ID" },
    { key: "profile_id", label: "Profile ID" },
    { key: "vehicule_id", label: "Vehicule ID" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(FavoriteController);

  return (
    <EntityTable
      title="Favorite"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="favorite_id"
    />
  );
}

export default FavoriteTable;
