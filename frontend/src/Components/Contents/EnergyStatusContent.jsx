import React, { useEffect, useState } from "react";
import "./EnergyContent.css";

import styles from "./EnergyStatusContent.module.scss";

const EnergyStatusContent = ({ lang, user, setIsOpen, setPage, energy }) => {
  // const [energy, setEnergy] = useState(user.energy);
  const [timeEnergy, setTimeEnergy] = useState(new Date(user.time_energy));
  const [timeEnergyLeft, setTimeEnergyLeft] = useState(null);

  useEffect(() => {
    let currentTime = new Date();
    const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
    currentTime = new Date(currentTime.getTime() + timeZoneOffset);
    let newTimeLeft = Math.max(0, Math.ceil((timeEnergy - currentTime) / 1000));
    const isoTimeLeft = new Date(newTimeLeft * 1000).toISOString();
    const formattedTimeLeft = new Date(isoTimeLeft).toLocaleString("en-US", {
      timeZone: "UTC",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setTimeEnergyLeft(formattedTimeLeft);

    const intervalId = setInterval(() => {
      setTimeEnergy(new Date(user.time_energy));
      // setEnergy(user.energy);
      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      let newTimeLeft = Math.max(
        0,
        Math.ceil((timeEnergy - currentTime) / 1000)
      );
      if (newTimeLeft <= 0 && user.energy !== user.energy_limit) {
        setIsOpen(false);
      }
      const isoTimeLeft = new Date(newTimeLeft * 1000).toISOString();
      const formattedTimeLeft = new Date(isoTimeLeft).toLocaleString("en-US", {
        timeZone: "UTC",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTimeEnergyLeft(formattedTimeLeft);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.modalEnergy}>
      <img
        src={require(`../../assets/modals/energy.png`)}
        className={styles.energyModalImg}
        alt="Energy"
      />

      {energy < user.energy_limit ? (
        <div className={styles.energyStatus}>
          <p className={styles.numbersEnergy}>
            {energy} / {user.energy_limit}
          </p>
          <p className={styles.numbersEnergy}>{timeEnergyLeft}</p>
        </div>
      ) : (
        <p>{lang.energy_is_full()}</p>
      )}
    </div>
  );
};
export default EnergyStatusContent;
