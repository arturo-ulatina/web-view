// Mirrors src/users/entities/user.entity.ts in the API
export interface User {
  id: number;
  name: string;
  lastname: string | null;
  age: number;
}

export type UserInput = Omit<User, "id">;

export const MIN_AGE = 1;
export const MAX_AGE = 115;
