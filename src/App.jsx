import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { firebaseApp } from "./firebaseConfig";

const App = () => {
  console.log(firebaseApp, " firebase");
  return (
    <BrowserRouter>
      <Routes>
    
          <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
