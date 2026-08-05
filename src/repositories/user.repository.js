import { prisma } from '../lib/prisma.js';

async function create(userData) {
    const createdUser = await prisma.user.create({
        data: userData
    });

    return createdUser;
}

async function findByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    return user;
}

const userRepository = {
    create,
    findByEmail,
};

export default userRepository;