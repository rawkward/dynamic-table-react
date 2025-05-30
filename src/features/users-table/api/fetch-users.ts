import type { SortingState } from "@tanstack/react-table";
import { api } from "@/shared/api/instance.ts";
import type { UsersResponse } from "@/entities/user/types.ts";
import { endpoint } from "@/shared/api/config.ts";

export const fetchUsers = async (
  start: number,
  size: number,
  sorting: SortingState,
): Promise<UsersResponse> => {
  const response = await api.get(`/${endpoint}`, {
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
