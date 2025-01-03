import React, { useState, useEffect } from "react";
import { invite_link } from "../../../config";
import { InviteGet } from "../../../api/api";
import "./TaskItem.css";

import frendsBg from "../../../assets/tasks/invite.png";
import tgBg from "../../../assets/tasks/TG.png";
import defaultBg from "../../../assets/tasks/TikTok.png";

import startImage from "../../../assets/tasks/bottom.png";
import claimImage from "../../../assets/tasks/check.png";
import doneImage from "../../../assets/tasks/Done.png";

export const TaskItem = (props) => {
  const [myLink, setMyLink] = useState(invite_link + `?start=&text=`);
  const [myLinkData, setMyLinkData] = useState({});

  const backgroundImages = {
    frends: frendsBg,
    tg: tgBg,
    default: defaultBg,
  };

  const generate_link = async () => {
    const linkData = await InviteGet(props.user_id);
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

  const startTask = async () => {
    try {
      if (props.task.social === "frends") {
        props.tg.openTelegramLink(myLink + `${props.lang.invite_msg()}`);
      } else if (props.task.social === "tg") {
        props.tg.openTelegramLink(props.task.link);
      } else {
        props.tg.openLink(props.task.link);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const taskStyle = {
    backgroundImage: `url(${
      props.task.social === "frends"
        ? backgroundImages.frends
        : props.task.social === "tg"
        ? backgroundImages.tg
        : backgroundImages.default
    })`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const buttonStyle = {
    backgroundImage: `url(${
      props.task.status === 0
        ? startImage
        : props.task.status === 1
        ? doneImage
        : startImage
    })`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "70px",
    height: "50px",
    border: "none",
    color: "white",
  };

  return (
    <div className="task-item-container" style={taskStyle}>
      <div style={{ marginLeft: "15%" }}>
        <p className="task-item-name">{props.task.name}</p>
        <div className="task-item-text">
          <span>{props.task.earn}</span>
          {/* <span>FULL +1</span> */}
        </div>
      </div>
      <button
        className="task-status-button"
        onClick={() => startTask()}
        disabled={props.task.status === 1}
        style={buttonStyle}
      ></button>
    </div>
  );
};
