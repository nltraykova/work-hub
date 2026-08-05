import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import userSchema from "../schemas/auth.schema.js";
import { generateAuthToken } from '../utils/token.utils.js';

async function register(userData) {
    const validationResult = userSchema.safeParse(userData);

    if (!validationResult.success) {
        return {
            success: false,
            type: 'validation',
            errors: validationResult.error.flatten().fieldErrors,
        };
    };

    const { rePassword, ...data } = validationResult.data;

    const existingUser = await userRepository.findByEmail(data.email);

    if(existingUser) {
        return {
            success: false,
            type: 'business',
            errors: {
                email: ['Email already exists']
            }
        }
    };

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdUser = await userRepository.create({
        ...data,
        password: hashedPassword
    });

    const { password, ...safeUser } = createdUser;

    const token = generateAuthToken(safeUser);

    return {
        success: true,
        data: {
            safeUser,
            token,
        },
    };
}

const authService = {
    register,
}

export default authService;