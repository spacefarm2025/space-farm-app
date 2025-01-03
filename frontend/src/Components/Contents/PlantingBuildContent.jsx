import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { buildPlantings, BuildPriceGet } from "../../api/api";
import { basic_price, energy_price } from "../../config";
import { fetchUser } from "../../redux/features/userSlice";
import "./PlantingBuildContent.css";

const PlantingBuildContent = ({
  lang,
  plantings,
  setPlantings,
  openModal,
  user,
  selectedPlanet,
  currentPlanet,
  setCurrentPlanet,
  setIsOpen,
}) => {
  const dispatch = useDispatch();
  const [buildPrice, setBuildPrice] = useState(basic_price);

  const getBuildPrice = async () => {
    try {
      const data = await BuildPriceGet(user.id, currentPlanet);
      if (data && data.data) {
        setBuildPrice(data.data);
      }
    } catch (error) {
      console.error("Failed to get price build plantation:", error);
    }
  };

  useEffect(() => {
    if (currentPlanet) {
      getBuildPrice();
    }
  }, [currentPlanet, user.id]);

  const buildPlantation = async () => {
    try {
      const data = await buildPlantings(user.id, currentPlanet);
      if (data && data.data) {
        if (data.data.plantings) setPlantings(data.data.plantings);
        if (data.data.user) dispatch(fetchUser(user.id));
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to build plantation:", error);
    }
  };

  return (
    <div>
      <div className="modal-heading">
        <h2 className="rotated-text">{lang.build()}</h2>
      </div>

      <div className="build-button-container">
        <div className="build">
          {/* <p className="build-text">{lang.build()}</p> */}
          <div
            className="price-info"
            style={{ color: buildPrice > user.balance ? "red" : "white" }}
          >
            {buildPrice}
            {/* <img src="./token.png" alt="Token" className="token-image-build" /> */}
          </div>
          <div
            className="price-info"
            style={{ marginTop: "40px", marginLeft: "10px" }}
          >
            <span
              style={{
                color: energy_price.build > user.energy ? "red" : "white",
              }}
            >
              {energy_price.build}
            </span>
          </div>
          <button
            className="accept"
            onClick={() =>
              buildPrice > user.balance
                ? openModal("balance")
                : energy_price.build > user.energy
                ? openModal("energy")
                : buildPlantation()
            }
          ></button>
        </div>
      </div>

      <div className="build-desc">
        {lang.buildPlantingDesc()} <br /> {lang.buildPlantingDesc2()}
        <br />
        <br />
      </div>
    </div>
  );
};

export default PlantingBuildContent;
