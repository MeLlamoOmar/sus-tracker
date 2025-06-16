export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDTO = {
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt: Date;
}