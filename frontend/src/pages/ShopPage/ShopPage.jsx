import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buySeed } from "../../api/api";
import upImg from "../../assets/shop/up.png";
import { fetchUser } from "../../redux/features/userSlice";
import "./Shop.css";
import UpgradeModal from "./UpgradeModal/UpgradeModal";

export const ShopPage = (props) => {
  const [groups, setGroups] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const newGroups = [];
    let step;

    switch (user.planet) {
      case 1:
        step = 3;
        break;
      case 2:
        step = 3;
        break;
      default:
        step = 3;
      // step = props.plants.length; // Если открыты все планеты
    }

    for (let i = 0; i < props.plants.length; i += step) {
      newGroups.push(props.plants.slice(i, i + step));
    }

    setGroups(newGroups);
  }, [props.plants, user.planet]);

  const handleBuy = async (item, isLocked) => {
    if (isLocked || item.price > props.balance) {
      console.error("Insufficient funds");
      return;
    }

    try {
      const data = await buySeed(props.user_id, item.id, "+", 1);
      dispatch(fetchUser(props.user_id));
      props.setSeeds(data.seeds);
    } catch (error) {
      console.error(error);
    }
  };

  const isItemLocked = (groupIndex) => {
    return user.planet === 1 && groupIndex > 0;
  };

  const countPurchasedSeeds = (seedId) => {
    const seed = props.seeds.find((s) => s.plant_id === seedId);
    return seed ? seed.quantity : 0;
  };

  const openModal = (itemName) => {
    setSelectedItemName(itemName);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <UpgradeModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        itemName={selectedItemName}
      ></UpgradeModal>
      <div className="shop-container">
        {groups.map((group, groupIndex) => (
          <ul key={groupIndex} className="content-page">
            <li
              className={
                groupIndex === 0
                  ? "planet-content-item"
                  : "planet-content-item-moon"
              }
            >
              <div className="content-item-texts-info">
                {group.map((item, index) => (
                  <span key={index}>
                    <p style={{ fontFamily: "RaceSport" }}>
                      {countPurchasedSeeds(item.id)}
                    </p>
                  </span>
                ))}
              </div>
            </li>
            {group.map((item, index) => (
              <li key={index} className="content-item">
                <img
                  className="upgradeBut"
                  src={upImg}
                  alt={"upgrade"}
                  onClick={() => openModal(props.lang.en_name_by_id(item.id))}
                />
                <img
                  src={require(`../../assets/seeds/${props.lang.en_name_by_id(
                    item.id
                  )}.png`)}
                  alt="Seed"
                  className="content-item-img"
                />
                <div className="content-item-texts-info">
                  <span>
                    <p
                      style={{
                        fontFamily: "RaceSport",
                        fontSize: 34,
                        marginBottom: "-10px",
                        marginRight: "15px",
                      }}
                    >
                      {user.planet === 1 && groupIndex === 1
                        ? "???"
                        : item.price}
                    </p>
                  </span>
                </div>
                <button
                  className="shop-button"
                  onClick={() => handleBuy(item, isItemLocked(groupIndex))}
                  disabled={
                    isItemLocked(groupIndex) || item.price > props.balance
                  }
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </>
  );
};
