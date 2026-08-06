import * as z from 'zod';

const registerSchema = z.object({
    firstName: z.string()
        .trim()
        .min(2, { error: 'First name must be at least 2 characters long'})
        .max(50, { error: 'First name must not exceed 50 characters' }),
    lastName: z.string()
        .trim()
        .min(2, { error: 'Last name must be at least 2 characters long'})
        .max(50, { error: 'Last name must not exceed 50 characters' }),
    email: z.email({ error: 'Invalid email address' })
        .max(254, { error: 'Email must not exceed 254 characters' })
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(8, { error: 'Password must be at least 8 characters long'})
        .max(72, { error: 'Password must not exceed 72 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { error: 'Password must contain at least one letter and one number'}),
    rePassword: z.string()
        .min(1, { error: 'Please confirm your password' })
}).refine((data) => data.password === data.rePassword, {
    error: 'Passwords do not match',
    path: ['rePassword']
});

const loginSchema = z.object({
    email: z.email({ error: 'Invalid email address' })
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(1, { error: 'Pasword is required'}),
});

export {
    registerSchema,
    loginSchema
}