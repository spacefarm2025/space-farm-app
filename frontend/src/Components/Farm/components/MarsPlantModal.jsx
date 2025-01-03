import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chargePlanting } from "../../../api/api";
import batteryImg from "../../../assets/mars-farm/battery.png";
import { fetchUser } from "../../../redux/features/userSlice";
import css from "./MarsPlantModal.module.scss";

const MarsPlantModal = ({ planting, setIsOpen, openModal }) => {
  const userData = useSelector((state) => state.user);
  const [charge, setCharge] = useState(3);
  const dispatch = useDispatch();

  const min = charge * 20;

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
          Select energy to charge: {charge}{" "}
          <img className={css.battery} src={batteryImg} alt="energy" />
        </span>
        <input
          type="range"
          min="1"
          max="3"
          value={charge}
          onChange={(e) => setCharge(parseInt(e.target.value))}
          className={css.energySlider}
        />
        <span>
          Сollect in <span className={css.min}>{min}</span> minutes
        </span>
        <button className={css.chargeButton} onClick={handleCharge}>
          Charge {charge}{" "}
          <img className={css.battery} src={batteryImg} alt="energy" />
        </button>
      </div>
    </>
  );
};

export default MarsPlantModal;
