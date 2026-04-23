import api from "../api";

export const getClients = async () => {
  const res = await api.get("/manage/getClients");

  return res.data;
};



