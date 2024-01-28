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
          src={imgData?.imgSrc}
          // src={imgSrc}
          alt={`Img no: ${index + 1}`}
          style={{
            width: "100%",
            height: "auto",
            marginTop: "20px",
            margin: "5px",
          }}
        />
        <p>Year: {imgData?.year || "User uploaded"}</p>
      </div>
      <div className="content-size-text">
        <p>
          {imgData?.card1}
          <br></br>
          {imgData?.card2}
        </p>
        <p>
          <strong>Summary: </strong> {imgDataTextInfo?.summary}
        </p>
      </div>
    </div>
    // </div>
  );
};

export default TimeLineContent;
