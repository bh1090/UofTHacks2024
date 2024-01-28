import React from "react";
import imgSrc from "../images/2009-01.jpg";
import "./TimeLineContent.css";
if (!imgSrc) {
  console.log("No img found");
}
const TimeLineContent = ({ imgData, index, imgDataTextInfo }) => {
  return (
    <div
      className="image-text-container"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <label htmlFor="image">Image No {index + 1}</label> */}
      {/* <div className="image-text-container"> */}
      <div className="content-size">
        <img
          src={imgData.imgSrc}
          alt={`Img no: ${index + 1}`}
          style={{
            width: "100%",
            height: "auto",
            marginTop: "20px",
            margin: "5px",
            // /borderRadius: '5%'/
          }}
        />
      </div>
      <div className="content-size">
        <p>
          Card1: {imgDataTextInfo.card1}
          Card2: {imgDataTextInfo.card2}
        </p>
        <p>Summary: {imgDataTextInfo.summary}</p>
      </div>
    </div>
    // </div>
  );
};

export default TimeLineContent;
