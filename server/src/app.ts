import express, {Express} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import env from 'dotenv';
import mongoose from 'mongoose';

import weatherRouter from './routes/weather-router'
import fileRouter from './routes/file-router'
import postsRouter from './routes/posts-router';
import userRouter from './routes/user-router';
import path from 'path';

if (process.env.NODE_ENV === "test") {
    env.config({ path: ".env.test" });
} else if (process.env.NODE_ENV === "production") {
    env.config({ path: ".env.prod" });
} else if (process.env.NODE_ENV === "dev") {
    env.config();
}

const app = express();

const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.once("open", () => console.log("Connected to DB"))
        mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DB_NAME }).then(() => {
            app.use(bodyParser.json());

            app.use(cors())
            app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
            // app.use((req, res, next) => {
            //     if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
            //         next();
            //     } else {
            //         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            //         res.header('Expires', '-1');
            //         res.header('Pragma', 'no-cache');
            //         res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist'));
            //     }
            // });
            app.use('/posts', postsRouter);
            app.use('/users', userRouter);
            app.use('/weather', weatherRouter)
            app.use('/file', fileRouter)
            app.use('/images', express.static("images"))
            
            resolve(app);
        });
    });
    return promise
}

export default initApp