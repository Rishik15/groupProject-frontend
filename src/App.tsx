import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/auth/ProtectedRoute";
import Register from "./pages/RegisterPage/Register";
import SignIn from "./pages/SignIn/Signin";
import CoachLayout from "./pages/Coach/Coach";
import ClientLayout from "./pages/Client/Client";
import LandingPage from "./pages/LandingPage/LandingPage";
import OnboardingSurveyPage from "./pages/OnboardingSurvey/OnboardingSurveyPage";
import BrowseCoaches from "./pages/Client/BrowseCoaches";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/coaches" element={<BrowseCoaches />} />
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
        <Route
          path="/onboarding/client"
          element={<OnboardingSurveyPage surveyType="client" />}
        />
        <Route
          path="/onboarding/coach"
          element={<OnboardingSurveyPage surveyType="coach" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
