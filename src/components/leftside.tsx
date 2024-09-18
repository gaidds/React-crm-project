import React from "react";
import ButtonsComponent from "./notesattachments";
import DescriptionComponent from "./deals-description";

const LeftSide = () => {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <ButtonsComponent />
      </div>
      <div>
        <DescriptionComponent />
      </div>
    </>
  );
};

export default LeftSide;