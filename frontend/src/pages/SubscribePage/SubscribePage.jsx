import React, { useState, useEffect } from "react";
import styles from "./SubscribePage.module.scss";
import { channel_link } from "../../config";
import { checkSubscribe } from "../../api/api";

import tgBg from "../../assets/tasks/tg-sub.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SubscribePage = ({ lang }) => {
  const tg = window?.Telegram?.WebApp;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // State to hold feedback messages

  useEffect(() => {
    if (userId) {
      checkSubscriptionStatus();
    }
  }, [userId]);

  const checkSubscriptionStatus = async () => {
    try {
      const subscribed = await checkSubscribe(userId);
      setIsSubscribed(subscribed);
      if (subscribed) {
        navigate("/");
      } else {
        setFeedbackMessage(lang.not_subscribed_message()); // Set a localized message for non-subscription
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setFeedbackMessage(lang.error_checking_subscription()); // Set error message if API call fails
    }
  };

  const startTask = async () => {
    try {
      tg.openTelegramLink(channel_link);
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualCheck = () => {
    checkSubscriptionStatus();
  };

  const taskStyle = {
    backgroundImage: `url(${tgBg})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.gradientText}>SPACE FARM</h1>
      <h1 className={styles.title}>{lang.subscribe_preview()}</h1>
      <div
        className="task-item-container"
        style={taskStyle}
        onClick={startTask}
      >
        <div style={{ marginLeft: "-10%", marginBottom: "4%" }}>
          <p className="task-item-name">{lang.subscribe_community()}</p>
        </div>
      </div>
      {!isSubscribed && (
        <button className={styles.button} onClick={handleManualCheck}>
          {lang.i_subscribed()}
        </button>
      )}
      {feedbackMessage && (
        <div className={styles.feedbackMessage}>{feedbackMessage}</div>
      )}
    </div>
  );
};

export default SubscribePage;
