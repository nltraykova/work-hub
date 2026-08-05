import express from 'express';
import { engine } from 'express-handlebars';
import routes from './routes.js';

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

app.use(routes);

app.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000...')
});