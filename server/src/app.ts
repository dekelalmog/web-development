import express, {Express} from 'express';
import postsRouter from './routes/posts-router';
import userRouter from './routes/user-router';
import weatherRouter from './routes/weather-router'
import fileRouter from './routes/file-router'
import bodyParser from 'body-parser';
import cors from 'cors';
import env from 'dotenv';
import mongoose from 'mongoose';

if (process.env.NODE_ENV === "test") {
    env.config({ path: ".env.test" });
} else if (process.env.NODE_ENV === "prod") {
    env.config({ path: ".env.prod" });
} else {
    env.config();
}
  
env.config();
const app = express();
const port = process.env.PORT || 3000;

const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.once("open", () => console.log("Connected to DB"))
        mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DB_NAME }).then(() => {
            app.use(bodyParser.json());

            app.use(cors())
            
            app.use('/posts', postsRouter);
            app.use('/users', userRouter);
            app.use('/weather', weatherRouter)
            app.use('/file', fileRouter)
            
            app.get('/', (req, res) => {
                res.send('default route');
            });

            resolve(app);
        });
    });
    return promise
}

export default initApp