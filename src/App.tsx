import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './pages/RegisterPage/Register';
import SignIn from './pages/SignIn/signin';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/signin" element= {<SignIn/>} />
    </Routes> 
  </Router>
  );
}

export default App;