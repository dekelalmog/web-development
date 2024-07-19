import express from 'express';
import postsRouter from './routes/posts-router';
import userRouter from './routes/user-router';
import bodyParser from 'body-parser';
import env from 'dotenv';
env.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/posts', postsRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send('default route');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});