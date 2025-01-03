import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom"; // Правильный импорт Routes и Route
import App from "./App";
import SubscribePage from "./pages/SubscribePage/SubscribePage";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { userRegister, checkSubscribe } from "./api/api";
import { get_language } from "./localization";
import { setUserId } from "./redux/features/userSlice";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

const RoutesComponent = () => {
  const tg = window?.Telegram?.WebApp;

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  const [language, setLanguage] = useState(1);
  const [lang, setLang] = useState(get_language(language));

  const navigate = useNavigate();
  const [subscribeStatus, setSubscribeStatus] = useState(0);

  useEffect(() => {
    if (tg) {
      tg.expand();
      const initData = tg.initData;
      const initDataUnsafe = tg.initDataUnsafe;
      const user = initDataUnsafe.user;
      const startapp = initDataUnsafe.start_param;

      if (initDataUnsafe !== null) {
        const Register = async () => {
          await userRegister(initData, user, startapp);
        };
        Register();

        dispatch(setUserId(initDataUnsafe.user.id));
      }
    }
  }, [dispatch, tg]);

  useEffect(() => {
    const fetchSubscribeStatus = async () => {
      try {
        const isSubscribed = await checkSubscribe(userId);
        setSubscribeStatus(isSubscribed ? 1 : 2);
        if (!isSubscribed) {
          navigate("/subscribe");
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setSubscribeStatus(2);
      }
    };
    fetchSubscribeStatus();
  }, [userId]);

  function modify_language() {
    const searchParams = new URLSearchParams(window.location.search);
    let language_temp = searchParams.get("lang");
    if (!language_temp) {
      language_temp = 2;
    } else {
      try {
        language_temp = parseInt(language_temp);
      } catch (error) {
        language_temp = 2;
      }
    }
    setLang(get_language(language_temp));
  }

  useEffect(() => {
    modify_language();
  }, [userId]);

  return (
    <TonConnectUIProvider
      manifestUrl="https://spacefarm.ink/tonconnect-manifest.json"
      language="ru"
    >
      <Routes>
        <Route path="/" element={<App lang={lang} />} />
        <Route path="/subscribe" element={<SubscribePage lang={lang} />} />
      </Routes>
    </TonConnectUIProvider>
  );
};

export default RoutesComponent;
