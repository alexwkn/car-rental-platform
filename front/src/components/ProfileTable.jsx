import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllProfiles,
  updateProfile,
  deleteProfile,
  addProfile,
} from "../API/controller/profiles";

const ProfileController = {
  getAll: getAllProfiles,
  update: updateProfile,
  remove: deleteProfile,
  add: addProfile,
};
function ProfileTable() {
  const fields = [
    { name: "name", label: "Name", type: "text", maxLength: 100 },
    { name: "email", label: "Email", type: "email", maxLength: 255 },
    { name: "password", label: "Password", type: "password", minLength: 8, maxLength: 255 },
    { name: "adress", label: "Adress", type: "text", required: false , maxLength: 255 },
    { name: "bank_account", label: "Bank Account", type: "text", required: false, maxLength: 50 },
    { name: "is_renter", label: "Is Renter", type: "checkbox" },
    { name: "profile_picture", label: "Profile Picture URL", type: "url", required: false, maxLength: 500 },
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