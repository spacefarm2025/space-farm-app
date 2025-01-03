import React, { useState } from "react";
import styles from "./Leaderboard.module.scss";
import UserCat from "./UserCat/UserCat";
import BestCats from "./BestCats/BestCats";

const LeaderboardPage = ({ user, lang }) => {
  const [activeView, setActiveView] = useState("myCat");

  return (
    <div className={styles.catComponent}>
      <div className={styles.topButtons}>
        <button
          className={styles.buttonMyCat}
          onClick={() => setActiveView("myCat")}
        ></button>
        <button
          className={styles.buttonBestCat}
          onClick={() => setActiveView("bestCats")}
        ></button>
      </div>

      {activeView === "myCat" ? (
        <UserCat user={user} />
      ) : (
        <BestCats user={user} lang={lang} />
      )}
    </div>
  );
};

export default LeaderboardPage;
