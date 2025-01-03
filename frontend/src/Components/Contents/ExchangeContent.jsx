import React, { useState } from "react";
import { createTransaction } from "../../api/api";
import styles from "./ExchangeContent.module.scss";

const ExchangeContent = ({ lang, user, token, setIsOpen }) => {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const [showWarning, setShowWarning] = useState(false);
  const [showWarning2, setShowWarning2] = useState(false);
  // const [showWarningLvl, setShowWarningLvl] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (parseFloat(value) < 5) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    if (parseFloat(value) >= 5) {
      setShowWarning2(true);
    } else {
      setShowWarning2(false);
    }

    // if (user.level < 100) {
    //   setShowWarningLvl(true);
    // } else {
    //   setShowWarningLvl(false);
    // }
  };

  const isButtonDisabled = () => {
    return parseFloat(amount) < 5 || user.level < 100 || wallet.trim() === "";
  };

  const handleWalletChange = (e) => {
    setWallet(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenMap = {
      SHIB: 1,
      PEPE: 2,
      USDT: 3,
    };
    const tokenId = tokenMap[token] || 0;

    try {
      const data = await createTransaction(user.id, tokenId, wallet, amount);
      if (data.data) {
      }
    } catch (error) {
      console.error("Failed to send form:", error);
    }
  };

  return (
    <div className={styles.exchangeContent}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <img
            src={require(`../../assets/wallet/${token}.png`)} // Use the token prop to set the image
            className={styles.coinImg}
            alt="Coin"
          />
          <label htmlFor="wallet">{lang.withdraw_wallet()}</label>
          <input
            type="text"
            id="wallet"
            name="wallet"
            className={styles.input}
            placeholder={lang.withdraw_wallet()}
            value={wallet}
            onChange={handleWalletChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amount">{lang.withdraw_amount()}</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={styles.input}
            placeholder={lang.withdraw_amount()}
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        {showWarning && (
          <p className={styles.warning}>{lang.withdraw_alert_1()}</p>
        )}

        {showWarning2 && (
          <p className={styles.warning}>{lang.withdraw_alert_3()}</p>
        )}

        {/* {showWarningLvl && (
          <p className={styles.warning}>{lang.withdraw_alert_2()}</p>
        )} */}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isButtonDisabled()}
        >
          {lang.withdraw_button()}
        </button>
      </form>
    </div>
  );
};

export default ExchangeContent;
