import { UserRepository } from '../repositories/user.repository';

export class AuthService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
}