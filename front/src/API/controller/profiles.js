import apiClient from "../http";
import API_ROUTES from "../apiRoutes.js";
import { toApiError } from "../apiError.js";

const getAllProfiles = async () => {
  try {
    const { data } = await apiClient.get(API_ROUTES.PROFILE_ROUTE);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
};

const getProfileById = async (id) => {
  try {
    const { data } = await apiClient.get(`${API_ROUTES.PROFILE_ROUTE}/${id}`);
    return data;
  } catch (e) {
    throw toApiError(e);
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
    throw toApiError(e);
  }
};

const deleteProfile = async (id) => {
  try {
    await apiClient.delete(`${API_ROUTES.PROFILE_ROUTE}/${id}`);
  } catch (e) {
    throw toApiError(e);
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
    throw toApiError(e);
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
    throw toApiError(e);
  }
};

const deleteProfilePicture = async (profileId) => {
  try {
    const { data } = await apiClient.delete(
      `${API_ROUTES.PROFILE_ROUTE}/${profileId}/picture`
    );
    return data;
  } catch (e) {
    throw toApiError(e);
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
