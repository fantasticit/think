/**
 * 用户状态枚举
 */
export declare enum UserStatus {
    normal = "normal",
    locked = "locked"
}
/**
 * 用户数据定义
 */
export interface IUser {
    id: string;
    name: string;
    password?: string;
    avatar?: string;
    email?: string;
    status: UserStatus;
    isSystemAdmin?: boolean;
}
/**
 * 登录用户数据定义
 */
export interface ILoginUser extends IUser {
    token: string;
}
