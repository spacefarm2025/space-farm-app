import React from "react";
import styles from "./UserCat.module.scss";

const UserCat = ({ user }) => {
  const imageIndex = Math.floor((user.level - 1) / 10) + 1;

  const catImg = require(`../../../assets/leaderboard/cat.png`);

  const circleImg = require(`../../../assets/leaderboard/circle/${imageIndex}-circle.png`);
  const catTitle = require(`../../../assets/leaderboard/title/${imageIndex}-title.png`);

  return (
    <>
      <div className={styles.catRing}>
        <img src={circleImg} className={styles.circleImage} alt="Circle Cat" />

        <img src={catImg} className={styles.catImage} alt="Cute Cat" />
      </div>

      <div className={styles.title}>
        <img src={catTitle} className={styles.titleImage} alt="Cute Cat" />
      </div>
    </>
  );
};

export default UserCat;
