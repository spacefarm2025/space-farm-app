import React from "react";
import styles from "./WalletItem.module.scss";

import sft from "../../../assets/wallet/coin.png";

export const WalletItem = ({ swapRole = false, ...props }) => {
  const token_src = require(`../../../assets/wallet/${props.tokenName}.png`);

  const handleOpenModal = () => {
    if (props.tokenName === "Liquid") {
      const token = {
        name: props.tokenName,
        id: props.tokenId,
        amount: props.amount,
      };
      props.openModal("swap", null, null, token);
    } else {
      props.openModal("coming");
    }
  };

  return (
    <div className={styles.walletItemContainer} onClick={handleOpenModal}>
      {swapRole ? (
        <>
          <img src={token_src} alt="Token" />
          <button className={styles.tokenButton}></button>
          <img src={sft} alt="Sft Coin" />
        </>
      ) : (
        <>
          <img src={sft} alt="Sft Coin" />
          <button className={styles.tokenButton}></button>
          <img src={token_src} alt="Token" />
        </>
      )}

      <div className={styles.walletItemLockContainer}>
        {/* <img src={require("../../assets/lock-small.png")} alt="lock" /> */}
      </div>
    </div>
  );
};
