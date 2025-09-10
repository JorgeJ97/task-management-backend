import type { CreateUserDto } from "../../dto/user.dto";

export interface IAuthService {
    login(email: string, password: string): Promise<string>;
    logout(token: string): Promise<void>;
    register(createUserDto: CreateUserDto): Promise<void>;
}