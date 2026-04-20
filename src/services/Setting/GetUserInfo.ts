import axios from "axios";

export async function GetUserInfo() {
  const res = await axios.get("http://localhost:8080/client/getInfo", {
    withCredentials: true,
  });

  return res.data;
}
