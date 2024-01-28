import React from 'react';
import {Head, Page} from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import TimeLinePage from './features/TimeLinePage';

const App = () => {
  return (
    <BrowserRouter>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/timeline" element={<TimeLinePage/>}/>
        </Routes>
       

    </BrowserRouter>
  )
}

export default App;