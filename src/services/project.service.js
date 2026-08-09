import projectRepository from "../repositories/project.repository.js";
import createProjectSchema from "../schemas/project.schema.js";

async function getMy(userId) {
    const projects = await projectRepository.getMy(userId);

    const projectsWithRole = projects.map(project => {
        const currentUserRole = project.members[0].role;

        return {
            ...project,
            currentUserRole
        };
    });

    return {
        projects: projectsWithRole,
        projectsCount: projects.length,
        activeProjectsCount: projects.filter(
            project => project.status === 'ACTIVE'
        ).length,
        completedProjectsCount: projects.filter(
            project => project.status === 'COMPLETED'
        ).length,
        archivedProjectsCount: projects.filter(
            project => project.status === 'ARCHIVED'
        ).length,
    };
}

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
    getMy,
    create,
};

export default projectService;