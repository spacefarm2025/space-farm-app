import React from "react";
import { useSelector } from "react-redux";
import hypeBut from "../../assets/hype/hype-min.png";
import wheelBut from "../../assets/wheel/wheel-page.png";
import Balance from "./Balance/Balance";
import styles from "./Header.module.scss";
import Level from "./Level/Level";

export const Header = (props) => {
  const user = useSelector((state) => state.user);

  return (
    <header className={styles.header}>
      <div className={styles.topHeader}>
        <div className={styles.leftHeader}>
          <Balance
            balance={props.balance}
            onClick={() => props.setPage("wallet")}
            className={styles.balance}
          />
          {props.page === "planets" && (
            <img
              onClick={() => props.setPage("hype")}
              className={styles.hypeButton}
              src={hypeBut}
              alt="hype"
            />
          )}
        </div>
        <div className={styles.rightHeader}>
          <Level level={user.level} />
          <div className={styles.energyContainer}>
            <p
              style={{ color: "#613405", marginLeft: "35%", paddingTop: "2%" }}
              onClick={props.onClickEnergy}
            >
              {user?.energy}/{user.energy_limit}
            </p>
          </div>
          {props.page === "planets" && (
            <img
              onClick={() => props.setPage("wheel")}
              className={styles.wheelButton}
              src={wheelBut}
              alt="wheel"
            />
          )}
        </div>
      </div>
    </header>
  );
};
