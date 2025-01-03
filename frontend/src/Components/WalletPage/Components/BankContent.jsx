import React, { useState } from "react";
import { createTransaction } from "../../../api/api";
import styles from "../WalletPage.module.scss";
import Accordion from "./Accordion";

import { SendTx } from "../TonConnect/SendTx";
import TonConnectComponent from "../TonConnect/TonConnect";

const BankContent = ({ tokens, wallets, user, lang }) => {
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [walletInput, setWalletInput] = useState("");
  const [amountInput, setAmountInput] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showWarning2, setShowWarning2] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const toggleAccordion = (id, token) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
    setSelectedToken(token.name);
  };

  const handleFocus = () => {
    if (amountInput === 0) {
      setAmountInput("");
    }
  };

  const handleBlur = () => {
    if (amountInput === "") {
      setAmountInput(0);
    }
  };

  const handleWithdrawClick = async () => {
    if (!selectedToken) return;

    const tokenMap = {
      SHIB: 1,
      PEPE: 2,
      USDT: 3,
      TON: 5,
    };
    const tokenId = tokenMap[selectedToken.name] || 0;

    try {
      const data = await createTransaction(
        user.id,
        tokenId,
        walletInput,
        amountInput
      );
      if (data.data) {
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleWalletChange = (e) => {
    setWalletInput(e.target.value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    setAmountInput(numericValue);

    if (parseFloat(numericValue) < 5) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    if (parseFloat(numericValue) >= 5) {
      setShowWarning2(true);
    } else {
      setShowWarning2(false);
    }
  };

  const handleAmountTONChange = (e) => {
    const value = e.target.value;

    // Разрешаем только числа и одну точку
    if (!/^\d*\.?\d*$/.test(value)) {
      return; // Если ввод не соответствует шаблону, ничего не делаем
    }

    setAmountInput(value); // Устанавливаем текущее строковое значение в инпуте

    const numericValue = parseFloat(value); // Преобразуем строку в число для проверки

    // Показываем предупреждения в зависимости от значения
    if (numericValue < 0.5) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    if (numericValue >= 0.5) {
      setShowWarning2(true);
    } else {
      setShowWarning2(false);
    }
  };

  const isButtonDisabled = () => {
    return (
      parseFloat(amountInput) < 5 ||
      user.level < 100 ||
      walletInput.trim() === ""
    );
  };

  return (
    <>
      <div className={styles.accordionList}>
        {tokens.map((token) => {
          if (token.name === "Liquid") {
            return null;
          }
          const wallet = wallets.find((w) => w.token_id === token.id) || {
            amount: 0,
          };

          return (
            <Accordion
              token={token}
              key={wallet.id}
              id={wallet.id}
              isOpen={openAccordionId === wallet.id}
              toggleAccordion={() => toggleAccordion(wallet.id, token)}
              balance={wallet.amount}
              content={
                token.name === "TON" ? (
                  <div className={styles.form}>
                    <div className={`${styles.formGroup} ${styles.bankAmount}`}>
                      <label htmlFor="amount">
                        {lang.withdraw_amount_ton()}
                      </label>
                      <input
                        id="amount"
                        name="amount"
                        className={styles.input}
                        value={amountInput}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        min="0"
                        onChange={handleAmountTONChange}
                      />
                      <span className={styles.dollarSign}>{"(TON)"}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.form}>
                      <div
                        className={`${styles.formGroup} ${styles.bankAmount}`}
                      >
                        <label htmlFor="amount">{lang.withdraw_amount()}</label>
                        <input
                          id="amount"
                          name="amount"
                          className={styles.input}
                          value={amountInput}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          min="0"
                          onChange={handleAmountChange}
                        />
                        <span className={styles.dollarSign}>{"($)"}</span>
                      </div>

                      <div
                        className={`${styles.formGroup} ${styles.bankWallet}`}
                      >
                        <input
                          type="text"
                          name="wallet"
                          className={styles.input}
                          placeholder={lang.withdraw_wallet()}
                          value={walletInput}
                          onChange={handleWalletChange}
                        />
                      </div>

                      {showWarning && (
                        <p className={styles.warning}>
                          {lang.withdraw_alert_1()}
                        </p>
                      )}
                      {showWarning2 && (
                        <p className={styles.warning}>
                          {lang.withdraw_alert_3()}
                        </p>
                      )}
                    </div>
                  </>
                )
              }
            />
          );
        })}
        {openAccordionId &&
          (selectedToken === "TON" ? (
            <TonConnectComponent
              walletInput={walletInput}
              amountInput={amountInput}
              token={tokens.find((token) => token.name === "TON")}
            />
          ) : (
            <div className={styles.buttonGroup}>
              <button
                className={styles.withdrawButton}
                onClick={handleWithdrawClick}
                disabled={isButtonDisabled()}
              >
                WITHDRAW
              </button>
              <button className={styles.depositButton}>DEPOSIT</button>
            </div>
          ))}
      </div>
    </>
  );
};

export default BankContent;
