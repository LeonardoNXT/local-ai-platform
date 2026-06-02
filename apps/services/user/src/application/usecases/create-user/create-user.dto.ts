export type CreateUserInputDto = {
  username: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
};

export type CreateUserResult = {
  id: string;
};
