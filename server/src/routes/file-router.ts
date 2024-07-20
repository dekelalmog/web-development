import express from "express";
import path from 'path'
import multer from "multer";

const base = "http://localhost:3000/";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
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
*     summary: upload file
*     tags: [File]
*     consumes:
*       - multipart/form-data
*     parameters:
*       - in: formData
*         name: file
*         schema:
*           type: file
*         description: file to upload
*     responses:
*       '200':
*         description: 'File uploaded'
*       '500':
*         description: 'Internal server error'
*/
router.post('', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});

export default router;