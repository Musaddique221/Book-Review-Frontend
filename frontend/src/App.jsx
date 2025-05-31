import React from "react";
import { Route, Routes } from "react-router-dom";


import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import BookScreen from "./screens/BookScreen";
import SingleBookScreen from "./screens/SingleBookScreen";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/books" element={<BookScreen />} />
        <Route path="/book/:id" element={<SingleBookScreen />} />
      </Routes>
    </div>
  );
};

export default App;
