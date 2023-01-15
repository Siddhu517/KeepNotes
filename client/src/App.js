import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { UserProvider } from "./context/Context";

import Home from "./components/pages/Home";
import Auth from "./components/pages/Auth";

function App() {
  const isAuth = Boolean(localStorage.getItem("auth"));
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Home /> : <Navigate to="/auth" />}
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
