import React from "react";
import style from "./GetSpinsContent.module.scss";

const GetSpinsContent = ({ lang, setPage, setIsOpen }) => {
  const handleClickInvite = () => {
    setPage("earn");
    setIsOpen(false);
  };

  return (
    <div className={style.modalSpins}>
      <h4 style={{ marginBottom: "10px" }}>{lang.spins_not_enough()}</h4>

      <button
        className={style.spinButton}
        style={{ width: "200px", marginTop: "20px" }}
        onClick={handleClickInvite}
      >
        {lang.get_spins()}
      </button>
    </div>
  );
};

export default GetSpinsContent;
