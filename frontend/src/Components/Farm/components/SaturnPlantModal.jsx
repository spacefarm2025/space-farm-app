import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chargePlanting } from "../../../api/api";
import liquidImg from "../../../assets/wallet/Liquid.png";
import { fetchUser } from "../../../redux/features/userSlice";
import css from "./SaturnPlantModal.module.scss";
const SaturnPlantModal = ({ planting, setIsOpen, openModal }) => {
  const userData = useSelector((state) => state.user);
  const [charge, setCharge] = useState(3);
  const dispatch = useDispatch();
  const min = charge;
  const collect = charge * 100;
  const handleCharge = async () => {
    dispatch(fetchUser(userData.userId));
    if (userData.energy < charge) {
      openModal("energy");
    } else {
      await chargePlanting(planting.id, charge);
      dispatch(fetchUser(userData.userId));
      setIsOpen(false);
    }
  };
  return (
    <>
      <div className={css.modalHeading}>
        <h2 className={css.rotatedText}>Сharge</h2>
      </div>
      <div className={css.containerPlantation}>
        <span className={css.energyLabel}>
          Select liquid to charge: {charge}{" "}
          <img className={css.battery} src={liquidImg} alt="liq" />
        </span>
        <input
          type="range"
          min="1"
          max="4"
          value={charge}
          onChange={(e) => setCharge(parseInt(e.target.value))}
          className={css.energySlider}
        />
        <span>
          Сollect <span className={css.min}>{collect} SCFA</span> in{" "}
          <span className={css.min}>{min}</span> hours
        </span>
        <button className={css.chargeButton} onClick={handleCharge}>
          Charge {charge}{" "}
          <img className={css.battery} src={liquidImg} alt="liq" />
        </button>
      </div>
    </>
  );
};
export default SaturnPlantModal;
