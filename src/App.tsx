import { AuthProvider } from "./hook/AuthContext";
import NavigatorBrowser from "./navigate/navigator";



const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigatorBrowser />
    </AuthProvider>
  );
};

export default App;
