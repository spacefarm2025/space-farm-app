import React, { useState } from "react";
import { useSelector } from "react-redux";
import { setViewModal } from "../../api/api";
import cat1image from "../../assets/cometOnboarding/cat.png";
import cat2image from "../../assets/cometOnboarding/cat2.png";
import fingerImage from "../../assets/cometOnboarding/Finger.png";
import infoImage from "../../assets/cometOnboarding/Info.png";
import cometImage from "../../assets/comets/3.png";
import styles from "./CometOnboarding.module.scss";

const CometOnboarding = ({ lang, setIsOpen }) => {
  const [step, setStep] = useState(1);
  const user_id = useSelector((state) => state.user.userId);

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const response = await setViewModal(user_id, "comets");
        setIsOpen(false);
      } catch (error) {
        console.error("Error registering comet onboarding view:", error);
      }
    }
  };

  return (
    <div className={styles.cometOnboarding} onClick={nextStep}>
      {step === 1 && (
        <>
          <div className={styles.cometContainer}>
            <img src={cometImage} alt="Comet" className={styles.cometImage} />
            <img
              src={fingerImage}
              alt="Finger"
              className={styles.fingerImage}
            />
          </div>

          <img src={cat1image} alt="cat" className={styles.firstCat} />
          <div className={styles.rect}>
            <p className={styles.prompttext}>{lang.tap_comet_prompt()}</p>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <img src={cat2image} alt="cat" className={styles.secondCat} />
          <div className={styles.rect}>
            <p className={styles.rewardtext}>{lang.tap_comet_reward()}</p>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <img src={infoImage} alt="Rewards" className={styles.rewardsImage} />
        </>
      )}
    </div>
  );
};

export default CometOnboarding;
