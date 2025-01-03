import React from "react";
import closeImg from "../../../assets/wheel/close.png";
import css from "./Popup.module.scss";

const Popup = ({ onClose, title, buttonTitle, content, className }) => {
  return (
    <div className={`${css.popup} ${className && className}`}>
      <div className={css.popupContent}>
        <div className={css.popupHeader}>
          <h2>{title}</h2>
        </div>
        <div className={css.popupBody}>
          <div className={css.content}>{content}</div>
          {buttonTitle && (
            <button className={css.popButton}>{buttonTitle}</button>
          )}
        </div>
      </div>
      <img
        className={css.closeButton}
        onClick={onClose}
        src={closeImg}
        alt={"close"}
      />
    </div>
  );
};

export default Popup;
