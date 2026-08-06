import { Router } from "express";
import authService from "../services/auth.service.js";

const authController = Router();

authController.get('/register', (req, res) => {
    res.render('auth/register');
});

authController.post('/register', async (req, res) => {
    const result = await authService.register(req.body);

    if (!result.success) {
        return res.status(400).render('auth/register', {
            errors: result.errors,
            formData: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }
        });
    };

    res.cookie('auth', result.data.token, { httpOnly: true });

    res.redirect('/');
});

authController.get('/login', (req, res) => {
    res.render('auth/login');
});

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result.success) {
        const statusCode = result.type === 'validation' ? 400 : 401;

        return res.status(statusCode).render('auth/login', {
            error: result.error,
            errors: result.errors,
            formData: {
                email: req.body.email,
            },
        });
    };

    res.cookie('auth', result.data.token, { httpOnly: true });

    res.redirect('/');
});

authController.get('/logout', (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
});

export default authController;