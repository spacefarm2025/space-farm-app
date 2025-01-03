import React, { useEffect, useState } from "react";
import { channel_link, earn_for_task, invite_link } from "../../config";
import "./ClosedPlanetContent.css";

import { useDispatch } from "react-redux";
import { checkSubscribe, InviteGet } from "../../api/api";
import { fetchUser } from "../../redux/features/userSlice";

const ClosedPlanetContent = ({ lang, user, tg, planet, currentPlanet }) => {
  const dispatch = useDispatch();
  const [myLink, setMyLink] = useState(invite_link + `?start=${user.id}&text=`);
  const [myLinkData, setMyLinkData] = useState({});
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

  useEffect(() => {
    generate_link();
  }, []);

  const planetImages = {
    1: require("../../assets/big-earth.png"),
    2: require("../../assets/big-moon.png"),
    3: require("../../assets/big-mars.png"),
    4: require("../../assets/big-saturn.png"),
  };

  const countInvites = {
    1: "1",
    2: "1",
    3: "3",
    4: "10",
  };

  return (
    <div className="modal-coins">
      <img
        src={planetImages[currentPlanet]}
        className="locked-planet-img"
        alt={`Planet ${currentPlanet}`}
      />

      <div className="crystall-container">
        <img
          src={require(`../../assets/modals/crystall.png`)}
          className="invite-img"
          alt="Crystall"
        />
        <div>
          <h3>{`${user.refer_count} / ${countInvites[currentPlanet]}`}</h3>
        </div>
      </div>
      <h4 style={{ margin: 0, padding: "5px", fontSize: "13px" }}>
        {lang.closed_planets()}
      </h4>
      <button
        className="task-item-container-invite"
        onClick={() => inviteFrends()}
      >
        <div className="task-invite">
          <p>{lang.invite_frends()}</p>
          <p className="earn_tokens" style={{ paddingLeft: "0" }}>
            {earn_for_task}
          </p>
        </div>
      </button>
    </div>
  );
};
export default ClosedPlanetContent;
