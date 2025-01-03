import React from "react";
import styles from "./WithdrawItem.module.scss";

export const WithdrawItem = (props) => {
  const token_src = require(`../../../assets/wallet/${props.token}.png`);

  const handleTokenClick = () => {
    props.openModal("exchange");
    props.setCurrentToken(props.token);
  };

  return (
    <div className={styles.withdrawItemContainer} onClick={handleTokenClick}>
      <button className={styles.tokenButton}></button>{" "}
      <img src={token_src} alt="Token" />
      <div className={styles.withdrawItemLockContainer}></div>
    </div>
  );
};
