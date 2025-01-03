import { useContext, useEffect, useRef } from "react";
import { BackendTokenContext } from "./BackendTokenContext";
import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { backendAuth } from "./BackendAuth";
import { useSelector } from "react-redux";

const localStorageKey = "my-dapp-auth-token";
const payloadTTLMS = 1000 * 60 * 20;

export function useBackendAuth() {
  const { setToken } = useContext(BackendTokenContext);
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const interval = useRef();

  const user_id = useSelector((state) => state.user.userId);

  useEffect(() => {
    if (!isConnectionRestored || !setToken) {
      return;
    }

    clearInterval(interval.current);

    if (!wallet) {
      localStorage.removeItem(localStorageKey);
      setToken(null);

      const refreshPayload = async () => {
        tonConnectUI.setConnectRequestParameters({ state: "loading" });

        const value = await backendAuth.generatePayload();
        if (!value) {
          tonConnectUI.setConnectRequestParameters(null);
        } else {
          tonConnectUI.setConnectRequestParameters({ state: "ready", value });
        }
      };

      refreshPayload();
      interval.current = setInterval(refreshPayload, payloadTTLMS);
      return;
    }

    const token = localStorage.getItem(localStorageKey);
    if (token) {
      setToken(token);
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      backendAuth
        .checkProof(wallet.connectItems.tonProof.proof, wallet.account, user_id)
        .then((result) => {
          if (result) {
            setToken(result);
            localStorage.setItem(localStorageKey, result);
          } else {
            alert("Please try another wallet");
            tonConnectUI.disconnect();
          }
        });
    } else {
      alert("Please try another wallet");
      tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, setToken]);
}
