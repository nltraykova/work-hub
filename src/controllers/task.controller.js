import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import taskService from "../services/task.service.js";
import projectService from "../services/project.service.js";

const taskController = Router({ mergeParams: true });

taskController.get('/', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    const result = await taskService.getAllProjectTasks(projectId, userId);

    if(!result.success) {
        if(result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if(result.type === 'forbidden') {
            return res.status(404).render('403');
        };
    };

    const data = result.data;
    
    res.render('task/projectTasks', { data });
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
        if(result.type === 'notFound') {
            return res.status(404).render('404');
        };

        if(result.type === 'forbidden') {
            return res.status(403).render('403');
        };

        if(result.type === 'validation') {
            return res.status(400).render('task/create', { 
                errors: result.errors,
                formData: { ...req.body },
            });
        };
    };

    res.redirect(`/projects/${projectId}`)


});

export default taskController;