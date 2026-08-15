import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import projectService from "../services/project.service.js";

const projectController = Router();

projectController.get('/my-projects', isAuth, async (req, res) => {
    const userId = req.user.id;

    const data = await projectService.getMy(userId);

    res.render('project/myProjects', { data });
});


projectController.get('/create', isAuth, (req, res) => {
    res.render('project/create');
});

projectController.post('/create', isAuth, async (req, res) => {
    const projectData = req.body;
    const ownerId = req.user.id;

    const result = await projectService.create(projectData, ownerId);

    if (!result.success) {
        return res.status(400).render('project/create', {
            errors: result.errors,
            formData: {
                name: req.body.name,
                description: req.body.description
            },
        });
    };

    res.redirect('/projects/my-projects');
});

projectController.get('/:projectId', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    const result = await projectService.getById(projectId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        } else if(result.type === 'forbidden') {
            return res.status(403).redirect('/auth/login');
        };
    };

    const data = result.data;

    res.render('project/details', { data });
});

export default projectController;