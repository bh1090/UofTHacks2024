import React from "react";

const TimeLineContent = ({ imgData, index }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <label htmlFor="image">Image</label>
      <img id="image" alt={`Img no: ${index + 1}`} src="" />
      <p>Here's the info!</p>
    </div>
  );
};

export default TimeLineContent;
