import BackOfficeLayout from "../layout/BackOfficeLayout";
import { useAuth } from "../provider/authProvider.jsx";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <BackOfficeLayout>
      <h1>Bienvenue, {user.email} dans le back office!</h1>
      <button onClick={logout}>Se déconnecter</button>
    </BackOfficeLayout>
  );
};

export default Home;
