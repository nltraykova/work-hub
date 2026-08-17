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
}

async function edit(projectId, data, userId) {
    const editedProject = await prisma.project.update({
        where: {
            id: projectId,
            ownerId: userId,
        },
        data: {
            name: data.name,
            description: data.description,
            status: data.status,
        },
    });

    return editedProject;
}

const projectRepository = {
    getMy,
    getById,
    create,
    edit,
};

export default projectRepository;