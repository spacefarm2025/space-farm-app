import {
  useTonWallet,
  useIsConnectionRestored,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useState, useContext } from "react";

import { BackendTokenContext } from "./BackendTokenContext";
import { backendAuth } from "./BackendAuth";

import styles from "./index.module.scss";

export const SendTx = ({ amountInput, token }) => {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [txInProgress, setTxInProgress] = useState(false);
  const [withdrawInProgress, setWithdrawInProgress] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [withdrawId, setWithdrawId] = useState(null);
  const [showVerification, setShowVerification] = useState(false);

  const { jwtToken } = useContext(BackendTokenContext);

  let content;
  switch (true) {
    case !isConnectionRestored:
      content = "Loading...";
      break;
    case txInProgress:
      content = "Tx in progress";
      break;
    case !!wallet:
      content = "DEPOSIT";
      break;
    default:
    case !wallet:
      content = "Connect Wallet";
      break;
  }

  const convertToNanoTON = (amount) => Math.floor(amount * 1_000_000_000);
  const numericInput = Number(amountInput);

  async function handleWithdraw() {
    if (!jwtToken) {
      alert("JWT Token отсутствует!");
      return;
    }

    try {
      const withdrawResponse = await backendAuth.createWithdraw(
        token.id,
        numericInput,
        jwtToken
      );

      if (!withdrawResponse || typeof withdrawResponse.id !== "number") {
        throw new Error("Invalid withdraw ID received from server.");
      }

      setWithdrawId(withdrawResponse.id);
      setShowVerification(true); // Показать форму верификации
    } catch (error) {
      console.error("Ошибка вывода:", error);
      alert(`Ошибка вывода: ${error.message}`);
    }
  }

  async function handleVerify() {
    if (!withdrawId) {
      alert("ID вывода отсутствует!");
      return;
    }

    const numericCode = Number(confirmationCode);
    if (isNaN(numericCode)) {
      alert("Invalid code: must be a numeric value.");
      return;
    }

    try {
      const verifyResponse = await backendAuth.verifyWithdraw(
        withdrawId,
        numericCode,
        jwtToken
      );

      if (verifyResponse && verifyResponse.transaction_id) {
        alert(
          `Вывод успешно выполнен! Транзакция: ${verifyResponse.transaction_id}`
        );
        setShowVerification(false); // Вернуться к исходному интерфейсу
      } else {
        alert(`Транзакция: ${JSON.stringify(verifyResponse)}`);
      }
    } catch (error) {
      console.error("Ошибка подтверждения вывода:", error);
      alert(`Ошибка подтверждения: ${error.message}`);
    }
  }

  const handleDeposit = async () => {
    if (!wallet) {
      tonConnectUI.connectWallet();
    } else if (!amountInput) {
      alert("Введите корректную сумму.");
    } else {
      setTxInProgress(true);
      try {
        const nanoTON = convertToNanoTON(amountInput);

        await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              amount: nanoTON.toString(),
              payload,
            },
          ],
        });

        const response = await backendAuth.addTokens(
          token.id,
          numericInput,
          jwtToken
        );
        alert("Transaction completed successfully!");
      } catch (e) {
        console.error("Transaction error:", e);
        alert("Transaction failed.");
      } finally {
        setTxInProgress(false);
      }
    }
  };

  return (
    <div className={styles.buttonGroup}>
      {showVerification ? (
        <div className={styles.verificationContainer}>
          <input
            id="confirmationCode"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className={styles.inputField}
            placeholder="Enter code"
          />
          <button
            className={styles.verifyButton}
            onClick={handleVerify}
            disabled={withdrawInProgress || !confirmationCode}
          >
            Verify Withdraw
          </button>
        </div>
      ) : (
        <>
          <button
            className={styles.depositButton}
            disabled={!isConnectionRestored || txInProgress}
            onClick={handleDeposit}
          >
            {content}
          </button>
          <button
            onClick={handleWithdraw}
            className={styles.withdrawButton}
            disabled={txInProgress}
          >
            WITHDRAW
          </button>
        </>
      )}
    </div>
  );
};
