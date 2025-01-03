import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRate, swapBalance } from "../../api/api";
import tokenImg from "../../assets/wallet/coin.png";
import swapArrowsImg from "../../assets/wallet/swap-arrows.png";
import { fetchUser } from "../../redux/features/userSlice";
import { fetchWallets } from "../../redux/features/walletSlice";
import Accordion from "./Components/Accordion";
import BankContent from "./Components/BankContent";

import styles from "./WalletPage.module.scss";
import TonConnectComponent from "./TonConnect/TonConnect";
import { BackendTokenContext } from "./TonConnect/BackendTokenContext";

import { WalletInfo } from "./TonConnect/WalletInfo";

export const WalletPage = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const { wallets, tokens } = useSelector((state) => state.wallet);
  const { userId } = useSelector((state) => state.user);
  const [activeView, setActiveView] = useState("exchange");
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const [jwtToken, setToken] = useState(null);

  const swapComponentRef = useRef(null);

  const toggleAccordion = (id) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  useEffect(() => {
    dispatch(fetchWallets(userId));
  }, []);

  const handleSwapClick = () => {
    if (swapComponentRef.current) {
      swapComponentRef.current.handleSwap();
    }
  };

  const SwapComponent = forwardRef(({ token, amount }, ref) => {
    const [rate, setRate] = useState(1);
    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount] = useState(0);
    const [error, setError] = useState("");

    useImperativeHandle(ref, () => ({
      handleSwap,
    }));

    const handleFromAmountChange = (e) => {
      const value = e.target.value;
      setError("");
      const numericValue = value.replace(/\D/g, "");
      setFromAmount(numericValue);
      setToAmount(numericValue * rate);
    };

    const handleFocus = () => {
      if (fromAmount === 0) {
        setFromAmount("");
      }
    };

    const handleBlur = () => {
      if (fromAmount === "") {
        setFromAmount(0);
      }
    };

    const handleSwap = async () => {
      if (fromAmount > amount) {
        setError(props.lang.swap_exchange_error_bal());
      } else if (fromAmount > 0) {
        await swapBalance(token.id, 0, userData.id, Number(fromAmount));
        setFromAmount("");
        dispatch(fetchWallets(userData.id));
        dispatch(fetchUser(userData.id));
      } else {
        setError(props.lang.swap_exchange_error_valid());
      }
    };

    useEffect(() => {
      const loadRate = async () => {
        const rateData = await getRate(token.id, 0);

        setRate(rateData);
      };

      loadRate();
    }, [token]);

    return (
      <div className={styles.exchangeFields}>
        <div className={styles.fieldFrom}>
          <label htmlFor="fromAmount">From</label>
          <input
            id="fromAmount"
            value={fromAmount}
            onChange={handleFromAmountChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
          />
          <img
            className={styles.fieldImg}
            src={require(`../../assets/wallet/${token.name}.png`)}
            alt={token.name}
          />
        </div>
        <img className={styles.swapImg} src={swapArrowsImg} alt="swap" />
        <div className={styles.fieldTo}>
          <label htmlFor="toAmount">To</label>
          <input type="number" id="toAmount" value={toAmount} readOnly />
          <img className={styles.fieldImg} src={tokenImg} alt={"token"} />
        </div>
        <p className={styles.swapError}>{error}</p>
      </div>
    );
  });

  return (
    <div className={styles.walletContainer}>
      <div>
        {/* <WalletInfo /> */}
        {/* <TonConnectComponent /> */}
      </div>
      <div className={styles.topButtons}>
        <button
          className={activeView === "exchange" ? styles.active : ""}
          onClick={() => setActiveView("exchange")}
        >
          Exchange
        </button>
        <button
          className={activeView === "bank" ? styles.active : ""}
          onClick={() => setActiveView("bank")}
        >
          Bank
        </button>
      </div>

      {activeView === "exchange" ? (
        <>
          <div className={styles.accordionList}>
            {tokens
              .filter((token) => token.name === "Liquid")
              .map((token) => {
                const wallet = wallets.find((w) => w.token_id === token.id) || {
                  amount: 0,
                };
                return (
                  <Accordion
                    token={token}
                    key={wallet.id}
                    id={wallet.id}
                    isOpen={openAccordionId === wallet.id}
                    toggleAccordion={toggleAccordion}
                    balance={wallet.amount}
                    content={
                      <SwapComponent
                        token={token}
                        ref={swapComponentRef}
                        amount={wallet.amount}
                      />
                    }
                    type="exchange"
                  />
                );
              })}
          </div>
          {openAccordionId && (
            <div className={styles.buttonGroup}>
              <button
                className={styles.exchangeButton}
                onClick={handleSwapClick}
              >
                EXCHANGE
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <BackendTokenContext.Provider value={{ jwtToken, setToken }}>
            <BankContent
              tokens={tokens}
              wallets={wallets}
              user={userData}
              lang={props.lang}
            />
          </BackendTokenContext.Provider>
        </>
      )}
    </div>
  );
};
