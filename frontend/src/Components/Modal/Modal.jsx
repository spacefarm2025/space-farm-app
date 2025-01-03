import React from "react";
import BalanceContent from "../Contents/BalanceContent";
import EnergyContent from "../Contents/EnergyContent";
import MarketContent from "../Contents/MarketContent";
import "./Modal.css";

import EnergyStatusContent from "../Contents/EnergyStatusContent";
import ExchangeContent from "../Contents/ExchangeContent";
import GetSpinsContent from "../Contents/GetSpinsContent";
import MarsPlantModal from "../Farm/components/MarsPlantModal";
import SwapModal from "../WalletPage/Components/SwapModal";
import ClosePlanetContent from "../Contents/ClosedPlanetContent";
import ComingSoonContent from "../Contents/ComingSoonContent";
import PlantingBuildContent from "../Contents/PlantingBuildContent";
import PlantingInfoContent from "../Contents/PlantingInfoContent";
import SaturnPlantModal from "../Farm/components/SaturnPlantModal";

const Modal = ({
  isOpen,
  setIsOpen,
  component,
  balance,
  user_id,
  lang,
  plants,
  plantings,
  energy,
  setPlantings,
  currentPlanting,
  seeds,
  setSeeds,
  setCurrentPlanting,
  user,
  tg,
  openModal,
  setPage,
  selectedPlanet,
  currentPlanet,
  setCurrentPlanet,
  planet,
  setPlantingActive,
  plantingActive,
  token,
}) => {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className={`modal-content`}>
        <button onClick={() => setIsOpen(false)} className={`close`}></button>
        {component === "market" && (
          <MarketContent
            balance={balance}
            user_id={user_id}
            lang={lang}
            plants={plants}
            setSeeds={setSeeds}
            seeds={seeds}
          />
        )}
        {component === "balance" && (
          <BalanceContent lang={lang} user={user} tg={tg} />
        )}
        {component === "energy" && (
          <EnergyContent
            lang={lang}
            user={user}
            tg={tg}
            setIsOpen={setIsOpen}
            setPage={setPage}
          />
        )}

        {component === "get-spins" && (
          <GetSpinsContent
            lang={lang}
            user={user}
            tg={tg}
            setIsOpen={setIsOpen}
            setPage={setPage}
          />
        )}

        {component === "energy-status" && (
          <EnergyStatusContent
            lang={lang}
            user={user}
            tg={tg}
            setIsOpen={setIsOpen}
            setPage={setPage}
            energy={energy}
          />
        )}
        {component === "plantingBuild" && (
          <div>
            <PlantingBuildContent
              lang={lang}
              plantings={plantings}
              setPlantings={setPlantings}
              openModal={openModal}
              user={user}
              setIsOpen={setIsOpen}
              currentPlanet={currentPlanet}
              setCurrentPlanet={setCurrentPlanet}
            />
          </div>
        )}
        {component === "plantingInfo" && (
          <PlantingInfoContent
            lang={lang}
            currentPlanting={currentPlanting}
            setCurrentPlanting={setCurrentPlanting}
            seeds={seeds}
            setSeeds={setSeeds}
            user_id={user_id}
            setPlantings={setPlantings}
            setIsOpen={setIsOpen}
            plants={plants}
            energy={energy}
            openModal={openModal}
            setPage={setPage}
            selectedPlanet={selectedPlanet}
            setPlantingActive={setPlantingActive}
            plantingActive={plantingActive}
          />
        )}

        {component === "marsPlant" && (
          <MarsPlantModal
            planting={currentPlanting}
            setIsOpen={setIsOpen}
            openModal={openModal}
          />
        )}

        {component === "saturnPlant" && (
          <SaturnPlantModal
            planting={currentPlanting}
            setIsOpen={setIsOpen}
            openModal={openModal}
          />
        )}

        {component === "closedPlanet" && (
          <ClosePlanetContent
            lang={lang}
            user={user}
            tg={tg}
            planet={planet}
            currentPlanet={currentPlanet}
            // setCurrentPlanet={setCurrentPlanet}
          />
        )}

        {component === "coming" && (
          <>
            <ComingSoonContent
              lang={lang}
              user={user}
              setIsOpen={setIsOpen}
              setPage={setPage}
            />
          </>
        )}

        {component === "swap" && (
          <>
            <SwapModal
              lang={lang}
              openModal={openModal}
              setIsOpen={setIsOpen}
              token={token}
            />
          </>
        )}

        {component === "exchange" && (
          <>
            <ExchangeContent
              lang={lang}
              user={user}
              setIsOpen={setIsOpen}
              setPage={setPage}
              token={token}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
