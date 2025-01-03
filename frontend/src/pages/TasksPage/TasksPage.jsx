import base64js from "base64-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSubscribe } from "../../api/api";
import buttonImg from "../../assets/tasks/bottom.png";
import claimImg from "../../assets/tasks/claim.png";
import coinImg from "../../assets/tasks/coin.png";
import crystalYTImg from "../../assets/tasks/crystal-yt.png";
import crystalImg from "../../assets/tasks/crystal.png";
import doneImg from "../../assets/tasks/Done.png";
import energyImg from "../../assets/tasks/energy.png";
import plusImg from "../../assets/tasks/plus.png";
import { channel_link, earn_for_task, energy_limit } from "../../config";
import {
  claimTaskReward,
  executeTask,
  fetchTasks,
} from "../../redux/features/tasksSlice";
import { TaskItem } from "./TaskItem/TaskItem";
import "./TasksPage.scss";

export const TasksPage = (props) => {
  const [subscribeStatus, setSubscribeStatus] = useState(0);

  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscribeStatus = async () => {
      try {
        const isSubscribed = await checkSubscribe(props.user_id);
        setSubscribeStatus(isSubscribed ? 1 : 2);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setSubscribeStatus(2);
      }
    };
    fetchSubscribeStatus();

    dispatch(fetchTasks(props.user_id));
  }, [dispatch, props.user_id]);

  const frends_task = {
    name: props.lang.invite_frends(),
    social: "frends",
    earn: earn_for_task,
    energy: energy_limit,
    status: 0,
  };

  const join_channel_task = {
    name: props.lang.subscribe_community(),
    social: "tg",
    earn: earn_for_task,
    energy: energy_limit,
    status: subscribeStatus,
    link: channel_link,
  };

  const ImageComponent = (base64String) => {
    if (!base64String) {
      return <p>No image data</p>;
    }
    const byteArray = base64js.toByteArray(base64String);
    const blob = new Blob([byteArray], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);

    return <img className="logo" src={imageUrl} alt="logo" />;
  };

  const StartTask = (el) => {
    if (el.status === 2) {
      dispatch(
        claimTaskReward({ user_id: props.user_id, task_id: el.task_id })
      );
    } else {
      dispatch(
        executeTask({
          user_id: props.user_id,
          task_id: el.task_id,
          link_redirect: el.link_redirect,
          tg: props.tg,
        })
      );
    }
  };

  return (
    <div className="earn-content">
      <TaskItem
        task={frends_task}
        lang={props.lang}
        user_id={props.user_id}
        tg={props.tg}
      />
      <TaskItem
        task={join_channel_task}
        lang={props.lang}
        user_id={props.user_id}
        tg={props.tg}
      />

      <div className="tasks-container">
        {tasks &&
          tasks.map((el) => {
            const isYoutube = el.link_redirect.includes("youtube");
            return (
              <div key={el.id} className={`${isYoutube && "youtube"} task`}>
                {isYoutube ? (
                  <img src={crystalYTImg} className="crystalYT" alt="crystal" />
                ) : (
                  <img src={crystalImg} className="crystal" alt="crystal" />
                )}
                {!isYoutube && ImageComponent(el.image)}
                <p className="text">{el.text}</p>
                <div className="reward">
                  <span className="tokens">
                    <img src={plusImg} className="plus" alt="+" />{" "}
                    {el.earn_points}
                    <img src={coinImg} className="coin" alt="coin" />
                  </span>
                  <span className="energy">
                    +{el.earn_energy}
                    <img src={energyImg} className="energy" alt="energy" />
                  </span>
                </div>
                <img
                  src={
                    el.status === 2
                      ? claimImg
                      : el.status === 0
                      ? buttonImg
                      : doneImg
                  }
                  className={`plusbutton ${el.status === 1 && "disabled"}`}
                  alt="button"
                  onClick={() => StartTask(el)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
