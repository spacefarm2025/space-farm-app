import { useBackendAuth } from "./useBackendAuth";
import { useContext } from "react";
import { BackendTokenContext } from "./BackendTokenContext";
import { backendAuth } from "./BackendAuth";
import { useTonWallet } from "@tonconnect/ui-react";

import styles from "./index.module.scss";

export const BackendApi = () => {
  useBackendAuth();

  const { token } = useContext(BackendTokenContext);
  const wallet = useTonWallet();

  if (!token) {
    return null;
  }

  return (
    <>
      {/* <button
        onClick={() =>
          backendAuth
            .getAccountInfo(token, wallet.account)
            .then((v) => alert(JSON.stringify(v)))
        }
        className={styles.connectButton}
      >
        Fetch private data
      </button> */}
    </>
  );
};
