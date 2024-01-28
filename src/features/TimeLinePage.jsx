import React from "react";
import TimeLineContent from "./TimeLineContent";
import TimeLineDisplay from "./TimeLineDisplay";

const TimeLinePage = ({ imgDataArr, imgDataTextInfo }) => {
  if (!Array.isArray(imgDataArr)) {
    console.error("img data must be n array");
    return null;
  }

//   const imgArr = [1, 2, 3];
  const timeLineHeader = (
    <header>
      <h1 style={{ marginTop: "50px" }}>{imgDataTextInfo.address}</h1>
    </header>
  );

//   const imageDataArray = imgArr.map((imgData, index) => {
//     return <TimeLineContent imgData={imgData} index={index} key={index} />;
//   });
  return (
    <>
      {timeLineHeader}
      {/* {imageDataArray} */}
      <TimeLineDisplay imgDataArr={imgDataArr} imgDataTextInfo={imgDataTextInfo} />
    </>
  );
};

export default TimeLinePage;
