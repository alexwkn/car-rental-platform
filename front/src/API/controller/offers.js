import apiClient from "../http.js";
import API_ROUTES from "../apiRoutes.js";

const getAllOffers = async () => {
  try {
    const { data } = await apiClient.get(API_ROUTES.OFFER_ROUTE);
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const getOfferById = async (id) => {
  try {
    const { data } = await apiClient.get(`${API_ROUTES.OFFER_ROUTE}/${id}`);
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const addOffer = async (offer) => {
  try {
    offer.offer_id = parseInt(offer.offer_id);
    offer.vehicle_id = parseInt(offer.vehicle_id);
    const { data } = await apiClient.post(`${API_ROUTES.OFFER_ROUTE}`, offer);
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const updateOffer = async (updatedOffer) => {
  try {
    if (updatedOffer.offer_id)
      updatedOffer.offer_id = parseFloat(updatedOffer.offer_id);
    if (updatedOffer.vehicle_id)
      updatedOffer.vehicle_id = parseFloat(updatedOffer.vehicle_id);

    const { data } = await apiClient.patch(
      `${API_ROUTES.OFFER_ROUTE}/${updatedOffer.offer_id}`,
      updatedOffer
    );
    return data;
  } catch (e) {
    throw new Error(
      "Une erreur est survenue, réessayez ultérieurement: " + e.message
    );
  }
};

const deleteOfferById = async (id) => {
  try {
    await apiClient.delete(`${API_ROUTES.OFFER_ROUTE}/${id}`);
  } catch (e) {
    throw new Error("Une erreur est survenue, réessayer plus tard: " + e);
  }
};

export { getAllOffers, getOfferById, addOffer, updateOffer, deleteOfferById };
