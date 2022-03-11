import { IUser, ILoginUser } from "../models";
export declare type ICreateUserDto = {
  name: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
  email?: string;
};
export declare type ILoginUserDto = Pick<ICreateUserDto, "name" | "password">;
export declare type IUpdateUserDto = Pick<ICreateUserDto, "avatar" | "email">;
export declare abstract class IUserService {
  user;
  token;
  registerLoading;
  registerError;
  loginLoading;
  loginError;
  updateLoading;
  updateError;
  abstract register(createUser: ICreateUserDto): Promise<IUser>;
  abstract login(loginUser: ILoginUserDto): Promise<ILoginUser>;
  abstract updateUser(updateUser: IUpdateUserDto): Promise<IUser>;
  abstract logout(): void;
  /**
   * 将数据存储到浏览器
   */
  abstract storetDataInBrowser(): void;

  /**
   * 从浏览器恢复数据
   */
  abstract syncDataInBrowser(): void;
}
