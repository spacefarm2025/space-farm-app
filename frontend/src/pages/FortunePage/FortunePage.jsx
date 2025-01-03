import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shibImage from "../../assets/wheel/Doge.png";
import spinsImage from "../../assets/wheel/Free-spin.png";
import pepeImage from "../../assets/wheel/Pepe.png";
import usdtImage from "../../assets/wheel/Tether.png";
import tokenImage from "../../assets/wheel/Token.png";
import { fetchSegments } from "../../redux/features/segmentsSlice";
import { fetchUser, fetchUserSpins } from "../../redux/features/userSlice";
import FirstWheel from "./components/FirstWheel";
import Popup from "./components/Popup";
import SecondWheel from "./components/SecondWheel";
import css from "./FortunePage.module.scss";

const FortunePage = ({ lang, openModal }) => {
  const dispatch = useDispatch();
  const [showSecondWheel, setShowSecondWheel] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [winData, setWinData] = useState(null);
  const segments = useSelector((state) => state.segments.segments);
  const spinResult = useSelector((state) => state.spin);
  const user_id = useSelector((state) => state.user.userId);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchUserSpins(user_id));
    }

    dispatch(fetchSegments());
  }, [dispatch]);

  const handleFirstSpinEnd = () => {
    if (spinResult.firstWheelPrize.specialType !== "Lose") {
      setShowSecondWheel(true);
    }
  };

  const handleSecondSpinEnd = () => {
    setShowSecondWheel(false);
    dispatch(fetchUser(user_id));

    const type = spinResult.firstWheelPrize.specialType;
    if (spinResult) {
      let image = null;
      switch (type) {
        case "Token":
          image = tokenImage;
          break;
        case "USDT":
          image = usdtImage;
          break;
        case "Free spin":
          image = spinsImage;
          break;
        case "SHIB":
          image = shibImage;
          break;
        case "PEPE":
          image = pepeImage;
          break;
        default:
          image = null;
      }
      if (spinResult) {
        setWinData({
          image,
          name: spinResult.firstWheelPrize.name,
          amount: spinResult.secondWheelPrize.name,
        });
        setShowWinPopup(true);
      }
    }
  };

  const closeWinPopup = () => {
    setShowWinPopup(false);
    setWinData(null);
  };

  return (
    <div className={css.main}>
      {showWinPopup && (
        <Popup
          title="Your Prize"
          onClose={closeWinPopup}
          content={
            <div className={css.winContent}>
              {winData.image && <img src={winData.image} alt="Prize" />}
              <p>
                {winData.amount} {winData.name}
              </p>
            </div>
          }
        />
      )}
      {!showWinPopup &&
        (showSecondWheel ? (
          <SecondWheel
            segments={spinResult.firstWheelPrize.secondWheelPrizes || []}
            onSpinEnd={handleSecondSpinEnd}
            title="Prize Size"
            secondWheelPrize={spinResult.secondWheelPrize}
          />
        ) : (
          <FirstWheel
            segments={segments}
            onSpinEnd={handleFirstSpinEnd}
            title="Choose Prize"
            openModal={openModal}
          />
        ))}
    </div>
  );
};

export default FortunePage;
