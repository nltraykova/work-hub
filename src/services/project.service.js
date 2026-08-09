import projectRepository from "../repositories/project.repository.js";
import createProjectSchema from "../schemas/project.schema.js";

async function create(projectData, ownerId) {
    const validationResult = createProjectSchema.safeParse(projectData);

    if (!validationResult.success) {
        return {
            success: false,
            type: 'validation',
            errors: validationResult.error.flatten().fieldErrors,
        };
    };

    const data = validationResult.data;

    const newProject = await projectRepository.create(data, ownerId);

    return {
            success: true,
            data: newProject,
        };
};

const projectService = {
    create,
};

export default projectService;