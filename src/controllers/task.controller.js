import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import taskService from "../services/task.service.js";
import projectService from "../services/project.service.js";

const taskController = Router({ mergeParams: true });

taskController.get('/', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    const result = await taskService.getAllProjectTasks(projectId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if (result.type === 'forbidden') {
            return res.status(404).render('403');
        };
    };

    const data = result.data;

    res.render('task/projectTasks', { data });
});

taskController.get('/:taskId', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    const result = await taskService.getDetails(projectId, taskId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if (result.type === 'forbidden') {
            return res.status(404).render('403');
        };
    };

    const data = result.data;

    res.render('task/details', { data });
});

taskController.get('/create', isAuth, async (req, res) => {
    const projectId = req.params.projectId;

    const members = await projectService.getAllMembers(projectId);

    res.render('task/create', { projectId, members });
});

taskController.post('/create', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id;
    const taskData = req.body;

    const result = await taskService.create(taskData, projectId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if (result.type === 'forbidden') {
            return res.status(403).render('403');
        };

        if (result.type === 'validation') {
            return res.status(400).render('task/create', {
                errors: result.errors,
                formData: { ...req.body },
            });
        };
    };

    res.redirect(`/projects/${projectId}`)


});

taskController.get('/:taskId/edit', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    const result = await taskService.getById(projectId, taskId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if (result.type === 'forbidden') {
            return res.status(404).render('403');
        };
    };

    const data = result.data;
    const priorityOptions = getPriorityOptions(data.priority);
    const statusOptions = getStatusOptions(data.status);
    const members = await projectService.getAllMembers(projectId);
    const assigneeOptions = getAssigneeOptions(members, data.assigneeId);
    const unassignedSelected = !data.assignee;

    res.render('task/edit', { data, priorityOptions, statusOptions, assigneeOptions, unassignedSelected });
});

taskController.post('/:taskId/edit', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const taskData = req.body;

    const result = await taskService.edit(projectId, taskId, userId, taskData);

    if (!result.success) {
        if (result.type === 'validation') {
            const priorityOptions = getPriorityOptions(taskData.priority);
            const statusOptions = getStatusOptions(taskData.status);
            const members = await projectService.getAllMembers(projectId);
            const assigneeOptions = getAssigneeOptions(members, taskData.assigneeId);
            const unassignedSelected = !taskData.assigneeId;

            return res.status(400).render('task/edit', {
                errors: result.errors,
                data: { ...req.body, projectId, id: taskId },
                priorityOptions,
                statusOptions,
                assigneeOptions,
                unassignedSelected,
            });
        };

        if (result.type === 'notFound') {
            return res.status(404).render('404')
        };

        if (result.type === 'forbidden') {
            return res.status(403).render('403');
        };
    };

    res.redirect(`/projects/${projectId}/tasks/${taskId}`);
});

//helpers
function getStatusOptions(taskStatus) {
    const statuses = {
        'TODO': 'To Do',
        'IN_PROGRESS': 'In Progress',
        'COMPLETED': 'Completed',
    };

    const options = Object.entries(statuses).map(([value, name]) => {
        return {
            name,
            value,
            selected: taskStatus === value,
        };
    })

    return options;
}

function getPriorityOptions(taskPriority) {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];

    const options = priorities.map(priority => {
        return {
            name: `${priority.charAt(0)}${priority.slice(1).toLowerCase()}`,
            value: priority,
            selected: taskPriority === priority,
        };
    });

    return options;
}

function getAssigneeOptions(members, taskAssigneeId) {
    const options = members.map(member => {
        return {
            name: `${member.user.firstName} ${member.user.lastName}`,
            value: member.user.id,
            selected: taskAssigneeId === member.user.id,
        };
    });

    return options;
}

export default taskController;
