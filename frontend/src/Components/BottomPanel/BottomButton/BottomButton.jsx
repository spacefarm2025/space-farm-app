import React from "react";
import styles from "./BottomButton.module.scss";

export const BottomButton = (props) => {
  const audio = new Audio(
    require("../../../assets/sounds/light-switch-156813.mp3")
  );

  const handleClick = () => {
    audio.play().catch((error) => {
      console.error("Ошибка воспроизведения звука:", error);
    });
    audio.volume = 0.1;

    props.setPage(props.name);
  };

  return (
    <div
      className={
        props.page === props.name
          ? `${styles.bottomButton} ${styles.bottomButtonActive}`
          : styles.bottomButton
      }
      onClick={handleClick}
    >
      <img
        src={props.imgSrc}
        alt={props.name}
        className={styles.bottomButtonImage}
      />
    </div>
  );
};
