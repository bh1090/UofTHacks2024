import React, { useState } from "react";
import TimeLineContent from "./TimeLineContent";

//arrows components
const TimeLineDisplay = ({ imgDataArr }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!Array.isArray(imgDataArr)) {
    console.error("img data must be n array");
    return null;
  }

  const onPreviousClick = () =>{

    if(currentIndex === 0){
        console.log("Start of images array: ", currentIndex);
        return null
    }
    setCurrentIndex(currentIndex-1)
  }

  const onNextClick = () => {

    if(currentIndex === imgDataArr.length - 1){
        console.log("End of images array: ", currentIndex);
        return null
    }
    setCurrentIndex(currentIndex+1)
  }
  if (!Array.isArray(imgDataArr)) {
    console.error("img data must be n array");
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    
      
      <TimeLineContent imgData={imgDataArr[currentIndex]} index={currentIndex} />

<div>
<button id="decrementImage" type="button" onClick={onPreviousClick}>
        {"<"}
      </button>
      <button id="incrementImage" type="button" onClick={onNextClick}>
        {">"}
      </button>
</div>
      
    </div>
  );
};

export default TimeLineDisplay;
