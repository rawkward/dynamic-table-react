export type User = {
  id: number;
  [key: string]: string | number;
};

export type UsersResponse = {
  data: User[];
  meta: {
    totalRowCount: number;
  };
};