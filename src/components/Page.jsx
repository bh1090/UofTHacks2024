import React from "react";
import "./Page.css";
import MapComponent from "./Map";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";

const Page = () => {

  const naviagte = useNavigate()

  const onSubmitClick = () => {

    console.log("To timeline page");
    naviagte("/timeline")
  }
  return (
    <div className="container">
        <nav>
          <p className="typeAnimation">
            <Typewriter
              options={{
                strings: [
                  'Time to Time-Travel with us?',
                  'Could we be a part of your MEMORY LANE?',
                  'WOW, SO NOSTALGIC !!',
                  'Take a Trip down Memory Lane :)'],
                autoStart: true,
                loop: true,
              }}
            />
          </p>
        </nav>
      <main>
        <section className="main-content">
            <button>Here comes Google Map Searching</button>
            <button type="button" onClick={onSubmitClick}>SUBMIT</button>
          <MapComponent />

        </section>

      </main>
    </div>
  );
};

export default Page;