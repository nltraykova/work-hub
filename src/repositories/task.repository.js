import { prisma } from "../lib/prisma.js";

async function getAllProjectTasks(projectId) {
    return await prisma.task.findMany({
        where: {
            projectId
        },
        include: {
            assignee: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }
    });
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
    create,
};

export default taskRepository;
