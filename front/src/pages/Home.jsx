import BackOfficeLayout from "../layout/BackOfficeLayout";

import { useState } from "react";
import { useAuth} from "../provider/authProvider.jsx"; 

const Home = () => {
  const { user, logout, login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ 
      ...prevState, 
      [name]: value }));
  }

  const handleLogin = async () => {
    const { email, password } = credentials;
    if (email && password) {
      try {
        await login({ email, password });
      }
      catch (error) {
        console.error("Login failed:", error);
      }
    }
  } 

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
      </div>
    );
  } 
  return (
    <BackOfficeLayout>
      <h1>Bienvenue, {user.email}!</h1>
      <button onClick={logout}>Se déconnecter</button>
    </BackOfficeLayout>
  );
}

export default Home;