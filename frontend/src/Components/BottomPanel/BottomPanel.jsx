import React from "react";
import { BottomButton } from "./BottomButton/BottomButton";
import styles from "./BottomPanel.module.scss";

export const BottomPanel = (props) => {
  return (
    <footer className={styles.bottomPanel}>
      <BottomButton
        name="shop"
        imgSrc={require("../../assets/menu-item-shop.png")}
        setPage={props.setPage}
        page={props.page}
      />
      <BottomButton
        name="earn"
        imgSrc={require("../../assets/menu-item-crystal.png")}
        setPage={props.setPage}
        page={props.page}
      />
      <BottomButton
        name="planets"
        imgSrc={require("../../assets/central-button.png")}
        setPage={props.setPage}
        page={props.page}
      />
      <BottomButton
        name="wallet"
        imgSrc={require("../../assets/menu-item-wallet.png")}
        setPage={props.setPage}
        page={props.page}
      />
      <BottomButton
        name="leaderboard"
        imgSrc={require("../../assets/menu-item-leader.png")}
        setPage={props.setPage}
        page={props.page}
      />
    </footer>
  );
};
