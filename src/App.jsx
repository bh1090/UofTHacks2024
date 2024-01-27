import React from 'react';
import {Head, Page} from "./components";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>

        <Head/>
        <Page/>

    </BrowserRouter>
  )
}

export default App;