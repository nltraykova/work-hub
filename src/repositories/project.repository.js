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

async function getById(projectId) {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            tasks: true,
            owner: true,
        },
    });

    return project;
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
    getById,
    create,
};

export default projectRepository;