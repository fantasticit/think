import type { IUser } from "@think/share";
import { HttpClient } from "./HttpClient";

export const register = (data: Partial<IUser>): Promise<IUser> => {
  return HttpClient.post("/user/register", data);
};
