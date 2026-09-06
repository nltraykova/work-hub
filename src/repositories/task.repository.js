import { prisma } from "../lib/prisma.js";

async function getAllProjectTasks(projectId) {
    const projectTasks = await prisma.task.findMany({
        where: {
            projectId
        },
        include: {
            assignee: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            },
            project: {
                select: {
                    id: true,
                },
            },
        },
    });

    return projectTasks;
}

async function getById(taskId) {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        },
        include: {
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
            assignee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            creator: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            comments: {
                select: {
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    createdAt: true,
                    content: true,
                },
            },
        },
    });

    return task;
}

async function create(data, projectId, userId) {
    const newTask = await prisma.task.create({
        data: {
            ...data,
            projectId,
            creatorId: userId,
        },
    });

    return newTask;
};

const taskRepository = {
    getAllProjectTasks,
    getById,
    create,
};

export default taskRepository;
