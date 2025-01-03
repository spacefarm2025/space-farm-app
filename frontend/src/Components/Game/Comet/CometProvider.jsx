import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CometContext = createContext();

export const useComets = () => useContext(CometContext);

export const CometProvider = ({ children, showComets }) => {
  const [comets, setComets] = useState([]);
  const [collectedComets, setCollectedComets] = useState([]);
  const userId = useSelector((state) => state.user.userId);

  const handleCollect = (id) => {
    setCollectedComets((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (userId && showComets) {
      const fetchComets = async () => {
        try {
          const response = await fetch(
            `https://api.spacefarm.ink/api/v1/user/comet?user_id=${userId}`
          );
          const data = await response.json();
          if (data.status === 1) {
            setComets((prev) => [...prev, data.data]);
          }
        } catch (error) {
          console.error("Error fetching comets:", error);
        }
      };

      fetchComets();

      const interval = setInterval(() => {
        fetchComets();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [userId, showComets]);

  return (
    <CometContext.Provider value={{ comets, handleCollect }}>
      {children}
    </CometContext.Provider>
  );
};
