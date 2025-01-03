import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkSubscribe, InviteGet } from "../../api/api";
import { channel_link, invite_link } from "../../config";
import { fetchUser } from "../../redux/features/userSlice";
import "./EnergyContent.css";

const EnergyContent = ({ lang, user, tg, setIsOpen, setPage }) => {
  const dispatch = useDispatch();
  const [myLink, setMyLink] = useState(invite_link + `?start=${user.id}&text=`);
  const [myLinkData, setMyLinkData] = useState({});
  const [energy, setEnergy] = useState(user.energy);
  const [timeEnergy, setTimeEnergy] = useState(new Date(user.time_energy));

  const openURL = async () => {
    try {
      const data = await checkSubscribe(user.id);
      if (data) {
        dispatch(fetchUser(user.id));
      }
      tg.openTelegramLink(channel_link);
    } catch (error) {
      console.error(error);
    }
  };

  const inviteFrends = async () => {
    try {
      tg.openTelegramLink(myLink + `${lang.invite_msg()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const generate_link = async () => {
    const linkData = await InviteGet(user.id);
    if (linkData) {
      setMyLinkData(linkData);
    }
  };

  useEffect(() => {
    if (myLinkData) {
      setMyLink(invite_link + `?start=${myLinkData.code}&text=`);
    }
  }, [myLinkData]);

  const handleClickEnergy = () => {
    setPage("earn");
    setIsOpen(false);
  };

  const [timeEnergyLeft, setTimeEnergyLeft] = useState(null);
  useEffect(() => {
    generate_link();
    let currentTime = new Date();
    const timeZoneOffset = currentTime.getTimezoneOffset() * 60000; // Отримуємо зміщення часового поясу в мілісекундах
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
      setEnergy(user.energy);
      let currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000; // Отримуємо зміщення часового поясу в мілісекундах
      currentTime = new Date(currentTime.getTime() + timeZoneOffset);
      let newTimeLeft = Math.max(
        0,
        Math.ceil((timeEnergy - currentTime) / 1000)
      );
      if (newTimeLeft <= 0 && user.energy != user.energy_limit) {
        dispatch(fetchUser(user.id));
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
    <div className="modal-energy">
      <img
        src={require(`../../assets/modals/energy.png`)}
        className="energy-modal-img"
        alt={`Energy`}
      />

      <h4 style={{ marginBottom: "10px" }}>{lang.energy_not_enough()}</h4>
      {/* <button className="button" onClick={() => inviteFrends()}>
        <p>⚡️ MAX ⚡️</p>
        <p className="earn_tokens" style={{ paddingLeft: "0" }}>
          {earn_for_task}
          <img src="./token.png" alt="Token" className="img-in-text" />
        </p>
        <p>
          {lang.invite_frends()}{" "}
          {myLinkData && (
            <span>{lang.invite_lefts(myLinkData.invites_left)}</span>
          )}
        </p>
        <p></p>
      </button> */}

      {/* <button className="button name" onClick={() => openURL()}>
        {!user.subscribe_channel && <p>⚡️ MAX ⚡️</p>}
        {!user.subscribe_channel && (
          <p className="earn_tokens" style={{ paddingLeft: "0" }}>
            {earn_for_task}
            <img src="./token.png" alt="Token" className="img-in-text" />
          </p>
        )}
        <p>{lang.subscribe_community()}</p>
      </button> */}

      {energy < user.energy_limit && (
        <div className="energy-status">
          <p className="numbers numbers-energy" style={{ marginTop: "15px" }}>
            {energy} / {user.energy_limit}
          </p>
          <p className="numbers numbers-energy">{timeEnergyLeft}</p>
        </div>
      )}

      <button
        className="energy-button"
        style={{ width: "200px", marginTop: "20px" }}
        onClick={handleClickEnergy}
      >
        {lang.get_energy()}
      </button>
    </div>
  );
};
export default EnergyContent;
