export type DeactivateUserDtoInput = {
  id: string;
  password: string;
};

export type DeactivateUserDtoResult = {
  deletedAt: string;
};
