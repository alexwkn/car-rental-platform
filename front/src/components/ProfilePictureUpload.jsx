import { useState, useRef } from "react";
import {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePictureUrl,
} from "../API/controller/profiles";
import "../styles/profilePicture.css";
import PropTypes from "prop-types";

function ProfilePictureUpload({ profileId, currentPicture, onPictureUpdated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    currentPicture ? getProfilePictureUrl(currentPicture) : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5000000; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError(null);
    setSuccess(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(
        currentPicture ? getProfilePictureUrl(currentPicture) : null
      );
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Seules les images PNG, JPG et JPEG sont acceptées");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("L'image ne doit pas dépasser 5 MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    // Générer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await uploadProfilePicture(profileId, selectedFile);
      setSuccess("Image uploadée avec succès !");
      setSelectedFile(null);

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notifier le parent du changement
      if (onPictureUpdated) {
        onPictureUpdated(response.data);
      }

      // Mettre à jour la preview avec la nouvelle image
      setPreviewUrl(getProfilePictureUrl(response.data.profile_picture));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPicture && !previewUrl) {
      setError("Aucune image à supprimer");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteProfilePicture(profileId);
      setSuccess("Image supprimée avec succès !");
      setPreviewUrl(null);
      setSelectedFile(null);

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notifier le parent du changement
      if (onPictureUpdated) {
        onPictureUpdated({ profile_picture: null });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(currentPicture ? getProfilePictureUrl(currentPicture) : null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="profile-picture-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="preview-image" />
        ) : (
          <div className="preview-placeholder">
            <span>No image</span>
          </div>
        )}
      </div>

      <div className="profile-picture-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="file-input"
          disabled={isUploading}
        />

        {selectedFile && (
          <div className="selected-file-info">
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
          </div>
        )}

        <div className="button-group">
          {selectedFile && (
            <>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-upload"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="btn-cancel"
              >
                Cancel
              </button>
            </>
          )}

          {(currentPicture || previewUrl) && !selectedFile && (
            <button
              onClick={handleDelete}
              disabled={isUploading}
              className="btn-delete"
            >
              {isUploading ? "Deleting..." : "Delete Image"}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );

  ProfilePictureUpload.propTypes = {
    profileId: PropTypes.number.isRequired,
    currentPicture: PropTypes.string,
    onPictureUpload: PropTypes.func,
  }
  
}

export default ProfilePictureUpload;
