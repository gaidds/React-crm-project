import React from "react";
import ButtonsComponent from "./Notesattachments";
import DescriptionComponent from "./DealsDescription";

const LeftSide = () => {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <ButtonsComponent />
      </div>
      <div>
        {/* <DescriptionComponent /> */}
      </div>
    </>
  );
};

export default LeftSide;