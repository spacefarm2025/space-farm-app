import React, { useEffect, useState } from "react";
import { channel_link, earn_for_task, invite_link } from "../../config";
import "./BalanceContent.css";

import { useDispatch } from "react-redux";
import { checkSubscribe, InviteGet } from "../../api/api";
import { fetchUser } from "../../redux/features/userSlice";

const BalanceContent = ({ lang, user, tg }) => {
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

  return (
    <div className="modal-coins">
      <img
        src={require(`../../assets/modals/coin.png`)}
        className="coin-img"
        alt={`Coin`}
      />
      <h4 style={{ margin: 0, marginTop: "25px" }}>{lang.balance_enough()}</h4>
      <button
        className="task-item-container-invite"
        onClick={() => inviteFrends()}
      >
        {/* <p>⚡️ MAX ⚡️</p> */}
        <div className="task-invite">
          <p>
            {lang.invite_frends()}{" "}
            {myLinkData && (
              // <span>{lang.invite_lefts(myLinkData.invites_left)}</span>
              <span>{lang.invite_lefts}</span>
            )}
          </p>
          <p className="earn_tokens" style={{ paddingLeft: "0" }}>
            {earn_for_task}
          </p>
        </div>
      </button>

      <button className="task-item-container-join" onClick={() => openURL()}>
        {/* {!user.subscribe_channel && <p> MAX </p>} */}
        <div className="task-invite">
          <p>{lang.subscribe_community()}</p>
          {/* {!user.subscribe_channel && ( */}
          <p className="earn_tokens" style={{ paddingLeft: "0" }}>
            {earn_for_task}
          </p>
          {/* )} */}
        </div>
      </button>
    </div>
  );
};
export default BalanceContent;
