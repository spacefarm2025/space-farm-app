import axios from "axios";

export const getUser = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/user/get?user_id=${user_id}`,
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTasks = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/user/tasks?user_id=${user_id}`,
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const checkViewModal = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/user/views?user_id=${user_id}`,
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const startTask = async (user_id, task_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/task/start",
      data: JSON.stringify({
        user_id: user_id,
        task_id: task_id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const claimTask = async (user_id, task_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/task/claim",
      data: JSON.stringify({
        user_id: user_id,
        task_id: task_id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const setViewModal = async (user_id, modal_name) => {
  try {
    const response = await axios({
      method: "post",
      url: `${api_url}/user/view`,
      data: {
        user_id: user_id,
        modal_name: modal_name,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaders = async (user_id, league_id) => {
  try {
    const response = await axios.get(`${api_url}/leaderboard`, {
      params: {
        user_id: user_id,
        sort: "xp",
        league: league_id,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
};

export const modifyBalance = async (user_id, amount, operation) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/balance/modify",
      data: JSON.stringify({
        user_id: user_id,
        amount: amount,
        operation: operation,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const buySeed = async (user_id, plant_id, operation, quantity) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/seed/modify",
      data: JSON.stringify({
        user_id: user_id,
        plant_id: plant_id,
        operation: operation,
        quantity: quantity,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unlockSeedApi = async (user_id, plant_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/seed/unlock",
      data: JSON.stringify({
        user_id: user_id,
        plant_id: plant_id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPlants = async () => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/plants/get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const userRegister = async (initData, user, startapp) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/register",
      data: { user: user, startapp: startapp || "" },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Telegram-Webapp": initData,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPlantings = async (user_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/plantings/get",
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const chargePlanting = async (plant_id, charge) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/charge",
      data: JSON.stringify({ plantation_id: plant_id, charge: charge }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getRate = async (from_id, to_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/rate?from_id=${from_id}&to_id=${to_id}`,
      data: JSON.stringify({ from_id: from_id, to_id: to_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const swapBalance = async (from_id, to_id, user_id, amount) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/swap",
      data: JSON.stringify({
        from_id: from_id,
        to_id: to_id,
        user_id: user_id,
        amount: amount,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getMarsPlantings = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/user/plantings?user_id=${user_id}&planet_id=3`,
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSaturnPlantings = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/user/plantings?user_id=${user_id}&planet_id=4`,
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const wateringPlantings = async (planting_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/watering",
      data: JSON.stringify({ planting_id: planting_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const harvestPlantings = async (planting_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/harvest",
      data: JSON.stringify({ planting_id: planting_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const claimLiquid = async (plant_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/claim",
      data: JSON.stringify({ plantation_id: plant_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const pasteSeeds = async (user_id, plant_id, plantation_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/seeds/paste",
      data: JSON.stringify({
        user_id: user_id,
        plant_id: plant_id,
        plantation_id: plantation_id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSeeds = async (user_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/seeds/get",
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkSubscribe = async (user_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/subscribe",
      data: JSON.stringify({ user_id: user_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const buildPlantings = async (user_id, planet_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/build",
      data: JSON.stringify({ user_id: user_id, planet_id: planet_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const BuildPriceGet = async (user_id, planet_id) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/planting/build/calculate",
      data: JSON.stringify({ user_id: user_id, planet_id: planet_id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const InviteGet = async (user_id) => {
  try {
    const response = await axios({
      method: "get",
      url: api_url + `/invite/get?user_id=${user_id}`,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTransaction = async (user_id, token_id, wallet, amount) => {
  try {
    const response = await axios({
      method: "post",
      url: api_url + "/user/transaction/create",
      data: JSON.stringify({
        user_id: user_id,
        token_id: token_id,
        wallet: wallet,
        amount: amount,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
