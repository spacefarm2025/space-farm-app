import React from "react";
import "./ComingSoonContent.css";

const ComingSoonContent = ({ lang }) => {
  return (
    <div className="modal-soon">
      <h2>{lang.coming_soon()}</h2>
    </div>
  );
};
export default ComingSoonContent;
