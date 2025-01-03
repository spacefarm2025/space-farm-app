import React, { useEffect, useState } from "react";
import { getRate } from "../../../api/api";
import arrowImg from "../../../assets/wallet/arrow.png";
import tokenImg from "../../../assets/wallet/coin.png";
import css from "./Accordion.module.scss";

const rateCache = {};

const Accordion = ({
  token,
  id,
  isOpen,
  toggleAccordion,
  balance,
  content,
  type,
}) => {
  const [rate, setRate] = useState(rateCache[token.id] || 1);

  useEffect(() => {
    if (!rateCache[token.id]) {
      const loadRate = async () => {
        const rateData = await getRate(token.id, 0);
        rateCache[token.id] = rateData;
        setRate(rateData);
      };

      loadRate();
    }
  }, [token]);

  return (
    <div className={`${css.accordion} ${css[token.name]}`}>
      <div className={css.accordionHeader} onClick={() => toggleAccordion(id)}>
        <div className={css.balanceSection}>
          <div className={css.balanceInfo}>
            {type === "exchange" ? <p>Exchange Rate</p> : <p>Total Balance</p>}
          </div>
          <h3>{type === "exchange" ? rate : balance}</h3>
        </div>
        {type === "exchange" ? (
          <div className={css.exchangeGroup}>
            <div className={css.logoGroup}>
              <img
                className={css.swapLogo}
                src={require(`../../../assets/wallet/${token.name}.png`)}
                alt={token.name}
              />
              <img className={css.arrow} src={arrowImg} alt={"arrow"} />
              <img className={css.tokenLogo} src={tokenImg} alt={"token"} />
            </div>
            <p>Total Balance</p>
            <span>{balance}</span>
          </div>
        ) : (
          <img
            className={css.logo}
            src={require(`../../../assets/wallet/${token.name}.png`)}
            alt={token.name}
          />
        )}
      </div>

      <div className={`${css.accordionContent} ${isOpen ? css.open : ""}`}>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
