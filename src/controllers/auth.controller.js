import { Router } from "express";
import authService from "../services/auth.service.js";

const authController = Router();

authController.get('/register', (req, res) => {
    res.render('auth/register');
});

authController.post('/register', async (req, res) => {
    const result = await authService.register(req.body);

    if(!result.success) {
        return res.status(400).render('auth/register', { 
            errors: result.errors, 
            formData: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }});
    };

    res.cookie('auth', result.data.token, { httpOnly: true });

    res.redirect('/');
});

export default authController;