import React from "react";
import LoginScreen from "./screens/LoginScreen";

import { Route, Routes } from "react-router-dom";
import SignupScreen from "./screens/SignupScreen";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
      </Routes>
    </div>
  );
};

export default App;
