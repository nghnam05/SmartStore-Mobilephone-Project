import { User } from "@prisma/client";

export interface UserWithRole extends User {
  role: {
    id: number;
    name: string;
    description: string;
  }
}