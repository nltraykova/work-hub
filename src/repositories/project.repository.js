import { prisma } from "../lib/prisma.js";

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
    create,
};

export default projectRepository;