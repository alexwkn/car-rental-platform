export const toApiError = (error) => {
  // Pas de réponse du tout
  if (!error.response) {
    return new Error(
      "Le serveur ne répond pas."
    );
  }

  const { status, data } = error.response;

  // 5xx
  if (status >= 500) {
    return new Error("Une erreur est survenue côté serveur. Réessayez plus tard.");
  }

  // 4xx
  const serverMessage = data?.message || data?.errors?.[0]?.message;
  return new Error(serverMessage || "Requête invalide, vérifiez les données envoyées.");
};

export default toApiError;
