import { api } from "@/shared/api/instance.ts";

export type User = {
  user_id: number;
  [key: string]: string | number;
};

export type UsersResponse = {
  data: User[];
  meta: {
    totalRowCount: number;
  };
};

export const fetchUsers = async (
  start: number,
  size: number,
): Promise<UsersResponse> => {
  const response = await api.get("/usersMedium", {
    params: {
      _start: start,
      _limit: size,
    },
  });
  return {
    data: response.data,
    meta: {
      totalRowCount: Number(response.headers["x-total-count"]),
    },
  };
};
