import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/auth/ProtectedRoute";
import Register from "./pages/RegisterPage/Register";
import SignIn from "./pages/SignIn/Signin";
import Coach from "./pages/Coach/coach";
import Client from "./pages/Client/client";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <Coach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Client />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
