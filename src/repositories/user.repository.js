import { prisma } from '../lib/prisma.js';

async function create(userData) {
    const createdUser = await prisma.user.create({
        data: userData
    });

    return createdUser;
}

async function getByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    return user;
}

async function getById(id) {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    return user;
}

const userRepository = {
    create,
    getByEmail,
    getById,
};

export default userRepository;