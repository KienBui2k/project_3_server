import express from 'express';
const router = express.Router();
import multer from "multer"
import productController from '../../controllers/product.controller';

const imgProductStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, `product_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`)
    }
})
const productUpload = multer({ storage: imgProductStorage })

const imgProductStorageUpdate = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, `product_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`)
    }
})
const productUpdate = multer({ storage: imgProductStorageUpdate })

router.get('/:id', productController.readProductById);
router.patch('/:id', productUpdate.array('imgs'), productController.update)

router.get("/", productController.findMany);

router.get('/', productController.readAllProduct);
router.post("/", productUpload.array('imgs'), productController.create)
//search


export default router;
