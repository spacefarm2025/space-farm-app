import React, { useState, useEffect } from "react";
import styles from "./BestCats.module.scss";
import arrowLeft from "../../../assets/left-arrow.png";
import arrowRight from "../../../assets/right-arrow.png";

import { getLeaders } from "../../../api/api";

const BestCats = ({ user, lang }) => {
  const [players, setPlayers] = useState([]);
  const [userRankings, setUserRankings] = useState(null);
  const [currentLeague, setCurrentLeague] = useState(
    Math.floor((user.level - 1) / 10) + 1
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getLeaders(user.id, currentLeague);
        setPlayers(data.leaders);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    const fetchRanking = async () => {
      try {
        const data = await getLeaders(user.id, 0);
        setUserRankings(data.info.rankings);
      } catch (error) {
        console.error("Failed to fetch rank:", error);
      }
    };

    fetchPlayers();
    fetchRanking();
  }, [user.id, currentLeague]);

  const handlePrevClick = () => {
    setCurrentLeague((prev) => Math.max(1, prev - 1));
  };

  const handleNextClick = () => {
    setCurrentLeague((prev) => Math.min(10, prev + 1));
  };

  const getPlayerStyle = (index) => {
    switch (index) {
      case 0:
        return styles.firstPlayer;
      case 1:
        return styles.secondPlayer;
      case 2:
        return styles.thirdPlayer;
      default:
        return styles.playerItem;
    }
  };

  const leagueImage = require(`../../../assets/leaderboard/title/${currentLeague}-title.png`);

  return (
    <>
      <div className={styles.title}>
        <button onClick={handlePrevClick} className={styles.customButton}>
          <img
            className={styles.sliderArrow}
            src={arrowLeft}
            alt="Arrow left"
          />
        </button>
        <img src={leagueImage} className={styles.titleImage} alt="League" />
        <button onClick={handleNextClick} className={styles.customButton}>
          <img
            className={styles.sliderArrow}
            src={arrowRight}
            alt="Arrow right"
          />
        </button>
      </div>

      {players.length > 0 ? (
        <div className={styles.bestCatsContainer}>
          {players.map((player, index) => (
            <div key={index} className={getPlayerStyle(index)}>
              {index > 2 ? (
                <span className={styles.rank}>{index + 1}</span>
              ) : (
                <span className={styles.divider}></span>
              )}
              <span className={styles.name}>
                {player.username
                  ? player.username.slice(0, 12) +
                    (player.username.length > 12 ? "..." : "")
                  : "Anonymous"}
              </span>
              <span className={styles.score}>
                {player.balance.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.bestCatsContainer}>{lang.no_users_league()}</div>
      )}

      <div className={styles.userItem}>
        <span className={styles.userName}>{user.username}</span>
        <span className={styles.userScore}>
          {userRankings ? `#${userRankings}` : "..."}
        </span>
      </div>
    </>
  );
};

export default BestCats;
