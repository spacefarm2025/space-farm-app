import React from "react";
import styles from "./Level.module.scss";

import img1 from "../../../assets/header/grades/1-lvl.png";
import img10 from "../../../assets/header/grades/10-lvl.png";
import img2 from "../../../assets/header/grades/2-lvl.png";
import img3 from "../../../assets/header/grades/3-lvl.png";
import img4 from "../../../assets/header/grades/4-lvl.png";
import img5 from "../../../assets/header/grades/5-lvl.png";
import img6 from "../../../assets/header/grades/6-lvl.png";
import img7 from "../../../assets/header/grades/7-lvl.png";
import img8 from "../../../assets/header/grades/8-lvl.png";
import img9 from "../../../assets/header/grades/9-lvl.png";

const images = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
  9: img9,
  10: img10,
};

const Level = (props) => {
  const getBackgroundImage = () => {
    const levelGroup = Math.floor((props.level - 1) / 10) + 1;
    return images[levelGroup];
  };

  return (
    <div
      className={styles.levelContainer}
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <p style={{ marginLeft: "20%", paddingTop: "3%" }}>{props.level}</p>
    </div>
  );
};

export default Level;
