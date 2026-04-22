export type Contract = {
  contract_id: number;
  details: string;
  name: string;
  price: string;
  start_date: string;
  end_date: string | null;
  user_id: number;
};

export type ContractsResponse = {
  counts: {
    history: number;
    pending: number;
    present: number;
  };
  history_contracts: Contract[];
  pending_requests: Contract[];
  present_contracts: Contract[];
};