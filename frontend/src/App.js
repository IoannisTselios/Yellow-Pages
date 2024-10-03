import './App.css';
import LoginScreen from './Pages/LoginScreen'; 
import { RegisterScreen } from './Pages/RegisterScreen';
import { HomeScreen } from './Pages/HomeScreen';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
