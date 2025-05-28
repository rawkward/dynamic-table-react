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