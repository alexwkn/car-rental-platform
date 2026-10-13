import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider.jsx";
import { ROUTES } from "../routes/routesPath.js";
import "../styles/login.css";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Déjà connecté : pas besoin de repasser par le login
  if (user) {
    return <Navigate to={ROUTES.HOME_ROUTE} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    setError("");
    if (!email || !password) {
      setError("Veuillez entrer l'email et le mot de passe.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(ROUTES.HOME_ROUTE, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">Back-office</span>
          <h1>Connexion</h1>
          <p>Accès réservé aux gestionnaires</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@mail.com"
              autoComplete="username"
              value={credentials.email}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
