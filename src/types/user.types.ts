export interface CreateUserData {
    name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {}