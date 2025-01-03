import React from "react";
import Comet from "./Comet";
import styles from "./Comet.module.scss";
import { useComets } from "./CometProvider";

const GlobalComets = () => {
  const { comets, handleCollect } = useComets();

  return (
    <div className={styles.cometContainer}>
      {comets.map((comet, index) => (
        <Comet
          key={index}
          id={comet.id}
          cometData={comet}
          onCollect={handleCollect}
        />
      ))}
    </div>
  );
};

export default GlobalComets;
