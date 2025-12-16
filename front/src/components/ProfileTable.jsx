import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllProfiles,
  updateProfile,
  deleteProfile,
  addProfile,
  getProfilePictureUrl,
} from "../API/controller/profiles";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { useState } from "react";

const ProfileController = {
  getAll: getAllProfiles,
  update: updateProfile,
  remove: deleteProfile,
  add: addProfile,
};
function ProfileTable() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fields = [
    { name: "name", label: "Name", type: "text", maxLength: 100 },
    { name: "email", label: "Email", type: "email", maxLength: 255 },
    {
      name: "password",
      label: "Password",
      type: "password",
      minLength: 8,
      maxLength: 255,
    },
    {
      name: "adress",
      label: "Adress",
      type: "text",
      required: false,
      maxLength: 255,
    },
    {
      name: "bank_account",
      label: "Bank Account",
      type: "text",
      required: false,
      maxLength: 50,
    },
    { name: "is_renter", label: "Is Renter", type: "checkbox" },
  ];

  const columns = [
    { key: "profile_id", label: "Profile ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "adress", label: "Adress" },
    { key: "bank_account", label: "Bank Account" },
    { key: "is_renter", label: "Is Renter" },
    {
      key: "profile_picture",
      label: "Profile Picture",
      render: (value, row) => {
        if (value) {
          return (
            <img
              src={getProfilePictureUrl(value)}
              alt={row.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={() => handleOpenUploadModal(row)}
              title="Click to change picture"
            />
          );
        }
        return (
          <button
            onClick={() => handleOpenUploadModal(row)}
            style={{
              padding: "5px 10px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        );
      },
    },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(ProfileController);

  const handleOpenUploadModal = (profile) => {
    setSelectedProfile(profile);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedProfile(null);
  };

  const handlePictureUpdated = (updatedData) => {
    // Mettre à jour le profil sélectionné avec les nouvelles données
    if (updatedData) {
      setSelectedProfile((prev) => ({
        ...prev,
        profile_picture: updatedData.profile_picture,
      }));
    }
    // Recharger les données pour afficher la nouvelle image dans le tableau
    hook.setQuery("");
  };

  return (
    <>
      <EntityTable
        title="Profile"
        fields={fields}
        columns={columns}
        hook={hook}
        idField="profile_id"
      />

      {/* Modal pour l'upload d'image */}
      {isUploadModalOpen && selectedProfile && (
        <div className="modal-overlay" onClick={handleCloseUploadModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Profile Picture - {selectedProfile.name}</h3>
              <button className="close-button" onClick={handleCloseUploadModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <ProfilePictureUpload
                profileId={selectedProfile.profile_id}
                currentPicture={selectedProfile.profile_picture}
                onPictureUpdated={handlePictureUpdated}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileTable;
