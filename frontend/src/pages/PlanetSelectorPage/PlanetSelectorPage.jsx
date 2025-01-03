import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { useSwipeable } from "react-swipeable";
import arrowLeft from "../../assets/left-arrow.png";
import arrowRight from "../../assets/right-arrow.png";
import { Farm } from "../../Components/Farm/Farm";

import { useSelector } from "react-redux";
import "./index.css";

export const PlanetSelectorPage = (props) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [rocketStage, setRocketStage] = useState("normal");

  const user = useSelector((state) => state.user);

  const [audio] = useState(
    new Audio(require("../../assets/sounds/woosh_northern87-91714.mp3"))
  );

  const handlePlayRocket = () => {
    audio.loop = false;
    audio.volume = 0.1;

    audio
      .play()
      .then(() => {
        console.log("Аудио воспроизводится");
      })
      .catch((error) => {
        console.error("Ошибка воспроизведения аудио:", error);
      });
  };

  const [planets, setPlanets] = useState([
    {
      id: 2,
      name: "moon",
      image: require("../../assets/big-moon.png"),
      lock: true,
    },
    {
      id: 1,
      name: "earth",
      image: require("../../assets/big-earth.png"),
      lock: false,
    },
    {
      id: 3,
      name: "mars",
      image: require("../../assets/big-mars.png"),
      lock: true,
    },
    {
      id: 4,
      name: "saturn",
      image: require("../../assets/big-saturn.png"),
      lock: true,
    },
  ]);

  // useEffect(() => {
  //   const updatedPlanets = planets.map((planet, index) => {
  //     return {
  //       ...planet,
  //       lock: planet.id > (user.planet > 3 ? 3 : user.planet),
  //     };
  //   });
  //   setPlanets(updatedPlanets);
  // }, [user.planet]);

  useEffect(() => {
    const updatedPlanets = planets.map((planet) => {
      if (planet.name === "earth") {
        return { ...planet, lock: false };
      }
      if (planet.name === "moon" && user.planet > 1) {
        return { ...planet, lock: false };
      }
      if (planet.name === "mars" && user.planet >= 3) {
        return { ...planet, lock: false };
      }
      if (planet.name === "saturn" && user.planet >= 10) {
        return { ...planet, lock: false };
      }
      return { ...planet, lock: true };
    });
    setPlanets(updatedPlanets);
  }, [user.planet]);

  const handleAnimationComplete = () => {
    handlePlayRocket();

    setIsAnimating(true);
    setRocketStage("animated");

    setTimeout(() => {
      setSelectedPlanet(null);
      setIsAnimating(false);
      props.setPage("planets");
    }, 1000);
  };

  const handlePlanetClick = (planet) => {
    if (planet.lock) {
      props.openModal("closedPlanet");
      props.setCurrentPlanet(planet.id);
    } else {
      handlePlayRocket();
      setRocketStage("animated");
      setTimeout(() => {
        setRocketStage("normal");
      }, 1000);

      setSelectedPlanet(planet);
      setCurrentIndex(planets.findIndex((p) => p.id === planet.id));
      props.setCurrentPlanet(planet.id);
      props.setPage("farm");
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
  };

  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex < planets.length - 1 ? currentIndex + 1 : currentIndex
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextClick(),
    onSwipedRight: () => handlePrevClick(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  const renderPlanets = () => {
    return planets.map((planet, index) => {
      let positionClass =
        index === currentIndex
          ? "main-planet"
          : index === currentIndex - 1
          ? "left-planet"
          : index === currentIndex + 1
          ? "right-planet"
          : "hidden-planet";

      const planetTitle = planet.lock
        ? require(`../../assets/${planet.name}-title-lock.png`)
        : require(`../../assets/${planet.name}-title.png`);

      return (
        <motion.div
          key={planet.id}
          className={`planet ${positionClass} ${planet.lock ? "locked" : ""}`}
          onClick={() => handlePlanetClick(planet)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="planet-img-container">
            <div className="planet-name">
              <img
                src={planetTitle}
                alt={planet.id}
                style={{ width: "200px" }}
              />
            </div>
            <img
              src={
                planet.lock
                  ? require(`../../assets/lock-big-${planet.name}.png`)
                  : planet.image
              }
              alt={planet.name}
              className="planet-img-content"
            />
          </div>
        </motion.div>
      );
    });
  };

  const rocketButtonStyle = {
    backgroundImage: `url(${
      rocketStage === "normal"
        ? require("../../assets/back-rocket.png")
        : require("../../assets/rocket_active.gif")
    })`,

    height: "180px",
    width: "120px",

    display: "flex",
    justifyContent: "center",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="planet-selector-container">
      {selectedPlanet === null ? (
        <div className="slider-container">
          <div className="slider" {...handlers}>
            <AnimatePresence initial={false}>{renderPlanets()}</AnimatePresence>
          </div>
          <div className="slider-arrows">
            <button
              onClick={handlePrevClick}
              disabled={currentIndex === 0}
              className="custom-button"
            >
              <img className="slider-arrow" src={arrowLeft} alt="Arrow left" />
            </button>
            <button
              onClick={handleNextClick}
              disabled={currentIndex === planets.length - 1}
              className="custom-button"
            >
              <img
                className="slider-arrow"
                src={arrowRight}
                alt="Arrow right"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="farm-container">
          <motion.button
            onClick={handleAnimationComplete}
            className="earth-button"
            initial={{ y: -200 }}
            animate={isAnimating ? { y: -50 } : { y: 0 }}
            transition={{ duration: 0.5 }}
            style={rocketButtonStyle}
          ></motion.button>

          <Farm
            plantings={props.plantings}
            lang={props.lang}
            seeds={props.seeds}
            setPage={props.setPage}
            setSeeds={props.setSeeds}
            setPlantings={props.setPlantings}
            user_id={props.user_id}
            fetchPlantings={props.fetchPlantings}
            plantingActive={props.plantingActive}
            setPlantingActive={props.setPlantingActive}
            setBackground={props.setBackground}
            defaultBg={props.defaultBg}
            openModal={props.openModal}
            selectedPlanet={selectedPlanet}
          />
        </div>
      )}
    </div>
  );
};
