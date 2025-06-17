export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
};

export type UserDTO = {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
}