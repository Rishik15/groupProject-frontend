import api from "../api";

export async function GetUserInfo() {
  const res = await api.get("/client/getInfo");

  return res.data;
}