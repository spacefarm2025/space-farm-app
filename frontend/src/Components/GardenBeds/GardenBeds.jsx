import React from "react";
import "./GardenBeds.css";

const GardenBeds = ({ plantings, openModal, lang }) => {
  const bedsPerRow = 1;

  const generateGardenBeds = () => {
    if (plantings.length > 0) {
      return plantings.map((planting, i) => {
        const growState = planting.grow_state;
        let currentTime = new Date();
        const timeZoneOffset = currentTime.getTimezoneOffset() * 60000; // Отримуємо зміщення часового поясу в мілісекундах
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
        }

        return (
          <div
            className="garden-bed"
            key={i}
            onClick={() => openModal("plantingInfo", planting)}
          >
            {!planting.plant_id ? (
              <img src={`./clear_garden.png`} alt="Garden Bed" />
            ) : (
              <img
                src={`./${lang.en_name_by_id(
                  planting.plant_id
                )}_garden_bed_${growStage}.png`}
                alt="Garden Bed"
              />
            )}
          </div>
        );
      });
    }
  };
  return (
    <div className="garden-beds-container">
      {plantings.length > 0 &&
        generateGardenBeds().reduce((rows, bed, index) => {
          const rowIndex = Math.floor(index / bedsPerRow);
          if (!rows[rowIndex]) {
            rows[rowIndex] = [];
          }
          rows[rowIndex].push(bed);
          return rows;
        }, [])}
      <div className="garden-bed" onClick={() => openModal("plantingBuild")}>
        <img
          src="./clear_garden.png"
          alt="Garden Bed"
          className="img-overlay"
        />
        <div className="garden-bed-overlay">
          <img className="garden-bed-hammer" src="./hammer.png" alt="Hammer" />
        </div>
      </div>
    </div>
  );
};

export default GardenBeds;
