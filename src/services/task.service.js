import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { isGreaterOrEqualOfToday as isGreaterThanOrEqualToToday } from "../utils/date.utils.js";

async function create(taskData, projectId, userId) {
    const project = await projectRepository.getById(projectId);

    if(!project) {
        return {
            success: false,
            type: 'notFound',
            error: 'Project not found',
        }
    };

    const member = project.members.find(member => member.userId === userId);

    if(!member) {
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
};

const taskService = {
    create,
};

export default taskService;