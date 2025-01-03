import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { buySeed, unlockSeedApi } from "../../api/api";
import lock from "../../assets/lock.png";
import { fetchUser } from "../../redux/features/userSlice";
import "./MarketContent.css";

const MarketContent = ({ balance, user_id, lang, plants, setSeeds, seeds }) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(
    plants.map((plant) => ({
      ...plant,
      quantity: 0,
    }))
  );

  useEffect(() => {
    setItems(
      plants.map((plant) => {
        const seed = seeds.find((seed) => seed.plant_id === plant.id);
        return {
          ...plant,
          quantity: 0,
          is_lock: seed ? seed.is_lock : false,
          cost_unlock: seed ? seed.cost_unlock : 0,
        };
      })
    );
  }, [plants, seeds]);

  const handleQuantityChange = (index, newQuantity) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  const unlockSeed = async (plant_id) => {
    try {
      for (const item of items) {
        if (item.is_lock) {
          const data = await unlockSeedApi(user_id, plant_id);
          dispatch(fetchUser(user_id));
          setSeeds(data.seeds);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuy = () => {
    let totalCost = 0;

    items.forEach((item) => {
      totalCost += item.price * item.quantity;
    });

    if (totalCost > balance) {
      return;
    }

    const fetchSeed = async (callback) => {
      try {
        for (const item of items) {
          if (item.quantity !== 0) {
            const data = await buySeed(user_id, item.id, "+", item.quantity);
            dispatch(fetchUser(user_id));
            setSeeds(data.seeds);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeed();

    // Reset quantities to 0
    setItems((prevItems) => {
      return prevItems.map((item) => ({ ...item, quantity: 0 }));
    });
  };

  const calculateTotalCost = () => {
    let totalCost = 0;

    items.forEach((item) => {
      totalCost += item.price * item.quantity;
    });

    return totalCost;
  };

  const totalCost = calculateTotalCost();
  const isInsufficientFunds = totalCost > balance;

  return (
    <div>
      <div className="balances-in-market">
        <img src="./token.png" alt="Token" className="token-image" />
        <p>{balance}</p>
      </div>
      <h2>{lang.market()}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ position: "relative" }}>
            {item.is_lock && (
              <div id="lock-overlay" onClick={() => unlockSeed(item.id)}>
                <div className="lock-content">
                  <img src={lock} alt="lock" />
                  <span>{item.cost_unlock}</span>
                  <img src="./token.png" alt="Token" />
                </div>
              </div>
            )}
            <div>
              <span>{lang.plants(item.id)}</span>
              <span>{item.price}</span>
            </div>
            <div>
              <button
                className="center-all"
                onClick={() => handleQuantityChange(index, item.quantity - 1)}
                disabled={item.quantity === 0}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="center-all"
                onClick={() => handleQuantityChange(index, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <h2>{lang.total_cost()}:</h2>
        <div className="balances-in-market">
          <img src="./token.png" alt="Token" className="token-image" />
          <p style={{ color: isInsufficientFunds ? "red" : "#000" }}>
            {totalCost.toLocaleString("en-US")}
          </p>
        </div>
      </div>
      <button
        onClick={handleBuy}
        className="buy"
        disabled={isInsufficientFunds}
      >
        {lang.buy()}
      </button>
    </div>
  );
};

export default MarketContent;
