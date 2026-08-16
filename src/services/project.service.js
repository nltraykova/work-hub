import projectRepository from "../repositories/project.repository.js";
import userRepository from "../repositories/user.repository.js";
import createProjectSchema from "../schemas/project.schema.js";
import { formatDate, formatLastUpdated, isToday } from "../utils/date.utils.js";

async function getMy(userId) {
    const projects = await projectRepository.getMy(userId);

    const projectsWithRole = projects.map(project => {
        const currentUserRole = project.members[0]?.role;

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

async function getById(projectId, userId) {
    const project = await projectRepository.getById(projectId);

    if (!project) {
        return {
            success: false,
            type: 'notFound',
            error: 'Project not found',
        };
    };

    const currentMember = project.members.find(member => member.userId === userId);
    
    if(!currentMember) {
        return {
            success: false,
            type: 'forbidden',
            error: 'You do not have access to this project'
        };
    };

    const data = buildDetails(project, currentMember, userId);

    return {
        success: true,
        data,
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
}

//helpers
function buildDetails(project, currentMember, userId) {
    const currentMemberData = {
        firstName: currentMember.user.firstName,
        lastName: currentMember.user.lastName,
        email: currentMember.user.email,
        role: currentMember.role,
    };

    const members = project.members.filter(
        member => member.userId !== userId
    );
    const membersCount = project.members.length;

    const tasksCount = project.tasks.length;
    const completedTasksCount = project.tasks.filter(
        task => task.status === 'COMPLETED'
    ).length;
    const inProgressTasksCount = project.tasks.filter(
        task => task.status === 'IN_PROGRESS'
    ).length;

    const progressPercentage = tasksCount !== 0 ? (completedTasksCount / tasksCount) * 100 : 0;

    const createdAt = formatDate(project.createdAt);

    const updatedAt = formatLastUpdated(project.updatedAt);

    const projectDetails = {
        ...project,
        createdAt,
        updatedAt,
        currentMember: currentMemberData,
        members,
        membersCount,
        tasksCount,
        completedTasksCount,
        inProgressTasksCount,
        progressPercentage,
    }

    return projectDetails;
}

const projectService = {
    getMy,
    getById,
    create,
};

export default projectService;