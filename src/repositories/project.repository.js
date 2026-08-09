import { prisma } from "../lib/prisma.js";

async function getMy(userId) {
    const myProjects = await prisma.project.findMany({
        where: { 
            members: {
                some: {
                    userId
                },
            },
        },
        include: {
            members: {
                where: {
                    userId
                },
            },
        },
    });

    return myProjects;
}

async function create(data, ownerId) {
    const newProject = await prisma.project.create({
        data: {
            ...data,
            ownerId,
            
            members: {
                create: {
                    userId: ownerId,
                    role: 'OWNER'
                },
            },
        },
    });

    return newProject;
};

const projectRepository = {
    getMy,
    create,
};

export default projectRepository;