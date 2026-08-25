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
            _count: {
                select: {
                    members: true,
                },
            },
            tasks: {
                select: {
                    status: true,
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
            tasks: {
                include: {
                    assignee: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                take: 3,
                orderBy: {
                    createdAt: "desc",
                },
            },
            owner: true,
        },
    });

    return project;
}

async function getAllMembers(projectId) {
    return await prisma.projectMember.findMany({
        where: {
            projectId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            },
        },
    });
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
    await prisma.project.update({
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
}

async function remove(projectId, userId) {
    await prisma.project.delete({
        where: {
            id: projectId,
            ownerId: userId,
        }
    });
}

const projectRepository = {
    getMy,
    getById,
    getAllMembers,
    create,
    edit,
    remove,
};

export default projectRepository;