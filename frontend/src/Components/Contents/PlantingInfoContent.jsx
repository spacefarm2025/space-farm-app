import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { harvestPlantings, pasteSeeds, wateringPlantings } from "../../api/api";
import { energy_price } from "../../config";
import { fetchUser } from "../../redux/features/userSlice";
import "./PlantingInfoContent.css";

const PlantingNoSeed = ({
  lang,
  currentPlanting,
  setCurrentPlanting,
  seeds,
  setSeeds,
  user_id,
  setPlantings,
  setIsOpen,
  energy,
  openModal,
  setPage,
  planting,
}) => {
  const dispatch = useDispatch();
  const pasteSeed = async (plant_id) => {
    try {
      const data = await pasteSeeds(user_id, plant_id, currentPlanting.id);
      if (data.length !== 0) {
        if (data?.plantings) setPlantings(data.plantings);
        if (data?.user) dispatch(fetchUser(user_id));
        if (data?.seeds) setSeeds(data.seeds);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const planetId = Number(currentPlanting.planet_id);

  const SeedElems = seeds
    .slice(planetId === 1 ? 0 : 3, planetId === 1 ? 3 : 6)
    .map((seed, index) => (
      <div key={seed.plant_id} className={`seed seed-position-${index + 1}`}>
        <button
          className="seed-button"
          onClick={() =>
            energy < energy_price.seed
              ? openModal("energy")
              : seed.quantity !== 0
              ? (pasteSeed(seed.plant_id), setIsOpen(false))
              : (setPage("shop"), setIsOpen(false))
          }
        >
          <img
            src={require(`../../assets/seed_${seed.plant_id}.png`)}
            alt="seed"
            className="seed-image"
          />
          {seed.quantity === 0 && (
            <img
              src={require(`../../assets/modals/lock.png`)}
              alt="lock"
              className="lock-overlay"
            />
          )}
        </button>
        <p
          style={{
            width: "80px",
            position: "absolute",
            color: seed.quantity !== 0 ? "white" : "white",
          }}
        >
          {lang.name_by_id(seed.plant_id)}
        </p>
      </div>
    ));

  return (
    <div>
      <div className="modal-heading">
        <h2 className="rotated-text">{lang.planting_no_seed()}</h2>
      </div>
      <div className="seeds">{SeedElems}</div>
      <br />
    </div>
  );
};

const PlantingInfoContent = ({
  lang,
  currentPlanting,
  setCurrentPlanting,
  seeds,
  setSeeds,
  user_id,
  setPlantings,
  setIsOpen,
  plants,
  energy,
  openModal,
  setPage,
}) => {
  const [timeWaterLeft, setTimeWaterLeft] = useState(null);
  const [timeWaterLeftNumber, setTimeWaterLeftNumber] = useState(null);
  const [timeHarvestLeft, setTimeHarvestLeft] = useState(null);
  const [timeHarvestLeftNumber, setTimeHarvestLeftNumber] = useState(null);
  const [plant, setPlant] = useState(null);

  const dispatch = useDispatch();

  const startWatering = async () => {
    try {
      const data = await wateringPlantings(currentPlanting.id);
      if (data) {
        setCurrentPlanting(data.planting);
        setPlantings((prevPlantings) =>
          prevPlantings.map((planting) =>
            planting.id === data.planting.id ? data.planting : planting
          )
        );
        if (data?.user) dispatch(fetchUser(user_id));
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startHarvest = async () => {
    try {
      const data = await harvestPlantings(currentPlanting.id);
      if (data) {
        const emptyPlanting = {
          ...currentPlanting,
          plant_id: null,
          grow_stage: null,
        };
        setCurrentPlanting(emptyPlanting);
        setPlantings((prevPlantings) =>
          prevPlantings.map((planting) =>
            planting.id === currentPlanting.id ? emptyPlanting : planting
          )
        );
        if (data?.user) dispatch(fetchUser(user_id));
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentPlanting) return;

    const timeWater = new Date(currentPlanting.time_water);
    let currentTime = new Date();
    const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
    currentTime = new Date(currentTime.getTime() + timeZoneOffset);
    let newTimeWaterLeft = Math.max(
      0,
      Math.ceil((timeWater - currentTime) / 1000)
    );
    const isoTimeWaterLeft = new Date(newTimeWaterLeft * 1000).toISOString();
    const formattedTimeWaterLeft = new Date(isoTimeWaterLeft).toLocaleString(
      "en-US",
      {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );
    setTimeWaterLeft(formattedTimeWaterLeft);
    setTimeWaterLeftNumber(newTimeWaterLeft);

    const timeHarvestLeft = new Date(currentPlanting.harvest_time);
    let newTimeHarvestLeft = Math.max(
      0,
      Math.ceil((timeHarvestLeft - currentTime) / 1000)
    );
    const isoTimeHarvestLeft = new Date(
      newTimeHarvestLeft * 1000
    ).toISOString();
    const formattedTimeHarvestLeft = new Date(
      isoTimeHarvestLeft
    ).toLocaleString("en-US", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setTimeHarvestLeft(formattedTimeHarvestLeft);
    setTimeHarvestLeftNumber(newTimeHarvestLeft);

    setPlant(plants.find((plant) => currentPlanting.plant_id === plant.id));

    const intervalId = setInterval(() => {
      const timeWater = new Date(currentPlanting.time_water);
      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000; // Отримуємо зміщення часового поясу в мілісекундах
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      let newTimeWaterLeft = Math.max(
        0,
        Math.ceil((timeWater - currentTime) / 1000)
      );
      const isoTimeWaterLeft = new Date(newTimeWaterLeft * 1000).toISOString();
      const formattedTimeWaterLeft = new Date(isoTimeWaterLeft).toLocaleString(
        "en-US",
        {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      );
      setTimeWaterLeft(formattedTimeWaterLeft);
      setTimeWaterLeftNumber(newTimeWaterLeft);

      const timeHarvestLeft = new Date(currentPlanting.harvest_time);
      let newTimeHarvestLeft = Math.max(
        0,
        Math.ceil((timeHarvestLeft - currentTime) / 1000)
      );
      const isoTimeHarvestLeft = new Date(
        newTimeHarvestLeft * 1000
      ).toISOString();
      const formattedTimeHarvestLeft = new Date(
        isoTimeHarvestLeft
      ).toLocaleString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTimeHarvestLeft(formattedTimeHarvestLeft);
      setTimeHarvestLeftNumber(newTimeHarvestLeft);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentPlanting]);

  if (!currentPlanting) {
    return null;
  }

  if (!currentPlanting.grow_stage) {
    return (
      <PlantingNoSeed
        lang={lang}
        currentPlanting={currentPlanting}
        seeds={seeds}
        setSeeds={setSeeds}
        user_id={user_id}
        setPlantings={setPlantings}
        setIsOpen={setIsOpen}
        energy={energy}
        openModal={openModal}
        setPage={setPage}
      />
    );
  }
  return (
    <div>
      <div className="modal-heading">
        <h2 className="rotated-text">{lang.planting()}</h2>
      </div>

      <div className="container-plantation">
        {timeHarvestLeftNumber > 0 && (
          <div>
            <button
              className={`planting-btn ${
                timeWaterLeftNumber !== 0 ? "transparent-background" : ""
              }`}
              onClick={() => {
                if (timeWaterLeftNumber === 0) {
                  energy < energy_price.watering
                    ? openModal("energy")
                    : startWatering();
                }
              }}
            >
              {timeWaterLeftNumber > 0 ? (
                <p>
                  {lang.watering()}: {timeWaterLeft}
                </p>
              ) : (
                <p className="flex-around">
                  {lang.watering()}
                  <span
                    style={{
                      color: energy < energy_price.watering ? "red" : "white",
                      fontFamily: "RaceSport",
                      marginTop: "45px",
                    }}
                  >
                    {energy_price.watering}
                  </span>
                </p>
              )}
            </button>
            <br></br>
          </div>
        )}
        <button
          className={`planting-btn-harvest ${
            timeHarvestLeftNumber !== 0 ? "transparent-background" : ""
          }`}
          style={{
            background: timeHarvestLeftNumber === 0,
          }}
        >
          {timeHarvestLeftNumber > 0 ? (
            <p className="flex-around">
              {lang.harvest()}: {timeHarvestLeft}
            </p>
          ) : (
            <p
              className="flex-around"
              onClick={() =>
                energy < energy_price.harvest
                  ? openModal("energy")
                  : startHarvest()
              }
            >
              <span>{lang.harvest()}</span>
              <span
                style={{
                  color: energy < energy_price.harvest ? "red" : "white",
                  fontFamily: "RaceSport",
                  marginTop: "45px",
                }}
              >
                {energy_price.harvest}
              </span>
            </p>
          )}
        </button>
        <br></br>
        <p className="plantation-info-collect">
          <span className="span-collect">
            {lang.earn()}: {plant?.tokens}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PlantingInfoContent;
