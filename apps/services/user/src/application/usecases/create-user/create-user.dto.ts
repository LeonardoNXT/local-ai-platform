export type CreateUserInputDto = {
  username: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  isEmailVerified: boolean;
};

export type CreateUserResult = {
  id: string;
};
