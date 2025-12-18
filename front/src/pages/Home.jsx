import BackOfficeLayout from "../layout/BackOfficeLayout";

import { useState } from "react";
import { useAuth } from "../provider/authProvider.jsx";

const Home = () => {
  const { user, logout, login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const { email, password } = credentials;
    setError("");
    if (email && password) {
      try {
        await login({ email, password });
      } catch (error) {
        console.error("Login failed:", error);
        setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
      }
    } else {
      setError("Veuillez entrer l'email et le mot de passe.");
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Page de connexion</h1>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
        />
        <button onClick={handleLogin}>Se connecter</button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    );
  }
  return (
    <BackOfficeLayout>
      <h1>Bienvenue, {user.email} dans le back office!</h1>
      <button onClick={logout}>Se déconnecter</button>
    </BackOfficeLayout>
  );
};

export default Home;
