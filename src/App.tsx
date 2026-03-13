import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './pages/RegisterPage/Register';
import LandingPage from './pages/LandingPage/LandingPage';


function App() {
  return (
  <Router>
    <Routes>
      <Route path="/landing" element={<LandingPage/>} />
      <Route path="/register" element={<Register/>} />
    </Routes> 
  </Router>
  );
}

export default App;