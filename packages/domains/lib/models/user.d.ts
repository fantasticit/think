export declare enum UserRole {
    normal = "normal",
    admin = "admin",
    superadmin = "superadmin"
}
export declare enum UserStatus {
    normal = "normal",
    locked = "locked"
}
export interface IUser {
    id: string;
    name: string;
    password?: string;
    avatar?: string;
    email?: string;
    role: UserRole;
    status: UserStatus;
}
export interface ILoginUser extends IUser {
    token: string;
}
