/* Create Express Router */
import express from 'express';
const router = express.Router();

import userModule from './modules/user';
router.use('/users', userModule);
import productModel from './modules/product'
router.use('/product', productModel)
import categoryModule from './modules/category';
router.use('/categories', categoryModule);
import purchaseModel from './modules/purchase';
router.use("/purchase", purchaseModel)
import receiptModule from './modules/receipt.api';
router.use('/receipts', receiptModule);
export default router;