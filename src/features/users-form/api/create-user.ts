import { api } from "@/shared/api/instance.ts";
import type { User } from "@/entities/user/types.ts";
import {endpoint} from "@/shared/api/config.ts";

export type CreateUserPayload = Omit<
  User,
  "id" | "profile_created_date" | "last_login_date" | "posts_count"
> & {
  [key: string]: string | number | undefined;
};

export const createUser = async (
  userData: CreateUserPayload,
): Promise<User> => {
  const response = await api.post<User>(`/${endpoint}`, userData);
  return response.data;
};
