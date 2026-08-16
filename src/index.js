import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import routes from './routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
    helpers: {
        setTitle(title) {
            this.pageTitle = title;
        }
    },
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.static('./src/public'));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(authMiddleware);

app.use(routes);

app.get('*url', (req, res) => {
    res.status(404).render('404');
});

app.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000...')
});