import apiClient from "../http.js";
import API_ROUTES from "../apiRoutes.js";
import { toApiError } from "../apiError.js";

const getAllOffers = async () => {
  try {
    const { data } = await apiClient.get(API_ROUTES.OFFER_ROUTE);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
};

const getOfferById = async (id) => {
  try {
    const { data } = await apiClient.get(`${API_ROUTES.OFFER_ROUTE}/${id}`);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
};

const addOffer = async (offer) => {
  try {
    offer.offer_id = parseInt(offer.offer_id);
    offer.vehicule_id = parseInt(offer.vehicule_id);
    const { data } = await apiClient.post(`${API_ROUTES.OFFER_ROUTE}`, offer);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
};

const updateOffer = async (updatedOffer) => {
  try {
    if (updatedOffer.offer_id)
      updatedOffer.offer_id = parseFloat(updatedOffer.offer_id);
    if (updatedOffer.vehicule_id)
      updatedOffer.vehicule_id = parseFloat(updatedOffer.vehicule_id);

    const { data } = await apiClient.patch(
      `${API_ROUTES.OFFER_ROUTE}/${updatedOffer.offer_id}`,
      updatedOffer
    );
    return data;
  } catch (e) {
    throw toApiError(e);
  }
};

const deleteOfferById = async (id) => {
  try {
    await apiClient.delete(`${API_ROUTES.OFFER_ROUTE}/${id}`);
  } catch (e) {
    throw toApiError(e);
  }
};

export { getAllOffers, getOfferById, addOffer, updateOffer, deleteOfferById };
