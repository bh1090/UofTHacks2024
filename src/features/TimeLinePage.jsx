import React from "react";
import TimeLineContent from "./TimeLineContent";
import TimeLineDisplay from "./TimeLineDisplay";

const TimeLinePage = ({ imgData }) => {
  if (!Array.isArray(imgData)) {
    console.error("img data must be n array");
    return null;
  }

  const imgArr = [1, 2, 3];
  const timeLineHeader = (
    <header>
      <h1 style={{ marginTop: "50px" }}>Header title!</h1>
    </header>
  );

  const imageDataArray = imgArr.map((imgData, index) => {
    return <TimeLineContent imgData={imgData} index={index} key={index} />;
  });
  return (
    <>
      {timeLineHeader}
      {/* {imageDataArray} */}
      <TimeLineDisplay imgDataArr={imgArr} />
    </>
  );
};

export default TimeLinePage;
