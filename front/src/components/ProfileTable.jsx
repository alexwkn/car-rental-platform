import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import * as ProfileController from "../API/controller/profiles";

function ProfileTable() {
  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "adress", label: "Adress", type: "text" },
    { name: "bank_account", label: "Bank Account", type: "text" },
    { name: "is_renter", label: "Is Renter", type: "checkbox" },
    { name: "profile_picture", label: "Profile Picture URL", type: "text" },
  ];

  const columns = [
    { key: "profile_id", label: "Profile ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "adress", label: "Adress" },
    { key: "bank_account", label: "Bank Account" },
    { key: "is_renter", label: "Is Renter" },
    { key: "profile_picture", label: "Profile Picture" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(ProfileController);

  return (
    <EntityTable
      title="Profile"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="profile_id"
    />
  );
}

export default ProfileTable;