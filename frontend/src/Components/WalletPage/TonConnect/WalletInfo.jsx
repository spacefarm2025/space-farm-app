import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import styles from "./index.module.scss";

export const WalletInfo = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  if (!wallet) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <button
        onClick={() => tonConnectUI.disconnect()}
        className={styles.connectButton}
      >
        <img src={wallet.imageUrl} alt="wallet" />
        {/* {wallet.name} */}
        Disconnect
      </button>
    </div>
  );
};
