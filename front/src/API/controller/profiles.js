import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";

const getAllProfiles = async () => {
  try {
    const { data } = await apiClient.get(API_ROUTES.PROFILE_ROUTE);
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const getProfileById = async (id) => {
  try {
    const { data } = await apiClient.get(`${API_ROUTES.PROFILE_ROUTE}/${id}`);
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};
const updateProfile = async (updatedProfile) => {
  try {
    if (updatedProfile.profile_id)
      updatedProfile.profile_id = parseFloat(updatedProfile.profile_id);

    const { data } = await apiClient.patch(
      `${API_ROUTES.PROFILE_ROUTE}/${updatedProfile.profile_id}`,
      updatedProfile
    );
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const deleteProfile = async (id) => {
  try {
    await apiClient.delete(`${API_ROUTES.PROFILE_ROUTE}/${id}`);
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const addProfile = async (profile) => {
  try {
    profile.profile_id = parseInt(profile.profile_id);
    const { data } = await apiClient.post(
      `${API_ROUTES.PROFILE_ROUTE}`,
      profile
    );
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const uploadProfilePicture = async (profileId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    const { data } = await apiClient.post(
      `${API_ROUTES.PROFILE_ROUTE}/${profileId}/upload-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue lors de l'upload de l'image: " + e.message
    );
  }
};

const deleteProfilePicture = async (profileId) => {
  try {
    const { data } = await apiClient.delete(
      `${API_ROUTES.PROFILE_ROUTE}/${profileId}/picture`
    );
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue lors de la suppression de l'image: " + e.message
    );
  }
};

const getProfilePictureUrl = (profilePicturePath) => {
  if (!profilePicturePath) return null;
  return `${API_ROUTES.API_ROUTE}/upload/${profilePicturePath}`;
};

export {
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  addProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePictureUrl,
};
