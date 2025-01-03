import React, { useState, useEffect } from "react";
import styles from "./HypePage.module.scss";
import tiktokIcon from "../../assets/hype/tiktok.png";
import instagramIcon from "../../assets/hype/instagram.png";
import twitterIcon from "../../assets/hype/twitter.png";
import youtubeIcon from "../../assets/hype/youtube.png";
import coinIcon from "../../assets/hype/coin.png";
import { useSelector } from "react-redux";

// import { invite_link } from "../../config";
import { bot_link } from "../../config";

import { InviteGet } from "../../api/api";

// Массив данных для таблицы
const rewardData = [
  { views: "100", reward: "10K" },
  { views: "1K-4.9K", reward: "20K" },
  { views: "5K-9.9K", reward: "30K" },
  { views: "10K-49.9K", reward: "50K" },
  { views: "50K-99.9K", reward: "100K" },
  { views: "100K-499.9K", reward: "500K" },
  { views: "500K-999.9K", reward: "1M" },
  { views: "1M", reward: "5M" },
];

const HypePage = ({ lang }) => {
  const [buttonText, setButtonText] = useState(lang.addLink());
  const user_id = useSelector((state) => state.user.userId);

  const [referralLink, setReferralLink] = useState(bot_link + `?start=&text=`);
  const [myLinkData, setMyLinkData] = useState({});

  const generate_link = async () => {
    const linkData = await InviteGet(user_id);
    if (linkData) {
      setMyLinkData(linkData);
    }
  };

  useEffect(() => {
    if (myLinkData) {
      setReferralLink(bot_link + `?start=${myLinkData.code}`);
    }
  }, [myLinkData]);

  useEffect(() => {
    generate_link();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setButtonText(lang.copied());
      setTimeout(() => setButtonText(lang.addLink()), 3000);
    });
  };

  return (
    <div className={styles.hypeContainer}>
      <div className={styles.header}>
        <p>{lang.help()}</p>
        <span>
          <h3>1 000 000 000</h3>
          <img className={styles.coinsIcon} src={coinIcon} alt="Coins" />
        </span>
      </div>

      <div className={styles.platforms}>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tiktokIcon} alt="TikTok" className={styles.platformIcon} />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagramIcon}
            alt="Instagram"
            className={styles.platformIcon}
          />
        </a>
        <button className={styles.addLinkButton} onClick={copyToClipboard}>
          {buttonText}
        </button>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={twitterIcon}
            alt="X (Twitter)"
            className={styles.platformIcon}
          />
        </a>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={youtubeIcon}
            alt="YouTube"
            className={styles.platformIcon}
          />
        </a>
      </div>

      <div className={styles.instructions}>
        <p>{lang.instructions1()}</p>
        <p>{lang.instructions2()}</p>
      </div>

      <div className={styles.instructions}>
        <p>{lang.instructions3()}</p>
      </div>

      <div className={styles.rewards}>
        <table className={styles.rewardTable}>
          <thead>
            <tr>
              <th>{lang.views()}</th>
              <th style={{ color: "#83FFD1" }}>{lang.reward()}</th>
            </tr>
          </thead>
          <tbody>
            {rewardData.map((item, index) => (
              <tr key={index}>
                <td cla>{item.views}</td>
                <td style={{ color: "#83FFD1" }}>
                  {item.reward}
                  <img
                    className={styles.coinsIconTable}
                    src={coinIcon}
                    alt="Coins"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HypePage;
