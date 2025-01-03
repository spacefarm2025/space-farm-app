import React, { useEffect, useState } from "react";
import smallScreenSpaceBg from "../../assets/back-small.png";
import normalSpaceBg from "../../assets/back.png";
import { ShopPage } from "../../pages/ShopPage/ShopPage";
import { TasksPage } from "../../pages/TasksPage/TasksPage";
import { WalletPage } from "../WalletPage/WalletPage";

import FortunePage from "../../pages/FortunePage/FortunePage";
import LeaderboardPage from "../../pages/LeaderboardPage/LeaderboardPage";
import { PlanetSelectorPage } from "../../pages/PlanetSelectorPage/PlanetSelectorPage";
import HypePage from "../../pages/HypePage/HypePage";

import "./MainSpace.scss";

export const MainSpace = (props) => {
  const [background, setBackground] = useState(normalSpaceBg);
  const [isMuted, setIsMuted] = useState(false);

  // ----------------BG SOUND---------------- //
  const [backgroundAudio] = useState(
    new Audio(require("../../assets/sounds/stranger-things-124008.mp3"))
  );

  const handleToggleSound = () => {
    if (isMuted) {
      backgroundAudio.play();
      backgroundAudio.volume = 0.1;
      backgroundAudio.loop = true;
    } else {
      backgroundAudio.pause();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const enableAudio = () => {
      backgroundAudio
        .play()
        .then(() => {
          backgroundAudio.loop = true;
          backgroundAudio.volume = 0.1;
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения звука:", error);
        });

      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
      backgroundAudio.pause();
    };
  }, [backgroundAudio]);
  // ----------------BG SOUND---------------- //

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 420) {
        setBackground(smallScreenSpaceBg);
      } else {
        setBackground(normalSpaceBg);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`background ${props.page !== "farm" && "noscroll"}`}>
      <img src={background} alt="Background" className={`background-img `} />
      <div
        className={`${props.page === "wheel" ? "wheel-content" : "content"}`}
      >
        {props.page === "shop" ? (
          <ShopPage
            plants={props.plants}
            seeds={props.seeds}
            setSeeds={props.setSeeds}
            setUser={props.setUser}
            user={props.user}
            user_id={props.user_id}
            balance={props.balance}
            lang={props.lang}
            openModal={props.openModal}
          />
        ) : props.page === "earn" ? (
          <TasksPage lang={props.lang} user_id={props.user_id} tg={props.tg} />
        ) : props.page === "wallet" ? (
          <WalletPage
            openModal={props.openModal}
            setCurrentToken={props.setCurrentToken}
            lang={props.lang}
          />
        ) : props.page === "planets" || props.page === "farm" ? (
          <PlanetSelectorPage
            plantings={props.plantings}
            lang={props.lang}
            seeds={props.seeds}
            setPage={props.setPage}
            setSeeds={props.setSeeds}
            setPlantings={props.setPlantings}
            setUser={props.setUser}
            user={props.user}
            user_id={props.user_id}
            fetchPlantings={props.fetchPlantings}
            plantingActive={props.plantingActive}
            setPlantingActive={props.setPlantingActive}
            setBackground={setBackground}
            defaultBg={normalSpaceBg}
            openModal={props.openModal}
            setCurrentPlanet={props.setCurrentPlanet}
          />
        ) : props.page === "leaderboard" ? (
          <LeaderboardPage user={props.user} lang={props.lang} />
        ) : props.page === "wheel" ? (
          <FortunePage lang={props.lang} openModal={props.openModal} />
        ) : props.page === "hype" ? (
          <HypePage user={props.user} lang={props.lang} />
        ) : null}

        <button className="volume-button" onClick={handleToggleSound}>
          <img
            src={
              isMuted
                ? require("../../assets/icons/volume-xmark-solid.png")
                : require("../../assets/icons/volume-high-solid.png")
            }
            alt="Volume Button"
          />
        </button>
      </div>
    </div>
  );
};
