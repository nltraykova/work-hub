import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import projectService from "../services/project.service.js";

const projectController = Router();

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

    res.redirect('/');
});

export default projectController;