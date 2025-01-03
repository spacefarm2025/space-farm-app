import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkViewModal,
  getPlantings,
  getPlants,
  getSeeds,
  setViewModal,
} from "./api/api";
import { BottomPanel } from "./Components/BottomPanel/BottomPanel";
import Preloader from "./Components/common/Preloader";
import { CometProvider } from "./Components/Game/Comet/CometProvider";
import GlobalComets from "./Components/Game/Comet/GlobalComets";
import { Header } from "./Components/Header/Header";
import { MainSpace } from "./Components/MainSpace/MainSpace";
import Modal from "./Components/Modal/Modal";
import CometOnboarding from "./Components/Onboardings/CometOnboarding";
import OnboardStart from "./Components/Onboardings/OnboardStart";
import { fetchUser } from "./redux/features/userSlice";

const App = ({ lang }) => {
  const tg = window?.Telegram?.WebApp;
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.userId);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [page, setPage] = useState("planets");
  const [energy, setEnergy] = useState(5);
  const [balance, setBalance] = useState(500);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [locateBalance, setLocateBalance] = useState(
    balance?.toLocaleString("en-US")
  );
  const [modalComponent, setModalComponent] = useState(null);
  const [plants, setPlants] = useState([]);
  const [plantings, setPlantings] = useState([]);
  const [currentPlanting, setCurrentPlanting] = useState(null);
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);

  const [plantingActive, setPlantingActive] = useState(true);
  const [seeds, setSeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCometOnboarding, setShowCometOnboarding] = useState(false);
  const [showComets, setShowComets] = useState(false);

  const checkIfViewedModal = async () => {
    try {
      const modalData = await checkViewModal(user_id);
      if (modalData.start === 0) {
        setShowOnboarding(true);
      } else if (modalData.comets === 0) {
        setShowCometOnboarding(true);
      } else {
        setShowComets(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user_id) {
      dispatch(fetchUser(user_id));
      checkIfViewedModal();
    }
  }, [user_id]);

  const fetchPlants = async () => {
    try {
      const plantsData = await getPlants();
      setPlants(plantsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlantings = async () => {
    try {
      const plantingsData = await getPlantings(user_id);
      setPlantings(plantingsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSeeds = async () => {
    try {
      const seedsData = await getSeeds(user_id);
      setSeeds(seedsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchPlants(), fetchPlantings(), fetchSeeds()]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (user_id) fetchData();
  }, [user_id]);

  useEffect(() => {
    if (userData) {
      setBalance(userData.balance);
      setEnergy(userData.energy);
    }
  }, [userData]);

  useEffect(() => {
    if (balance != null) {
      setLocateBalance(balance.toLocaleString("en-US"));
    }
  }, [balance]);

  const openModal = (component, planting = null, selectedPlanet, token) => {
    // fetchUserData();
    if (planting) setCurrentPlanting(planting);
    if (selectedPlanet) setCurrentPlanet(selectedPlanet);
    if (token) setCurrentToken(token);

    setIsOpenModal(true);
    setModalComponent(component);
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    try {
      const response = await setViewModal(user_id, "start");
      checkIfViewedModal();
    } catch (error) {
      console.error("Error registering main onboarding view:", error);
    }
  };

  const handleCometOnboardingComplete = async () => {
    setShowCometOnboarding(false);
    try {
      const response = await setViewModal(user_id, "comets");
      setShowComets(true);
    } catch (error) {
      console.error("Error registering comet onboarding view:", error);
    }
  };

  return (
    <CometProvider showComets={showComets}>
      <main>
        {isLoading ? (
          <Preloader />
        ) : (
          <>
            {showOnboarding && (
              <OnboardStart lang={lang} setIsOpen={handleOnboardingComplete} />
            )}
            {showCometOnboarding && (
              <CometOnboarding
                lang={lang}
                setIsOpen={handleCometOnboardingComplete}
              />
            )}
            <>
              <Header
                lang={lang}
                user={userData}
                energy={energy}
                onClickEnergy={() => openModal("energy-status")}
                page={page}
                setPage={setPage}
                balance={locateBalance}
                openModal={openModal}
              />

              <BottomPanel
                page={page}
                setPage={setPage}
                openModal={openModal}
              />
              <div className="body-page">
                <MainSpace
                  page={page}
                  plants={plants}
                  seeds={seeds}
                  setSeeds={setSeeds}
                  setPlantings={setPlantings}
                  user={userData}
                  user_id={user_id}
                  balance={balance}
                  lang={lang}
                  tg={tg}
                  plantings={plantings}
                  setPage={setPage}
                  setPlantingActive={setPlantingActive}
                  plantingActive={plantingActive}
                  openModal={openModal}
                  setCurrentPlanet={setCurrentPlanet}
                  setCurrentToken={setCurrentToken}
                />
                <Modal
                  isOpen={isOpenModal}
                  setIsOpen={(isOpen) => {
                    setIsOpenModal(isOpen);
                    checkIfViewedModal();
                  }}
                  component={modalComponent}
                  balance={balance}
                  user_id={user_id}
                  lang={lang}
                  plants={plants}
                  plantings={plantings}
                  energy={energy}
                  setEnergy={setEnergy}
                  setPlantings={setPlantings}
                  currentPlanting={currentPlanting}
                  seeds={seeds}
                  setSeeds={setSeeds}
                  setCurrentPlanting={setCurrentPlanting}
                  user={userData}
                  tg={tg}
                  openModal={openModal}
                  setPage={setPage}
                  selectedPlanet={currentPlanet}
                  currentPlanet={currentPlanet}
                  setCurrentPlanet={setCurrentPlanet}
                  setPlantingActive={setPlantingActive}
                  plantingActive={plantingActive}
                  token={currentToken}
                />
              </div>
            </>
            {showComets && <GlobalComets />}
          </>
        )}
      </main>
    </CometProvider>
  );
};

export default App;
