import api from "../../api";
import type { ContractsResponse } from "../../../utils/Interfaces/Dashboard/Coach/types";

export const getContracts = async (): Promise<ContractsResponse> => {
  const res = await api.get("/dashboard/coach/contracts");
  return res.data;
};