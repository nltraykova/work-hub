import jwt from 'jsonwebtoken';

export function generateAuthToken(user) {
    const playload = {
        id: user.id,
        role: user.role
    };
    const secret = process.env.AUTH_SECRET;

    const token = jwt.sign(playload, secret, { expiresIn: '2h' });

    return token;
}