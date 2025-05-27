import type { SortingState } from "@tanstack/react-table";
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
  sorting: SortingState,
): Promise<UsersResponse> => {
  const response = await api.get("/usersShort", {
    params: {
      _start: start,
      _limit: size,
      _sort: sorting.map((s) => s.id).join(","),
      _order: sorting.map((s) => (s.desc ? "desc" : "asc")).join(","),
    },
  });
  return {
    data: response.data,
    meta: {
      totalRowCount: Number(response.headers["x-total-count"]),
    },
  };
};
