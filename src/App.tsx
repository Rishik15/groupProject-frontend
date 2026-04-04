import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/auth/ProtectedRoute";
import Register from "./pages/RegisterPage/Register";
import SignIn from "./pages/SignIn/Signin";
import CoachLayout from "./pages/Coach/Coach";
import ClientLayout from "./pages/Client/Client";
import LandingPage from "./pages/LandingPage/LandingPage";
import BrowseCoaches from "./pages/Client/BrowseCoaches";
import CoachProfile from "./pages/Client/CoachProfile";

/*
import CoachProfile from "./pages/Coach/CoachProfile";
<Route path="/coaches/:id" element={<CoachProfile />} />

*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/coaches" element={<BrowseCoaches />} />
        <Route path="/coaches/:id" element={<CoachProfile />} />
        <Route
          path="/coach/*"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;