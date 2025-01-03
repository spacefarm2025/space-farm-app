import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTelegram } from "../../../Hooks/useTelegram";
import { fetchUser } from "../../../redux/features/userSlice";
import styles from "./Comet.module.scss";

const getRandomStartPosition = () => {
  const side = Math.random() > 0.5 ? "left" : "right";
  const margin = 10;
  const position = Math.random() * (100 - margin * 2) + margin;
  return {
    top: "-10%",
    [side]: `${position}%`,
  };
};

const getRandomEndPosition = () => {
  const side = Math.random() > 0.5 ? "left" : "right";
  const margin = 10;
  const position = Math.random() * (100 - margin * 2) + margin;
  return {
    top: "110%",
    [side]: `${position}%`,
  };
};

const Comet = ({ id, onCollect, cometData }) => {
  const [startPosition, setStartPosition] = useState(getRandomStartPosition());
  const [endPosition, setEndPosition] = useState(getRandomEndPosition());
  const [collected, setCollected] = useState(false);
  const [reward, setReward] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { tg } = useTelegram();

  useEffect(() => {
    const removeTimeout = setTimeout(() => {
      setCollected(true);
    }, 5000);

    return () => {
      clearTimeout(removeTimeout);
    };
  }, []);

  const [claimCometSound] = useState(
    new Audio(require("../../../assets/sounds/multi-coin-payout-5-213723.mp3"))
  );

  const handlePlayClaimCometSound = () => {
    claimCometSound.loop = false;
    claimCometSound.volume = 0.1;
    claimCometSound.play().catch((error) => {
      console.error("Ошибка воспроизведения аудио:", error);
    });
  };

  const handleClick = async (event) => {
    tg.HapticFeedback.impactOccurred("heavy");
    handlePlayClaimCometSound();

    const rewardAmount = cometData.earn;
    const rewardPosition = {
      top: event.clientY,
      left: event.clientX,
    };

    let rewardType;
    switch (cometData.comet_id) {
      case 1:
        rewardType = "SFT";
        break;
      case 2:
        rewardType = "Energy";
        break;
      case 3:
        rewardType = "PEPE";
        break;
      case 4:
        rewardType = "SHIB";
        break;
      case 5:
        rewardType = "USDT";
        break;
      case 6:
        rewardType = "SFT";
        break;
      case 7:
        rewardType = "SFT";
        break;
      default:
        rewardType = "$";
    }

    setReward({
      position: rewardPosition,
      amount: rewardAmount,
      type: rewardType,
    });

    setTimeout(() => {
      setReward(null);
      setCollected(true);
      onCollect(id);
      dispatch(fetchUser(user.id));
    }, 1000);

    try {
      const response = await fetch(
        "https://api.spacefarm.ink/api/v1/user/comet/claim",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comet_id: cometData.id }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error collecting comet:", error);
    }
  };

  if (collected) return null;

  return (
    <>
      {!reward ? (
        <motion.img
          src={require(`../../../assets/comets/${cometData.comet_id}.png`)}
          alt="Comet"
          className={styles.comet}
          initial={startPosition}
          animate={endPosition}
          transition={{ duration: 5, ease: "linear" }}
          onClick={handleClick}
        />
      ) : (
        <h1
          className={styles.reward}
          style={{
            top: `${reward.position.top}px`,
            left: `${reward.position.left}px`,
          }}
        >
          +{reward.amount} {reward.type}
        </h1>
      )}
    </>
  );
};

export default Comet;
