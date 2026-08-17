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

    const result = await projectService.getDetails(projectId, userId);

    if (!result.success) {
        if (result.type === 'notFound') {
            return res.status(404).render('404');
        } else if(result.type === 'forbidden') {
            return res.status(403).render('403');
        };
    };

    const data = result.data;

    res.render('project/details', { data });
});

projectController.get('/:projectId/edit', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    const result = await projectService.getEditData(projectId, userId);

    if(!result.success) {
        if(result.type === 'notFound') {
            return res.status(404).render('404');
        } else if(result.type === 'forbidden') {
            return res.status(403).render('403');
        };
    };

    const project = result.data;

    const options = getStatusOptions(project.status);

    res.render('project/edit', { project, options } );
});

projectController.post('/:projectId/edit', isAuth, async (req, res) => {
    const projectId = req.params.projectId;
    const projectData = req.body;
    const userId = req.user.id;

    const result = await projectService.edit(projectId, projectData, userId);

    if(!result.success) {
        if(result.type === 'validation') {
            const options = getStatusOptions(req.body.status);

            return res.status(400).render('project/edit', { 
                errors: result.errors,
                project: {
                    id: projectId,
                    name: req.body.name,
                    description: req.body.description,
                    status: req.body.status,
                },
                options,
             });
        } else if(result.type === 'notFound') {
            return res.status(404).render('404');
        } else if(result.type === 'forbidden') {
            return res.status(403).render('403');
        };
    };

    res.redirect(`/projects/${projectId}`);
});

function getStatusOptions(projectStatus) {
    const statuses = ['ACTIVE', 'COMPLETED', 'ARCHIVED'];

    const options = statuses.map(status => {
        return {
            name: `${status.charAt(0)}${status.slice(1).toLowerCase()}`,
            value: status,
            selected: projectStatus === status,
        };
    });

    return options;
}

export default projectController;