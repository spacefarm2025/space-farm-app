import React from "react";
import { useSelector } from "react-redux";
import styles from "./Balance.module.scss";

const Balance = ({ onClick }) => {
  const balance = useSelector((state) => state.user.balance);
  return (
    <div className={styles.balances} onClick={onClick}>
      <p>{balance}</p>
    </div>
  );
};
export default Balance;
