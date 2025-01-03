import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRate, swapBalance } from "../../../api/api";
import arrowImg from "../../../assets/wallet/arrow.png";
import sft from "../../../assets/wallet/coin.png";
import { fetchUser } from "../../../redux/features/userSlice";
import { fetchWallets } from "../../../redux/features/walletSlice";
import css from "./SwapModal.module.scss";

const SwapModal = ({ lang, openModal, setIsOpen, token }) => {
  const userData = useSelector((state) => state.user);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [rate, setRate] = useState(1);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const dispatch = useDispatch();

  const token_src = require(`../../../assets/wallet/${token.name}.png`);

  useEffect(() => {
    const loadRate = async () => {
      const rateData = await getRate(token.id, 0);
      setRate(rateData);
    };

    loadRate();
  }, [token]);

  const handleSwap = async () => {
    if (amount > token.amount) {
      setError(lang.swap_exchange_error_bal());
    } else if (amount > 0) {
      await swapBalance(token.id, 0, userData.id, Number(amount));
      setAmount("");
      dispatch(fetchWallets(userData.id));
      dispatch(fetchUser(userData.id));
    } else {
      setError(lang.swap_exchange_error_valid());
    }
  };

  useEffect(() => {
    setCalculatedAmount(Number(amount) * rate);
  }, [amount, rate]);

  return (
    <>
      <div className={css.containerSwap}>
        <div className={css.imgContainer}>
          <img className={css.coinImg} src={token_src} alt="Token" />
          <img className={css.arrowImg} src={arrowImg} alt="to" />
          <img className={css.coinImg} src={sft} alt="Sft Coin" />
        </div>
        <div className={css.inputContainer}>
          <input
            value={amount}
            onChange={(e) => {
              setError("");
              setAmount(e.target.value);
            }}
            placeholder={lang.swap_exchange_placeholder()}
            className={css.amountInput}
          />
          {amount && !isNaN(calculatedAmount) && (
            <div className={css.calculatedAmount}>
              {`You will receive ${calculatedAmount} SFT`}
            </div>
          )}
          <p className={css.error}>{error}</p>
        </div>
        <button className={css.swapButton} onClick={handleSwap}>
          {lang.swap_exchange()}
        </button>
      </div>
    </>
  );
};

export default SwapModal;
