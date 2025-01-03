import React, { useState } from "react";
import MarsikWelcome_1 from "../../assets/marsik/hero_1.png";
import MarsikWelcome_2 from "../../assets/marsik/hero_2.png";
import MarsikWelcome_3 from "../../assets/marsik/hero_3.png";
import MarsikWelcome_4 from "../../assets/marsik/hero_4.png";
import MarsikWelcome_5 from "../../assets/marsik/hero_5.png";
import styles from "./OnboardStart.module.scss";

import { useSelector } from "react-redux";
import { setViewModal } from "../../api/api";

const OnboardStart = ({ lang, setIsOpen }) => {
  const [step, setStep] = useState(1);

  const user_id = useSelector((state) => state.user.userId);

  const nextStep = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        const response = await setViewModal(user_id, "start");
      } catch (error) {
        console.error("Error registering modal view:", error);
      }
      setIsOpen(false);
    }
  };

  const getContent = () => {
    switch (step) {
      case 1:
        return {
          title: lang.hello_title_step1(),
          text: lang.hello_step1(),
          image: MarsikWelcome_1,
        };
      case 2:
        return {
          title: lang.hello_title_step2(),
          text: lang.hello_step2(),
          image: MarsikWelcome_2,
        };
      case 3:
        return {
          title: lang.hello_title_step3(),
          text: lang.hello_step3(),
          image: MarsikWelcome_3,
        };
      case 4:
        return {
          title: lang.hello_title_step4(),
          text: lang.hello_step4(),
          image: MarsikWelcome_4,
        };
      case 5:
        return {
          title: lang.hello_title_step5(),
          text: lang.hello_step5(),
          image: MarsikWelcome_5,
        };
      default:
        return {
          title: lang.hello_title_step1(),
          text: lang.hello_step1(),
          image: MarsikWelcome_1,
        };
    }
  };

  const { title, text, image } = getContent();

  return (
    <div className={styles.heroModal}>
      <div className={styles.modalContentHero}>
        <div className={styles.welcomePanel}>
          <h2 className={styles.gradientText}>{lang.name}</h2>
          <img src={image} alt="Marsik" className={styles.heroImg} />
          <h3>{title}</h3>
          <div className={styles.welcomeH}>{text}</div>

          <button onClick={nextStep} className={styles.continue}>
            {step < 5 ? lang.continue() : lang.finish()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardStart;
