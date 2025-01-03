import React, { useEffect, useState } from "react";
import closeImg from "../../../assets/modals/Cancel.png";
import UpImg from "../../../assets/shop/upgrade.png";
import css from "./UpgradeModal.module.scss";

const UpgradeModal = ({ isOpen, onClose, itemName }) => {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);

      switch (itemName) {
        case "potato":
          setTime(1);
          setIncome(20);
          break;
        case "carrot":
          setTime(3);
          setIncome(30);
          break;
        case "popcorn":
          setTime(5);
          setIncome(40);
          break;
        case "flower":
          setTime(10);
          setIncome(60);
          break;
        case "cabbage":
          setTime(20);
          setIncome(80);
          break;
        case "blueberry":
          setTime(35);
          setIncome(110);
          break;
        default:
          setTime(0);
          setIncome(0);
      }
    } else {
      setVisible(false);
    }
  }, [isOpen, itemName]);

  if (!isOpen) return null;

  return (
    <div
      className={`${css.modalOverlay} ${visible ? `${css.visible}` : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`${css.modalContent} ${visible ? `${css.zoomIn}` : ""}`}>
        <span className={css.level}>1</span>
        <span className={css.time}>{time} min</span>
        <p className={css.incText}>Income:</p>
        <div className={css.incomeCont}>
          <span className={css.income}>{income}</span>
          <span className={css.plusIncom}>+{income}</span>
        </div>
        <p className={css.price}>Coming soon</p>
        <img
          src={require(`../../../assets/seeds/${itemName}.png`)}
          alt="Seed"
          className={css.seedImg}
        />
        <img
          src={closeImg}
          alt="close"
          className={css.close}
          onClick={onClose}
        />
        <img src={UpImg} alt="upgrade" className={css.upgrade} />
      </div>
    </div>
  );
};

export default UpgradeModal;
