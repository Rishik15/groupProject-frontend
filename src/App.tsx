import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import SignIn from "./pages/SignIn/signin";
import OnboardingSurveyPage from "./pages/OnboardingSurvey/OnboardingSurveyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
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