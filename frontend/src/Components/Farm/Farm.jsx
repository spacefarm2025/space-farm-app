import React, { useEffect, useRef } from "react";
import "./Farm.scss";

import { useDispatch, useSelector } from "react-redux";
import { claimLiquid } from "../../api/api";
import farmBgEarth from "../../assets/earth-farm/farm-earth-back.png";
import farmMars from "../../assets/mars-farm/mars-bg.png";
import farmBgMoon from "../../assets/moon-farm/farm-moon-back.png";
import farmBgSaturn from "../../assets/saturn-farm/saturn-bg.png";

import {
  fetchMarsPlantings,
  fetchSaturnPlantings,
} from "../../redux/features/plantsSlice";

const backgrounds = {
  earth: farmBgEarth,
  moon: farmBgMoon,
  mars: farmMars,
  saturn: farmBgSaturn,
};
export const Farm = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const marsPlants = useSelector((state) => state.plants.marsPlantings);
  const saturnPlants = useSelector((state) => state.plants.saturnPlantings);

  const plantingsRef = useRef();

  useEffect(() => {
    if (props.selectedPlanet.name === "mars") {
      dispatch(fetchMarsPlantings(props.user_id));
    }

    if (props.selectedPlanet.name === "saturn") {
      dispatch(fetchSaturnPlantings(props.user_id));
    }
  }, [dispatch, props.user_id, props.openModal, props.selectedPlanet.name]);

  useEffect(() => {
    const selectedBackground =
      backgrounds[props.selectedPlanet.name] || props.defaultBg;
    if (props.setBackground) {
      props.setBackground(selectedBackground);
    }
    return () => {
      if (props.setBackground) {
        props.setBackground(props.defaultBg);
      }
    };
  }, [props.selectedPlanet, props]);

  const claimPlant = async (id, growStage) => {
    if (growStage === 3) {
      await claimLiquid(id);
      dispatch(fetchMarsPlantings(props.user_id));
      dispatch(fetchSaturnPlantings(props.user_id));
    }
  };

  const depleteEnergy = (planting) => {
    props.openModal("marsPlant", planting);
  };

  const generateMarsBeds = () => {
    return marsPlants.map((planting, i) => {
      if (!planting) return null;

      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      currentTime = currentTime.getTime();
      const timeStart = new Date(planting.time_start).getTime();
      const timeFinish = new Date(planting.time_finish).getTime();
      const midPoint = timeStart + (timeFinish - timeStart) / 2;

      let growStage;
      if (currentTime >= timeStart && currentTime <= midPoint) {
        growStage = 1;
      } else if (currentTime > midPoint && currentTime <= timeFinish) {
        growStage = 2;
      } else if (currentTime > timeFinish) {
        growStage = 3;
      } else {
        growStage = 1;
      }

      const energyDepleted = !planting.charge;
      if (energyDepleted) {
        return (
          <div
            className={`planting planting-${i + 1} plant-${
              props.selectedPlanet.name
            }`}
            key={i}
            onClick={() => depleteEnergy(planting)}
          >
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/battery.png`)}
              className="locked-mars"
              alt="charge"
            />
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/lock-garden.png`)}
              alt="Garden Bed"
            />
          </div>
        );
      } else {
        return (
          <div
            className={`planting planting-${i + 1} plant-${
              props.selectedPlanet.name
            }`}
            key={i}
            onClick={() => claimPlant(planting.id, growStage)}
          >
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/stage_${growStage}.png`)}
              className="locked-mars"
              alt="charge"
            />
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/lock-garden.png`)}
              alt="Garden Bed"
            />
          </div>
        );
      }
    });
  };

  const depleteEnergySaturn = (planting) => {
    props.openModal("saturnPlant", planting);
  };

  const generateSaturnBeds = () => {
    return saturnPlants.map((planting, i) => {
      if (!planting) return null;

      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      currentTime = currentTime.getTime();
      const timeStart = new Date(planting.time_start).getTime();
      const timeFinish = new Date(planting.time_finish).getTime();
      const midPoint = timeStart + (timeFinish - timeStart) / 2;

      let growStage;
      if (currentTime >= timeStart && currentTime <= midPoint) {
        growStage = 1;
      } else if (currentTime > midPoint && currentTime <= timeFinish) {
        growStage = 2;
      } else if (currentTime > timeFinish) {
        growStage = 3;
      } else {
        growStage = 1;
      }

      const energyDepleted = !planting.charge;
      if (energyDepleted) {
        return (
          <div
            className={`planting planting-${i + 1} plant-${
              props.selectedPlanet.name
            }`}
            key={i}
            onClick={() => depleteEnergySaturn(planting)}
          >
            {/* <img
                src={require(`../../assets/${props.selectedPlanet.name}-farm/Liquid.png`)}
                className="locked-saturn"
                alt="charge"
              /> */}
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/garden.png`)}
              alt="Garden Bed"
            />
          </div>
        );
      } else {
        return (
          <div
            className={`planting planting-${i + 1} plant-${
              props.selectedPlanet.name
            }`}
            key={i}
            onClick={() => claimPlant(planting.id, growStage)} // Аналогично Mars
          >
            {/* <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/stage_${growStage}.png`)}
              className="locked-saturn"
              alt="charge"
            /> */}
            {growStage === 3 && (
              <img
                src={require(`../../assets/${props.selectedPlanet.name}-farm/coin.png`)}
                alt="Coin"
                className="claim-saturn"
              />
            )}
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/active-garden.png`)}
              alt="Garden Bed"
            />
          </div>
        );
      }
    });
  };

  const generateGardenBeds = () => {
    const filteredPlantings = props.plantings
      .filter((planting) => planting.planet_id === props.selectedPlanet.id)
      .slice(0, 3);

    return filteredPlantings.map((planting, i) => {
      if (!planting) return null;

      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      currentTime = currentTime.getTime();
      const timeSeed = new Date(planting.time_seed).getTime();
      const timeHarvest = new Date(planting.harvest_time).getTime();
      const midPoint = timeSeed + (timeHarvest - timeSeed) / 2;

      let growStage;
      if (currentTime >= timeSeed && currentTime <= midPoint) {
        growStage = 1;
      } else if (currentTime > midPoint && currentTime <= timeHarvest) {
        growStage = 2;
      } else if (currentTime > timeHarvest) {
        growStage = 3;
      } else {
        growStage = 1;
      }

      // Default logic for Earth and Moon
      return (
        <div
          className={`planting planting-${i + 1} plant-${
            props.selectedPlanet.name
          }`}
          key={i}
          onClick={() => props.openModal("plantingInfo", planting)}
        >
          {!planting.plant_id ? (
            <img
              src={require(`../../assets/${props.selectedPlanet.name}-farm/open-garden.png`)}
              alt="Active Ground"
            />
          ) : (
            <img
              src={require(`../../assets/${
                props.selectedPlanet.name
              }-farm/stage/${props.lang.en_name_by_id(
                planting.plant_id
              )}_${growStage}.png`)}
              alt="Garden Bed"
            />
          )}
        </div>
      );
    });
  };

  const openBuildModal = async () => {
    props.openModal("plantingBuild");
  };

  return (
    <div className="islands-container" ref={plantingsRef}>
      {props.selectedPlanet.name === "mars"
        ? generateMarsBeds()
        : props.selectedPlanet.name === "saturn"
        ? generateSaturnBeds()
        : generateGardenBeds()}
      {props.plantings.filter(
        (planting) => planting.planet_id === props.selectedPlanet.id
      ).length < 3 && (
        <div
          className={`planting ${
            props.plantings.filter(
              (planting) => planting.planet_id === props.selectedPlanet.id
            ).length === 0
              ? "planting-1"
              : props.plantings.filter(
                  (planting) => planting.planet_id === props.selectedPlanet.id
                ).length === 1
              ? "planting-2"
              : "planting-3"
          } plant-${props.selectedPlanet.name}`}
          onClick={() => openBuildModal()}
        >
          {props.selectedPlanet.name === "mars" && (
            <img
              className="locked-mars"
              src={require(`../../assets/${props.selectedPlanet.name}-farm/lock.png`)}
              alt="locked"
            />
          )}
          <img
            src={require(`../../assets/${props.selectedPlanet.name}-farm/lock-garden.png`)}
            alt="Garden Bed"
          />
        </div>
      )}
    </div>
  );
};
