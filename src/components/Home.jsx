import React from "react";
import Head from "./Head";
import Page from "./Page";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Head />
      <Link to={"/timeline"}>To timeline</Link>
      <Page />
    </>
  );
};

export default Home;
