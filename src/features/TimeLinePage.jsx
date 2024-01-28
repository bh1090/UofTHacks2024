import React from "react";
import TimeLineContent from "./TimeLineContent";

const TimeLinePage = () => {
  const imgArr = [1, 2, 3];
  const timeLineHeader = (
    <header>
      <h1>Header title!</h1>
    </header>
  );

  const imageDataArray = imgArr.map((imgData, index) => {

   return <TimeLineContent imgData={imgData} index={index} key={index}/>
  });
  return (
    <>
      {timeLineHeader}
      {imageDataArray}
    </>
  );
};

export default TimeLinePage;
