import { prisma } from "../lib/prisma.js";

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
    create,
};

export default taskRepository;
