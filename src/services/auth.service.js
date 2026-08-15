import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateAuthToken } from '../utils/token.utils.js';

async function register(userData) {
    const validationResult = registerSchema.safeParse(userData);

    if (!validationResult.success) {
        return {
            success: false,
            type: 'validation',
            errors: validationResult.error.flatten().fieldErrors,
        };
    };

    const { rePassword, ...data } = validationResult.data;

    const existingUser = await userRepository.getByEmail(data.email);

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

async function login(email, userPassword) {
    const validationResult = loginSchema.safeParse({
        email,
        password: userPassword
    });

    if(!validationResult.success) {
        return {
            success: false,
            type: 'validation',
            errors: validationResult.error.flatten().fieldErrors,
        };
    };

    const data = validationResult.data;

    const existingUser = await userRepository.getByEmail(data.email);

    if(!existingUser) {
        return {
            success: false,
            type: 'business',
            error: 'Invalid email or password',
        };
    };

    const isPasswordValid = await bcrypt.compare(userPassword, existingUser.password);

    if(!isPasswordValid) {
        return {
            success: false,
            type: 'business',
            error: 'Invalid email or password',
        };
    };

    const { password, ...loggedUser } = existingUser;

    const token = generateAuthToken(loggedUser);

    return {
            success: true,
            data: {
                user: loggedUser,
                token,
            },
        };
}

const authService = {
    register,
    login,
}

export default authService;
