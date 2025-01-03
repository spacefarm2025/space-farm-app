import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
// import { AddressInfo } from "./AddressInfo";
import { WalletInfo } from "./WalletInfo";
import { SendTx } from "./SendTx";
import { BackendTokenContext } from "./BackendTokenContext";
import { useState } from "react";
import { BackendApi } from "./BackendApi";

import styles from "./index.module.scss";

const TonConnectComponent = ({ codeInput, amountInput, token }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [jwtToken, setToken] = useState(null);

  return (
    <BackendTokenContext.Provider value={{ jwtToken, setToken }}>
      {/* <TonConnectButton /> */}
      <div className={styles.tonConnectContainer}>
        <SendTx amountInput={amountInput} token={token} />
        <BackendApi />

        {/* <AddressInfo /> */}
        <WalletInfo />
      </div>
    </BackendTokenContext.Provider>
  );
};

export default TonConnectComponent;
