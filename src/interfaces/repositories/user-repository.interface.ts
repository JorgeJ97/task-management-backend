import type { CreateUserData, UpdateUserData } from "../../types/user.types";

export interface IUserRepository <TUser> {
    findByEmail(email: string): Promise<TUser> | null;
    save(userData: CreateUserData): Promise<TUser>;
    update(userData: UpdateUserData): Promise<TUser>;
}