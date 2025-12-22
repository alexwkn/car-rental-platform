const REGEX_NAME = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_STREET = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+\s+\d+[A-Za-z]?$/;

const ERRORS = {
  REQUIRED: "Veuillez remplir tous les champs.",
  INVALID_EMAIL: "Veuillez entrer une adresse e-mail valide.",
  INVALID_NAME: "Le nom ne peut contenir que des lettres.",
  INVALID_FIRSTNAME: "Le prénom ne peut contenir que des lettres.",
  INVALID_STREET: "L'adresse doit contenir un nom de rue suivi d'un numéro (ex: Rue Centrale 19).",
  PASSWORD_MISMATCH: "Les mots de passe ne correspondent pas."
};

export const validateLogin = (email, password) => {
  if (!email || !password) return ERRORS.REQUIRED;
  if (!REGEX_EMAIL.test(email)) return ERRORS.INVALID_EMAIL;
  return null;
};

export const validateRegistration = (data) => {
  const {
    firstName,
    lastName,
    email,
    streetNumber,
    postalCode,
    city,
    password,
    confirmPassword,
  } = data;

  const requiredFields = [
    firstName, lastName, email, streetNumber,
    postalCode, city, password, confirmPassword
  ];

  if (requiredFields.some(field => !field)) return ERRORS.REQUIRED;
  if (!REGEX_NAME.test(lastName)) return ERRORS.INVALID_NAME;
  if (!REGEX_NAME.test(firstName)) return ERRORS.INVALID_FIRSTNAME;
  if (!REGEX_EMAIL.test(email)) return ERRORS.INVALID_EMAIL;
  if (!REGEX_STREET.test(streetNumber)) return ERRORS.INVALID_STREET;
  if (password !== confirmPassword) return ERRORS.PASSWORD_MISMATCH;

  return null;
};
