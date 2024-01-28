import React, { useState } from "react";
import "./Page.css";
import MapComponent from "./Map";
import Typewriter from "typewriter-effect";

const Page = () => {

  const [showImgData, setShowImgData] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false)
  const onSubmitClick = (e) => {

    if(!canSubmit){
        console.log("Must have an img to submit~!");
        return null
    }
    console.log("show Timeline images");
    setShowImgData(true)
    
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
            <button type="button" onClick={onSubmitClick} style={{margin: "10px", padding: "10px"}}>SUBMIT</button>
          <MapComponent showImgData={showImgData} setCanSubmit={setCanSubmit}/>

        </section>

      </main>
    </div>
  );
};

export default Page;