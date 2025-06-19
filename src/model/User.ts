export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
  name?: string;
};

export type UserDTO = {
  email: string;
  password: string;
  createdAt?: number;
  updatedAt?: number;
  name?: string;
}