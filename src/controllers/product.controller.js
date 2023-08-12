import { uploadFileToStorage } from "../meobase";
import productModel from "../models/product.model";
import fs from "fs"
import path from "path";
export default {
    readAllProduct: async function (req, res) {
        try {
            let result = await productModel.readAllProduct();
            res.status(module.status ? 200 : 214).json(result)
        } catch (err) {
            return res.status(200).json(
                {
                    message: "Bad request products!!"
                }
            )
        }


    },
    readProductById: async (req, res) => {
        try {
            let modelRes = await productModel.readProductById(parseInt(req.params.id))
            res.status(modelRes.status ? 200 : 214).json(modelRes)

        } catch (err) {
            return res.status(500).json(
                {
                    message: "Bad request products !"
                }
            )
        }
    },
    create: async (req, res) => {
        console.log("req.file", req.files);
      
        let productInforFormat = JSON.parse(req.body.product_infor);

        // xử lý avatar
        let avatarProcess = await uploadFileToStorage(req.files[0], "products", fs.readFileSync(req.files[0].path));
        productInforFormat.avatar = avatarProcess;
        fs.unlink(req.files[0].path, (err) => {

        })
        req.files.splice(0, 1);
        // console.log("productInforFormat", productInforFormat);
        let product = productInforFormat;
        try {
            /* Gọi model xử lý database */
            let result = await productModel.create(product);
            return res.status(result.status ? 200 : 214).json(result)
            // console.log("result", result)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi xử lý!"
            })
        }
    },
    update: async function (req, res) {
        console.log("datta in ", req.files);
        console.log("datta in sfsefesf ", req.body);

        let productInforFormat = JSON.parse(req.body.product_infor);
        // xử lý avatar
        if (req.files.length > 0) {
            let avatarProcess = await uploadFileToStorage(req.files[0], "products", fs.readFileSync(req.files[0].path));
            productInforFormat.avatar = avatarProcess;
            fs.unlink(req.files[0].path, (err) => {

            })
            req?.files.splice(0, 1);
        }


        let product = productInforFormat;
        console.log("product", product);

        let dataActive = Boolean(product.active);
        let productEditData = {
            ...product,
            active: dataActive
        };
        let productId = parseInt(req.params.id)
        console.log("data out", productEditData);

        try {
            let result = await productModel.update(productId, productEditData)
            console.log("result", result);
            return res.status(result.status ? 200 : 214).json(result)
            // parseInt(req.params.id)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi xử lý!"
            })
        }
    },
    //search
    findMany: async function (req, res) {
        try {
            /* Find by name or des */
            if (req.query.search) {
                let modelRes = await productModel.searchByName(req.query.search)
                return res.status(modelRes.status ? 200 : 221).json(modelRes)
            }
            /* Find all */
            let modelRes = await productModel.findMany()
            return res.status(modelRes.status ? 200 : 221).json(modelRes)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi không xác định!"
            })
        }
    },
    
}

