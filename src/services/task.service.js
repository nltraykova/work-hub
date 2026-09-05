import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { isGreaterThanOrEqualToToday, formatDateShort } from "../utils/date.utils.js";
import { makeAvatar } from "../utils/other.utils.js";

async function getAllProjectTasks(projectId, userId) {
    const project = await projectRepository.getById(projectId);

    if (!project) {
        return {
            success: false,
            type: 'notFound',
            error: 'Project not found',
        };
    };

    const currentMember = project.members.find(member => member.userId === userId);

    if (!currentMember) {
        return {
            success: false,
            type: 'forbidden',
            error: 'You do not have access to this project'
        };
    };

    const projectTasks = (await taskRepository.getAllProjectTasks(projectId)).map(task => {
        return {
            ...task,
            dueDate: task.dueDate ? formatDateShort(task.dueDate) : undefined,
            assigneeAvatar: task.assignee ? makeAvatar(task.assignee.firstName, task.assignee.lastName) : undefined,
        }
    });
    
    const projectTasksCount = projectTasks.length;
    const projectTasksToDoCount = projectTasks.filter(
        task => task.status === 'TODO'
    ).length;
    const projectTasksInProgressCount = projectTasks.filter(
        task => task.status === 'IN_PROGRESS'
    ).length;
    const projectTasksCompletedCount = projectTasks.filter(
        task => task.status === 'COMPLETED'
    ).length;

    return {
        success: true,
        data: {
            project,
            projectTasks,
            projectTasksCount,
            projectTasksToDoCount,
            projectTasksInProgressCount,
            projectTasksCompletedCount,
        },
    };
}

async function create(taskData, projectId, userId) {
    const project = await projectRepository.getById(projectId);

    if (!project) {
        return {
            success: false,
            type: 'notFound',
            error: 'Project not found',
        }
    };

    const member = project.members.find(member => member.userId === userId);

    if (!member) {
        return {
            success: false,
            type: 'forbidden',
            error: 'You do not have permission to create task to this project'
        };
    };

    const validationResult = createTaskSchema.safeParse(taskData);

    if (!validationResult.success) {
        return {
            success: false,
            type: 'validation',
            errors: validationResult.error.flatten().fieldErrors,
        };
    };

    const data = validationResult.data;

    if (data.dueDate && !isGreaterThanOrEqualToToday(data.dueDate)) {
        return {
            success: false,
            type: 'validation',
            errors: { dueDate: 'Due Date must be greater than or equal to today' },
        };
    };

    const newTask = await taskRepository.create(data, projectId, userId);

    return {
        success: true,
        data: newTask,
    };
}

const taskService = {
    getAllProjectTasks,
    create,
};

export default taskService;