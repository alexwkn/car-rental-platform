const REGEX_NAME = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_STREET = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+\s+\d+[A-Za-z]?$/;

const ERRORS = {
  REQUIRED: "Veuillez remplir tous les champs.",
  INVALID_EMAIL: "Veuillez entrer une adresse e-mail valide.",
  
  INVALID_NAME: "Le nom ne peut contenir que des lettres.",
  INVALID_FIRSTNAME: "Le prénom ne peut contenir que des lettres.",
  NAME_TOO_SHORT: "Le nom doit contenir au moins 2 caractères.",
  NAME_TOO_LONG: "Le nom ne peut pas dépasser 100 caractères.", 
  FIRSTNAME_TOO_SHORT: "Le prénom doit contenir au moins 2 caractères.", 
  FIRSTNAME_TOO_LONG: "Le prénom ne peut pas dépasser 100 caractères.",
  
  INVALID_STREET: "L'adresse doit contenir un nom de rue suivi d'un numéro (ex: Rue Centrale 19).",
  STREET_TOO_LONG: "L'adresse ne peut pas dépasser 255 caractères.",
  INVALID_CITY: "La ville ne peut contenir que des lettres.",
  CITY_TOO_SHORT: "La ville doit contenir au moins 2 caractères.", 
  CITY_TOO_LONG: "La ville ne peut pas dépasser 100 caractères.",
  
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères.",
  PASSWORD_TOO_LONG: "Le mot de passe ne peut pas dépasser 255 caractères.",
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
 
  if (firstName.length < 2) return ERRORS.FIRSTNAME_TOO_SHORT; 
  if (firstName.length > 100) return ERRORS.FIRSTNAME_TOO_LONG;
  if (lastName.length < 2) return ERRORS.NAME_TOO_SHORT; 
  if (lastName.length > 100) return ERRORS.NAME_TOO_LONG;

  if (!REGEX_NAME.test(lastName)) return ERRORS.INVALID_NAME;
  if (!REGEX_NAME.test(firstName)) return ERRORS.INVALID_FIRSTNAME;

  if (!REGEX_EMAIL.test(email)) return ERRORS.INVALID_EMAIL;
  if (city.length < 2) return ERRORS.CITY_TOO_SHORT;
   if (city.length > 100) return ERRORS.CITY_TOO_LONG;
  if (!REGEX_NAME.test(city)) return ERRORS.INVALID_CITY;

  if (streetNumber.length > 255) return ERRORS.STREET_TOO_LONG;
  if (!REGEX_STREET.test(streetNumber)) return ERRORS.INVALID_STREET;
  if (password.length < 8) return ERRORS.PASSWORD_TOO_SHORT; 
  if (password.length > 255) return ERRORS.PASSWORD_TOO_LONG;
  if (password !== confirmPassword) return ERRORS.PASSWORD_MISMATCH;

  return null;
};
