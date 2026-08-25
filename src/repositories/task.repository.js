import { prisma } from "../lib/prisma.js";

async function getAllTasksByProject(projectId) {
    return await prisma.task.findMany({
        where: {
            projectId
        }
    });
}

async function create(data, projectId, userId) {
    const newTask = await prisma.task.create({
        data: {
            ...data,
            projectId,
            creatorId: userId
        },
    });

    return newTask;
};

const taskRepository = {
    getAllTasksByProject,
    create,
};

export default taskRepository;
