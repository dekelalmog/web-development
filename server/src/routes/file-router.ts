import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')
      .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
      .slice(1)
      .join('.')
    cb(null, Date.now() + "." + ext)
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *  name: File
 *  description: Files API
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload file
 *     tags: [File]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 *       '500':
 *         description: Internal server error
 */
router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.status(200).send({ url: `/${req.file.path}` });
});

export default router;